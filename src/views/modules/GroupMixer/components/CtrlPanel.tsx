/* eslint-disable lodash/chaining */
import { MixerItem, TagGroup } from '@/interfaces/core.interface'
import { simpleTagsToCode } from '@/utils'
import { Button, Group, Paper } from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import { bindActionCreators } from '@reduxjs/toolkit'
import _ from 'lodash'
import React, { FC, useMemo } from 'react'
import { useGroupMixer } from '../GroupMixer.hook'

interface WeightText {
  text: string
  weight: number
}

/**
 * @description useControlPanel 是一個自定義的 Hook，用於提供控制 ControlPanel 的狀態和操作的函數和變數
 * @returns {Object} 返回一個包含 weightTextList 、setState 和 thisState 等屬性的物件
 */
const useControlPanel = () => {
  const { thisState, tagGroupEntities, tagAtomEntities, dispatch, thisActions } = useGroupMixer()
  const { setState } = thisActions
  const actionCreators = bindActionCreators({ setState }, dispatch)

  /**
   * @description weightTextList 是一個根據當前 itemList 中的 MixerItem 物件和相關的 Tag Group 和 Atom 數據計算得到的 WeightText 陣列
   * @type {WeightText[]}
   */
  const weightTextList: WeightText[] = useMemo(() => {
    const groupList = _.compact(_.map(thisState.itemList, ({ groupID, weight }) => ({ group: tagGroupEntities[groupID], weight })))

    /**
     * @description 根據 Tag Group 和 Atom 數據計算出每個 MixerItem 的文字內容，返回一個 WeightText 物件
     * @param {TagGroup | undefined} group - 一個 TagGroup 物件或 undefined
     * @returns {WeightText} 返回一個包含代碼字串和權重屬性的 WeightText 物件
     */
    const getText = (group: TagGroup | undefined) => (group ? simpleTagsToCode(_.compact(_.map(group.atomIDs, (id) => tagAtomEntities[id])), 'split') : '')

    return _.map(groupList, ({ group, weight }) => ({ text: getText(group), weight }))
  }, [thisState, tagGroupEntities, tagAtomEntities])
  return { weightTextList, ...actionCreators, thisState }
}

/**
 * @description ControlPanel 是一個函數組件，渲染用於控制 MixerItem 陣列的按鈕，並提供清空和複製功能
 * @returns {React.FC} 返回一個 React 函數組件
 */
export const ControlPanel: FC = () => {
  const clipboard = useClipboard({ timeout: 500 })
  const { weightTextList, setState, thisState } = useControlPanel()

  /**
   * @description 當清空按鈕被點擊時，重新產生一個新的 MixerItem 陣列，並更新狀態
   */
  const handleClearClick = () => {
    const newList: MixerItem[] = _.map(thisState.itemList, (item) => ({ id: item.id, groupID: '', weight: 0 }))
    setState({ itemList: newList })
  }

  /**
   * @description 當複製按鈕被點擊時，調用 mixAll 函數將 weightTextList 轉換為字串後複製到剪貼簿中
   */
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
          Copy
        </Button>
      </Group>
    </Paper>
  )
}

/**
 * @description 將提供的 WeightText 陣列轉換為字串，依據每個元素的 weight 屬性，在文字前後加上對應數量的括號，再以逗號分隔成一個字串
 * @param {WeightText[]} weightTextList - 一個由 WeightText 物件組成的陣列，每個物件都有 text 和 weight 屬性
 * @returns {string} 返回轉換後的字串
 */
const mixAll = (weightTextList: WeightText[]): string => {
  const result = _(weightTextList)
    .filter((item) => !_.isEmpty(item.text))
    .map(({ text, weight }) => `${_.repeat('(', weight)}${text}${_.repeat(')', weight)}`)
    .join(`,\n`)
  return result
}
