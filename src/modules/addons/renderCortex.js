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
  float intensity = pow( b + s * abs(dot(vNormal, vPositionNormal)), p );
  
  // 将轮廓颜色应用到片元上
  gl_FragColor = vec4( glowColor, intensity );
}
`

const brainMaskMaterial = new THREE.ShaderMaterial({
  uniforms: {
    s: { type: 'f', value: -1.0 }, // 增加s值以增强轮廓的对比度
    b: { type: 'f', value: 0.6 }, // 调整b值以更好地控制轮廓的亮度
    p: { type: 'f', value: 2.0 }, // 调整p值以控制轮廓的渐变效果
    glowColor: { type: 'c', value: new THREE.Color('#2ff') },
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.BackSide, // 使用BackSide只显示物体的外部轮廓
  blending: THREE.AdditiveBlending,
  depthWrite: false,
})
