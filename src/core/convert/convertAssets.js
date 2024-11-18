// 统一使用downloadUrl\fileName的数据结构
export const convertAssets = (params) => {
  let sourceData
  if (params.modalityResultList) {
    sourceData = params.modalityResultList
  }
  if (params.assetsList) {
    sourceData = params.assetsList
  }
  const assets = {
    nucleus: [],
    lead: [],
    fiber: [],
    head: {},
    matrix: {},
    filter: [],
    VTA: [],
    wholeBrainFiber: [],
  }
  if (globalThis.SRENV.IS_PLATFORM_PAD()) {
    sourceData.forEach((item) => {
      if (item.type === 'nucleus') {
        assets.nucleus = item.downloadUrlList.map((v) => {
          return {
            downloadUrl: v,
            fileName: v,
          }
        })
      }
      if (item.type === 'lead') {
        const reg = new RegExp('Lead.txt')
        const lead = item.downloadUrlList.find((v) => {
          return reg.test(v)
        })
        assets.lead = {
          downloadUrl: lead,
          fileName: lead,
        }
      }
      if (item.type === 'fiber') {
        const fibers = item.downloadUrlList.filter((v) => {
          return v.search('whole_brain') !== -1
        })
        const wholeBrainFibers = item.downloadUrlList.filter((v) => {
          return v.search('head_mask') !== -1
        })
        assets.fiber = fibers
        assets.wholeBrainFiber = wholeBrainFibers
      }
      if (item.type === 'matrix') {
        const str1 = 'MNI152_template'
        const globalAffine = item.downloadUrlList.find((v) => {
          return v.search(str1) !== -1
        })
        assets.matrix[str1] = {
          downloadUrl: globalAffine,
          fileName: globalAffine,
        }
      }
      if (item.type === 'head') {
        if (item.downloadUrlList.length > 0) {
          assets.head = {
            downloadUrl: item.downloadUrlList[0],
            fileName: item.downloadUrlList[0],
          }
        }
      }
      if (item.type === 'filter') {
        assets.filter = item.downloadUrlList.map((v) => {
          return {
            downloadUrl: v,
            fileName: v,
          }
        })
      }
      if (item.type === 'VTA') {
        assets.VTA = item.downloadUrlList.map((v) => {
          return {
            downloadUrl: v,
            fileName: v,
          }
        })
      }
    })
  } else {
    sourceData.forEach((item) => {
      if (item.type === 'nucleus') {
        assets.nucleus = item.downloadUrlList
      }
      if (item.type === 'lead') {
        const reg = new RegExp('Lead.txt')
        const lead = item.downloadUrlList.find((v) => {
          return reg.test(v.fileName)
        })
        assets.lead = lead
      }
      if (item.type === 'fiber') {
        const fibers = item.downloadUrlList.filter((v) => {
          return v.fileName.search('whole_brain') !== -1
        })
        const wholeBrainFibers = item.downloadUrlList.filter((v) => {
          return v.fileName.search('head_mask') !== -1
        })
        assets.fiber = fibers
        assets.wholeBrainFiber = wholeBrainFibers
      }
      if (item.type === 'matrix') {
        const str1 = 'MNI152_template'
        const globalAffine = item.downloadUrlList.find((v) => {
          return v.fileName.search(str1) !== -1
        })
        assets.matrix[str1] = globalAffine
      }
      if (item.type === 'head') {
        if (item.downloadUrlList.length > 0) {
          assets.head = item.downloadUrlList[0]
        }
      }
      if (item.type === 'filter') {
        assets.filter = item.downloadUrlList
      }
      if (item.type === 'VTA') {
        assets.VTA = item.downloadUrlList
      }
    })
  }
  return assets
}
