import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { Article } from '../../interfaces/core.interface'
const adapter = createEntityAdapter<Article>()
export const articlesSlice = createSlice({
  name: 'ARTICLES',
  initialState: adapter.getInitialState(),
  reducers: {
    addOne: adapter.addOne,
    removeOne: adapter.removeOne,
    updateOne: adapter.updateOne,
  },
})
