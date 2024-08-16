/**
 * *当Program改变时，我们实时更新VTA
 * ?更新VTA模型
 * ?对VTA进行CutOff
 */
import usePatientStoreHook from '@/store/usePatientStore'
import useVtaStoreHook from '@/store/useVtaStore'
import { diffVtaList, handleStuff } from './diffVta'
import { map } from 'radash'

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

// 根据program的更新，在electricStore里存储相应的nii field
// 在调节幅值时，根据nii field构建模型
export const subscribeProgramUpdate = () => {
  // 采用队列机制，如果当前有电场在处理，必须等当前的电场处理完毕，才能处理下一个
  const queue = []
  let flag = false
  patientStore.$subscribe((mutation, state) => {
    const fn = async () => {
      flag = true
      // 防止引用导致内存泄漏，直接拷贝一份
      const newProgram = JSON.parse(JSON.stringify(state.patientProgram))
      // 将program转换为VtaTable的结构
      const newVtaTable = convertToVtaTable(newProgram)
      const oldVtaTable = vtaStore.$state.vtaTable
      await manageVta(newVtaTable, oldVtaTable)
      vtaStore.vtaTable = newVtaTable
      flag = false
      if (queue.length > 0) {
        const nextFn = queue.shift()
        nextFn()
      }
    }
    console.log('flag', flag)
    if (!flag) {
      fn()
    } else {
      queue.push(fn)
    }
  })
}

const manageVta = async (newVtaTable, oldVtaTable) => {
  await map(Object.keys(newVtaTable), async (position) => {
    const newVtaList = newVtaTable[position]
    const oldVtaList = oldVtaTable[position]
    const stuffList = diffVtaList(newVtaList, oldVtaList)
    console.log('【VtaStuffList】', stuffList)
    await handleStuff(stuffList)
  })
}
