import { SFIcon } from '@/views/shared/SFIcon'
import { useSortable } from '@dnd-kit/sortable'
import { ActionIcon, Box, Card, Flex, NativeSelect, SegmentedControl, Slider, Text } from '@mantine/core'
import React, { FC, useEffect } from 'react'
import { useGroupMixer } from '../GroupMixer.hook'
import _ from 'lodash'
import { MixerItem } from '@/interfaces/core.interface'
import { bindActionCreators } from '@reduxjs/toolkit'
const MARKS = [
  { value: 0, label: 'No' },
  { value: 1, label: '( )' },
  { value: 2, label: '(( ))' },
  { value: 3, label: '((( )))' },
  { value: 4, label: '(((( ))))' },
  { value: 5, label: '(((( ))))' },
]
interface Props {
  group: MixerItem
}
const useSortCard = () => {
  const { allAtomList, allGroupList, dispatch, tagAtomEntities, tagGroupEntities, thisActions, thisState } = useGroupMixer()
  const { setState } = thisActions
  const actionCreators = bindActionCreators({ setState }, dispatch)
  const SelectOptions = [{ value: '', label: '...' }, ..._.map(allGroupList, (e) => ({ value: e.id, label: e.title }))]
  return { allAtomList, allGroupList, dispatch, tagAtomEntities, tagGroupEntities, thisActions, thisState, SelectOptions, ...actionCreators }
}
export const SortCard: FC<Props> = (props) => {
  const { SelectOptions, setState, thisState } = useSortCard()
  const { group } = props
  const { attributes, listeners } = useSortable({ id: group.id })
  const handleSelectChange = (value: string) => {
    const nextGroup: MixerItem = { ...group, groupID: value }
    const id = _.toNumber(group.id)
    const newList = _.map(thisState.itemList, (group, i) => (i === id ? nextGroup : group))
    setState({ itemList: newList })
  }
  const handleSliderChange = (value: number) => {
    const nextGroup: MixerItem = { ...group, weight: value }
    const id = _.toNumber(group.id)
    const newList = _.map(thisState.itemList, (group, i) => (i === id ? nextGroup : group))
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
            onChange={(e) => handleSliderChange(_.toNumber(e))}
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
