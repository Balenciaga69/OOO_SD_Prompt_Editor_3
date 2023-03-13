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

/**
 * 用於 TagCard 元件中使用的自訂 Hook，返回 removeOne 和 updateOne 這兩個 action creators
 *
 * @returns {object} 返回一個包含 removeOne 和 updateOne 兩個 action creators 的物件
 */
const useTagCard = () => {
  const { dispatch } = useTagEditor()
  const { removeOne, updateOne } = tagAtomSlice.actions
  const actionCreators = bindActionCreators({ removeOne, updateOne }, dispatch)
  return { ...actionCreators }
}

/**
 * 用於顯示 TagCard 的 function component，根據傳入的 tagAtom 屬性顯示表格內容
 *
 * @param {object} props - 由父元件傳入的 props，包含 tagAtom 屬性，用於顯示該 tag 的內容
 * @returns {JSX.Element} 返回一個 React 元件，顯示 TagCard 內容
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

/**
 * 用於顯示表格中 tag 名稱的 function component，包含可拖曳排序和刪除 tag 的功能
 *
 * @param {object} props - 由父元件傳入的 props，包含 tagAtom 屬性，用於顯示該 tag 的名稱
 * @returns {JSX.Element} 返回一個 React 元件，顯示表格中 tag 名稱內容
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

/**
 * 更新TagCard的權重，可增加或減少數字權重與括弧權重。
 * @function useTagCard
 * @returns {Object} actionCreators - 用於更新store的actionCreators
 *
 * @function RowNumberWeight
 * @param {TagCardProps} props - 包含單個tag atom的屬性(prop)
 * @returns {JSX.Element} - 包含更新數字權重的tr元素
 *
 * @function RowBracketWeight
 * @param {TagCardProps} props - 包含單個tag atom的屬性(prop)
 * @returns {JSX.Element} - 包含更新括弧權重的tr元素
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
export const RowBracketWeight: FC<TagCardProps> = ({ tagAtom }) => {
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

/**
 * @description 包装带有数字悬停卡的组件的高阶组件
 * @function
 * @param {WithNumHoverCardProps} props - 组件props对象
 * @returns {JSX.Element} - 返回一个包含悬停卡的组件
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

/**
 * @description 包装带有名称悬停卡的组件的高阶组件
 * @function
 * @param {WithNameHoverCardProps} props - 组件props对象
 * @returns {JSX.Element} - 返回一个包含悬停卡的组件
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
