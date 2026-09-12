export type TreeKey = string | number
export type TreeData = Record<string, unknown>
export interface TreeFieldNames {
  label?: string
  children?: string
  disabled?: string
}
export interface TreeNode {
  key: TreeKey
  data: TreeData
  label: string
  level: number
  disabled: boolean
  parentKey: TreeKey | null
  children: TreeNode[]
  index: number
  siblingCount: number
}
export interface TreeCheckState {
  checkedKeys: TreeKey[]
  checkedNodes: TreeData[]
  halfCheckedKeys: TreeKey[]
  halfCheckedNodes: TreeData[]
}
