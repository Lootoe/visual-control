/**
 * *当Program改变时，我们实时更新电极片模型
 * ?改变电极片颜色
 */
import usePatientStoreHook from '@/store/usePatientStore'
import { updateChip } from './updateChip'

const patientStore = usePatientStoreHook()

export const subscribeProgramUpdate = () => {
  patientStore.$subscribe((mutation, state) => {
    const newProgram = state.patientProgram
    updateChip(newProgram)
  })
}
