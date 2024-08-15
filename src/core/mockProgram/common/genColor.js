export const genColor = (node, flag = false) => {
  // 0\1\2\2'
  if (node === 2 && flag) {
    // P2的负极是黄色
    return colors[3]
  }
  const colors = ['#27386f', '#0cce16', '#088fe9', '#f0ec05']
  return colors[node]
}
