<script setup>
import { debug, compileTxt } from './index'
import { addMesh, removeMesh } from '@/modules/scene'
import { renderTxt } from './renderTxt'

onMounted(() => {
  debug()
})

const uploadRef = ref(null)
const renderMode = ref(0)
const amp = ref(0)

let points = []
let values = []
let mesh = null

const onAmpChanged = async (value) => {
  amp.value = value
  removeMesh(mesh)
  mesh = await renderTxt(points, values, value, renderMode.value)
  addMesh(mesh)
}
const onModeChange = () => {
  onAmpChanged(amp.value)
}
const onFileSuccess = (file) => {
  const reader = new FileReader()
  reader.onload = async function (e) {
    // 读取文件内容为字符串
    const fileContent = e.target.result
    const res = compileTxt(fileContent)
    points = res.points
    values = res.values
    console.log('总点数', points.length)
    mesh = await renderTxt(points, values, 0, renderMode.value)
    addMesh(mesh)
  }
  reader.readAsText(file.raw)
}
</script>

<template>
  <control-scene></control-scene>
  <amp-slider @changeAmp="onAmpChanged"></amp-slider>
  <el-upload
    ref="uploadRef"
    class="upload-demo"
    :auto-upload="false"
    :show-file-list="false"
    :on-change="onFileSuccess"
  >
    <template #trigger>
      <el-button type="primary">select file</el-button>
    </template>
  </el-upload>
  <el-switch
    v-model="renderMode"
    class="switch-mode"
    inline-prompt
    size="large"
    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
    inactive-text="显示点云"
    active-text="显示表面"
    :inactive-value="0"
    :active-value="1"
    @change="onModeChange"
  />
</template>

<style scoped lang="less">
.upload-demo {
  position: absolute;
  bottom: 2.4rem;
  right: 0.34rem;
}
.switch-mode {
  position: absolute;
  bottom: 1.8rem;
  right: 0.46rem;
}
</style>
