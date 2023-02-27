import { rootSlices } from '@/core'
import { TagBlock } from '@/interfaces/core.interface'
import { SFIcon } from '@/views/shared/SFIcon'
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { ActionIcon, Box, Card, Input, ScrollArea, SimpleGrid, Skeleton } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { bindActionCreators, nanoid } from '@reduxjs/toolkit'
import _ from 'lodash'
import React, { FC, useEffect, useState } from 'react'
import { useTagEditor } from '../useTagEditor'
import { AreaDragCardGrid } from './AreaDragCardGrid'
interface CarouselItemProps {
  tagBlock: TagBlock
}
const useCarouselItem = () => {
  const { dispatch, allTagBlock, myState, myActions } = useTagEditor()
  const { setState } = myActions
  const actionCreators = bindActionCreators({ ...rootSlices.tagBlockSlice.actions, setMyState: setState }, dispatch)
  return { ...actionCreators, allTagBlock, myState }
}
export const CarouselItem: FC<CarouselItemProps> = (props) => {
  const { tagBlock } = props
  const { myState } = useCarouselItem()
  const isCurrent = tagBlock.id === myState.blockID
  return (
    <Card h='100%' style={{ backgroundColor: '#1a1b1e60' }} withBorder className='CarouselItem overflow-visible'>
      {isCurrent && (
        <>
          <ScrollArea type='never' h='100%'>
            <NamingSection tagBlock={tagBlock} />
            <DragSection tagBlock={tagBlock} />
          </ScrollArea>
          <ActionSection tagBlock={tagBlock} />
        </>
      )}
      {!isCurrent && (
        <ScrollArea type='never' h='100%'>
          <SkeletonSection length={tagBlock.tagIDs.length} />
        </ScrollArea>
      )}
    </Card>
  )
}
const NamingSection: FC<CarouselItemProps> = (props) => {
  const [title, setTitle] = useState(props.tagBlock.title)
  const { updateOne } = useCarouselItem()
  const [debounced] = useDebouncedValue(title, 200)
  // 降低更新store的頻率
  useEffect(() => {
    updateOne({ changes: { title }, id: props.tagBlock.id })
  }, [debounced])
  // inputValue from Props=>store
  useEffect(() => {
    setTitle(props.tagBlock.title)
  }, [props])
  return (
    <Card.Section inheritPadding>
      <Input size='xl' fw='bolder' variant='unstyled' placeholder='為這項集合命名......' maxLength={10} value={title} onChange={(e) => setTitle(e.target.value)} />
    </Card.Section>
  )
}
const DragSection: FC<CarouselItemProps> = (props) => {
  const { tagBlock } = props
  return (
    <Card.Section inheritPadding className='flex-grow-1'>
      <AreaDragCardGrid tagBlock={tagBlock} />
    </Card.Section>
  )
}
const ActionSection: FC<CarouselItemProps> = (props) => {
  const { tagBlock } = props
  const { addOne, removeOne, allTagBlock, setMyState } = useCarouselItem()
  const handleAddClick = () => {
    const id = nanoid()
    addOne({ id, tagIDs: [], title: id })
  }
  const handleRemoveClick = () => {
    const removeID = tagBlock.id
    removeOne(removeID)
  }
  const iconProps: Omit<FontAwesomeIconProps, 'icon'> = { size: '2x', className: 'pointer' }
  return (
    <Box>
      {allTagBlock.length < 10 && (
        <Box className='plus'>
          <ActionIcon variant='filled' radius='xl' size='xl' onClick={handleAddClick}>
            <SFIcon icon='faPlus' iconProps={iconProps} />
          </ActionIcon>
        </Box>
      )}
      {allTagBlock.length > 1 && (
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
