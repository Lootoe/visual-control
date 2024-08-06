<script setup>
import { useCounterStore } from '@/store/useCounterStore'
import { isLoading } from '@/hooks/useLoading.js'

defineOptions({
    name: 'Home',
})
const countStore = useCounterStore()
const { count, doubleCount } = storeToRefs(countStore)
const increment = countStore.increment
const randomizeCounter = countStore.randomizeCounter
</script>

<template>
    <div class="center">
        <hello-world></hello-world>
        <div :size="24" class="info">单倍：{{ count }}</div>
        <div :size="24" class="info">双倍：{{ doubleCount }}</div>
        <div class="btn-box">
            <el-button type="primary" secondary @click="increment"
                >加一</el-button
            >
            <el-button
                type="primary"
                secondary
                @click="randomizeCounter"
                :loading="isLoading()"
                >等待随机</el-button
            >
        </div>
    </div>
</template>

<style scoped lang="less">
.center {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .info {
        margin: 8px 0;
    }
}
</style>
