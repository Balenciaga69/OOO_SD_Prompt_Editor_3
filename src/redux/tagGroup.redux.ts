import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { TagGroup } from './../interfaces/core.interface'
const tagGroupAdapter = createEntityAdapter<TagGroup>()
export const tagGroupSlice = createSlice({
  name: 'TAG_GROUP',
  initialState: tagGroupAdapter.getInitialState(),
  reducers: {
    addOne: tagGroupAdapter.addOne,
    removeOne: tagGroupAdapter.removeOne,
    updateOne: tagGroupAdapter.updateOne,
    setAll: tagGroupAdapter.setAll,
  },
})
