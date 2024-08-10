import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

/**加载obj模型，主要是辅视图的人头 */
export const loadBrain = (url) => {
  return new Promise((resolve, reject) => {
    if (!url || url === '') reject()
    const loader = new OBJLoader()
    loader.load(
      url,
      (object) => {
        const geometry = object.children[0].geometry
        resolve(geometry)
      },
      null,
      reject
    )
  })
}
