import { SFIcon } from '@/views/shared/SFIcon'
import { useSortable } from '@dnd-kit/sortable'
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { ActionIcon, Box, Card, Flex, Group, HoverCard, Table, Text } from '@mantine/core'
import { bindActionCreators } from '@reduxjs/toolkit'
import _ from 'lodash'
import React, { FC, ReactNode, useCallback, useMemo } from 'react'
import { useTagEditor } from '../TagEditor.hook'
import { TagAtom } from '@/interfaces/core.interface'
import { tagAtomSlice } from '@/redux'
interface TagCardProps {
  tagAtom: TagAtom
}
const useTagCard = () => {
  const { dispatch } = useTagEditor()
  const { removeOne, updateOne } = tagAtomSlice.actions
  const actionCreators = bindActionCreators({ removeOne, updateOne }, dispatch)
  return { ...actionCreators }
}
export const TagCard: FC<TagCardProps> = ({ tagAtom }) => {
  return (
    <Card withBorder p={0} className='overflow-visible'>
      <Table highlightOnHover className='overflow-visible'>
        <tbody>
          <RowTitle tagAtom={tagAtom} />
          <RowNumberWeight tagAtom={tagAtom} />
          <RowBracketWeight tagAtom={tagAtom} />
        </tbody>
      </Table>
    </Card>
  )
}
export const RowTitle: FC<TagCardProps> = ({ tagAtom }) => {
  const { removeOne } = useTagCard()
  const { attributes, listeners } = useSortable({ id: tagAtom.id })
  // FIXME: by CaiChengYou
  const processedTitle = useMemo(() => _.truncate(tagAtom.title, { omission: '...', length: 16 }), [tagAtom])
  const handleXIconClick = useCallback(() => {
    removeOne(tagAtom.id)
  }, [tagAtom, removeOne])
  return (
    <tr>
      <td className='w-20'>
        <SFIcon icon='faSignature' />
      </td>
      <td>
        <Flex>
          <WithNameHoverCard name={tagAtom.title} handleXIconClick={handleXIconClick}>
            <Text maw='8.5rem' className='overflow-hidden'>
              {tagAtom.title}
            </Text>
          </WithNameHoverCard>
          <ActionIcon className='ms-auto' variant='transparent' size='xs' {...listeners} {...attributes}>
            <SFIcon icon='faGripVertical' />
          </ActionIcon>
        </Flex>
      </td>
    </tr>
  )
}
const RowNumberWeight: FC<TagCardProps> = ({ tagAtom }) => {
  const { updateOne } = useTagCard()
  const handleNumMinusClick = useCallback(() => {
    if (tagAtom.numberWeight <= 0.1) return
    const nextNumberWeight = _.toNumber((tagAtom.numberWeight - 0.1).toFixed(1))
    updateOne({ id: tagAtom.id, changes: { numberWeight: nextNumberWeight, bracketWeight: 0 } })
  }, [tagAtom, updateOne])

  const handleNumAddClick = useCallback(() => {
    if (tagAtom.numberWeight >= 2.0) return
    const nextNumberWeight = _.toNumber((tagAtom.numberWeight + 0.1).toFixed(1))
    updateOne({ id: tagAtom.id, changes: { numberWeight: nextNumberWeight, bracketWeight: 0 } })
  }, [tagAtom, updateOne])

  return (
    <tr>
      <td className='w-20'>
        <SFIcon icon='faArrowUp19' />
      </td>
      <td>
        <WithPlusMinusHoverCard handleMinusIconClick={handleNumMinusClick} handlePlusIconClick={handleNumAddClick}>
          <Text>{tagAtom.numberWeight}</Text>
        </WithPlusMinusHoverCard>
      </td>
    </tr>
  )
}
export const RowBracketWeight: FC<TagCardProps> = ({ tagAtom }) => {
  const { updateOne } = useTagCard()

  const handleBracketMinusClick = useCallback(() => {
    if (tagAtom.bracketWeight <= -5) return
    const nextBracketWeight = tagAtom.bracketWeight - 1
    updateOne({ id: tagAtom.id, changes: { bracketWeight: nextBracketWeight, numberWeight: 1 } })
  }, [tagAtom, updateOne])

  const handleBracketAddClick = useCallback(() => {
    if (tagAtom.bracketWeight >= 10) return
    const nextBracketWeight = tagAtom.bracketWeight + 1
    updateOne({ id: tagAtom.id, changes: { bracketWeight: nextBracketWeight, numberWeight: 1 } })
  }, [tagAtom, updateOne])
  return (
    <tr>
      <td className='w-20'>
        <SFIcon icon='faW' />
      </td>
      <td>
        <WithPlusMinusHoverCard handleMinusIconClick={handleBracketMinusClick} handlePlusIconClick={handleBracketAddClick}>
          <Text>{tagAtom.bracketWeight}</Text>
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
  name: string
  handleXIconClick: () => void
}
const WithNameHoverCard: FC<WithNameHoverCardProps> = (props) => {
  const { children, name, handleXIconClick } = props
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
            {name}
          </Box>
        </Flex>
      </HoverCard.Dropdown>
    </HoverCard>
  )
}
