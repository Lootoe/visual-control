import * as THREE from 'three'
import useSceneStoreHook from '@/store/useSceneStore'

const sceneStore = useSceneStoreHook()

const loadFile = (url) => {
  return new Promise((resolve, reject) => {
    const fileloadr = new THREE.FileLoader()
    fileloadr.load(
      url,
      (data) => {
        resolve(data)
      },
      null,
      reject
    )
  })
}

export const loadLeadTxt = (url) => {
  return new Promise((resolve, reject) => {
    const leads = {}
    const sceneExtra = sceneStore.extraData
    loadFile(url)
      .then((data) => {
        const reg1 = /\n/g
        let arr = data.split(reg1)
        // 去除末尾的空字符串
        arr = arr.filter((v) => !!v && v !== '')
        // 读取电极序号
        const reg2 = /\[\w\]/g
        // 读取电极长度
        const reg3 = /\[len_\d{1}\]/
        // 先设置电极坐标
        arr.forEach((v) => {
          // 获取电极序号
          const pre = v.match(reg2)
          if (pre) {
            const position = Number(pre[0].match(/\w/)[0])
            // 获取坐标
            const post = v.split(reg2)[1]
            const points = post.split(',')
            points.forEach((v, i) => {
              points[i] = Number(v)
            })
            const source = new THREE.Vector3(points[0], points[1], points[2])
            source.applyMatrix4(sceneExtra.MNI152_template)
            source.applyMatrix4(sceneExtra.ras2xyz)
            const target = leads[position]
            if (!target) {
              const lead = {
                position,
                leadPoints: [source],
                leadLen: 60,
              }
              leads[position] = lead
            } else {
              target.leadPoints.push(source)
            }
          }
        })
        // 再设置电极长度
        arr.forEach((v) => {
          const lenResult = v.match(reg3)
          if (lenResult) {
            const position = Number(lenResult[0].match(/\d{1}/)[0])
            // 提取后面的数字
            const len = Number(v.split(reg3)[1])
            const target = leads[position]
            target.leadLen = len
          }
        })
        resolve(leads)
      })
      .catch(reject)
  })
}
