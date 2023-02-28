import { TagAtom, TagEditorState, TagGroup } from '@/interfaces/core.interface'
import { tagEditorSlice } from '@/views/modules/TagEditor'
import { PayloadAction, createAction } from '@reduxjs/toolkit'
import _ from 'lodash'
import { SagaIterator } from 'redux-saga'
import { put, takeEvery } from 'redux-saga/effects'
import { RootState } from './store'
import { tagAtomSlice } from './tagAtom.redux'
import { tagGroupSlice } from './tagGroup.redux'
export function* localStorageSaga(): SagaIterator {
  yield takeEvery('INIT_STATE_FROM_LOCAL', initStateFromLocal)
}

function* initStateFromLocal({ payload }: PayloadAction<{ state: RootState }>): SagaIterator {
  const { state } = payload
  const { modules, shared } = state
  const { tagEditor } = modules
  const { tagAtom, tagGroup } = shared
  yield put(tagAtomSlice.actions.setAll(_.values(tagAtom.entities) as TagAtom[]))
  yield put(tagGroupSlice.actions.setAll(_.values(tagGroup.entities) as TagGroup[]))
  yield put(tagEditorSlice.actions.setState(tagEditor))
}
export const initStateFromLocalAction = createAction<{ state: RootState }>('INIT_STATE_FROM_LOCAL')
