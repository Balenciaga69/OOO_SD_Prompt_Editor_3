import { RootState } from '@/redux'
import _ from 'lodash'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { tagEditorSlice } from './TagEditor.redux'
export const useTagEditor = () => {
  const dispatch = useDispatch()
  const tagEditorActions = tagEditorSlice.actions
  const tagEditorState = useSelector((state: RootState) => state.modules.tagEditor)
  const tagGroupEntities = useSelector((state: RootState) => state.shared.tagGroup.entities)
  const tagAtomEntities = useSelector((state: RootState) => state.shared.tagAtom.entities)

  const currentGroupInfo = useMemo(() => {
    if (_.isEmpty(tagEditorState.groupID)) return
    const { groupID } = tagEditorState
    return tagGroupEntities[groupID]
  }, [tagEditorState, tagGroupEntities])

  const currentAtomList = useMemo(() => {
    if (_.isUndefined(currentGroupInfo)) return []
    const { atomIDs } = currentGroupInfo
    return _.compact(_.map(atomIDs, (id) => tagAtomEntities[id]))
  }, [tagAtomEntities, currentGroupInfo])

  return { dispatch, tagEditorState, tagEditorActions, currentGroupInfo, currentAtomList, tagAtomEntities, tagGroupEntities }
}
