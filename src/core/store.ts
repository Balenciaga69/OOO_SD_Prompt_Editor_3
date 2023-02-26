import { tagEditorSaga, tagEditorSlice } from '@/views/modules/TagEditor'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware, { SagaIterator } from 'redux-saga'
import { all, call } from 'redux-saga/effects'
import { tagBlockSlice, tagSlice } from './slices'

const shared = combineReducers({ tag: tagSlice.reducer, tagBlock: tagBlockSlice.reducer })
const modules = combineReducers({ tagEditor: tagEditorSlice.reducer })
export const rootSlices = { tagSlice, tagEditorSlice, tagBlockSlice }

function* rootSaga(): SagaIterator {
  yield all([call(tagEditorSaga)])
}

const sagaMiddleware = createSagaMiddleware()
export const appStore = configureStore({
  reducer: { shared, modules },
  middleware: [sagaMiddleware],
})
sagaMiddleware.run(rootSaga)
