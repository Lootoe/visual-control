// Author: Fyrestar https://mevedia.com (https://github.com/Fyrestar/THREE.BufferGeometry-toIndexed)
import * as THREE from 'three'

/**
 * 将 BufferGeometry 转换为 Indexed Geometry 的函数
 * @param {THREE.BufferGeometry} src - 输入的 BufferGeometry
 * @param {boolean} fullIndex - 是否对所有属性进行索引
 * @param {number} precision - 索引精度（默认为6）
 * @returns {THREE.BufferGeometry} - 输出的 Indexed Geometry
 */
function toIndexedGeometry(src, fullIndex = true, precision = 6) {
  let list = []
  let vertices = {}
  let attributesKeys, morphKeys
  let prec = Math.pow(10, precision)
  let precHalf = Math.pow(10, Math.floor(precision / 2))
  let length = 0

  function floor(array, offset) {
    if (array instanceof Float32Array) {
      return Math.floor(array[offset] * prec)
      // eslint-disable-next-line no-undef
    } else if (array instanceof Float16Array) {
      return Math.floor(array[offset] * precHalf)
    } else {
      return array[offset]
    }
  }

  function createAttribute(src_attribute) {
    const dst_attribute = new THREE.BufferAttribute(
      new src_attribute.array.constructor(length * src_attribute.itemSize),
      src_attribute.itemSize
    )

    const dst_array = dst_attribute.array
    const src_array = src_attribute.array

    for (let i = 0, l = list.length; i < l; i++) {
      const index = list[i] * src_attribute.itemSize
      const offset = i * src_attribute.itemSize
      for (let j = 0; j < src_attribute.itemSize; j++) {
        dst_array[offset + j] = src_array[index + j]
      }
    }

    return dst_attribute
  }

  function hashAttribute(attribute, offset) {
    const array = attribute.array
    return Array.from({ length: attribute.itemSize }, (_, i) => floor(array, offset + i)).join('_')
  }

  function store(index, n) {
    let id = ''
    for (const key of attributesKeys) {
      const attribute = src.attributes[key]
      const offset = attribute.itemSize * index * 3 + n * attribute.itemSize
      id += hashAttribute(attribute, offset) + '_'
    }
    for (const key of morphKeys) {
      const attribute = src.morphAttributes[key]
      const offset = attribute.itemSize * index * 3 + n * attribute.itemSize
      id += hashAttribute(attribute, offset) + '_'
    }
    if (vertices[id] === undefined) {
      vertices[id] = list.length
      list.push(index * 3 + n)
    }
    return vertices[id]
  }

  function storeFast(x, y, z, v) {
    const id = `${Math.floor(x * prec)}_${Math.floor(y * prec)}_${Math.floor(z * prec)}`
    if (vertices[id] === undefined) {
      vertices[id] = list.length
      list.push(v)
    }
    return vertices[id]
  }

  function indexBufferGeometry(src, dst, fullIndex) {
    attributesKeys = Object.keys(src.attributes)
    morphKeys = Object.keys(src.morphAttributes)
    const position = src.attributes.position.array
    const faceCount = position.length / 9
    const indexArray = new (faceCount * 3 > 65536 ? Uint32Array : Uint16Array)(faceCount * 3)

    if (fullIndex) {
      for (let i = 0; i < faceCount; i++) {
        indexArray[i * 3] = store(i, 0)
        indexArray[i * 3 + 1] = store(i, 1)
        indexArray[i * 3 + 2] = store(i, 2)
      }
    } else {
      for (let i = 0; i < faceCount; i++) {
        const offset = i * 9
        indexArray[i * 3] = storeFast(
          position[offset],
          position[offset + 1],
          position[offset + 2],
          i * 3
        )
        indexArray[i * 3 + 1] = storeFast(
          position[offset + 3],
          position[offset + 4],
          position[offset + 5],
          i * 3 + 1
        )
        indexArray[i * 3 + 2] = storeFast(
          position[offset + 6],
          position[offset + 7],
          position[offset + 8],
          i * 3 + 2
        )
      }
    }

    dst.index = new THREE.BufferAttribute(indexArray, 1)
    length = list.length

    for (const key of attributesKeys) {
      dst.attributes[key] = createAttribute(src.attributes[key])
    }

    for (const key of morphKeys) {
      dst.morphAttributes[key] = createAttribute(src.morphAttributes[key])
    }

    dst.boundingSphere = src.boundingSphere ? src.boundingSphere.clone() : new THREE.Sphere()
    dst.boundingBox = src.boundingBox ? src.boundingBox.clone() : new THREE.Box3()

    for (const group of src.groups) {
      dst.addGroup(group.start, group.count, group.materialIndex)
    }

    vertices = {}
    list = []
  }

  const geometry = new THREE.BufferGeometry()
  indexBufferGeometry(src, geometry, fullIndex)
  return geometry
}

export { toIndexedGeometry }
