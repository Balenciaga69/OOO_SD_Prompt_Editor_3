import { tagSlice } from '@/core/slices'
import { Tag } from '@/interfaces/core.interface'
import { SFIcon } from '@/views/shared/SFIcon'
import { useSortable } from '@dnd-kit/sortable'
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { ActionIcon, Box, Card, Flex, Group, HoverCard, Table, Text } from '@mantine/core'
import { bindActionCreators } from '@reduxjs/toolkit'
import _ from 'lodash'
import React, { FC, ReactNode, useCallback, useMemo } from 'react'
import { useTagEditor } from '../useTagEditor'
interface TagCardProps {
  tag: Tag
}
const useTagCard = () => {
  const { dispatch } = useTagEditor()
  const { removeOne, updateOne } = tagSlice.actions
  const actionCreators = bindActionCreators({ removeOne, updateOne }, dispatch)
  return { ...actionCreators }
}
export const TagCard: FC<TagCardProps> = ({ tag }) => {
  return (
    <Card withBorder p={0} className='overflow-visible'>
      <Table highlightOnHover className='overflow-visible'>
        <tbody>
          <RowTitle tag={tag} />
          <RowNumberWeight tag={tag} />
          <RowBracketWeight tag={tag} />
        </tbody>
      </Table>
    </Card>
  )
}
export const RowTitle: FC<TagCardProps> = ({ tag }) => {
  const { removeOne } = useTagCard()
  const { attributes, listeners } = useSortable({ id: tag.id })
  const processedTitle = useMemo(() => _.truncate(tag.title, { omission: '...', length: 16 }), [tag])
  const handleXIconClick = useCallback(() => {
    removeOne(tag.id)
  }, [tag, removeOne])
  return (
    <tr>
      <td className='w-20'>
        <SFIcon icon='faSignature' />
      </td>
      <td>
        <Flex>
          <WithNameHoverCard text={tag.title} handleXIconClick={handleXIconClick}>
            <Text className='flex-grow-1'>{processedTitle}</Text>
          </WithNameHoverCard>
          <ActionIcon variant='transparent' size='xs' {...listeners} {...attributes}>
            <SFIcon icon='faGripVertical' />
          </ActionIcon>
        </Flex>
      </td>
    </tr>
  )
}
const RowNumberWeight: FC<TagCardProps> = ({ tag }) => {
  const { updateOne } = useTagCard()
  const handleNumMinusClick = useCallback(() => {
    if (tag.numberWeight <= 0.1) return
    const nextNumberWeight = _.toNumber((tag.numberWeight - 0.1).toFixed(1))
    updateOne({ id: tag.id, changes: { numberWeight: nextNumberWeight, bracketWeight: 0 } })
  }, [tag, updateOne])

  const handleNumAddClick = useCallback(() => {
    if (tag.numberWeight >= 2.0) return
    const nextNumberWeight = _.toNumber((tag.numberWeight + 0.1).toFixed(1))
    updateOne({ id: tag.id, changes: { numberWeight: nextNumberWeight, bracketWeight: 0 } })
  }, [tag, updateOne])

  return (
    <tr>
      <td className='w-20'>
        <SFIcon icon='faArrowUp19' />
      </td>
      <td>
        <WithPlusMinusHoverCard handleMinusIconClick={handleNumMinusClick} handlePlusIconClick={handleNumAddClick}>
          <Text>{tag.numberWeight}</Text>
        </WithPlusMinusHoverCard>
      </td>
    </tr>
  )
}
export const RowBracketWeight: FC<TagCardProps> = ({ tag }) => {
  const { updateOne } = useTagCard()

  const handleBracketMinusClick = useCallback(() => {
    if (tag.bracketWeight <= -5) return
    const nextBracketWeight = tag.bracketWeight - 1
    updateOne({ id: tag.id, changes: { bracketWeight: nextBracketWeight, numberWeight: 1 } })
  }, [tag, updateOne])

  const handleBracketAddClick = useCallback(() => {
    if (tag.bracketWeight >= 10) return
    const nextBracketWeight = tag.bracketWeight + 1
    updateOne({ id: tag.id, changes: { bracketWeight: nextBracketWeight, numberWeight: 1 } })
  }, [tag, updateOne])
  return (
    <tr>
      <td className='w-20'>
        <SFIcon icon='faW' />
      </td>
      <td>
        <WithPlusMinusHoverCard handleMinusIconClick={handleBracketMinusClick} handlePlusIconClick={handleBracketAddClick}>
          <Text>{tag.bracketWeight}</Text>
        </WithPlusMinusHoverCard>
      </td>
    </tr>
  )
}
interface WithNumHoverCardProps {
  children: ReactNode
  handlePlusIconClick: () => void
  handleMinusIconClick: () => void
}
const WithPlusMinusHoverCard: FC<WithNumHoverCardProps> = (props) => {
  const { children, handleMinusIconClick, handlePlusIconClick } = props
  const iconProps: Omit<FontAwesomeIconProps, 'icon'> = { size: '2xs', className: 'pointer' }
  return (
    <HoverCard shadow='md' position='left'>
      <HoverCard.Target>{children}</HoverCard.Target>
      <HoverCard.Dropdown>
        <Group spacing='md'>
          <ActionIcon variant='filled' radius='xl' size='sm' onClick={handleMinusIconClick}>
            <SFIcon icon='faMinus' iconProps={iconProps} />
          </ActionIcon>
          <ActionIcon variant='filled' radius='xl' size='sm' onClick={handlePlusIconClick}>
            <SFIcon icon='faPlus' iconProps={iconProps} />
          </ActionIcon>
        </Group>
      </HoverCard.Dropdown>
    </HoverCard>
  )
}
interface WithNameHoverCardProps {
  children: ReactNode
  text: string
  handleXIconClick: () => void
}
const WithNameHoverCard: FC<WithNameHoverCardProps> = (props) => {
  const { children, text, handleXIconClick } = props
  const iconProps: Omit<FontAwesomeIconProps, 'icon'> = { size: 'xs', className: 'pointer' }
  return (
    <HoverCard shadow='md' position='left'>
      <HoverCard.Target>{children}</HoverCard.Target>
      <HoverCard.Dropdown>
        <Flex align='center' justify='start' gap='xs' className='z-999'>
          <ActionIcon color='red' variant='light' size='sm' onClick={handleXIconClick}>
            <SFIcon icon='faX' iconProps={iconProps} />
          </ActionIcon>
          <Box className='line-break' maw={300}>
            {text}
          </Box>
        </Flex>
      </HoverCard.Dropdown>
    </HoverCard>
  )
}
