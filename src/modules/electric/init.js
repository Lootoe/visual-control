import usePatientStoreHook from '@/store/usePatientStore'
import useVtaStoreHook from '@/store/useVtaStore'

const patientStore = usePatientStoreHook()
const vtaStore = useVtaStoreHook()

export const convertToVtaTable = (program) => {
  const vtaTable = {}
  // 第一层是不同电极
  // 第二层forEach是同根电极的不同program
  Object.keys(program).forEach((position) => {
    const arr = program[position]
    vtaTable[position] = []
    arr.forEach((leadProgram) => {
      const { vtaList, display } = leadProgram
      if (display === 1) {
        vtaTable[position].push(...vtaList)
      }
    })
  })
  return vtaTable
}

export const __initElectric = () => {
  vtaStore.vtaTable = convertToVtaTable(patientStore.patientProgram)
}
