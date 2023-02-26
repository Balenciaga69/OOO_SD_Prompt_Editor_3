import { TagEditorState } from '@/interfaces/core.interface'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialState: TagEditorState = {
  code: '',
  blockID: '',
}
export const tagEditorSlice = createSlice({
  name: 'TAG_EDITOR',
  initialState: initialState,
  reducers: {
    setState(state, { payload }: PayloadAction<Partial<TagEditorState>>) {
      state = { ...state, ...payload }
    },
  },
})
