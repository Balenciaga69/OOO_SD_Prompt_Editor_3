import { TagAtom } from '@/interfaces/core.interface'
import { tagAtomSlice } from '@/redux'
import { SFIcon } from '@/views/shared/SFIcon'
import { useSortable } from '@dnd-kit/sortable'
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { ActionIcon, Box, Card, Flex, Group, HoverCard, Table, Text } from '@mantine/core'
import { bindActionCreators } from '@reduxjs/toolkit'
import _ from 'lodash'
import React, { FC, ReactNode } from 'react'
import { useTagEditor } from '../TagEditor.hook'

interface TagCardProps {
  tagAtom: TagAtom
}

/*
 * 自定義React Hook，提供操作標籤狀態的函數
 */
const useTagCard = () => {
  const { dispatch } = useTagEditor()
  const { removeOne, updateOne } = tagAtomSlice.actions
  const actionCreators = bindActionCreators({ removeOne, updateOne }, dispatch)
  return { ...actionCreators }
}

/*
 * 顯示標籤卡片，包含標籤名稱、數量和權重
 */
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

/*
 * 顯示標籤卡片中的標籤名稱，提供刪除標籤和拖曳排序功能
 */
export const RowTitle: FC<TagCardProps> = ({ tagAtom }) => {
  const { removeOne } = useTagCard()
  const { attributes, listeners } = useSortable({ id: tagAtom.id })
  const handleXIconClick = () => {
    removeOne(tagAtom.id)
  }
  return (
    <tr>
      <td className='w-20'>
        <SFIcon icon='faSignature' />
      </td>
      <td>
        <Flex>
          <Box>
            <WithNameHoverCard name={tagAtom.title} handleXIconClick={handleXIconClick}>
              <Text maw='120px' className='overflow-hidden text-nowrap'>
                {tagAtom.title}
              </Text>
            </WithNameHoverCard>
          </Box>
          <ActionIcon className='ms-auto' variant='transparent' size='xs' {...listeners} {...attributes}>
            <SFIcon icon='faGripVertical' />
          </ActionIcon>
        </Flex>
      </td>
    </tr>
  )
}

/*
 * 顯示標籤卡片中的數量權重，提供增減數量權重的功能
 */
const RowNumberWeight: FC<TagCardProps> = ({ tagAtom }) => {
  const { updateOne } = useTagCard()
  const handleNumMinusClick = () => {
    if (tagAtom.numberWeight <= 0.1) return
    const nextNumberWeight = _.toNumber((tagAtom.numberWeight - 0.1).toFixed(1))
    updateOne({ id: tagAtom.id, changes: { numberWeight: nextNumberWeight, bracketWeight: 0 } })
  }
  const handleNumAddClick = () => {
    if (tagAtom.numberWeight >= 2.0) return
    const nextNumberWeight = _.toNumber((tagAtom.numberWeight + 0.1).toFixed(1))
    updateOne({ id: tagAtom.id, changes: { numberWeight: nextNumberWeight, bracketWeight: 0 } })
  }
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

/*
 * 顯示標籤卡片中的括號權重，提供增減括號權重的功能
 */
const RowBracketWeight: FC<TagCardProps> = ({ tagAtom }) => {
  const { updateOne } = useTagCard()
  const handleBracketMinusClick = () => {
    if (tagAtom.bracketWeight <= -5) return
    const nextBracketWeight = tagAtom.bracketWeight - 1
    updateOne({ id: tagAtom.id, changes: { bracketWeight: nextBracketWeight, numberWeight: 1 } })
  }
  const handleBracketAddClick = () => {
    if (tagAtom.bracketWeight >= 10) return
    const nextBracketWeight = tagAtom.bracketWeight + 1
    updateOne({ id: tagAtom.id, changes: { bracketWeight: nextBracketWeight, numberWeight: 1 } })
  }
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

/*
 * 一個 Higher-Order Component，提供帶有數量增減功能的 Hover Card
 */
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

/*
 * 一個 Higher-Order Component，提供帶有名稱和刪除功能的 Hover Card
 */
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
