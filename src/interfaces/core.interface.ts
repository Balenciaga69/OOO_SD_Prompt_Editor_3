import { EntityState } from '@reduxjs/toolkit'
export interface TagEditorState {
  code: string
  blockID: string
}
export interface AppState {
  shared: {
    tag: EntityState<Tag>
    tagBlock: EntityState<TagBlock>
  }
  modules: {
    tagEditor: TagEditorState
  }
}
export interface Tag {
  id: string
  title: string
  bracketWeight: number
  numberWeight: number
}
export interface TagBlock {
  id: string
  title: string
  tagIDs: string[]
}
