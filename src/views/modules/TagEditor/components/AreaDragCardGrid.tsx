import { RootState } from '@/core'
import { tagBlockSlice, tagSlice } from '@/core/slices'
import { Tag, TagBlock } from '@/interfaces/core.interface'
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button, SimpleGrid } from '@mantine/core'
import { bindActionCreators } from '@reduxjs/toolkit'
import _ from 'lodash'
import React, { FC, ReactElement, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTagEditor } from '../useTagEditor'
import { TagCard } from './TagCard'

const useAreaDragCardGrid = () => {
  const { dispatch } = useTagEditor()
  const { updateOne: updateBlock } = tagBlockSlice.actions
  const { updateOne: updateTag } = tagSlice.actions
  const tagDict = useSelector((state: RootState) => state.shared.tag.entities)
  const actionCreators = bindActionCreators({ updateTag, updateBlock }, dispatch)
  return { ...actionCreators, tagDict }
}
interface Props {
  tagBlock: TagBlock
}
export const AreaDragCardGrid: FC<Props> = (props) => {
  const { tagBlock } = props
  const { updateBlock, tagDict } = useAreaDragCardGrid()
  const currTagList = useMemo(() => _.compact(_.map(tagBlock.tagIDs, (id) => tagDict[id])), [tagBlock, tagDict])
  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event
    if (over && active && active.id !== over.id) {
      const oldIdx = _.findIndex(currTagList, ['id', active.id])
      const newIdx = _.findIndex(currTagList, ['id', over.id])
      const newItems = arrayMove(currTagList, oldIdx, newIdx)
      const IDs = _.map(newItems, 'id')
      updateBlock({ id: tagBlock.id, changes: { tagIDs: IDs } })
    }
  }
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={currTagList} strategy={rectSortingStrategy}>
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
          {_.map(currTagList, (tag) => (
            <SortableItemWrapper key={tag.id} id={tag.id}>
              <TagCard tag={tag} />
            </SortableItemWrapper>
          ))}
        </SimpleGrid>
      </SortableContext>
    </DndContext>
  )
}
interface SortableItemWrapperProps {
  children: ReactNode
  id: string
}
export function SortableItemWrapper({ id, children }: SortableItemWrapperProps): ReactElement {
  const { setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const className = isDragging ? 'dragging' : ''
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  return (
    <div className={className} ref={setNodeRef} style={style}>
      {children}
    </div>
  )
}
