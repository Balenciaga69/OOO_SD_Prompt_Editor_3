import { TagGroup } from '@/interfaces/core.interface'
import { tagGroupSlice } from '@/redux'
import { SFIcon } from '@/views/shared/SFIcon'
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { ActionIcon, Box, Card, Input, ScrollArea, SimpleGrid, Skeleton } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { bindActionCreators, nanoid } from '@reduxjs/toolkit'
import _ from 'lodash'
import React, { FC, useEffect, useState } from 'react'
import { useTagEditor } from '../TagEditor.hook'
import { AreaDragCardGrid } from './AreaDragCardGrid'
interface CarouselItemProps {
  tagGroup: TagGroup
}
const useCarouselItem = () => {
  const { dispatch, allGroupList, thisState, thisActions } = useTagEditor()
  const { setState } = thisActions
  const actionCreators = bindActionCreators({ ...tagGroupSlice.actions, setState }, dispatch)
  return { ...actionCreators, allGroupList, thisState }
}
export const CarouselItem: FC<CarouselItemProps> = (props) => {
  const { tagGroup } = props
  const { thisState } = useCarouselItem()
  const isCurrent = thisState.group && tagGroup.id === thisState.group.id
  return (
    <Card h='100%' style={{ backgroundColor: '#1a1b1e60' }} withBorder className='CarouselItem overflow-visible'>
      {isCurrent && (
        <>
          <ScrollArea type='never' h='100%'>
            <NamingSection tagGroup={tagGroup} />
            <DragSection tagGroup={tagGroup} />
          </ScrollArea>
          <ActionSection tagGroup={tagGroup} />
        </>
      )}
      {!isCurrent && (
        <ScrollArea type='never' h='100%'>
          <SkeletonSection length={tagGroup.atomIDs.length} />
        </ScrollArea>
      )}
    </Card>
  )
}
const NamingSection: FC<CarouselItemProps> = (props) => {
  const [title, setTitle] = useState(props.tagGroup.title)
  const { updateOne } = useCarouselItem()
  const [debounced] = useDebouncedValue(title, 200)
  // 降低更新store的頻率
  useEffect(() => {
    updateOne({ changes: { title }, id: props.tagGroup.id })
  }, [debounced])
  // inputValue from Props=>store
  useEffect(() => {
    setTitle(props.tagGroup.title)
  }, [props])
  return (
    <Card.Section inheritPadding>
      <Input size='xl' fw='bolder' variant='unstyled' placeholder='My tag block name is...' maxLength={30} value={title} onChange={(e) => setTitle(e.target.value)} />
    </Card.Section>
  )
}
const DragSection: FC<CarouselItemProps> = (props) => {
  const { tagGroup: tagGroup } = props
  return (
    <Card.Section inheritPadding className='flex-grow-1'>
      <AreaDragCardGrid tagGroup={tagGroup} />
    </Card.Section>
  )
}
const ActionSection: FC<CarouselItemProps> = (props) => {
  const { tagGroup } = props
  const { addOne, removeOne, allGroupList } = useCarouselItem()
  const handleAddClick = () => {
    const id = nanoid()
    addOne({ id, atomIDs: [], title: id })
  }
  const handleRemoveClick = () => {
    const removeID = tagGroup.id
    removeOne(removeID)
  }
  const iconProps: Omit<FontAwesomeIconProps, 'icon'> = { size: '2x', className: 'pointer' }
  return (
    <Box>
      {allGroupList.length < 10 && (
        <Box className='plus'>
          <ActionIcon variant='filled' radius='xl' size='xl' onClick={handleAddClick}>
            <SFIcon icon='faPlus' iconProps={iconProps} />
          </ActionIcon>
        </Box>
      )}
      {allGroupList.length > 1 && (
        <Box className='minus'>
          <ActionIcon variant='filled' radius='xl' size='xl' onClick={handleRemoveClick}>
            <SFIcon icon='faMinus' iconProps={iconProps} />
          </ActionIcon>
        </Box>
      )}
    </Box>
  )
}
const SkeletonSection: FC<{ length: number }> = (props) => {
  return (
    <SimpleGrid
      cols={6}
      className='AreaDragCardGrid'
      breakpoints={[
        { maxWidth: 'xl', cols: 5 },
        { maxWidth: 'lg', cols: 4 },
        { maxWidth: 'md', cols: 3 },
        { maxWidth: 'sm', cols: 2 },
        { maxWidth: 'xs', cols: 1 },
      ]}
    >
      {_.times(_.min([props.length, 30]) ?? 0, (i) => (
        <Skeleton h={150} circle key={i} />
      ))}
    </SimpleGrid>
  )
}
