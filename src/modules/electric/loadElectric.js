import ndarray from 'ndarray'
import * as nifti from 'nifti-reader-js'
import * as THREE from 'three'
import { map } from 'radash'
import { ElMessage } from 'element-plus'
import axios from 'axios'
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

export const loadNifitis = async (downloadUrlArr) => {
  const buffers = []
  await map(downloadUrlArr, async (downloadUrl) => {
    // 判断触点组合的URL是否为空
    // 在初始化和调节幅值时，我们只能调节一根电极，那么另一根电极的触点组合可能为0000
    // 为了防止我们去处理0000这个不存在的触点组合
    // 我们直接不做任何事
    if (!calcUrlIsZero(downloadUrl)) {
      const buffer = await loadNii(downloadUrl)
      buffers.push(buffer)
    }
  })
  return buffers
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
        let value = nArray.get(x, y, z)
        // 最边缘的值置为0，防止存在破洞
        // 不给外层加一圈，而是原地置零，是因为加一圈需要将整个shape向右上平移，相当麻烦
        if (
          x === 0 ||
          y === 0 ||
          z === 0 ||
          x === colLength - 1 ||
          y === rowLength - 1 ||
          z === depth - 1
        ) {
          value = 0
        }
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

export const loadElectric = async (downloadUrlArr) => {
  let buffers
  let fusionHeader = null
  const imageDataArr = []
  let imageDataLength = 0
  try {
    buffers = await loadNifitis(downloadUrlArr)
    // 如果全是0000的触点组合，那就不处理
    if (buffers.length === 0) return null
    buffers.forEach((buffer) => {
      const { imageData, header } = depressNifiti(buffer)
      imageDataLength = imageData.length
      imageDataArr.push(imageData)
      fusionHeader = header
    })
  } catch (error) {
    console.log('error', error)
    // 有的电场组合不是很合理，或者说我们给的组合并不完整
    ElMessage({
      type: 'warning',
      message: '该触点组合暂无电场仿真',
    })
    // 返回Null，那么在usElectric里，渲染电场的逻辑就会暂停
    return null
  }
  imageDataArr.forEach((arr) => {
    arr.forEach((value, i) => {
      if (Number.isNaN(value)) {
        arr[i] = 0
      }
    })
  })
  // 融合后的图像数据
  const fusionImage = Array(imageDataLength).fill(0)
  for (let i = 0; i < imageDataLength; i++) {
    imageDataArr.forEach((imageData) => {
      fusionImage[i] += imageData[i]
    })
  }
  const dims = fusionHeader.dims.slice(1, 4)
  const dimsCorrect = [dims[2], dims[1], dims[0]]
  const nArray = ndarray(fusionImage, dimsCorrect)
  const fusionVta = generateField(nArray, fusionHeader)
  const ndArrayList = imageDataArr.map((imageData) => ndarray(imageData, dimsCorrect))
  const splitVta = ndArrayList.map((nArray) => generateField(nArray, fusionHeader))

  const electricRenderData = {
    fusionVta,
    splitVta,
    nodeLength: downloadUrlArr.length,
  }
  return electricRenderData
}
