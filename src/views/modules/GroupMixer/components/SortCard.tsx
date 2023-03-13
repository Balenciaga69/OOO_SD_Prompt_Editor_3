import { MixerItem } from '@/interfaces/core.interface'
import { SFIcon } from '@/views/shared/SFIcon'
import { useSortable } from '@dnd-kit/sortable'
import { ActionIcon, Box, Card, Flex, NativeSelect, SegmentedControl, Text } from '@mantine/core'
import { bindActionCreators } from '@reduxjs/toolkit'
import _ from 'lodash'
import React, { FC } from 'react'
import { useGroupMixer } from '../GroupMixer.hook'

interface Props {
  group: MixerItem
}

/**
 * 用於獲取群組排序卡片中所需的所有狀態和方法的函數
 * @returns {object} 包含所有狀態和方法的物件，以及群組選項的 SelectOptions 物件
 */
const useSortCard = () => {
  const { allAtomList, allGroupList, dispatch, tagAtomEntities, tagGroupEntities, thisActions, thisState } = useGroupMixer()
  const { setState } = thisActions
  const actionCreators = bindActionCreators({ setState }, dispatch)
  const SelectOptions = [{ value: '', label: '...' }, ..._.map(allGroupList, (e) => ({ value: e.id, label: e.title }))]
  return { allAtomList, allGroupList, dispatch, tagAtomEntities, tagGroupEntities, thisActions, thisState, SelectOptions, ...actionCreators }
}

/**
 * 用於群組排序卡片的 React 元件
 * @param {object} props - 包含一個 MixerItem 物件的 group 屬性的物件
 * @returns {JSX.Element} 返回一個包含群組排序 UI 的卡片元件
 */
export const SortCard: FC<Props> = (props) => {
  const { SelectOptions, setState, thisState } = useSortCard()
  const { group } = props
  const { attributes, listeners } = useSortable({ id: group.id })

  /**
   * 用於處理群組選擇變更事件的函數
   * @param {string} value - 選擇的群組 ID
   */
  const handleSelectChange = (value: string) => {
    const nextItem: MixerItem = { ...group, groupID: value }
    setNewItemList(nextItem)
  }

  /**
   * 用於處理權重變更事件的函數
   * @param {string} value - 變更的權重值
   */
  const handleSliderChange = (value: string) => {
    const nextItem: MixerItem = { ...group, weight: _.toNumber(value) }
    setNewItemList(nextItem)
  }

  /**
   * 用於更新 MixerItem 列表的函數
   * @param {object} nextItem - 新的 MixerItem 物件
   */
  const setNewItemList = (nextItem: MixerItem) => {
    const id = _.toString(group.id)
    const newList = _.map(thisState.itemList, (group) => (group.id === id ? nextItem : group))
    setState({ itemList: newList })
  }
  return (
    <Box>
      <Card>
        <Card.Section inheritPadding py='xs'>
          <Flex align='center' mb='md'>
            <Text size='lg'>Group</Text>
            <ActionIcon className='ms-auto ' variant='transparent' size='xs' {...listeners} {...attributes}>
              <SFIcon icon='faGripVertical' />
            </ActionIcon>
          </Flex>
          <NativeSelect size='lg' variant='unstyled' data={SelectOptions} value={group.groupID} onChange={(e) => handleSelectChange(e.target.value)} />
        </Card.Section>
        <Card.Section inheritPadding py='xs'>
          <Text size='lg' mb='md'>
            Weight
          </Text>
          <SegmentedControl
            color='yellow'
            value={_.toString(group.weight)}
            onChange={(e) => handleSliderChange(e)}
            data={[
              { label: 'Normal', value: '0' },
              { label: 'Single', value: '1' },
              { label: 'Double', value: '2' },
            ]}
          />
        </Card.Section>
      </Card>
    </Box>
  )
}
