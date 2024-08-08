// 清除场景中的所有对象
function clearScene(scene) {
  while (scene.children.length > 0) {
    const object = scene.children[0]
    scene.remove(object)
    disposeObject(object)
  }
}

// 销毁对象
function disposeObject(object) {
  if (object.geometry) {
    object.geometry.dispose()
  }

  if (object.material) {
    if (Array.isArray(object.material)) {
      object.material.forEach((material) => disposeMaterial(material))
    } else {
      disposeMaterial(object.material)
    }
  }

  if (object.texture) {
    object.texture.dispose()
  }

  if (object.children.length > 0) {
    object.children.forEach((child) => disposeObject(child))
  }
}

// 销毁材质
function disposeMaterial(material) {
  if (material.map) {
    material.map.dispose()
  }
  if (material.lightMap) {
    material.lightMap.dispose()
  }
  if (material.bumpMap) {
    material.bumpMap.dispose()
  }
  if (material.normalMap) {
    material.normalMap.dispose()
  }
  if (material.specularMap) {
    material.specularMap.dispose()
  }
  if (material.envMap) {
    material.envMap.dispose()
  }
  material.dispose()
}

// 释放WebGL上下文
function releaseRenderer(renderer) {
  renderer.dispose()
  const gl = renderer.getContext()
  gl.getExtension('WEBGL_lose_context').loseContext()
}

export const cleanScene = (renderer, scene) => {
  // 清除场景中的所有对象
  clearScene(scene)

  // 释放WebGL上下文
  releaseRenderer(renderer)

  // 将renderer的domElement从DOM中移除
  if (renderer.domElement && renderer.domElement.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement)
  }
}
