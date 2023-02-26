import { RD } from '@/core'
import { AppState } from '@/interfaces/core.interface'
import { Box, Button, Group, Paper } from '@mantine/core'
import { dracula } from '@uiw/codemirror-theme-dracula'
import CodeMirror from '@uiw/react-codemirror'
import React, { FC, useState } from 'react'
import { useStore } from 'react-redux'
const useHook = () => {
  const { getCodeEdgeError: getPromptEdgeError, getCodePairError: getPromptPairError } = RD.FUNCS.CODE_SYNTAX_CHECK
  const { modules, shared } = useStore<AppState>().getState()
}
export const BlockCodeMirror: FC = () => {
  useHook()
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
  const onChange = (value: string): void => {}
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
