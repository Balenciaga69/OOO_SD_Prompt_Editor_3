import { groupMixerSaga, groupMixerSlice } from './../views/modules/GroupMixer/GroupMixer.redux'
import { tagEditorSaga, tagEditorSlice } from '@/views/modules/TagEditor'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware, { SagaIterator } from 'redux-saga'
import { all, call } from 'redux-saga/effects'
import { localStorageSaga } from './localStorage.redux'
import { tagAtomSlice } from './tagAtom.redux'
import { tagGroupSlice } from './tagGroup.redux'

const shared = combineReducers({ tagAtom: tagAtomSlice.reducer, tagGroup: tagGroupSlice.reducer })
const modules = combineReducers({ tagEditor: tagEditorSlice.reducer, groupMixer: groupMixerSlice.reducer })

const sagaMiddleware = createSagaMiddleware()

export const appStore = configureStore({
  reducer: { shared, modules },
  middleware: [sagaMiddleware],
})

export type RootState = ReturnType<typeof appStore.getState>

function* rootSaga(): SagaIterator {
  yield all([call(localStorageSaga), call(tagEditorSaga), call(groupMixerSaga)])
}
sagaMiddleware.run(rootSaga)
