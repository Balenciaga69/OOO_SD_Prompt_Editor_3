import { RootState } from '@/redux'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { tagEditorSlice } from './TagEditor.redux'
import { useEffect } from 'react'
export const useTagEditor = () => {
  const dispatch = useDispatch()
  const thisState = useSelector((state: RootState) => state.modules.tagEditor)
  const thisActions = tagEditorSlice.actions
  const tagGroupEntities = useSelector((state: RootState) => state.shared.tagGroup.entities)
  const tagAtomEntities = useSelector((state: RootState) => state.shared.tagAtom.entities)
  const allGroupList = _.compact(_.values(tagGroupEntities))
  const allAtomList = _.compact(_.values(tagAtomEntities))
  useEffect(() => {
    if (thisState.group) {
      const nextAtomList = _.compact(_.map(thisState.group.tagIDs, (id) => tagAtomEntities[id]))
      dispatch(thisActions.setState({ atomList: nextAtomList }))
    }
  }, [thisState.group?.tagIDs])

  return { dispatch, thisState, thisActions, allGroupList, allAtomList, tagAtomEntities, tagGroupEntities }
}
