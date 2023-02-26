import { SFIcon } from '@/views/shared/SFIcon'
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { ActionIcon, Box, Card, Input, ScrollArea } from '@mantine/core'
import { nanoid } from '@reduxjs/toolkit'
import _ from 'lodash'
import React, { FC, useMemo, useState } from 'react'
import { AreaDragCardGrid } from './AreaDragCardGrid'
import { Keen3DCarousel } from './Keen3DCarousel'
import { useTagEditor } from '../useTagEditor'
import { TagBlock } from '@/interfaces/core.interface'
const useBlockTagVisual = () => {
  const { dispatch, myActions, myState, sharedState } = useTagEditor()
  const tagBlockEntities = useMemo(() => {
    return _.filter(sharedState.tagBlock.entities, (e) => !_.isNil(e)) as TagBlock[]
  }, [sharedState])
  return { tagBlockEntities }
}
export const BlockTagVisual: FC = () => {
  const { tagBlockEntities } = useBlockTagVisual()
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
      {tagBlockEntities.length && (
        <Keen3DCarousel>
          {_.map(tagBlockEntities, (entity) => (
            <VisualItem key={entity.id} handleClickPlusIcon={plus} handleClickMinusIcon={minus} />
          ))}
        </Keen3DCarousel>
      )}
    </Box>
  )
}

interface VisualItemProps {
  handleClickPlusIcon: () => void
  handleClickMinusIcon: (id: string) => void
}
const useVisualItem = () => {
  const { dispatch, myActions, myState, sharedState } = useTagEditor()
}

const VisualItem: FC<VisualItemProps> = (props) => {
  const { handleClickMinusIcon, handleClickPlusIcon } = props
  const handleTitleChange = (title: string) => {
    console.info(' watchThis title', title)
  }
  const iconProps: Omit<FontAwesomeIconProps, 'icon'> = { size: '2x', className: 'pointer' }

  const NamingSection: FC = () => (
    <Card.Section inheritPadding>
      <Input size='xl' fw='bolder' variant='unstyled' placeholder='為這項集合命名......' maxLength={10} value={code} onChange={(e) => handleTitleChange(e.target.value)} />
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
