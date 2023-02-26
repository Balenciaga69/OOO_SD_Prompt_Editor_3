import { rootSlices } from '@/core'
import { TagBlock } from '@/interfaces/core.interface'
import { SFIcon } from '@/views/shared/SFIcon'
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { ActionIcon, Box, Card, Input, ScrollArea } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { bindActionCreators, nanoid } from '@reduxjs/toolkit'
import _ from 'lodash'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { useTagEditor } from '../useTagEditor'
import { AreaDragCardGrid } from './AreaDragCardGrid'
import { Keen3DCarousel } from './Keen3DCarousel'
const useBlockTagVisual = () => {
  const { allTagBlock, myState } = useTagEditor()
  return { allTagBlock, myState }
}
export const BlockTagVisual: FC = () => {
  const { allTagBlock, myState } = useBlockTagVisual()
  return (
    <Box py='xl' h='100%'>
      {allTagBlock.length && (
        <Keen3DCarousel>
          {_.map(allTagBlock, (tagBlock) => (
            <VisualItem key={tagBlock.id} tagBlock={tagBlock} />
          ))}
        </Keen3DCarousel>
      )}
    </Box>
  )
}
interface VisualItemProps {
  tagBlock: TagBlock
}
const useVisualItem = () => {
  const { dispatch } = useTagEditor()
  const actionCreators = bindActionCreators({ ...rootSlices.tagBlockSlice.actions }, dispatch)
  return { ...actionCreators }
}
const VisualItem: FC<VisualItemProps> = (props) => {
  const { tagBlock } = props
  return (
    <Card h='100%' style={{ backgroundColor: '#1a1b1e60' }} withBorder className='VisualItem overflow-visible'>
      <ScrollArea type='never' h='100%'>
        <NamingSection tagBlock={tagBlock} />
        <DragSection tagBlock={tagBlock} />
      </ScrollArea>
      <ActionSection tagBlock={tagBlock} />
    </Card>
  )
}
const NamingSection: FC<VisualItemProps> = (props) => {
  const [title, setTitle] = useState(props.tagBlock.title)
  const { updateOne } = useVisualItem()
  const [debounced] = useDebouncedValue(title, 200)
  useEffect(() => {
    updateOne({ changes: { title }, id: props.tagBlock.id })
  }, [debounced])
  return (
    <Card.Section inheritPadding>
      <Input size='xl' fw='bolder' variant='unstyled' placeholder='為這項集合命名......' maxLength={10} value={title} onChange={(e) => setTitle(e.target.value)} />
    </Card.Section>
  )
}
const DragSection: FC<VisualItemProps> = (props) => {
  const { tagBlock } = props
  return (
    <Card.Section inheritPadding className='flex-grow-1'>
      <AreaDragCardGrid tagBlock={tagBlock} />
    </Card.Section>
  )
}
const ActionSection: FC<VisualItemProps> = (props) => {
  const { tagBlock } = props
  const blockLength = useBlockTagVisual().allTagBlock.length
  const { addOne, removeOne } = useVisualItem()
  const handleAddClick = () => {
    addOne({ id: nanoid(), tagIDs: [], title: '' })
  }
  const handleRemoveClick = () => {
    removeOne(tagBlock.id)
  }
  const iconProps: Omit<FontAwesomeIconProps, 'icon'> = { size: '2x', className: 'pointer' }
  return (
    <Box>
      {blockLength < 10 && (
        <Box className='plus'>
          <ActionIcon variant='filled' radius='xl' size='xl' onClick={handleAddClick}>
            <SFIcon icon='faPlus' iconProps={iconProps} />
          </ActionIcon>
        </Box>
      )}
      {blockLength > 1 && (
        <Box className='minus'>
          <ActionIcon variant='filled' radius='xl' size='xl' onClick={handleRemoveClick}>
            <SFIcon icon='faMinus' iconProps={iconProps} />
          </ActionIcon>
        </Box>
      )}
    </Box>
  )
}
