import { Box } from '@mantine/core'
import _ from 'lodash'
import React, { FC } from 'react'
import { useTagEditor } from '../useTagEditor'
import { Keen3DCarousel } from './Keen3DCarousel'
const useBlockTagVisual = () => {
  const { allTagBlock } = useTagEditor()
  return { allTagBlock }
}
export const BlockTagVisual: FC = () => {
  const { allTagBlock } = useBlockTagVisual()
  return (
    <Box py='xl' h='100%'>
      {allTagBlock.length && <Keen3DCarousel />}
    </Box>
  )
}
