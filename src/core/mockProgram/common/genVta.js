const processArray = (arr) => {
  let result = new Array(arr.length).fill(0) // 初始化结果数组，全部为0
  let n = arr.length

  // 遍历数组，处理左侧的1
  for (let i = 0; i < n; i++) {
    if (arr[i] === 2) {
      result[i] = 2
      // 向左寻找第一个1
      for (let j = i - 1; j >= 0; j--) {
        if (arr[j] === 1) {
          result[j] = 1
          break
        }
      }
      // 向右寻找第一个1
      for (let j = i + 1; j < n; j++) {
        if (arr[j] === 1) {
          result[j] = 1
          break
        }
      }
    }
  }

  return result
}

const processNiiUrl = (position, arr) => {
  const source = arr.join('')
  const fileName = `Lead_${position}_${source}.nii.gz`
  return fileName
}

const generateVta = (nodes, position = 1) => {
  if (!nodes) return []
  const length = nodes.length
  let vtaSegments = []
  if (nodes.every((v) => v.node !== 2)) {
    const arr = new Array(length).fill(0)
    // 去除多余的1
    const newArr = processArray(arr)
    const url = processNiiUrl(position, newArr)
    vtaSegments.push(url)
  } else {
    // 将每个负单独提取出来
    // 如果其它位置是负，那就置为1
    // 如果其他位置是1，那就是1
    for (let i = 0; i < length; i++) {
      const curtNode = nodes[i].node
      const arr = []
      if (curtNode === 2) {
        arr[i] = curtNode
        for (let j = 0; j < length; j++) {
          if (i === j) continue
          const otherNode = nodes[j].node
          const node = otherNode === 2 ? 1 : otherNode
          arr[j] = node
        }
        // 去除多余的1
        const newArr = processArray(arr)
        const url = processNiiUrl(position, newArr)
        vtaSegments.push(url)
      }
    }
  }
  return {
    downloadUrlArr: vtaSegments,
    amplitude: 0,
  }
}

export { generateVta }
