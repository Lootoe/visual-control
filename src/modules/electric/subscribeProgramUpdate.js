import { debounce } from 'radash'
import usePatientStoreHook from '@/store/usePatientStore'
import { updateElectrics } from './updateElectrics'

const patientStore = usePatientStoreHook()

// 根据program的更新，在electricStore里存储相应的nii field
// 在调节幅值时，根据nii field构建模型
export const subscribeProgramUpdate = () => {
  const dFn = debounce({ delay: 200 }, async (state) => {
    updateElectrics(state.patientProgram)
  })
  // 采用队列机制，如果当前有电场在处理，必须等当前的电场处理完毕，才能处理下一个
  patientStore.$subscribe(async (mutation, state) => {
    dFn(state)
  })
}
