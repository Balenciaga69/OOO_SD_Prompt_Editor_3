import { RootState } from '@/redux'
import _ from 'lodash'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { tagEditorSlice } from './TagEditor.redux'

/**
 * useTagEditor是一個自訂Hook，用於編輯標籤狀態及相關資訊的管理。
 * 該函數透過Redux的useDispatch及useSelector hooks取得應用程式狀態的相關資訊。
 * 在取得標籤群組及標籤原子的實體後，透過useMemo將當前群組及原子資訊計算得出。
 */
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
  }, [tagEditorState.groupID, tagGroupEntities])

  const currentAtomList = useMemo(() => {
    if (_.isUndefined(currentGroupInfo)) return []
    const { atomIDs } = currentGroupInfo
    return _.compact(_.map(atomIDs, (id) => tagAtomEntities[id]))
  }, [tagAtomEntities, currentGroupInfo?.atomIDs])

  return { dispatch, tagEditorState, tagEditorActions, currentGroupInfo, currentAtomList, tagAtomEntities, tagGroupEntities }
}
