import { useCallback } from 'react'
import { useStore, useDispatch } from 'react-redux'
import { RD } from './RD'
import { RootState, initStateFromLocalAction } from '@/redux'
import _ from 'lodash'
export const useMyLocal = () => {
  const store = useStore()
  const dispatch = useDispatch()
  const load = useCallback(() => {
    const key = RD.LOCAL_STORAGE_KEY.REDUX
    const json = localStorage.getItem(key)
    if (json) {
      const state = JSON.parse(json)
      if (_.isPlainObject(store.getState())) {
        dispatch(initStateFromLocalAction({ state: state as RootState }))
      } else {
        localStorage.clear()
      }
    }
  }, [dispatch])
  const save = useCallback(() => {
    const state = store.getState()
    localStorage.setItem(RD.LOCAL_STORAGE_KEY.REDUX, JSON.stringify(state))
  }, [store])
  return { load, save }
}
