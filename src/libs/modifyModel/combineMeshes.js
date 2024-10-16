import { ADDITION, Brush, Evaluator } from 'three-bvh-csg'

export const combineMeshes = (meshes) => {
  const brushs = meshes.map((mesh) => {
    const geo = mesh.geometry.clone()
    const brush = new Brush(geo, mesh.material.clone())
    return brush
  })
  const evaluator = new Evaluator()
  evaluator.attributes = ['position', 'normal']
  let result = brushs[0]
  for (let i = 1; i < brushs.length; i++) {
    result = evaluator.evaluate(result, brushs[i], ADDITION)
  }
  result.material = meshes[0].material
  result.renderOrder = 2
  return result
}
