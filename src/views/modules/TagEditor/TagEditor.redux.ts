import { TagAtom, TagEditorState, TagGroup } from '@/interfaces/core.interface'
import { RootState, tagAtomSlice, tagGroupSlice } from '@/redux'
import { codeSyntaxCheckFuncs, simpleTagParserFromAngular } from '@/utils'
import { PayloadAction, createSlice, nanoid } from '@reduxjs/toolkit'
import _ from 'lodash'
import { SagaIterator } from 'redux-saga'
import { put, select, takeEvery } from 'redux-saga/effects'
const initialState: TagEditorState = {
  atomList: [],
  group: null,
  inputText: '',
}
const sliceName = 'TAG_EDITOR'
export const tagEditorSlice = createSlice({
  name: sliceName,
  initialState: initialState,
  reducers: {
    setState: (state, { payload }: PayloadAction<Partial<TagEditorState>>) => ({ ...state, ...payload }),
    initTagEditor: () => undefined,
    submitCode: () => undefined,
  },
})
export function* tagEditorSaga(): SagaIterator {
  yield takeEvery(tagEditorSlice.actions.initTagEditor.type, initTagEditor)
  yield takeEvery(tagEditorSlice.actions.submitCode.type, submitCode)
}
function* initTagEditor(): SagaIterator {
  const thisState = (yield select((state: RootState) => state.modules.tagEditor)) as unknown as TagEditorState
  if (!thisState.group) {
    const newGroup: TagGroup = { id: nanoid(), atomIDs: [], title: 'my First Tag Group' }
    yield put(tagGroupSlice.actions.addOne(newGroup))
    yield put(tagEditorSlice.actions.setState({ group: newGroup, atomList: [], inputText: '' }))
  }
}
function* submitCode(): SagaIterator {
  const { getInputEdgeError, getInputPairError } = codeSyntaxCheckFuncs
  const thisState = (yield select((state: RootState) => state.modules.tagEditor)) as unknown as TagEditorState
  const thisGroup = thisState.group
  if (!thisGroup) return
  const { atomIDs: oldIDs } = thisGroup
  const { inputText } = thisState
  const edgeResult = getInputEdgeError(inputText)
  const pairResult = getInputPairError(inputText)
  if (edgeResult && pairResult) return
  const tagListWithoutID: Omit<TagAtom, 'id'>[] = simpleTagParserFromAngular(inputText)
  const newIDs = _.times(tagListWithoutID.length, () => nanoid())
  const atomList = _.map(tagListWithoutID, (tag, index) => ({ ...tag, id: newIDs[index] }))
  if (!_.isEmpty(atomList)) {
    yield put(tagAtomSlice.actions.addMany(atomList))
  }
  yield put(tagAtomSlice.actions.removeMany(oldIDs))
  yield put(tagGroupSlice.actions.updateOne({ changes: { atomIDs: newIDs }, id: thisGroup.id }))
}
