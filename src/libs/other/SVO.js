class OctreeNode {
  constructor(bounds, depth = 0) {
    this.bounds = bounds // 体素的空间边界
    this.children = [] // 存储子节点
    this.depth = depth // 当前节点的深度
    this.isLeaf = true // 标记是否为叶节点
    this.points = [] // 存储在该节点内的点云数据
  }

  // 判断是否需要细分节点
  needsSubdivision(maxPoints) {
    // 当节点中的点数超过最大限制且深度未超过最大深度时细分
    return this.points.length > maxPoints && this.depth < OctreeNode.MAX_DEPTH
  }

  // 细分节点，将其分成8个子节点
  subdivide() {
    const [xMin, yMin, zMin] = this.bounds.min
    const [xMax, yMax, zMax] = this.bounds.max
    const midX = (xMin + xMax) / 2
    const midY = (yMin + yMax) / 2
    const midZ = (zMin + zMax) / 2

    const subBounds = [
      { min: [xMin, yMin, zMin], max: [midX, midY, midZ] },
      { min: [midX, yMin, zMin], max: [xMax, midY, midZ] },
      { min: [xMin, midY, zMin], max: [midX, yMax, midZ] },
      { min: [midX, midY, zMin], max: [xMax, yMax, midZ] },
      { min: [xMin, yMin, midZ], max: [midX, midY, zMax] },
      { min: [midX, yMin, midZ], max: [xMax, midY, zMax] },
      { min: [xMin, midY, midZ], max: [midX, yMax, zMax] },
      { min: [midX, midY, midZ], max: [xMax, yMax, zMax] },
    ]

    for (let i = 0; i < 8; i++) {
      this.children.push(new OctreeNode(subBounds[i], this.depth + 1))
    }

    this.isLeaf = false // 不再是叶节点
  }

  // 分配点云到子节点
  distributePoints() {
    if (this.isLeaf) return

    for (let point of this.points) {
      for (let child of this.children) {
        if (child.containsPoint(point)) {
          child.points.push(point)
          break
        }
      }
    }

    this.points = [] // 清空当前节点的点，所有点已分配到子节点
  }

  // 检查点是否在节点的边界内
  containsPoint(point) {
    const [x, y, z] = point
    const [xMin, yMin, zMin] = this.bounds.min
    const [xMax, yMax, zMax] = this.bounds.max
    return x >= xMin && x <= xMax && y >= yMin && y <= yMax && z >= zMin && z <= zMax
  }
}

// 定义 Octree 的最大深度
OctreeNode.MAX_DEPTH = 6

export class SVO {
  constructor(points, bounds) {
    this.root = new OctreeNode(bounds) // 根节点
    this.points = points // 输入的点云数据
  }

  buildTree(maxPointsPerNode) {
    this.root.points = this.points
    this._subdivide(this.root, maxPointsPerNode)
  }

  _subdivide(node, maxPointsPerNode) {
    if (node.needsSubdivision(maxPointsPerNode)) {
      node.subdivide()
      node.distributePoints()
      for (let child of node.children) {
        this._subdivide(child, maxPointsPerNode)
      }
    }
  }

  traverse(callback) {
    this._traverseNode(this.root, callback)
  }

  _traverseNode(node, callback) {
    if (node.isLeaf) {
      callback(node)
    } else {
      for (let child of node.children) {
        this._traverseNode(child, callback)
      }
    }
  }
}
