import { SFIcon } from '@/views/shared/SFIcon'
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { ActionIcon, Box, Card, Flex, Input, ScrollArea } from '@mantine/core'
import { nanoid } from '@reduxjs/toolkit'
import _ from 'lodash'
import React, { FC, useState } from 'react'
import { Keen3DCarousel } from './Keen3DCarousel'
import { AreaDragCardGrid } from './AreaDragCardGrid'

export const BlockTagVisual: FC = () => {
  const [items, setItems] = useState<Array<string>>(['???'])
  // FIXME:Redux by CaiChengYou
  const plus = (): void => {
    if (items.length >= 10) return
    setItems([...items, nanoid()])
  }
  const minus = (id: string): void => {
    if (items.length <= 1) return

    const newList = _.filter(items, (e) => e !== id)
    setItems(newList)
  }
  return (
    <Box py='xl' h='100%'>
      {items.length && (
        <Keen3DCarousel>
          {_.map(items, (id) => (
            <VisualItem key={id} handleClickPlusIcon={plus} handleClickMinusIcon={minus} id={id} />
          ))}
        </Keen3DCarousel>
      )}
    </Box>
  )
}

interface VisualItemProps {
  id: string
  handleClickPlusIcon: () => void
  handleClickMinusIcon: (id: string) => void
}

const VisualItem: FC<VisualItemProps> = (props) => {
  const { id, handleClickMinusIcon, handleClickPlusIcon } = props

  const iconProps: Omit<FontAwesomeIconProps, 'icon'> = { size: '2x', className: 'pointer' }

  const NamingSection: FC = () => (
    <Card.Section inheritPadding>
      <Input size='xl' fw='bolder' variant='unstyled' placeholder='為這項集合命名......' maxLength={10} />
    </Card.Section>
  )

  const DragSection: FC = () => (
    <Card.Section inheritPadding className='flex-grow-1'>
      <AreaDragCardGrid />
    </Card.Section>
  )

  const ActionSection: FC = () => (
    <Box>
      <Box className='plus'>
        <ActionIcon variant='filled' radius='xl' size='xl' onClick={handleClickPlusIcon}>
          <SFIcon icon='faPlus' iconProps={iconProps} />
        </ActionIcon>
      </Box>
      <Box className='minus'>
        <ActionIcon variant='filled' radius='xl' size='xl' onClick={(): void => handleClickMinusIcon(id)}>
          <SFIcon icon='faMinus' iconProps={iconProps} />
        </ActionIcon>
      </Box>
    </Box>
  )
  return (
    <Card h='100%' style={{ backgroundColor: '#1a1b1e60' }} withBorder className='VisualItem overflow-visible'>
      <ScrollArea type='never' h='100%'>
        <NamingSection />
        <DragSection />
      </ScrollArea>
      <ActionSection />
    </Card>
  )
}
