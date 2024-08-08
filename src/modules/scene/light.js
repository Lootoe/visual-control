import * as THREE from 'three'

export const createLight = (strength, distance) => {
  const light1 = new THREE.DirectionalLight(0xffffff, strength)
  light1.position.set(0, distance, 0)
  const light2 = new THREE.DirectionalLight(0xffffff, strength)
  light2.position.set(0, -distance, 0)
  const light3 = new THREE.DirectionalLight(0xffffff, strength)
  light1.position.set(0, 0, distance)
  const light4 = new THREE.DirectionalLight(0xffffff, strength)
  light2.position.set(0, 0, -distance)
  return [light1, light2, light3, light4]
}
