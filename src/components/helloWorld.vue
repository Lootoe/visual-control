<script setup>
const mode = globalThis.SRENV.MODE
const platform = globalThis.SRENV.PLATFORM
</script>

<template>
    <div class="greet">current mode is : {{ mode }}</div>
    <div class="greet">current platform is : {{ platform }}</div>
</template>

<style scoped lang="less">
.greet {
    font-size: 36px;
    font-weight: bold;
}
</style>
