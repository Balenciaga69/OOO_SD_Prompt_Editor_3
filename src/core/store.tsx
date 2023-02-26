import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { articlesSlice, promptsSlice } from './redux'
import { editorPromptSlice } from '@/views/modules/EditorPrompt'

const shared = combineReducers({ articles: articlesSlice.reducer, prompts: promptsSlice.reducer })
const modules = combineReducers({ editorPrompt: editorPromptSlice.reducer })
export const appStore = configureStore({
  reducer: { shared, modules },
})
