import { ActionIcon, Box, Card, Flex, Input } from '@mantine/core'
import _ from 'lodash'
import React, { FC, useState } from 'react'
import { Keen3DCarousel } from './Keen3DCarousel'
import { SFIcon } from '@/views/shared/SFIcon'
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { nanoid } from '@reduxjs/toolkit'
import { DragCardList } from './DragCardList'

export const PromptVisualArea: FC = () => {
  const [items, setItems] = useState<Array<string>>(['???'])

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
            <VisualPaper key={id} handleClickPlusIcon={plus} handleClickMinusIcon={minus} id={id} />
          ))}
        </Keen3DCarousel>
      )}
    </Box>
  )
}

interface CardItemProps {
  id: string
  handleClickPlusIcon: () => void
  handleClickMinusIcon: (id: string) => void
}

const VisualPaper: FC<CardItemProps> = (props) => {
  const { id, handleClickMinusIcon: onClickMinusIcon, handleClickPlusIcon: onClickPlusIcon } = props

  const iconProps: Omit<FontAwesomeIconProps, 'icon'> = { size: '2x', className: 'pointer' }

  const DragSection: FC = () => (
    <Card.Section inheritPadding className='flex-grow-1'>
      <Box h='100%'>
        {/* // FIXME: by CaiChengYou */}
        <DragCardList />
      </Box>
    </Card.Section>
  )

  const NamingSection: FC = () => (
    <Card.Section inheritPadding>
      <Input variant='unstyled' placeholder='為這項集合命名......' maxLength={10} />
    </Card.Section>
  )

  const ActionSection: FC = () => (
    <>
      <Box className='plus'>
        <ActionIcon variant='filled' radius='xl' size='xl' onClick={onClickPlusIcon}>
          <SFIcon icon='faPlus' iconProps={iconProps} />
        </ActionIcon>
      </Box>
      <Box className='minus'>
        <ActionIcon variant='filled' radius='xl' size='xl' onClick={(): void => onClickMinusIcon(id)}>
          <SFIcon icon='faMinus' iconProps={iconProps} />
        </ActionIcon>
      </Box>
    </>
  )
  return (
    <Card h='100%' p='xl' withBorder className='CardItem'>
      <NamingSection />
      <Flex h='100%' direction='column'>
        <DragSection />
      </Flex>
      <ActionSection />
    </Card>
  )
}
