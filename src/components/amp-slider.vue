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
  <div class="amp-wrapper">
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
    <div class="amp-label">幅值：{{ patientStore.amplitude }}V</div>
  </div>
</template>

<style scoped lang="less">
.amp-wrapper {
  position: absolute;
  right: 0.24rem;
  height: 4rem;
  top: 45%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1.4rem;
  .amp-slider {
    flex: 1;
  }
  .amp-label {
    width: 100%;
    font-size: 0.2rem;
    color: #fff;
    margin-top: 0.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
