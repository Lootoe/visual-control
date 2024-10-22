export const loadElectricTxt = (url) => {
  return new Promise((resolve, reject) => {
    this.loadFile(url)
      .then((data) => {
        // 先将每个点区分开
        const reg = /\n/g
        const arr = data.split(reg)
        const arr_notEmpty = arr.filter((v) => v !== '')
        // 再将点取出来，并且得到它的阈值
        const points = []
        arr_notEmpty.forEach((v) => {
          const [a, b, c, strength] = v.split(',')
          points.push([parseFloat(a), parseFloat(b), parseFloat(c), parseFloat(strength)])
        })
        resolve(points)
      })
      .catch(reject)
  })
}
