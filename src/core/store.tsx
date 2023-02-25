import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { articlesSlice, promptsSlice } from './redux'

const shared = combineReducers({ articles: articlesSlice.reducer, prompts: promptsSlice.reducer })
export const appStore = configureStore({
  reducer: { shared },
})
