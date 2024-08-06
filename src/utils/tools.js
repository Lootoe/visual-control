/**
 * 加载图片
 * @param {*} name 图片名称
 * @returns URL
 */
export const loadImg = name => {
  return new URL(`../assets/img/${name}`, import.meta.url).href
}
