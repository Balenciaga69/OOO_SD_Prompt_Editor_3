import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { Tag, TagBlock } from '../interfaces/core.interface'
const TagAdapter = createEntityAdapter<Tag>()
export const tagSlice = createSlice({
  name: 'TAG',
  initialState: TagAdapter.getInitialState(),
  reducers: {
    addOne: TagAdapter.addOne,
    removeOne: TagAdapter.removeOne,
    removeMany: TagAdapter.removeMany,
    updateOne: TagAdapter.updateOne,
    addMany: TagAdapter.addMany,
  },
})
const TagBlockAdapter = createEntityAdapter<TagBlock>()
export const tagBlockSlice = createSlice({
  name: 'TAG_BLOCK',
  initialState: TagBlockAdapter.getInitialState(),
  reducers: {
    addOne: TagBlockAdapter.addOne,
    removeOne: TagBlockAdapter.removeOne,
    updateOne: TagBlockAdapter.updateOne,
  },
})
