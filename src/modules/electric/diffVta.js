// 计算触点组合是否变化
const isCombinationChanged = (oldVta, newVta) => {
  // 先对比数组的长度是否变化，如果变了，那说明组合就变了
  // 如果数组的长度没变，那就判断每一个元素的对应的downloadUrl是否变化
  const oldLen = oldVta.downloadUrlArr.length
  const newLen = newVta.downloadUrlArr.length
  let flag = false
  if (oldLen !== newLen) {
    flag = true
  } else {
    newVta.downloadUrlArr.forEach((newUrl, i) => {
      const oldUrl = oldVta.downloadUrlArr[i]
      if (oldUrl !== newUrl) {
        flag = true
      }
    })
  }
  return flag
}

// 计算幅值是否变化
const isAmplitudeChanged = (oldVta, newVta) => {
  // 如果数组对位的vta幅值不一致，那就说明变化了
  // *同一个group的幅值一定相同，所以我们比较第一项即可
  const oldAmp = oldVta.amplitude
  const newAmp = newVta.amplitude
  return oldAmp !== newAmp
}

// 计算幅值是否为0
// !还有一种可能，那就是幅值不为0，但是触点组合全是0，这种情况也当幅值为0处理
const isAmplitudeZero = (newVta) => {
  const isAmpZero = parseFloat(newVta.amplitude) === 0
  const hasUrlZero = newVta.downloadUrlArr.some((url) => calcUrlIsZero(url))
  return isAmpZero || hasUrlZero
}

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

export { isCombinationChanged, isAmplitudeChanged, isAmplitudeZero }
