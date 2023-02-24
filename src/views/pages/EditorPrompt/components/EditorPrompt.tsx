import React, { FC } from 'react'
import { BlockBadgeDnd } from './BlockBadgeDnd'
import { Box } from '@mantine/core'

export const EditorPrompt: FC = () => {
  return (
    <Box>
      <BlockBadgeDnd />
      <BlockBadgeDnd />
    </Box>
  )
}
