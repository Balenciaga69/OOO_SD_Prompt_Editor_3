/* eslint-disable lodash/chaining */
import { MixerItem } from '@/interfaces/core.interface'
import { Button, Group, Paper } from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import _ from 'lodash'
import React, { useMemo } from 'react'
import { FC } from 'react'
import { useGroupMixer } from '../GroupMixer.hook'
import { simpleTagsToCode } from '@/utils'
import { bindActionCreators } from '@reduxjs/toolkit'
interface WeightText {
  text: string
  weight: number
}
const useControlPanel = () => {
  const { thisState, tagGroupEntities, tagAtomEntities, dispatch, thisActions } = useGroupMixer()
  const { setState } = thisActions
  const actionCreators = bindActionCreators({ setState }, dispatch)
  const weightTextList: WeightText[] = useMemo(() => {
    const groupList = _.compact(_.map(thisState.itemList, ({ groupID, weight }) => ({ group: tagGroupEntities[groupID], weight: weight })))
    return _.map(groupList, ({ group, weight }) => {
      if (_.isNil(group)) return { text: '', weight }
      const atomList = _.compact(_.map(group.atomIDs, (id) => tagAtomEntities[id]))
      return { text: simpleTagsToCode(atomList, 'split'), weight }
    })
  }, [thisState, tagGroupEntities, tagAtomEntities])
  return { weightTextList, ...actionCreators, thisState }
}
export const ControlPanel: FC = () => {
  const clipboard = useClipboard({ timeout: 500 })
  const { weightTextList, setState, thisState } = useControlPanel()
  const handleClearClick = () => {
    const newList: MixerItem[] = _.map(thisState.itemList, (item) => ({ id: item.id, groupID: '', weight: 0 }))
    setState({ itemList: newList })
  }
  const handleGenerateClick = () => {
    clipboard.copy(mixAll(weightTextList))
  }
  return (
    <Paper radius='xl' p='sm'>
      <Group>
        <Button variant='filled' w='7rem' radius='xl' color='gray' onClick={handleClearClick}>
          Clear
        </Button>
        <Button variant='filled' w='7rem' radius='xl' color='gray' onClick={handleGenerateClick}>
          Generate
        </Button>
      </Group>
    </Paper>
  )
}
const mixAll = (weightTextList: WeightText[]): string => {
  const result = _(weightTextList)
    .filter((item) => !_.isEmpty(item.text))
    .map(({ text, weight }) => `${_.repeat('(', weight)}${text}${_.repeat(')', weight)}`)
    .join(`,\n`)
  console.info(' watchThis result:', result)
  return result
}
