import { TagAtom, TagEditorState, TagGroup } from '@/interfaces/core.interface'
import { RootState, tagAtomSlice, tagGroupSlice } from '@/redux'
import { codeSyntaxCheckFuncs, simpleTagParserFromAngular } from '@/utils'
import { Dictionary, PayloadAction, createSlice, nanoid } from '@reduxjs/toolkit'
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
  initialState,
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
  const tagEditorState: TagEditorState = yield select((state: RootState) => state.modules.tagEditor)
  if (!_.isEmpty(tagEditorState.groupID)) return
  const id = nanoid()
  const newGroup: TagGroup = { id, atomIDs: [], title: 'my First Tag Group' }
  yield put(tagGroupSlice.actions.addOne(newGroup))
  yield put(tagEditorSlice.actions.setGroupID({ groupID: id }))
  yield put(tagEditorSlice.actions.setInputText({ inputText: '' }))
}
function* submitInputText(): SagaIterator {
  const tagEditorState: TagEditorState = yield select((state: RootState) => state.modules.tagEditor)
  const tagGroupEntities: Dictionary<TagGroup> = yield select((state: RootState) => state.shared.tagGroup.entities)
  const { groupID, inputText } = tagEditorState
  if (isInputError(inputText)) return
  if (_.isEmpty(groupID)) return
  const oldIDs = tagGroupEntities[groupID]?.atomIDs
  if (_.isUndefined(oldIDs)) return
  const tagListWithoutID: Omit<TagAtom, 'id'>[] = simpleTagParserFromAngular(inputText)
  const newIDs = _.times(tagListWithoutID.length, () => nanoid())
  const newAtomList = _.map(tagListWithoutID, (tag, i) => ({ ...tag, id: newIDs[i] }))
  yield put(tagAtomSlice.actions.addMany(newAtomList))
  yield put(tagAtomSlice.actions.removeMany(oldIDs))
  yield put(tagGroupSlice.actions.updateOne({ changes: { atomIDs: newIDs }, id: groupID }))
}

const isInputError = (inputText: string) => {
  const { getInputEdgeError, getInputPairError } = codeSyntaxCheckFuncs
  const edgeResult = getInputEdgeError(inputText)
  const pairResult = getInputPairError(inputText)
  return edgeResult || pairResult
}
