export const loadImg = (name) => {
  return new URL(`../assets/img/${name}`, import.meta.url).href
}

export const splitRGBA = (color) => {
  // 提取单纯的RGB和Alpha
  // 因为emissive不支持alpha，需要设置opacity
  const numReg = /\d+/g
  const arr = color.match(numReg)
  let R, G, B
  R = arr[0]
  G = arr[1]
  B = arr[2]
  const alpha = arr[4] ? `${arr[3]}.${arr[4]}` : `${arr[3]}`
  return { pure: `rgb(${R},${G},${B})`, alpha }
}
