import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SimpleGrid } from '@mantine/core'
import _ from 'lodash'
import React, { FC, ReactElement, ReactNode, useState } from 'react'

interface Props {
  children?: ReactNode
  id: number
}
export const DragCardList: FC = () => {
  const [items, setItems] = useState([1, 2, 3])
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
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <SimpleGrid cols={4}>
          {_.map(items, (id) => (
            <SortableItemWrapper key={id} id={id} />
          ))}
        </SimpleGrid>
      </SortableContext>
    </DndContext>
  )
}
export function SortableItemWrapper({ id }: Props): ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {id}
    </div>
  )
}
