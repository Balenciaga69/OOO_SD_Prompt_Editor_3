import { useSortable } from '@dnd-kit/sortable'
import React, { ReactNode, ReactElement } from 'react'
import { CSS } from '@dnd-kit/utilities'

interface SSortableItemWrapperProps {
  children: ReactNode
  id: string | number
}

/**
 * 這是一個可拖曳排序元素的包裹器組件，用於將子元素包裝成可拖曳的元素。
 * 它會監聽子元素的拖動事件，然後根據拖動的位置改變元素的樣式。
 * 如果元素正在被拖動，則會添加一個"dragging"的CSS類名，以改變元素的樣式。
 * 使用useSortable hook來監聽子元素的拖動事件，並返回一些需要用到的參數和方法。
 * 接受兩個props: id和children。id用於識別該元素，children為該元素的子元素。
 * 返回一個div元素，類名和樣式根據拖動狀態而定，並將子元素包裝在其中。
 */
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
