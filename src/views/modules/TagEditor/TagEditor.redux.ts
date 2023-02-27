import { RD, RootState, rootSlices } from '@/core'
import { Tag, TagBlock, TagEditorState } from '@/interfaces/core.interface'
import { EntityState, PayloadAction, createSlice, nanoid } from '@reduxjs/toolkit'
import _ from 'lodash'
import { SagaIterator } from 'redux-saga'
import { put, select, takeEvery } from 'redux-saga/effects'
import { tagBlockSlice, tagSlice } from './../../../core/slices'
import { simpleTagParserFromAngular } from './../../../utils/old-parser-from-angular'
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
    submitCode() {
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
  console.info(' watchThis  tagEditorSaga initMain')
  const myState = (yield select((state: RootState) => state.modules.tagEditor)) as unknown as TagEditorState
  if (_.isEmpty(myState.blockID)) {
    const newID = nanoid()
    yield put(rootSlices.tagBlockSlice.actions.addOne({ id: newID, tagIDs: [], title: '' }))
    yield put(rootSlices.tagEditorSlice.actions.setState({ blockID: newID }))
  }
}
function* submitCode(): SagaIterator {
  const { getCodeEdgeError, getCodePairError } = RD.FUNCS.CODE_SYNTAX_CHECK
  const tagBlockState = (yield select((state: RootState) => state.shared.tagBlock)) as unknown as EntityState<TagBlock>
  const myState = (yield select((state: RootState) => state.modules.tagEditor)) as unknown as TagEditorState
  const myTagBlockDetail = tagBlockState.entities[myState.blockID] as TagBlock
  const { tagIDs } = myTagBlockDetail
  const { code } = myState
  const edgeResult = getCodeEdgeError(code)
  const pairResult = getCodePairError(code)
  if (edgeResult && pairResult) return
  const tagListWithoutID: Omit<Tag, 'id'>[] = simpleTagParserFromAngular(code)
  const IDs = _.times(tagListWithoutID.length, () => nanoid())
  const tagList = _.map(tagListWithoutID, (t, i) => ({ ...t, id: IDs[i] }))
  if (!_.isEmpty(tagList)) {
    yield put(tagSlice.actions.addMany(tagList))
  }
  yield put(tagSlice.actions.removeMany(tagIDs))
  yield put(tagBlockSlice.actions.updateOne({ changes: { tagIDs: IDs }, id: myState.blockID }))
}
