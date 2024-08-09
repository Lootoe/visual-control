import * as THREE from 'three'
import { loadNucleus } from './loadNucleus'

const getNucleusMat = (color, alpha) => {
  return new THREE.MeshLambertMaterial({
    color: color,
    transparent: true,
    opacity: alpha,
    depthTest: true,
    side: THREE.DoubleSide,
  })
}

export const renderNucleus = (nucleusObject) => {
  const { url, color, alpha, zh, en } = nucleusObject
  return new Promise((resolve, reject) => {
    loadNucleus(url)
      .then((geometry) => {
        const mat = getNucleusMat(color, alpha)
        const mesh = new THREE.Mesh(geometry, mat)
        mesh.name = 'nucleus'
        mesh.renderOrder = 2
        const displayName = `${zh}（${en}）`
        mesh.userData = { displayName }
        resolve(mesh)
      })
      .catch(reject)
  })
}
