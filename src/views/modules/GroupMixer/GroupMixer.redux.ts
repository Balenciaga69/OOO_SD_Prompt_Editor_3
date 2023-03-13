import { GroupMixerState, MixerItem } from '@/interfaces/core.interface'
import { RootState } from '@/redux'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
import { SagaIterator } from 'redux-saga'
import { put, select, takeEvery } from 'redux-saga/effects'
const initialState: GroupMixerState = {
  itemList: [],
}

const sliceName = 'GROUP_MIXER'

/**
 * 用於群組排序功能的 Redux store slice
 * @type {object}
 */
export const groupMixerSlice = createSlice({
  name: sliceName,
  initialState: initialState,
  reducers: {
    setState: (state, { payload }: PayloadAction<Partial<GroupMixerState>>) => ({ ...state, ...payload }),
    isNotFilled: () => undefined,
  },
})

/**
 * 用於群組排序功能的 Redux saga，用於處理 isNotFilled action
 * @returns {Iterator} 包含所有 effects 的 iterator 物件
 */
export function* groupMixerSaga(): SagaIterator {
  yield takeEvery(groupMixerSlice.actions.isNotFilled.type, isNotFilled)
}

/**
 * 用於檢查未填寫的群組列表的 generator 函數
 */
function* isNotFilled(): SagaIterator {
  const thisState = (yield select((state: RootState) => state.modules.groupMixer)) as unknown as GroupMixerState
  if (thisState.itemList.length !== 8) {
    const newGroupList: MixerItem[] = _.times(8, (i) => ({
      id: _.toString(i),
      groupID: '',
      weight: 0,
    }))
    yield put(groupMixerSlice.actions.setState({ itemList: newGroupList }))
  }
}
