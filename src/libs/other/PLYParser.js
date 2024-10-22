import axios from 'axios'

export class PLYParser {
  constructor() {
    this.propertyNameMapping = {}
    this.customPropertyMapping = {}
  }

  parse(url) {
    const scope = this

    return new Promise((resolve) => {
      axios
        .get(url, {
          responseType: 'arraybuffer',
        })
        .then(function (res) {
          const result = scope.walk(res.data)
          resolve(result)
        })
    })
  }

  setPropertyNameMapping(mapping) {
    this.propertyNameMapping = mapping
  }

  setCustomPropertyNameMapping(mapping) {
    this.customPropertyMapping = mapping
  }

  walk(data) {
    function parseHeader(data, headerLength = 0) {
      const patternHeader = /^ply([\s\S]*)end_header(\r\n|\r|\n)/
      let headerText = ''
      const result = patternHeader.exec(data)

      if (result !== null) {
        headerText = result[1]
      }

      const header = {
        comments: [],
        elements: [],
        headerLength: headerLength,
        objInfo: '',
      }

      const lines = headerText.split(/\r\n|\r|\n/)
      let currentElement

      function make_ply_element_property(propertValues, propertyNameMapping) {
        const property = { type: propertValues[0] }

        if (property.type === 'list') {
          property.name = propertValues[3]
          property.countType = propertValues[1]
          property.itemType = propertValues[2]
        } else {
          property.name = propertValues[1]
        }

        if (property.name in propertyNameMapping) {
          property.name = propertyNameMapping[property.name]
        }

        return property
      }

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i]
        line = line.trim()

        if (line === '') continue

        const lineValues = line.split(/\s+/)
        const lineType = lineValues.shift()
        line = lineValues.join(' ')

        switch (lineType) {
          case 'format':
            header.format = lineValues[0]
            header.version = lineValues[1]

            break

          case 'comment':
            header.comments.push(line)

            break

          case 'element':
            if (currentElement !== undefined) {
              header.elements.push(currentElement)
            }

            currentElement = {}
            currentElement.name = lineValues[0]
            currentElement.count = parseInt(lineValues[1])
            currentElement.properties = []

            break

          case 'property':
            currentElement.properties.push(
              make_ply_element_property(lineValues, scope.propertyNameMapping)
            )

            break

          case 'obj_info':
            header.objInfo = line

            break

          default:
            console.log('unhandled', lineType, lineValues)
        }
      }

      if (currentElement !== undefined) {
        header.elements.push(currentElement)
      }

