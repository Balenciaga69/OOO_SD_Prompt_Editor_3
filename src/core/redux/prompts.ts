import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { Prompt } from '../../interfaces/core.interface'
const adapter = createEntityAdapter<Prompt>()
export const promptsSlice = createSlice({
  name: 'PROMPTS',
  initialState: adapter.getInitialState(),
  reducers: {
    addOne: adapter.addOne,
    removeOne: adapter.removeOne,
    updateOne: adapter.updateOne,
  },
})
