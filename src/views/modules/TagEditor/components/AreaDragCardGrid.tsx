import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SimpleGrid } from '@mantine/core'
import React, { FC, ReactElement, ReactNode, useEffect, useMemo, useState } from 'react'
import { TagCard } from './TagCard'
import { useTagEditor } from '../useTagEditor'
import { bindActionCreators } from '@reduxjs/toolkit'
import { tagBlockSlice, tagSlice } from '@/core/slices'
import { Tag, TagBlock } from '@/interfaces/core.interface'
import _ from 'lodash'
import { useSelector } from 'react-redux'
import { RootState } from '@/core'
const useAreaDragCardGrid = () => {
  const { dispatch } = useTagEditor()
  const { updateOne: updateBlock } = tagBlockSlice.actions
  const { updateOne: updateTag } = tagSlice.actions
  const tagDict = useSelector((state: RootState) => state.shared.tag.entities)
  const actionCreators = bindActionCreators({ updateTag, updateBlock }, dispatch)
  const allTag = _.filter(tagDict, (e) => !_.isNil(e)) as Tag[]
  return { allTag, ...actionCreators }
}
interface Props {
  tagBlock: TagBlock
}
export const AreaDragCardGrid: FC<Props> = (props) => {
  const { tagBlock } = props
  const { updateBlock, allTag } = useAreaDragCardGrid()
  const getTagCurrIDs = () => _.filter(allTag, (tag) => _.includes(tagBlock.tagIDs, tag.id))
  const [items, setItems] = useState(getTagCurrIDs())
  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event
    if (over && active && active.id !== over.id) {
      const oldIdx = _.findIndex(items, ['id', active.id])
      const newIdx = _.findIndex(items, ['id', over.id])
      const newItems = arrayMove(items, oldIdx, newIdx)
      const IDs = _.map(newItems, 'id')
      updateBlock({ id: tagBlock.id, changes: { tagIDs: IDs } })
      setItems(newItems)
    }
  }
  useEffect(() => {
    setItems(getTagCurrIDs())
  }, [allTag.length])
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={rectSortingStrategy}>
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
          {_.map(items, (tag) => (
            <SortableItemWrapper key={tag.id} id={tag.id}>
              <TagCard name={tag.title} />
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const className = isDragging ? 'dragging' : ''
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  return (
    <div className={className} ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}
