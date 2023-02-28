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

export interface MixerItem {
  id: string
  groupID: string
  weight: number
}
export interface GroupMixerState {
  itemList: MixerItem[]
}
