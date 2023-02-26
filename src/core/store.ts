import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { tagBlockSlice, tagSlice } from './slices'
import { tagEditorSlice } from '@/views/modules/TagEditor'

const shared = combineReducers({ tag: tagSlice.reducer, tagBlock: tagBlockSlice.reducer })
const modules = combineReducers({ tagEditor: tagEditorSlice.reducer })
export const appStore = configureStore({
  reducer: { shared, modules },
})
