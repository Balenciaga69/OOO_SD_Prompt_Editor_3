import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { TagAtom } from './../interfaces/core.interface'
const TagAtomAdapter = createEntityAdapter<TagAtom>()
export const tagAtomSlice = createSlice({
  name: 'TAG_ATOM',
  initialState: TagAtomAdapter.getInitialState(),
  reducers: {
    addOne: TagAtomAdapter.addOne,
    removeOne: TagAtomAdapter.removeOne,
    removeMany: TagAtomAdapter.removeMany,
    updateOne: TagAtomAdapter.updateOne,
    addMany: TagAtomAdapter.addMany,
    setAll: TagAtomAdapter.setAll,
  },
})
