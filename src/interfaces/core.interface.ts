import { EntityState } from '@reduxjs/toolkit'

export interface Prompt {
  id: string
  text: string
  numW: number
  bracketW: number
}
export interface Article {
  id: string
  title: string
  promptIDs: string[]
}
export interface EditorPromptState {
  code: string
  articleID: string
}
export interface AppState {
  shared: {
    articles: EntityState<Article>
    prompts: EntityState<Prompt>
  }
  modules: {
    editorPrompt: EditorPromptState
    modalArticles: null
    modalSetting: null
  }
}
