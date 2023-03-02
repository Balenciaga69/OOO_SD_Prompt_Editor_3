import { TagGroup } from '@/interfaces/core.interface'
import { tagAtomSlice, tagGroupSlice } from '@/redux'
import { SSortableItemWrapper } from '@/views/shared/SSortableItemWrapper'
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable'
import { SimpleGrid } from '@mantine/core'
import { bindActionCreators } from '@reduxjs/toolkit'
import _ from 'lodash'
import React, { FC, useMemo } from 'react'
import { useTagEditor } from '../TagEditor.hook'
import { TagCard } from './TagCard'

const useAreaDragCardGrid = () => {
  const { dispatch, tagAtomEntities } = useTagEditor()
  const { updateOne: updateOneGroup } = tagGroupSlice.actions
  const { updateOne: updateOneAtom } = tagAtomSlice.actions
  const actionCreators = bindActionCreators({ updateOneAtom, updateOneGroup }, dispatch)
  return { ...actionCreators, tagAtomEntities }
}
interface Props {
  tagGroup: TagGroup
}
export const AreaDragCardGrid: FC<Props> = (props) => {
  const { tagGroup } = props
  const { updateOneGroup, tagAtomEntities } = useAreaDragCardGrid()
  const areaAtomList = useMemo(() => _.compact(_.map(tagGroup.atomIDs, (id) => tagAtomEntities[id])), [tagGroup, tagAtomEntities])
  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event
    if (over && active && active.id !== over.id) {
      const oldIdx = _.findIndex(areaAtomList, ['id', active.id])
      const newIdx = _.findIndex(areaAtomList, ['id', over.id])
      const newItems = arrayMove(areaAtomList, oldIdx, newIdx)
      const IDs = _.map(newItems, 'id')
      updateOneGroup({ id: tagGroup.id, changes: { atomIDs: IDs } })
    }
  }
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={areaAtomList} strategy={rectSortingStrategy}>
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
          {_.map(areaAtomList, (tag) => (
            <SSortableItemWrapper key={tag.id} id={tag.id}>
              <TagCard tagAtom={tag} />
            </SSortableItemWrapper>
          ))}
        </SimpleGrid>
      </SortableContext>
    </DndContext>
  )
}
