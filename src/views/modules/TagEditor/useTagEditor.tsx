import { RootState, rootSlices } from '@/core'
import { TagBlock } from '@/interfaces/core.interface'
import _ from 'lodash'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
export const useTagEditor = () => {
  const dispatch = useDispatch()
  const myState = useSelector((state: RootState) => state.modules.tagEditor)
  const myActions = rootSlices.tagEditorSlice.actions
  /**
   * shared
   */
  const tagBlockState = useSelector((state: RootState) => state.shared.tagBlock)
  const tagState = useSelector((state: RootState) => state.shared.tag)
  const currTagBlock = useMemo(() => tagBlockState.entities[myState.blockID], [tagBlockState, myState])
  const currTagList = useMemo(() => {
    if (!currTagBlock) return []
    return _.compact(_.map(currTagBlock.tagIDs, (id) => tagState.entities[id]))
  }, [currTagBlock])
  const allTagBlock = useMemo(() => {
    return _.filter(tagBlockState.entities, (e) => !_.isNil(e)) as TagBlock[]
  }, [tagBlockState])
  return { dispatch, myState, myActions, currTagBlock, currTagList, allTagBlock }
}
