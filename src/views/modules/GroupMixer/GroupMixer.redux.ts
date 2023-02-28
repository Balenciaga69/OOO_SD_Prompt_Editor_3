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
export const groupMixerSlice = createSlice({
  name: sliceName,
  initialState: initialState,
  reducers: {
    setState: (state, { payload }: PayloadAction<Partial<GroupMixerState>>) => ({ ...state, ...payload }),
    isNot8: () => undefined,
  },
})
export function* groupMixerSaga(): SagaIterator {
  yield takeEvery(groupMixerSlice.actions.isNot8.type, isNot8)
}
function* isNot8(): SagaIterator {
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
