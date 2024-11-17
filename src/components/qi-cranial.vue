<script setup>
defineOptions({
  name: 'qi-cranial',
})

import usePatientStoreHook from '@/store/usePatientStore.js'
const patientStore = usePatientStoreHook()

const dialogVisual = ref(true)
const showQi = computed(() => {
  return patientStore?.patientInfo?.config?.isPneumocrania
})
</script>

<template>
  <div class="qilu-wrap" v-if="showQi">
    <div class="title" @click="dialogVisual = true">
      <img src="../assets/img/warning.png" alt="" />
      <span>气颅提醒</span>
    </div>
    <el-dialog
      v-model="dialogVisual"
      title=""
      align-center
      :show-close="false"
      :close-on-click-modal="false"
      class="qilu-dialog"
    >
      <div class="dialog-box">
        <div class="title">
          <img src="../assets/img/warning.png" alt="" />
          <span>气颅提醒！</span>
        </div>
        <div class="content">
          当前可视化是在颅内积气的术后CT上重建的，气体吸收后电极位置可能与图像所示略有差异，仅供参考！
        </div>
        <div class="footer">
          <span @click="dialogVisual = false">我已知晓</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.qilu-wrap {
  .title {
    font-weight: 400;
    font-size: 0.18rem;
    color: #f4891f;
    cursor: pointer;
    display: flex;
    align-items: center;
    img {
      width: 0.36rem;
      height: 0.36rem;
      margin-right: 0.12rem;
      vertical-align: bottom;
    }
  }
}
</style>
<style lang="less">
.qilu-wrap {
  position: absolute;
  z-index: 10;
  bottom: 1.6rem;
  right: 0.24rem;
  .el-dialog.qilu-dialog {
    width: 6rem !important;
    border-radius: 0.12rem;
    padding: 0;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      background: #262f44;
      border-radius: 0.12rem;
      border: 0.02rem solid #3a8eef;
      .dialog-box {
        padding: 0.38rem 0.4rem;
        .title {
          font-size: 0.26rem;
        }
        .content {
          width: 95%;
          padding: 0.2rem 0;
          font-size: 0.2rem;
          color: #ffffff;
          line-height: 0.3rem;
          font-style: normal;
          text-transform: none;
        }
        .footer {
          padding-top: 0.2rem;
          text-align: center;
          span {
            display: inline-block;
            width: 2.1rem;
            height: 0.7rem;
            line-height: 0.7rem;
            text-align: center;
            background: #7ac0c7;
            border-radius: 0.35rem;
            cursor: pointer;
            font-size: 0.22rem;
            color: #ffffff;
          }
        }
      }
    }
  }
}
</style>
