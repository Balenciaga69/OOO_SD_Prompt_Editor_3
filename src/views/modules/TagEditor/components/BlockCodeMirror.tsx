import { simpleTagsToCode } from '@/utils/old-parser-from-angular'
import { Box, Button, Group, Paper } from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import { bindActionCreators } from '@reduxjs/toolkit'
import { dracula } from '@uiw/codemirror-theme-dracula'
import CodeMirror from '@uiw/react-codemirror'
import _ from 'lodash'
import React, { FC, useEffect } from 'react'
import { useTagEditor } from '../TagEditor.hook'
const useBlockCodeMirror = () => {
  const { dispatch, tagEditorActions, tagEditorState, currentAtomList } = useTagEditor()
  const { setInputText, submitInputText } = tagEditorActions
  const actionCreators = bindActionCreators({ setInputText, submitInputText }, dispatch)
  return { currentAtomList, tagEditorState, ...actionCreators }
}
export const BlockCodeMirror: FC = () => {
  return (
    <Box className='mh-100vh h-100vh'>
      <Box>
        <Box mb='md'>
          <ControlPanel />
        </Box>
        <CodePanel />
      </Box>
    </Box>
  )
}
const CodePanel: FC = () => {
  const { setInputText, tagEditorState, currentAtomList } = useBlockCodeMirror()
  const { inputText } = tagEditorState
  useEffect(() => {
    const updatedInputText = simpleTagsToCode(currentAtomList, 'split')
    setInputText({ inputText: updatedInputText })
  }, [currentAtomList])
  const defaultText = `(masterpiece:1.2),((ultra-detail)),[1Girl]...`
  const maxHeight = 'calc(100vh - 24px)'
  return <CodeMirror value={inputText} placeholder={defaultText} maxHeight={maxHeight} onChange={(text) => setInputText({ inputText: text })} theme={dracula} />
}
const ControlPanel: FC = () => {
  const clipboard = useClipboard({ timeout: 500 })
  const { setInputText, submitInputText, currentAtomList, tagEditorState } = useBlockCodeMirror()
  const { inputText } = tagEditorState
  const handleSplitClick = () => {
    const nextText = simpleTagsToCode(currentAtomList, 'split')
    setInputText({ inputText: nextText })
  }
  const handleUnderScoreClick = () => {
    const nextText = _.replace(inputText, /[^\S\n]/g, '_')
    setInputText({ inputText: nextText })
  }
  const handleTrimClick = () => {
    const nextText = simpleTagsToCode(currentAtomList, 'zip')
    setInputText({ inputText: nextText })
  }
  const handleRefreshClick = () => {
    submitInputText()
  }
  const handleCopyCodeClick = () => {
    clipboard.copy(inputText)
  }
  return (
    <Paper radius='xl' p='sm'>
      <Group>
        <Button variant='filled' w='7rem' radius='xl' color='gray' onClick={handleSplitClick}>
          Split
        </Button>
        <Button variant='filled' w='7rem' radius='xl' color='gray' onClick={handleTrimClick}>
          Trim
        </Button>
        <Button variant='filled' w='7rem' radius='xl' color='gray' onClick={handleUnderScoreClick}>
          UnderLine
        </Button>
        <Button variant='filled' w='7rem' radius='xl' color='gray' onClick={handleCopyCodeClick}>
          CopyCode
        </Button>
        <Button ml='auto' variant='filled' w='6rem' radius='xl' color='yellow' onClick={handleRefreshClick}>
          Refresh
        </Button>
      </Group>
    </Paper>
  )
}
