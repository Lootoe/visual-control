export const getOutterFace = (faces) => {
  const keyMap = new Map()
  faces.forEach((face) => {
    const key = face.sort((a, b) => a - b).join('_')
    if (!keyMap.has(key)) {
      keyMap.set(key, {
        face: face,
        count: 1,
      })
    } else {
      keyMap.get(key).count++
    }
  })
  const result = []
  keyMap.forEach((value) => {
    if (value.count === 1) {
      result.push(value.face)
    }
  })
  return result
}
