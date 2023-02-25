import { Box, Button, Group, Paper } from '@mantine/core'
import { dracula } from '@uiw/codemirror-theme-dracula'
import CodeMirror from '@uiw/react-codemirror'
import React, { FC, useCallback } from 'react'
export const PromptInputArea: FC = () => {
  return (
    <Box className='mh-100vh h-100vh'>
      <Box>
        <Box mb='md'>
          <ControlPaper />
        </Box>
        <CodeMr />
      </Box>
    </Box>
  )
}
const CodeMr: FC = () => {
  const onChange = useCallback((value: string, viewUpdate: unknown) => {
    console.log('value:', value)
  }, [])
  const defaultText = `(masterpiece:1.2),((ultra-detail)),[1Girl]...`
  const maxHeight = 'calc(100vh - 24px)'
  return <CodeMirror placeholder={defaultText} maxHeight={maxHeight} onChange={onChange} theme={dracula} />
}
const ControlPaper: FC = () => {
  return (
    <Paper radius='xl' p='sm'>
      <Group>
        <Button variant='filled' w='6rem' radius='xl' color='gray'>
          Split
        </Button>
        <Button variant='filled' w='6rem' radius='xl' color='gray'>
          Min
        </Button>
        <Button ml='auto' variant='filled' w='6rem' radius='xl' color='yellow'>
          Refresh
        </Button>
      </Group>
    </Paper>
  )
}
