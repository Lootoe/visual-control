import { diffVtaList, handleStuff } from './diffVta'
import { diffVtaListPad, handleStuffPad } from './diffVtaPad'
import useVtaStoreHook from '@/store/useVtaStore'
import { map } from 'radash'

const vtaStore = useVtaStoreHook()

export const updateElectrics = async (program) => {
  const isContorl = program.isControl ?? true
  // 防止引用导致内存泄漏，直接拷贝一份
  const newProgram = JSON.parse(JSON.stringify(program))
  // 将program转换为VtaTable的结构
  const newVtaTable = convertToVtaTable(newProgram)
  const oldVtaTable = vtaStore.$state.vtaTable
  await manageVta(newVtaTable, oldVtaTable, isContorl)
  vtaStore.vtaTable = newVtaTable
}

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

const manageVta = async (newVtaTable, oldVtaTable, isContorl) => {
  await map(Object.keys(newVtaTable), async (position) => {
    const newVtaList = newVtaTable[position]
    const oldVtaList = oldVtaTable[position]
    if (globalThis.SRENV.IS_PLATFORM_PAD()) {
      const stuffList = diffVtaListPad(newVtaList, oldVtaList, isContorl)
      console.log('【VtaStuffList】', stuffList)
      await handleStuffPad(stuffList, position)
    } else {
      const stuffList = diffVtaList(newVtaList, oldVtaList)
      console.log('【VtaStuffList】', stuffList)
      await handleStuff(stuffList, position)
    }
  })
}
