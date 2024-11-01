<script setup>
import { debug, compileTxt } from './index'
import { addMesh, removeMesh } from '@/modules/scene'
import { renderTxt, calcPointsLayer } from './renderTxt'

onMounted(() => {
  debug()
})

const uploadRef = ref(null)
const renderMode = ref(0)
const amp = ref(0)

let points = []
let values = []
let mesh = null
let staticsList = shallowRef([])

let totalLength = 0

const onAmpChanged = async (value) => {
  console.time('完整重建耗时')
  amp.value = value
  removeMesh(mesh)
  mesh = await renderTxt(points, values, value, renderMode.value)
  addMesh(mesh)
  console.timeEnd('完整重建耗时')
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
    totalLength = points.length
    staticsList.value = calcPointsLayer(values)
    mesh = await renderTxt(points, values, 0, renderMode.value)
    addMesh(mesh)
  }
  reader.readAsText(file.raw)
}
</script>

<template>
  <control-scene></control-scene>
  <amp-slider @changeAmp="onAmpChanged"></amp-slider>
  <div class="statics">
    <div class="statics-item" v-for="item in staticsList" :key="item.name">
      [{{ item.range[0] }},{{ item.range[1] }}]：{{ item.length }}
    </div>
    <div class="total">总点数：{{ totalLength }}</div>
  </div>

  <div class="panel">
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
  </div>
</template>

<style scoped lang="less">
.panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 1.2rem;
  right: 0.36rem;
}
.statics {
  position: absolute;
  color: #fff;
  top: 0.2rem;
  left: 0.2rem;
  font-size: 0.24rem;
}
</style>
