import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counterStore', () => {

  // state
  let count = ref(0)
  let loading = ref(false)

  // getters
  let doubleCount = computed(() => {
    return count.value * 2
  })

  // +1
  let increment = () => {
    count.value++
  }

  // +random
  let randomizeCounter = async () => {
    loading.value = true
    setTimeout(() => {
      count.value = Math.round(100 * Math.random())
      loading.value = false
      return
    }, 1000)
  }

  return {
    count, loading, doubleCount, increment, randomizeCounter
  }
})
