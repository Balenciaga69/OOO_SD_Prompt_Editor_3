import { Box, Button, Group, Paper } from '@mantine/core'
import { bindActionCreators } from '@reduxjs/toolkit'
import { dracula } from '@uiw/codemirror-theme-dracula'
import CodeMirror from '@uiw/react-codemirror'
import _ from 'lodash'
import React, { FC, useEffect } from 'react'
import { useTagEditor } from '../TagEditor.hook'
import { useClipboard, useDebouncedState } from '@mantine/hooks'
import { simpleTagsToCode } from '@/utils/old-parser-from-angular'
const useBlockCodeMirror = () => {
  const { dispatch, thisActions, thisState } = useTagEditor()
  const { setState, submitCode } = thisActions
  const actionCreators = bindActionCreators({ setState, submitCode }, dispatch)
  return { thisState, ...actionCreators }
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
  const { setState, thisState } = useBlockCodeMirror()
  const { atomList, inputText } = thisState
  const [debText, setDebText] = useDebouncedState(inputText, 200)
  /**
   * fix update input freq issue
   */
  // useEffect(() => {
  //   setState({ inputText: debText })
  // }, [debText])
  // useEffect(() => {
  //   setDebText(inputText)
  // }, [inputText])
  /**
   * auto input atom list to code
   */
  useEffect(() => {
    const nextText = simpleTagsToCode(atomList, 'split')
    setState({ inputText: nextText })
  }, [atomList])
  const defaultText = `(masterpiece:1.2),((ultra-detail)),[1Girl]...`
  const maxHeight = 'calc(100vh - 24px)'
  return <CodeMirror value={inputText} placeholder={defaultText} maxHeight={maxHeight} onChange={(text) => setState({ inputText: text })} theme={dracula} />
}
const ControlPanel: FC = () => {
  const clipboard = useClipboard({ timeout: 500 })
  const { setState, submitCode, thisState } = useBlockCodeMirror()
  const { atomList, inputText } = thisState
  const handleSplitClick = () => {
    const nextText = simpleTagsToCode(atomList, 'split')
    setState({ inputText: nextText })
  }
  const handleUnderScoreClick = () => {
    const nextText = _.replace(inputText, /[^\S\n]/g, '_')
    setState({ inputText: nextText })
  }
  const handleTrimClick = () => {
    const nextText = simpleTagsToCode(atomList, 'zip')
    setState({ inputText: nextText })
  }
  const handleRefreshClick = () => {
    submitCode()
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
