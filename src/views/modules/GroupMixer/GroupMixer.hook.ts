import { RootState } from '@/redux'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { groupMixerSlice } from './GroupMixer.redux'
export const useGroupMixer = () => {
  const dispatch = useDispatch()
  const thisState = useSelector((state: RootState) => state.modules.groupMixer)
  const thisActions = groupMixerSlice.actions
  const tagGroupEntities = useSelector((state: RootState) => state.shared.tagGroup.entities)
  const tagAtomEntities = useSelector((state: RootState) => state.shared.tagAtom.entities)
  const allGroupList = _.compact(_.values(tagGroupEntities))
  const allAtomList = _.compact(_.values(tagAtomEntities))
  return { dispatch, thisState, thisActions, allGroupList, allAtomList, tagAtomEntities, tagGroupEntities }
}
