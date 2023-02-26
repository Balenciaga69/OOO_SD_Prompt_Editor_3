import { rootSlices } from '@/core'
import { AppState } from '@/interfaces/core.interface'
import _ from 'lodash'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
export const useTagEditor = () => {
  const dispatch = useDispatch()
  const selector = useSelector((state: AppState) => state)
  const myState = selector.modules.tagEditor
  const myActions = rootSlices.tagEditorSlice.actions
  /**
   * shared
   */
  const sharedState = selector.shared
  const currTagBlock = useMemo(() => sharedState.tagBlock.entities[myState.blockID], [sharedState])
  const currTagList = useMemo(() => {
    if (!currTagBlock) return []
    return _.compact(_.map(currTagBlock.tagIDs, (id) => sharedState.tag.entities[id]))
  }, [currTagBlock])
  return { dispatch, myState, sharedState, myActions, currTagBlock, currTagList }
}
