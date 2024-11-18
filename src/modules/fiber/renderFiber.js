import * as THREE from 'three'

export const renderFiberInOneMesh = (sourceFibers) => {
  const allPositions = []
  const tangents = []

  for (const arr of sourceFibers) {
    const vectors = arr.map((p) => new THREE.Vector3(p[0], p[1], p[2]))
    const curve = new THREE.CatmullRomCurve3(vectors)
    const len = Math.max(4, Math.floor(vectors.length / 2))

    for (let i = 0; i < len; i++) {
      const t = i / (len - 1)
      const v = curve.getPointAt(t)
      const tangent = curve.getTangentAt(t).normalize()

      allPositions.push(v.x, v.y, v.z)
      tangents.push(tangent.x, tangent.y, tangent.z)
    }

    allPositions.push(NaN, NaN, NaN) // 截断纤维
    tangents.push(NaN, NaN, NaN)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(allPositions, 3))
  geometry.setAttribute('tangent', new THREE.Float32BufferAttribute(tangents, 3))

  const material = new THREE.ShaderMaterial({
    vertexShader: `
      ${THREE.ShaderChunk.logdepthbuf_pars_vertex}
      bool isPerspectiveMatrix(mat4){
        return true;
      }
      attribute vec3 tangent; // 预先计算并传入切线
      varying vec3 vTangent;  // 传递切线向量到片段着色器
      varying vec3 vPosition; // 传递顶点位置

      void main() {
        vTangent = tangent; // 直接使用传入的切线
        vPosition = position; // 传递顶点位置（备用）
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

        ${THREE.ShaderChunk.logdepthbuf_vertex}
      }
    `,
    fragmentShader: `
      ${THREE.ShaderChunk.logdepthbuf_pars_fragment}
      precision lowp float;
      varying vec3 vTangent; // 接收顶点着色器传递的切线向量

      void main() {
        vec3 normalizedTangent = normalize(vTangent); // 归一化切线向量

        // 按切线方向计算颜色
        vec3 x = vec3(1.0, 0.0, 0.0);
        vec3 y = vec3(0.0, 1.0, 0.0);
        vec3 z = vec3(0.0, 0.0, 1.0);

        float r = abs(dot(normalizedTangent, x));
        float g = abs(dot(normalizedTangent, z));
        float b = abs(dot(normalizedTangent, y));

        gl_FragColor = vec4(r, g, b, 1.0); // 根据切线方向着色
        ${THREE.ShaderChunk.logdepthbuf_fragment}
      }
    `,
    vertexColors: true,
  })

  return new THREE.Line(geometry, material)
}
