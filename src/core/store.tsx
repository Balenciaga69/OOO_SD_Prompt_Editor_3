import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
const sagaMiddleware = createSagaMiddleware()
export const appStore = configureStore({
  reducer: {},
  middleware: [sagaMiddleware],
})
