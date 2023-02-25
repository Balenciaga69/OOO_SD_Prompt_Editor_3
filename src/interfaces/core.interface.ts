import { EntityState } from '@reduxjs/toolkit'

export interface Prompt {
  id: string
  text: string
  numW: number
  bracketW: number
}
export interface Article {
  id: string
  promptIDs: string[]
}
export interface CurrentInfo {
  articleID: string
}
export interface AppState {
  shared: {
    articles: EntityState<Article>
    prompts: EntityState<Prompt>
  }
  modules: {
    editorPrompt: null
    modalArticles: null
    modalSetting: null
  }
}
