import { useCounterStore } from "../store/useCounterStore"

const counterStore = useCounterStore()

export const isLoading = () => {
    return counterStore.loading
}