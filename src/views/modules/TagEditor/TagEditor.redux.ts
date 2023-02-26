import { RD, rootSlices } from '@/core'
import { AppState, TagEditorState } from '@/interfaces/core.interface'
import { PayloadAction, createSlice, nanoid } from '@reduxjs/toolkit'
import _ from 'lodash'
import { SagaIterator } from 'redux-saga'
import { put, takeEvery, select } from 'redux-saga/effects'
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
      undefined
    },
  },
})
const { actions } = tagEditorSlice
export function* tagEditorSaga(): SagaIterator {
  yield takeEvery(actions.initMain.type, initMain)
  yield takeEvery(actions.submitCode.type, submitCode)
}
function* initMain(): SagaIterator {
  const myState = (yield select((state: AppState) => state.modules.tagEditor)) as unknown as TagEditorState
  if (_.isEmpty(myState.blockID)) {
    const newID = nanoid()
    yield put(rootSlices.tagBlockSlice.actions.addOne({ id: newID, tagIDs: [], title: '' }))
    yield put(rootSlices.tagEditorSlice.actions.setState({ blockID: newID }))
  }
}
function* submitCode({ payload }: PayloadAction<{ code: string }>): SagaIterator {
  const { getCodeEdgeError, getCodePairError } = RD.FUNCS.CODE_SYNTAX_CHECK
  const { code } = payload
  const myState = (yield select((state: AppState) => state.modules.tagEditor)) as unknown as TagEditorState
  const edgeResult = getCodeEdgeError(code)
  const pairResult = getCodePairError(code)
  console.info(' watchThis payload', edgeResult, pairResult)
}
