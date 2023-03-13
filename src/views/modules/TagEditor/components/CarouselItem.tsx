import { TagGroup } from '@/interfaces/core.interface'
import { tagGroupSlice } from '@/redux'
import { SFIcon } from '@/views/shared/SFIcon'
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { ActionIcon, Box, Card, Input, ScrollArea, SimpleGrid, Skeleton } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { bindActionCreators, nanoid } from '@reduxjs/toolkit'
import _ from 'lodash'
import React, { FC, useEffect, useState } from 'react'
import { useTagEditor } from '../TagEditor.hook'
import { AreaDragCardGrid } from './AreaDragCardGrid'

interface CarouselItemProps {
  tagGroup: TagGroup
}

/*
 * 自訂 Hook，提供編輯標籤組的相關狀態和方法
 */
const useCarouselItem = () => {
  const { dispatch, tagGroupEntities, tagEditorState } = useTagEditor()
  const groupEntitiesLength = _.values(tagGroupEntities).length
  const actionCreators = bindActionCreators({ ...tagGroupSlice.actions }, dispatch)
  return { ...actionCreators, groupEntitiesLength, tagEditorState }
}

/*
 * 旋轉木馬項目，顯示標籤組內容，支援編輯、拖曳和刪除
 */
export const CarouselItem: FC<CarouselItemProps> = (props) => {
  const { tagGroup } = props
  const { tagEditorState } = useCarouselItem()
  const isCurrent = tagGroup.id === tagEditorState.groupID
  return (
    <Card h='100%' style={{ backgroundColor: '#1a1b1e60' }} withBorder className='CarouselItem overflow-visible'>
      {isCurrent && (
        <>
          <ScrollArea type='never' h='100%'>
            <NamingSection tagGroup={tagGroup} />
            <DragSection tagGroup={tagGroup} />
          </ScrollArea>
          <ActionSection tagGroup={tagGroup} />
        </>
      )}
      {!isCurrent && (
        <ScrollArea type='never' h='100%'>
          <SkeletonSection length={tagGroup.atomIDs.length} />
        </ScrollArea>
      )}
    </Card>
  )
}

/**
 * 用於命名標籤區塊的名稱，
 * 可以編輯並同步到 store 中。
 * 透過 useDebouncedValue 可以降低更新 store 的頻率。
 * @description
 * 使用 useState、useEffect、useCarouselItem 和 useDebouncedValue hooks 實作
 */
const NamingSection: FC<CarouselItemProps> = (props) => {
  const [title, setTitle] = useState(props.tagGroup.title)
  const { updateOne } = useCarouselItem()
  const [debounced] = useDebouncedValue(title, 200)

  // 降低更新store的頻率
  useEffect(() => {
    updateOne({ changes: { title }, id: props.tagGroup.id })
  }, [debounced])

  // 用於同步 title 狀態
  useEffect(() => {
    setTitle(props.tagGroup.title)
  }, [props.tagGroup.title])
  return (
    <Card.Section inheritPadding>
      <Input size='xl' fw='bolder' variant='unstyled' placeholder='My tag block name is...' maxLength={30} value={title} onChange={(e) => setTitle(e.target.value)} />
    </Card.Section>
  )
}

/**
 * 顯示可拖曳的標籤卡片列表
 */
const DragSection: FC<CarouselItemProps> = (props) => {
  const { tagGroup: tagGroup } = props
  return (
    <Card.Section inheritPadding className='flex-grow-1'>
      <AreaDragCardGrid tagGroup={tagGroup} />
    </Card.Section>
  )
}

/**
 * 顯示編輯標籤組的相關按鈕，包括新增、刪除
 */
const ActionSection: FC<CarouselItemProps> = (props) => {
  const { tagGroup } = props
  const { addOne, removeOne, groupEntitiesLength } = useCarouselItem()
  const handleAddClick = () => {
    const id = nanoid()
    addOne({ id, atomIDs: [], title: id })
  }
  const handleRemoveClick = () => {
    const removeID = tagGroup.id
    removeOne(removeID)
  }

  const iconProps: Omit<FontAwesomeIconProps, 'icon'> = { size: '2x', className: 'pointer' }
  return (
    <Box>
      {/* 顯示新增按鈕 */}
      {groupEntitiesLength < 10 && (
        <Box className='plus'>
          <ActionIcon variant='filled' radius='xl' size='xl' onClick={handleAddClick}>
            <SFIcon icon='faPlus' iconProps={iconProps} />
          </ActionIcon>
        </Box>
      )}
      {/* 顯示刪除按鈕 */}
      {groupEntitiesLength > 1 && (
        <Box className='minus'>
          <ActionIcon variant='filled' radius='xl' size='xl' onClick={handleRemoveClick}>
            <SFIcon icon='faMinus' iconProps={iconProps} />
          </ActionIcon>
        </Box>
      )}
    </Box>
  )
}

/**
 * 用於顯示骨架元素的 function component，根據 length 參數決定顯示骨架元素的數量
 */
const SkeletonSection: FC<{ length: number }> = (props) => {
  return (
    <SimpleGrid
      cols={6}
      className='AreaDragCardGrid'
      breakpoints={[
        { maxWidth: 'xl', cols: 5 },
        { maxWidth: 'lg', cols: 4 },
        { maxWidth: 'md', cols: 3 },
        { maxWidth: 'sm', cols: 2 },
        { maxWidth: 'xs', cols: 1 },
      ]}
    >
      {/* 顯示骨架元素 */}
      {_.times(_.min([props.length, 30]) ?? 0, (i) => (
        <Skeleton h={150} circle key={i} />
      ))}
    </SimpleGrid>
  )
}
