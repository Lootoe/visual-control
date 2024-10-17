import { addMesh } from '@/modules/scene'
import * as THREE from 'three'

export function debug() {
  const box = new THREE.BoxGeometry(50, 50, 50)
  const material = new THREE.MeshNormalMaterial()
  const mesh = new THREE.Mesh(box, material)
  addMesh(mesh)
}
