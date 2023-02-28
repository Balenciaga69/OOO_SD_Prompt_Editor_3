import { Box } from '@mantine/core'
import React, { FC } from 'react'
import { useTagEditor } from '../TagEditor.hook'
import { Keen3DCarousel } from './Keen3DCarousel'

export const BlockTagVisual: FC = () => {
  const { allGroupList } = useTagEditor()
  return (
    <Box py='xl' h='100%'>
      {allGroupList.length && <Keen3DCarousel />}
    </Box>
  )
}
