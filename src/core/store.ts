import { RD } from '@/core'
import { Tag, TagBlock } from '@/interfaces/core.interface'
import { tagEditorSaga, tagEditorSlice } from '@/views/modules/TagEditor'
import { Action, PayloadAction, combineReducers, configureStore } from '@reduxjs/toolkit'
import _ from 'lodash'
import createSagaMiddleware, { SagaIterator } from 'redux-saga'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { tagBlockSlice, tagSlice } from './slices'
import { useDispatch, useStore } from 'react-redux'
import { useCallback, useEffect } from 'react'

const shared = combineReducers({ tag: tagSlice.reducer, tagBlock: tagBlockSlice.reducer })
const modules = combineReducers({ tagEditor: tagEditorSlice.reducer })

const sagaMiddleware = createSagaMiddleware()

export const appStore = configureStore({
  reducer: { shared, modules },
  middleware: [sagaMiddleware],
})

export const rootSlices = { tagSlice, tagEditorSlice, tagBlockSlice }

export type RootState = ReturnType<typeof appStore.getState>

function* rootSaga(): SagaIterator {
  yield takeEvery('INIT_STATE_FROM_LOCAL', initStateFromLocal)
  yield call(tagEditorSaga)
}
sagaMiddleware.run(rootSaga)

function* initStateFromLocal({ payload }: PayloadAction<{ state: RootState }>): SagaIterator {
  const { state } = payload
  const { modules, shared } = state
  const { tagEditor } = modules
  const { tag, tagBlock } = shared
  yield put(tagSlice.actions.setAll(_.values(tag.entities) as Tag[]))
  yield put(tagBlockSlice.actions.setAll(_.values(tagBlock.entities) as TagBlock[]))
  yield put(tagEditorSlice.actions.setState(tagEditor))
  const allState = (yield select((state: RootState) => state)) as unknown as RootState
  console.info(' watchThis initStateFromLocal', allState)
}
function initStateFromLocalAction(state: RootState): PayloadAction<{ state: RootState }> {
  return {
    type: 'INIT_STATE_FROM_LOCAL',
    payload: {
      state,
    },
  }
}
export const useMyLocal = () => {
  const store = useStore()
  const dispatch = useDispatch()
  const load = useCallback(() => {
    const key = RD.LOCAL_STORAGE_KEY.REDUX
    const json = localStorage.getItem(key)
    if (json) {
      const state = JSON.parse(json) as RootState
      dispatch(initStateFromLocalAction(state))
    }
  }, [dispatch])
  const save = useCallback(() => {
    const state = store.getState()
    localStorage.setItem(RD.LOCAL_STORAGE_KEY.REDUX, JSON.stringify(state))
  }, [store])
  return { load, save }
}
