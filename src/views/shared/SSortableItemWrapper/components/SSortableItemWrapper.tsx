import { useSortable } from '@dnd-kit/sortable'
import React, { ReactNode, ReactElement } from 'react'
import { CSS } from '@dnd-kit/utilities'

interface SSortableItemWrapperProps {
  children: ReactNode
  id: string | number
}
export function SSortableItemWrapper({ id, children }: SSortableItemWrapperProps): ReactElement {
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
