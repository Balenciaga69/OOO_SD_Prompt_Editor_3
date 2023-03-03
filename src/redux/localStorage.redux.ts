import { TagAtom, TagGroup } from '@/interfaces/core.interface'
import { tagEditorSlice } from '@/views/modules/TagEditor'
import { PayloadAction, createAction } from '@reduxjs/toolkit'
import _ from 'lodash'
import { SagaIterator } from 'redux-saga'
import { put, takeEvery } from 'redux-saga/effects'
import { groupMixerSlice } from './../views/modules/GroupMixer/GroupMixer.redux'
import { RootState } from './store'
import { tagAtomSlice } from './tagAtom.redux'
import { tagGroupSlice } from './tagGroup.redux'
export function* localStorageSaga(): SagaIterator {
  yield takeEvery('INIT_STATE_FROM_LOCAL', initStateFromLocal)
}

function* initStateFromLocal({ payload }: PayloadAction<{ state: RootState }>): SagaIterator {
  console.info(' watchThis initStateFromLocal')
  const { state } = payload
  const { modules, shared } = state
  const { tagEditor, groupMixer } = modules
  const { groupID, inputText } = tagEditor
  const { tagAtom, tagGroup } = shared
  yield put(tagAtomSlice.actions.setAll(_.values(tagAtom.entities) as TagAtom[]))
  yield put(tagGroupSlice.actions.setAll(_.values(tagGroup.entities) as TagGroup[]))
  yield put(tagEditorSlice.actions.setGroupID({ groupID }))
  yield put(tagEditorSlice.actions.setInputText({ inputText }))
  yield put(groupMixerSlice.actions.setState(groupMixer))
}
export const initStateFromLocalAction = createAction<{ state: RootState }>('INIT_STATE_FROM_LOCAL')
