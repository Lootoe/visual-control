// 统一使用downloadUrl\fileName的数据结构
export const convertAssets = (params) => {
  const { modalityResultList } = params
  const assets = {
    nucleus: [],
    lead: [],
    fiber: [],
    head: {},
    matrix: {},
    filter: [],
    VTA: [],
  }
  modalityResultList.forEach((item) => {
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
      assets.fiber = item.downloadUrlList
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
  return assets
}
