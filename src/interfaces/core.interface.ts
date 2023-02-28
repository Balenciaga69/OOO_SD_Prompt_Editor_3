export interface TagAtom {
  id: string
  title: string
  bracketWeight: number
  numberWeight: number
}
export interface TagGroup {
  id: string
  title: string
  tagIDs: string[]
}
export interface TagEditorState {
  inputText: string
  group: TagGroup | null
  atomList: TagAtom[]
}
