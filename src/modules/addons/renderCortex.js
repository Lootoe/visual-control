import * as THREE from 'three'
import { loadCortex } from './loadCortex.js'

export const renderCortex = (url) => {
  return new Promise((resolve, reject) => {
    loadCortex(url)
      .then((geometry) => {
        const mesh = new THREE.Mesh(geometry, brainMaskMaterial)
        mesh.renderOrder = 2
        resolve(mesh)
      })
      .catch(reject)
  })
}

const vertexShader = `
varying vec3 vNormal;
varying vec3 vPositionNormal;
void main() 
{
  vNormal = normalize( normalMatrix * normal );
  vPositionNormal = normalize(( modelViewMatrix * vec4(position, 1.0) ).xyz);
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`

const fragmentShader = `
uniform vec3 glowColor;
uniform float b;
uniform float p;
uniform float s;
varying vec3 vNormal;
varying vec3 vPositionNormal;
void main() 
{
  float a = pow( b + s * abs(dot(vNormal, vPositionNormal)), p );
  gl_FragColor = vec4( glowColor, a );
}
`

const brainMaskMaterial = new THREE.ShaderMaterial({
  uniforms: {
    s: { type: 'f', value: -1 },
    b: { type: 'f', value: 0.8 },
    p: { type: 'f', value: 4 },
    glowColor: { type: 'c', value: new THREE.Color('#2ff') },
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.FrontSide,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
})
