import * as THREE from 'three'
import { map } from 'radash'
import axios from 'axios'
import ndarray from 'ndarray'
import * as nifti from 'nifti-reader-js'
import useSceneStoreHook from '@/store/useSceneStore'

const sceneStore = useSceneStoreHook()

// 判断触点组合的URL是否为空
const calcUrlIsZero = (downloadUrl = '') => {
  try {
    const str_1 = downloadUrl.split('_').pop()
    const str_2 = str_1.split('.').shift()
    const isZero = parseFloat(str_2) === 0
    return isZero
  } catch (error) {
    return false
  }
}

export const loadElectric = async (downloadUrlArr) => {
  const buffers = []
  await map(downloadUrlArr, async (downloadUrl) => {
    if (!calcUrlIsZero(downloadUrl)) {
      const buffer = await loadNii(downloadUrl)
      buffers.push(buffer)
    }
  })

  if (buffers.length === 0) return null

  let fusionHeader = null
  let imageDataLength = 0
  const imageDataArr = []
  // 多负极的电场需要融合
  buffers.forEach((buffer) => {
    const { imageData, header } = depressNifiti(buffer)
    imageDataLength = imageData.length
    imageDataArr.push(imageData)
    fusionHeader = header
  })
  // 去除NaN值
  imageDataArr.forEach((arr) => {
    arr.forEach((value, i) => {
      if (Number.isNaN(value)) {
        arr[i] = 0
      }
    })
  })
  // 对相同索引的标量值进行叠加达到融合效果
  const fusionImage = Array(imageDataLength).fill(0)
  for (let i = 0; i < imageDataLength; i++) {
    imageDataArr.forEach((imageData) => {
      fusionImage[i] += imageData[i]
    })
  }
  const dims = fusionHeader.dims.slice(1, 4)
  const dimsCorrect = [dims[2], dims[1], dims[0]]
  const nArray = ndarray(fusionImage, dimsCorrect)
  const field = generateField(nArray, fusionHeader)
  return field
}

const loadNii = (url) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        responseType: 'arraybuffer',
      })
      .then((res) => {
        resolve(res.data)
      })
      .catch(reject)
  })
}

// 得到分析后的Image数据和头文件
const depressNifiti = (buffer) => {
  let source = null
  let imageData = null
  let header = null
  // 如果是nii.gz，那就解压
  if (nifti.isCompressed(buffer)) {
    source = nifti.decompress(buffer)
  } else {
    source = buffer
  }

  if (nifti.isNIFTI(source)) {
    header = nifti.readHeader(source)
    const niftiImage = nifti.readImage(header, source)
    if (header.datatypeCode === nifti.NIFTI1.TYPE_UINT8) {
      imageData = new Uint8Array(niftiImage)
    } else if (header.datatypeCode === nifti.NIFTI1.TYPE_INT16) {
      imageData = new Int16Array(niftiImage)
    } else if (header.datatypeCode === nifti.NIFTI1.TYPE_INT32) {
      imageData = new Int32Array(niftiImage)
    } else if (header.datatypeCode === nifti.NIFTI1.TYPE_FLOAT32) {
      imageData = new Float32Array(niftiImage)
    } else if (header.datatypeCode === nifti.NIFTI1.TYPE_FLOAT64) {
      imageData = new Float64Array(niftiImage)
    } else if (header.datatypeCode === nifti.NIFTI1.TYPE_INT8) {
      imageData = new Int8Array(niftiImage)
    } else if (header.datatypeCode === nifti.NIFTI1.TYPE_UINT16) {
      imageData = new Uint16Array(niftiImage)
    } else if (header.datatypeCode === nifti.NIFTI1.TYPE_UINT32) {
      imageData = new Uint32Array(niftiImage)
    }
  } else {
    throw new Error('该文件不是nitifi文件')
  }
  return { header, imageData }
}

const generateField = (nArray, header) => {
  const { affine } = header
  const [colLength, rowLength, depth] = nArray.shape
  const m41 = new THREE.Matrix4(...affine[0], ...affine[1], ...affine[2], ...affine[3])
  let values = []
  let points = []
  for (let z = 0; z < depth; z++) {
    for (let y = 0; y < rowLength; y++) {
      for (let x = 0; x < colLength; x++) {
        const point = new THREE.Vector3(z, y, x)
        const value = nArray.get(x, y, z)
        point.applyMatrix4(m41)
        point.applyMatrix4(sceneStore.extraData.MNI152_template)
        point.applyMatrix4(sceneStore.extraData.ras2xyz)
        points.push(point)
        values.push(Math.abs(value))
      }
    }
  }

  return { shape: nArray.shape, points, values }
}
