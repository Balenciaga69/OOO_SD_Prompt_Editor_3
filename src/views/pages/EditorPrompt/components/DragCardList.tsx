import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Col, SimpleGrid } from '@mantine/core'
import _ from 'lodash'
import React, { FC, ReactElement, ReactNode, useState } from 'react'
import { PromptInfoCard } from './PromptInfoCard'

interface Props {
  children: ReactNode
  id: number
}

export const DragCardList: FC = () => {
  const [items, setItems] = useState([1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25])
  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event
    if (over && active && active.id !== over.id) {
      setItems((items) => {
        const oldIdx = items.indexOf(_.toNumber(active.id))
        const newIdx = items.indexOf(_.toNumber(over.id))
        return arrayMove(items, oldIdx, newIdx)
      })
    }
  }
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <SimpleGrid
          cols={5}
          className='DragCardListGrid'
          breakpoints={[
            { maxWidth: 'lg', cols: 4 },
            { maxWidth: 'md', cols: 3 },
            { maxWidth: 'sm', cols: 2 },
            { maxWidth: 'xs', cols: 1 },
          ]}
        >
          {_.map(items, (id) => (
            <SortableItemWrapper key={id} id={id}>
              <PromptInfoCard name={`mastersadasdasd ${id}`} />
            </SortableItemWrapper>
          ))}
        </SimpleGrid>
      </SortableContext>
    </DndContext>
  )
}
export function SortableItemWrapper({ id, children }: Props): ReactElement {
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
