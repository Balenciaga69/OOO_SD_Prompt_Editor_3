import { TagAtom, TagEditorState, TagGroup } from '@/interfaces/core.interface'
import { RootState, tagAtomSlice, tagGroupSlice } from '@/redux'
import { codeSyntaxCheckFuncs, simpleTagParserFromAngular } from '@/utils'
import { PayloadAction, createSlice, nanoid } from '@reduxjs/toolkit'
import _ from 'lodash'
import { SagaIterator } from 'redux-saga'
import { put, select, takeEvery } from 'redux-saga/effects'
const initialState: TagEditorState = {
  groupID: '',
  inputText: '',
}
const sliceName = 'TAG_EDITOR'
export const tagEditorSlice = createSlice({
  name: sliceName,
  initialState: initialState,
  reducers: {
    setGroupID: (state, { payload }: PayloadAction<{ groupID: string }>) => ({ ...state, ...payload }),
    setInputText: (state, { payload }: PayloadAction<{ inputText: string }>) => ({ ...state, ...payload }),
    initialize: () => undefined,
    submitInputText: () => undefined,
  },
})
export function* tagEditorSaga(): SagaIterator {
  yield takeEvery(tagEditorSlice.actions.initialize.type, initialize)
  yield takeEvery(tagEditorSlice.actions.submitInputText.type, submitInputText)
}
function* initialize(): SagaIterator {
  const tagEditorState = (yield select((state: RootState) => state.modules.tagEditor)) as unknown as TagEditorState
  if (!_.isEmpty(tagEditorState.groupID)) return
  const id = nanoid()
  const newGroup: TagGroup = { id, atomIDs: [], title: 'my First Tag Group' }
  yield put(tagGroupSlice.actions.addOne(newGroup))
  yield put(tagEditorSlice.actions.setGroupID({ groupID: id }))
  yield put(tagEditorSlice.actions.setInputText({ inputText: '' }))
}
function* submitInputText(): SagaIterator {
  const tagEditorState = (yield select((state: RootState) => state.modules.tagEditor)) as unknown as TagEditorState
  const { groupID } = tagEditorState
  if (_.isEmpty(groupID)) return
  // FIXME: byCaiChengYou
  const { atomIDs: oldIDs } = thisGroup
  const { inputText } = tagEditorState
  if (isInputError(inputText)) return
  const tagListWithoutID: Omit<TagAtom, 'id'>[] = simpleTagParserFromAngular(inputText)
  const newIDs = _.times(tagListWithoutID.length, () => nanoid())
  const atomList = _.map(tagListWithoutID, (tag, index) => ({ ...tag, id: newIDs[index] }))
  if (!_.isEmpty(atomList)) {
    yield put(tagAtomSlice.actions.addMany(atomList))
  }
  yield put(tagAtomSlice.actions.removeMany(oldIDs))
  yield put(tagGroupSlice.actions.updateOne({ changes: { atomIDs: newIDs }, id: thisGroup.id }))
}

const isInputError = (inputText: string) => {
  const { getInputEdgeError, getInputPairError } = codeSyntaxCheckFuncs
  const edgeResult = getInputEdgeError(inputText)
  const pairResult = getInputPairError(inputText)
  return edgeResult || pairResult
}
