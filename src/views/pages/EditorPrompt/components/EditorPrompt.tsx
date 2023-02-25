import { Box } from '@mantine/core'
import React, { FC } from 'react'
import { PromptInputArea } from './PromptInputArea'
import { PromptVisualArea } from './PromptVisualArea'
import '../EditorPrompt.scss'
export const EditorPrompt: FC = () => {
  return (
    <Box>
      <Box className='h-100vh mh-100vh'>
        <PromptVisualArea />
      </Box>
      <Box className='h-100vh mh-100vh'>
        <PromptInputArea />
      </Box>
    </Box>
  )
}
