import * as THREE from 'three'
import { getGeometryFromVertices, getPointCloud } from '@/libs/other/threeTools'
import { SVO } from '@/libs/other/SVO'
import { addMesh } from '@/modules/scene'

const getSquarePointsCloud = (num, min, max, center = [0, 0, 0]) => {
  const points = []
  for (let i = 0; i < num; i++) {
    const x = Math.random() * (max - min) + min + center[0]
    const y = Math.random() * (max - min) + min + center[1]
    const z = Math.random() * (max - min) + min + center[2]
    points.push([x, y, z])
  }
  return points
}

export const testSVO = () => {
  const points = getSquarePointsCloud(500, -50, 50, [0, 0, 0])
  const pointCloud = getPointCloud(points, 1)
  addMesh(pointCloud)

  const bounds = {
    min: [-50, -50, -50],
    max: [50, 50, 50],
  }

  const svo = new SVO(points, bounds)
  svo.buildTree(6)
  console.log('svo', svo)

  // 渲染SVO当中所有叶节点的方框
  svo.traverse((node) => {
    if (node.isLeaf) {
      const box = new THREE.Box3(
        new THREE.Vector3(...node.bounds.min),
        new THREE.Vector3(...node.bounds.max)
      )
      // 使用 Box3Helper 可视化该边界框
      const boxHelper = new THREE.Box3Helper(box, 0x00ffff) // 红色边框
      addMesh(boxHelper) // 添加到场景中进行渲染
    }
  })
}
