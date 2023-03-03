import { Box } from '@mantine/core'
import React, { FC } from 'react'
import { useTagEditor } from '../TagEditor.hook'
import { Keen3DCarousel } from './Keen3DCarousel'
import _ from 'lodash'

export const BlockTagVisual: FC = () => {
  const { tagGroupEntities } = useTagEditor()
  const groupEntitiesLength = _.values(tagGroupEntities).length
  return (
    <Box py='xl' h='100%'>
      {groupEntitiesLength > 0 && <Keen3DCarousel />}
    </Box>
  )
}
