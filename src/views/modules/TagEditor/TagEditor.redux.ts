import { TagAtom, TagEditorState, TagGroup } from '@/interfaces/core.interface'
import { RootState, tagAtomSlice, tagGroupSlice } from '@/redux'
import { codeSyntaxCheckFuncs, simpleTagParserFromAngular } from '@/utils'
import { Dictionary, PayloadAction, createSlice, nanoid } from '@reduxjs/toolkit'
import _ from 'lodash'
import { SagaIterator } from 'redux-saga'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import Swal from 'sweetalert2'
import { getErrorSweetAlertOptions } from './../../../utils/sweetAlertHelper'

const initialState: TagEditorState = {
  groupID: '',
  inputText: '',
  prevInputText: '',
}

const sliceName = 'TAG_EDITOR'
export const tagEditorSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setGroupID: (state, { payload }: PayloadAction<{ groupID: string }>) => ({ ...state, ...payload }),
    setInputText: (state, { payload }: PayloadAction<{ inputText: string }>) => ({ ...state, ...payload }),
    setPrevInputText: (state, { payload }: PayloadAction<{ prevInputText: string }>) => ({ ...state, ...payload }),
    initialize: () => undefined,
    submitInputText: () => undefined,
  },
})

export function* tagEditorSaga(): SagaIterator {
  yield takeEvery(tagEditorSlice.actions.initialize.type, initialize)
  yield takeEvery(tagEditorSlice.actions.submitInputText.type, submitInputText)
}

/**
 * 用於初始化標籤編輯器，檢查當前標籤編輯器的狀態。若該編輯器已經存在，則直接退出函數。
 * 若編輯器不存在，則初始化一個新的標籤編輯器，包括新增一個標籤群組和設定當前編輯的標籤群組ID及輸入框的文字內容為空。
 */
function* initialize(): SagaIterator {
  const tagEditorState: TagEditorState = yield select((state: RootState) => state.modules.tagEditor)
  if (!_.isEmpty(tagEditorState.groupID)) return
  const id = nanoid()
  const newGroup: TagGroup = { id, atomIDs: [], title: 'my First Tag Group' }
  yield put(tagGroupSlice.actions.addOne(newGroup))
  yield put(tagEditorSlice.actions.setGroupID({ groupID: id }))
  yield put(tagEditorSlice.actions.setInputText({ inputText: '' }))
}

/**
 * 用於提交標籤編輯器的輸入框中的文字內容，並根據輸入框的文字內容進行相應的標籤操作。
 * 首先，從 Store 中取得所需的屬性。然後，檢查輸入框中的文字內容是否符合要求，若不符合，則彈出錯誤提示框，並退出函數。
 * 接著，判斷當前編輯的標籤群組是否存在，若不存在，則退出函數。否則，從該標籤群組中取得所包含的標籤 ID。
 * 然後，根據輸入框中的文字內容，解析出一系列的標籤，並為每個標籤創建一個新的標籤 ID。接著，刪除舊的標籤並新增新的標籤，同時更新當前編輯的標籤群組的標籤 ID。
 */
function* submitInputText(): SagaIterator {
  // Take Props from Store
  const tagEditorState: TagEditorState = yield select((state: RootState) => state.modules.tagEditor)
  const tagGroupEntities: Dictionary<TagGroup> = yield select((state: RootState) => state.shared.tagGroup.entities)

  // Take props from State
  const { groupID, inputText } = tagEditorState

  // Return early
  const errorMsg = isInputError(inputText)
  if (!_.isNil(errorMsg)) {
    const option = getErrorSweetAlertOptions({ text: `Catch char '${errorMsg.char}' can't be matched ` })
    yield call(() => Swal.fire(option))
    return
  }
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

/**
 * 用於檢查輸入框中的文字內容是否符合要求。
 * 該函數會調用 codeSyntaxCheckFuncs 中的兩個函數，分別用於檢查邊緣字符和括號匹配。
 * 若輸入框中的文字內容符合要求，則返回 null。否則，返回一個包含錯誤信息的對象。
 */
const isInputError = (inputText: string) => {
  const { getInputEdgeError, getInputPairError } = codeSyntaxCheckFuncs
  const edgeResult = getInputEdgeError(inputText)
  const pairResult = getInputPairError(inputText)
  return edgeResult || pairResult
}
