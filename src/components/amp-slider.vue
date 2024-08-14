<script setup>
import { updateProgramByAmplitude } from '@/libs/updateProgram.js'
import usePatientStoreHook from '@/store/usePatientStore.js'

const patientStore = usePatientStoreHook()

const sliderToolTip = (value) => {
  return `幅值：${value}V`
}
const onAmpChange = (value) => {
  updateProgramByAmplitude(value)
}
</script>

<template>
  <el-slider
    v-model="patientStore.amplitude"
    :min="0"
    :max="12.75"
    :step="0.05"
    vertical
    :format-tooltip="sliderToolTip"
    class="amp-slider"
    placement="left"
    @change="onAmpChange"
  ></el-slider>
</template>

<style scoped lang="less">
.amp-slider {
  position: absolute;
  right: 0.2rem;
  height: 4rem;
  top: 45%;
}
</style>
