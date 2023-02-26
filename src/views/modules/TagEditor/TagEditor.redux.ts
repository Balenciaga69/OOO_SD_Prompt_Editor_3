import { tagBlockSlice, tagSlice } from './../../../core/slices'
import { RD, RootState, rootSlices } from '@/core'
import { Tag, TagEditorState } from '@/interfaces/core.interface'
import { PayloadAction, createSlice, nanoid } from '@reduxjs/toolkit'
import _ from 'lodash'
import { SagaIterator } from 'redux-saga'
import { put, select, takeEvery } from 'redux-saga/effects'
const initialState: TagEditorState = {
  code: '',
  blockID: '',
}
export const tagEditorSlice = createSlice({
  name: 'TAG_EDITOR',
  initialState: initialState,
  reducers: {
    setState(state, { payload }: PayloadAction<Partial<TagEditorState>>) {
      return { ...state, ...payload }
    },
    initMain() {
      undefined
    },
    submitCode(state, { payload }: PayloadAction<{ code: string }>) {
      payload
      return state
    },
  },
})
const { actions } = tagEditorSlice
export function* tagEditorSaga(): SagaIterator {
  yield takeEvery(actions.initMain.type, initMain)
  yield takeEvery(actions.submitCode.type, submitCode)
}
function* initMain(): SagaIterator {
  const myState = (yield select((state: RootState) => state.modules.tagEditor)) as unknown as TagEditorState
  if (_.isEmpty(myState.blockID)) {
    const newID = nanoid()
    yield put(rootSlices.tagBlockSlice.actions.addOne({ id: newID, tagIDs: [], title: '' }))
    yield put(rootSlices.tagEditorSlice.actions.setState({ blockID: newID }))
  }
}
function* submitCode({ payload }: PayloadAction<{ code: string }>): SagaIterator {
  const { getCodeEdgeError, getCodePairError } = RD.FUNCS.CODE_SYNTAX_CHECK
  const { code } = payload
  const myState = (yield select((state: RootState) => state.modules.tagEditor)) as unknown as TagEditorState
  const edgeResult = getCodeEdgeError(code)
  const pairResult = getCodePairError(code)
  const res = RD.FUNCS.PARSE(code)
  for (const i in [0, 1, 2, 3, 4, 5]) {
    const newTag: Tag = { id: String(i), bracketWeight: 0, numberWeight: 0, title: `標籤${i}` }
    yield put(tagSlice.actions.addOne(newTag))
  }
  yield put(tagBlockSlice.actions.updateOne({ changes: { tagIDs: ['0', '1', '2', '3', '4'] }, id: myState.blockID }))
}
