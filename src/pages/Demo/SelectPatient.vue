<script setup>
import { useRouter } from 'vue-router'
import { getDemoList } from '@/utils/api'

const router = useRouter()

const DISEASE_CODE_ENUM = {
  MOVEMENT: 0,
  PSYCHIATRIC: 1,
}
// 帕金森患者
const movementDisorders = ref([])
// 精神病患者
const psychiatricDisorders = ref([])

onMounted(() => {
  getDemoList().then((res) => {
    for (const item of res.data.data || []) {
      if (item.diseaseCode === DISEASE_CODE_ENUM.MOVEMENT) {
        movementDisorders.value.push(item)
      } else if (item.diseaseCode === DISEASE_CODE_ENUM.PSYCHIATRIC) {
        psychiatricDisorders.value.push(item)
      }
    }
    console.log('movementDisorders', movementDisorders.value)
    console.log('psychiatricDisorders', psychiatricDisorders.value)
  })
})

const diseaseTypeList = computed(() => {
  return [
    { title: '运动障碍性疾病', patientList: movementDisorders.value },
    { title: '精神性疾病', patientList: psychiatricDisorders.value },
  ]
})

const patientSelectHandler = (item) => {
  router.push({
    path: '/demo/index',
    query: {
      demoId: item.id,
    },
  })
}
</script>

<template>
  <div class="patientSelectorContainer">
    <div class="tip">本软件为演示使用，以正式软件为准！</div>
    <div v-for="(item, index) of diseaseTypeList" :key="index" :class="{ children: index }">
      <div v-if="item.patientList.length" class="patientType">
        <div class="title">{{ item.title }}</div>
        <div class="patientContainer">
          <div
            v-for="(patient, patientIndex) of item.patientList"
            :key="patientIndex"
            class="patientOuter"
          >
            <div class="patient" @click="patientSelectHandler(patient)">
              <div>{{ `靶点：${patient.targetSpot}` }}</div>
              <div>{{ patient.leadType }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.patientSelectorContainer {
  width: 100vw;
  height: 100vh;
  background-color: #131b34;
  padding: 32px;
  overflow-y: auto;
  .tip {
    color: #935f36;
    font-size: 16px;
    float: right;
  }
  .patientType {
    .title {
      font-size: 20px;
      color: #ffffffe5;
      font-weight: 700;
      margin-bottom: 24px;
    }
    .patientContainer {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .patientOuter {
        width: 32%;
        .patient {
          color: #ffffff99;
          margin-bottom: 24px;
          padding: 14px 18px;
          font-size: 16px;
          background-color: #27406f;
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
          cursor: pointer;
        }
      }
    }
  }
  .children {
    margin-top: 24px;
  }
}
</style>