      return header
    }

    function parseASCIINumber(n, type) {
      switch (type) {
        case 'char':
        case 'uchar':
        case 'short':
        case 'ushort':
        case 'int':
        case 'uint':
        case 'int8':
        case 'uint8':
        case 'int16':
        case 'uint16':
        case 'int32':
        case 'uint32':
          return parseInt(n)

        case 'float':
        case 'double':
        case 'float32':
        case 'float64':
          return parseFloat(n)
      }
    }

    function parseASCIIElement(properties, tokens) {
      const element = {}

      for (let i = 0; i < properties.length; i++) {
        if (tokens.empty()) return null

        if (properties[i].type === 'list') {
          const list = []
          const n = parseASCIINumber(tokens.next(), properties[i].countType)

          for (let j = 0; j < n; j++) {
            if (tokens.empty()) return null

            list.push(parseASCIINumber(tokens.next(), properties[i].itemType))
          }

          element[properties[i].name] = list
        } else {
          element[properties[i].name] = parseASCIINumber(tokens.next(), properties[i].type)
        }
      }

      return element
    }

    function createBuffer() {
      const buffer = {
        vertices: [],
        values: [],
      }

      for (const customProperty of Object.keys(scope.customPropertyMapping)) {
        buffer[customProperty] = []
      }

      return buffer
    }

    function mapElementAttributes(properties) {
      const elementNames = properties.map((property) => {
        return property.name
      })

      function findAttrName(names) {
        for (let i = 0, l = names.length; i < l; i++) {
          const name = names[i]

          if (elementNames.includes(name)) return name
        }

        return null
      }

      return {
        attrX: findAttrName(['x', 'px', 'posx']) || 'x',
        attrY: findAttrName(['y', 'py', 'posy']) || 'y',
        attrZ: findAttrName(['z', 'pz', 'posz']) || 'z',
        attrV: findAttrName(['v', 'value']) || 'v',
      }
    }

    function parseASCII(data, header) {
      // PLY ascii format specification, as per http://en.wikipedia.org/wiki/PLY_(file_format)

      const buffer = createBuffer()

      const patternBody = /end_header\s+(\S[\s\S]*\S|\S)\s*$/
      let body, matches

      if ((matches = patternBody.exec(data)) !== null) {
        body = matches[1].split(/\s+/)
      } else {
        body = []
      }

      const tokens = new ArrayStream(body)

      loop: for (let i = 0; i < header.elements.length; i++) {
        const elementDesc = header.elements[i]
        const attributeMap = mapElementAttributes(elementDesc.properties)

        for (let j = 0; j < elementDesc.count; j++) {
          const element = parseASCIIElement(elementDesc.properties, tokens)

          if (!element) break loop

          handleElement(buffer, elementDesc.name, element, attributeMap)
        }
      }
      return buffer
    }

    function handleElement(buffer, elementName, element, cacheEntry) {
      if (elementName === 'vertex') {
        buffer.vertices.push([
          element[cacheEntry.attrX],
          element[cacheEntry.attrY],
          element[cacheEntry.attrZ],
        ])

        if (cacheEntry.attrV !== null) {
          buffer.values.push(element[cacheEntry.attrV])
        }

        for (const customProperty of Object.keys(scope.customPropertyMapping)) {
          for (const elementProperty of scope.customPropertyMapping[customProperty]) {
            buffer[customProperty].push(element[elementProperty])
          }
        }
      }
    }

    function binaryReadElement(at, properties) {
      const element = {}
      let read = 0

      for (let i = 0; i < properties.length; i++) {
        const property = properties[i]
        const valueReader = property.valueReader

        if (property.type === 'list') {
          const list = []

          const n = property.countReader.read(at + read)
          read += property.countReader.size

          for (let j = 0; j < n; j++) {
            list.push(valueReader.read(at + read))
            read += valueReader.size
          }

          element[property.name] = list
        } else {
          element[property.name] = valueReader.read(at + read)
          read += valueReader.size
        }
      }

      return [element, read]
    }

    function setPropertyBinaryReaders(properties, body, little_endian) {
      function getBinaryReader(dataview, type, little_endian) {
        switch (type) {
          // corespondences for non-specific length types here match rply:
          case 'int8':
          case 'char':
            return {
              read: (at) => {
                return dataview.getInt8(at)
              },
              size: 1,
            }
          case 'uint8':
          case 'uchar':
            return {
              read: (at) => {
                return dataview.getUint8(at)
              },
              size: 1,
            }
          case 'int16':
          case 'short':
            return {
              read: (at) => {
                return dataview.getInt16(at, little_endian)
              },
              size: 2,
            }
          case 'uint16':
          case 'ushort':
            return {
              read: (at) => {
                return dataview.getUint16(at, little_endian)
              },
              size: 2,
            }
          case 'int32':
          case 'int':
            return {
              read: (at) => {
                return dataview.getInt32(at, little_endian)
              },
              size: 4,
            }
          case 'uint32':
          case 'uint':
            return {
              read: (at) => {
                return dataview.getUint32(at, little_endian)
              },
              size: 4,
            }
          case 'float32':
          case 'float':
            return {
              read: (at) => {
                return dataview.getFloat32(at, little_endian)
              },
              size: 4,
            }
          case 'float64':
          case 'double':
            return {
              read: (at) => {
                return dataview.getFloat64(at, little_endian)
              },
              size: 8,
            }
        }
      }

      for (let i = 0, l = properties.length; i < l; i++) {
        const property = properties[i]

        if (property.type === 'list') {
          property.countReader = getBinaryReader(body, property.countType, little_endian)
          property.valueReader = getBinaryReader(body, property.itemType, little_endian)
        } else {
          property.valueReader = getBinaryReader(body, property.type, little_endian)
        }
      }
    }

    function parseBinary(data, header) {
      const buffer = createBuffer()

      const little_endian = header.format === 'binary_little_endian'
      const body = new DataView(data, header.headerLength)
      let result,
        loc = 0

      for (let currentElement = 0; currentElement < header.elements.length; currentElement++) {
        const elementDesc = header.elements[currentElement]
        const properties = elementDesc.properties
        const attributeMap = mapElementAttributes(properties)

        setPropertyBinaryReaders(properties, body, little_endian)

        for (
          let currentElementCount = 0;
          currentElementCount < elementDesc.count;
          currentElementCount++
        ) {
          result = binaryReadElement(loc, properties)
          loc += result[1]
          const element = result[0]

          handleElement(buffer, elementDesc.name, element, attributeMap)
        }
      }

      return buffer
    }

    function extractHeaderText(bytes) {
      let i = 0
      let cont = true

      let line = ''
      const lines = []

      const startLine = new TextDecoder().decode(bytes.subarray(0, 5))
      const hasCRNL = /^ply\r\n/.test(startLine)

      do {
        const c = String.fromCharCode(bytes[i++])

        if (c !== '\n' && c !== '\r') {
          line += c
        } else {
          if (line === 'end_header') cont = false
          if (line !== '') {
            lines.push(line)
            line = ''
          }
        }
      } while (cont && i < bytes.length)

      // ascii section using \r\n as line endings
      if (hasCRNL === true) i++

      return { headerText: lines.join('\r') + '\r', headerLength: i }
    }

    let geometry
    const scope = this

    if (data instanceof ArrayBuffer) {
      const bytes = new Uint8Array(data)
      const { headerText, headerLength } = extractHeaderText(bytes)
      const header = parseHeader(headerText, headerLength)

      if (header.format === 'ascii') {
        const text = new TextDecoder().decode(bytes)

        geometry = parseASCII(text, header)
      } else {
        geometry = parseBinary(data, header)
      }
    } else {
      geometry = parseASCII(data, parseHeader(data))
    }

    return geometry
  }
}

class ArrayStream {
  constructor(arr) {
    this.arr = arr
    this.i = 0
  }

  empty() {
    return this.i >= this.arr.length
  }

  next() {
    return this.arr[this.i++]
  }
}