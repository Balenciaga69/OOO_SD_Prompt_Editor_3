import { RootState, initStateFromLocalAction } from '@/redux'
import { getYesNoSweetAlertOptions } from '@/utils/sweetAlertHelper'
import _ from 'lodash'
import { useDispatch, useStore } from 'react-redux'
import Swal from 'sweetalert2'
import { RD } from './RD'
export const useMyLocal = () => {
  const store = useStore()
  const dispatch = useDispatch()

  const load = () => {
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
  }
  const save = () => {
    const state = store.getState()
    localStorage.setItem(RD.LOCAL_STORAGE_KEY.REDUX, JSON.stringify(state))
  }

  const clear = async () => {
    const options = getYesNoSweetAlertOptions({ text: 'This will delete all data and refresh', icon: 'question', title: 'Waring' })
    const { isConfirmed } = await Swal.fire(options)
    if (!isConfirmed) return
    localStorage.clear()
    window.location.reload()
  }
  return { load, save, clear }
}
