<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => {
  router.back()
}
</script>

<template>
  <el-result icon="error" title="环境错误" sub-title="您进入了一个与当前环境不一致的页面">
    <template #extra>
      <el-button type="primary" @click="goBack">返回</el-button>
    </template>
  </el-result>
</template>

<style scoped lang="less"></style>
