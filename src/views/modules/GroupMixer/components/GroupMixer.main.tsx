import { SSortableItemWrapper } from '@/views/shared/SSortableItemWrapper'
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable'
import { Box, Modal, SimpleGrid } from '@mantine/core'
import { bindActionCreators } from '@reduxjs/toolkit'
import _ from 'lodash'
import React, { FC, useEffect } from 'react'
import { useGroupMixer } from '../GroupMixer.hook'
import { ControlPanel } from './CtrlPanel'
import { SortCard } from './SortCard'
interface Props {
  opened: boolean
  onClose: () => void
}
const useMain = () => {
  const { thisState, dispatch, thisActions } = useGroupMixer()
  const { itemList: groupList } = thisState
  const { setState, isNot8 } = thisActions
  const actionCreators = bindActionCreators({ setState, isNot8 }, dispatch)
  useEffect(() => {
    actionCreators.isNot8()
  }, [])
  return { ...actionCreators, groupList }
}
export const GroupMixer: FC<Props> = (props) => {
  const { groupList, setState } = useMain()
  const { onClose, opened } = props
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active && active.id !== over.id) {
      const oldIdx = _.findIndex(groupList, ['id', active.id])
      const newIdx = _.findIndex(groupList, ['id', over.id])
      const newGroupList = arrayMove(groupList, oldIdx, newIdx)
      setState({ itemList: newGroupList })
    }
  }
  return (
    <Modal size='auto' overlayBlur={4} overlayOpacity={0} withCloseButton={false} opened={opened} onClose={onClose}>
      <>
        <Box py='md'>
          <ControlPanel />
        </Box>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={groupList} strategy={rectSortingStrategy}>
            <SimpleGrid
              cols={4}
              w='80vw'
              className='AreaDragCardGrid'
              breakpoints={[
                { maxWidth: 'xl', cols: 4 },
                { maxWidth: 'lg', cols: 2 },
                { maxWidth: 'md', cols: 2 },
                { maxWidth: 'sm', cols: 2 },
                { maxWidth: 'xs', cols: 1 },
              ]}
            >
              {_.map(groupList, (group) => (
                <SSortableItemWrapper key={group.id} id={group.id}>
                  <SortCard group={group} />
                </SSortableItemWrapper>
              ))}
            </SimpleGrid>
          </SortableContext>
        </DndContext>
      </>
    </Modal>
  )
}
