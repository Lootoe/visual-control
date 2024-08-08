import { renderNucleus } from './renderNucleus'
import { getNucleusEnum } from '@/enum/nucleusEnum'
import { usePatientStoreHook } from '@/store/usePatientStore'
import { useNucleusStoreHook } from '@/store/useNucleusStore'
import { addMeshes } from '@/modules/scene'

const { getPatientInfo, getPatientAssets } = usePatientStoreHook()
const { cacheNucleusList } = useNucleusStoreHook()

const getNucleusNameByFile = (fileName) => {
  // http://localhost:3000/patientData/46/nucleus/Right-NAc.ply
  // Right-NAc.ply
  // Right-NAc
  const str1 = fileName.split('/').pop()
  const str2 = str1.split('.')[0]
  return str2
}

const splitRGBA = (color) => {
  // 提取单纯的RGB和Alpha
  const numReg = /\d+/g
  const arr = color.match(numReg)
  let R, G, B
  R = arr[0]
  G = arr[1]
  B = arr[2]
  const alpha = arr[4] ? `${arr[3]}.${arr[4]}` : `${arr[3]}`
  return { pure: `rgb(${R},${G},${B})`, alpha }
}

export const initNucleus = () => {
  return new Promise((resolve, reject) => {
    const patientInfo = getPatientInfo()
    // 获取核团下载链接
    const nucleusAssets = getPatientAssets().nucleus
    // 获取疾病类型
    const diseaseEnum = patientInfo?.config?.diseaseCode || 0
    // 获取患者植入的核团
    const implantNucleus = patientInfo?.config?.nucleus || []
    // 获取核团配置
    const nucleusEnum = getNucleusEnum(diseaseEnum)
    const nucleusObjectArr = nucleusAssets.map((item) => {
      const nucleusName = getNucleusNameByFile(item.fileName)
      const nucleusConfig = nucleusEnum.find((item) => item.downloadName === nucleusName)
      const { pure, alpha } = splitRGBA(nucleusConfig.color)
      const nucleus = {
        mesh: null,
        ...nucleusConfig,
        // 以下三个变量会在加载核团时使用
        url: item.downloadUrl,
        color: pure,
        alpha: alpha,
      }
      return nucleus
    })
    // 下载核团
    Promise.all(nucleusObjectArr.map((item) => renderNucleus(item)))
      .then((nucleusMeshArr) => {
        addMeshes(nucleusMeshArr)
        nucleusMeshArr.forEach((nucleusMesh, index) => {
          const nuleusObject = nucleusObjectArr[index]
          nuleusObject.mesh = nucleusMesh
          // 同时还需要根据配置决定是否默认显示
          nucleusMesh.visible = nuleusObject.visible
        })
        // 但是我们需要的是经过排序的
        // 常用核团会放前面
        const sortedNucleusList = nucleusObjectArr.sort((a, b) => {
          return a.orderIndex - b.orderIndex
        })
        // 植入核团默认显示
        sortedNucleusList.forEach((item) => {
          implantNucleus.forEach((implantName) => {
            if (item.downloadName.search(implantName) !== -1) {
              item.visible = true
            }
          })
        })
        cacheNucleusList(sortedNucleusList)
        resolve()
      })
      .catch(reject)
  })
}
