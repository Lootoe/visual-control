import * as THREE from 'three'
import { loadBrain } from './loadBrain.js'
import brainObj from '@/assets/models/brain.obj'

export const renderBrain = () => {
  return new Promise((resolve, reject) => {
    loadBrain(brainObj)
      .then((geometry) => {
        const mesh = new THREE.Mesh(geometry, brainMat)
        resolve(mesh)
      })
      .catch(reject)
  })
}

const brainMat = new THREE.MeshLambertMaterial({ color: 0xffffff })
