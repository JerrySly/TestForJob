type IdType = String | Number; 

type TreeNode = {
  id: IdType
  parent: IdType
  type?: any
}

class TreeStore {
  items: TreeNode[] = [];
  mapByIndex: Map<IdType, TreeNode>;
  childrenMap: Map<IdType, TreeNode[]>;

  constructor(arr: TreeNode[]) {
    this.items = arr;
    this.mapByIndex = new Map<IdType, TreeNode>(arr.map(node => [node.id, node]));
    this.childrenMap = new Map<IdType, TreeNode[]>(arr.map(node => [node.id, arr.filter(otherNode => otherNode.parent === node.id)]));
  }

  getAll(): TreeNode[] {
    return this.items;
  }

  getItem(id: IdType): TreeNode | null {
    return this.mapByIndex.get(id) ?? null
  }

  getChildren(id: IdType): TreeNode[] {
    return this.childrenMap.get(id) ?? []
  }

  getAllChildren(id: IdType): TreeNode[] {
    const result: TreeNode[] = [];
    let layer: TreeNode[] = [];
    do {
      if (!layer.length) {
        layer = this.getChildren(id)
        result.push(...layer);
      } else {
        const tempLayer: TreeNode[] = []
        layer.forEach(node => {
          tempLayer.push(...this.getChildren(node.id));
        })
        result.push(...tempLayer);
        layer = tempLayer;
      }
    } while(layer.some(x => this.childrenMap.get(x.id)?.length))
    return result;
  }


  getAllParents(id: IdType): TreeNode[] | null  {
    let item = this.mapByIndex.get(id);
    if (!item) return null;
    const result: TreeNode[] = []
    while (item && item.parent) {
      result.push(item);
      item = this.mapByIndex.get(item?.parent);
    }
    return result;
  }
}


const items: TreeNode[] = [
  { id: 1, parent: 'root' },
  { id: 2, parent: 1, type: 'test' },
  { id: 3, parent: 1, type: 'test' },

  { id: 4, parent: 2, type: 'test' },
  { id: 5, parent: 2, type: 'test' },
  { id: 6, parent: 2, type: 'test' },

  { id: 7, parent: 4, type: null },
  { id: 8, parent: 4, type: null },
];
const ts = new TreeStore(items)

console.log(ts.getAll());
console.log(ts.getItem(7));
console.log(ts.getChildren(4));
console.log(ts.getChildren(5));
console.log(ts.getChildren(2));
console.log(ts.getAllChildren(2));
console.log(ts.getAllParents(7));
