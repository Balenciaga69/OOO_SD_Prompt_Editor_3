import { EditorPromptState } from '@/interfaces/core.interface'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialState: EditorPromptState = {
  code: '',
  articleID: '',
}
export const editorPromptSlice = createSlice({
  name: 'PROMPT_EDITOR',
  initialState: initialState,
  reducers: {
    setState(state, { payload }: PayloadAction<Partial<EditorPromptState>>) {
      state = { ...state, ...payload }
    },
  },
})
