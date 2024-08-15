export const genColor = (node, flag) => {
  if (node === 2 && flag) {
    return colors[3]
  }
  const colors = ['#27386f', '#0cce16', '#ff6fe9', '#fec621']
  return colors[node]
}
