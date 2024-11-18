import * as THREE from 'three'

export const renderFiberInOneMesh = (sourceFibers) => {
  const allPositions = []

  for (const arr of sourceFibers) {
    const vectors = arr.map((p) => new THREE.Vector3(p[0], p[1], p[2]))
    const curve = new THREE.CatmullRomCurve3(vectors)
    const len = vectors.length

    for (let i = 0; i < len; i++) {
      const v = curve.getPointAt(i / (len - 1))
      allPositions.push(v.x, v.y, v.z)
    }

    allPositions.push(NaN, NaN, NaN) // 截断纤维
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(allPositions, 3))

  // 使用自定义 ShaderMaterial 替代 LineBasicMaterial
  const material = new THREE.ShaderMaterial({
    vertexShader: `
      ${THREE.ShaderChunk.logdepthbuf_pars_vertex}
      bool isPerspectiveMatrix(mat4){
        return true;
      }
      varying vec3 vPosition;

      void main() {
        vPosition = position; // 将 position 传递给 fragment shader
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        ${THREE.ShaderChunk.logdepthbuf_vertex}
      }
    `,
    fragmentShader: `
      ${THREE.ShaderChunk.logdepthbuf_pars_fragment}
      precision lowp float;
      varying vec3 vPosition;

      void main() {
        vec3 normalizedPosition = normalize(vPosition); // 归一化顶点位置

        // 按顶点方向计算颜色
        vec3 x = vec3(1.0, 0.0, 0.0);
        vec3 y = vec3(0.0, 1.0, 0.0);
        vec3 z = vec3(0.0, 0.0, 1.0);

        float r = abs(dot(normalizedPosition, x));
        float g = abs(dot(normalizedPosition, z));
        float b = abs(dot(normalizedPosition, y));

        gl_FragColor = vec4(r, g, b, 1.0);
        ${THREE.ShaderChunk.logdepthbuf_fragment}
      }
    `,
    vertexColors: true,
  })

  return new THREE.Line(geometry, material)
}
