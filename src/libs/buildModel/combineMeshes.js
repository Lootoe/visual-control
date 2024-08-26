import { ADDITION, Brush, Evaluator } from 'three-bvh-csg'

export const combineMeshes = (meshes) => {
  const brushs = meshes.map((mesh) => {
    const brush = new Brush(mesh.geometry.clone(), mesh.material.clone())
    brush.updateMatrixWorld()
    return brush
  })
  const evaluator = new Evaluator()
  evaluator.attributes = ['position', 'normal']
  let result = brushs[0]
  for (let i = 0; i < brushs.length - 1; i++) {
    result = evaluator.evaluate(result, brushs[i + 1], ADDITION)
  }
  result.material = meshes[0].material
  result.renderOrder = 2
  return result
}
