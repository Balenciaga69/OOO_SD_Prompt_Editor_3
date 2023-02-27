import { Box, Button, Group, Paper } from '@mantine/core'
import { bindActionCreators } from '@reduxjs/toolkit'
import { dracula } from '@uiw/codemirror-theme-dracula'
import CodeMirror from '@uiw/react-codemirror'
import _ from 'lodash'
import React, { FC, useEffect } from 'react'
import { useTagEditor } from '../useTagEditor'
import { useClipboard, useDebouncedState } from '@mantine/hooks'
import { simpleTagsToCode } from '@/utils/old-parser-from-angular'
const useBlockCodeMirror = () => {
  const { dispatch, myActions, myState, currTagList } = useTagEditor()
  const { blockID, code } = myState
  const { setState, submitCode } = myActions
  const actionCreators = bindActionCreators({ setState, submitCode }, dispatch)

  return { blockID, currTagList, code, ...actionCreators }
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
  const { setState, code, currTagList } = useBlockCodeMirror()
  const [debCode, setDebCode] = useDebouncedState(code, 200)
  useEffect(() => {
    setState({ code: debCode })
  }, [debCode])
  useEffect(() => {
    setDebCode(code)
  }, [code])
  useEffect(() => {
    // when block changed , update code state
    const nextCode = simpleTagsToCode(currTagList, 'split')
    setDebCode(nextCode)
  }, [currTagList])
  const defaultText = `(masterpiece:1.2),((ultra-detail)),[1Girl]...`
  const maxHeight = 'calc(100vh - 24px)'
  return <CodeMirror value={debCode} placeholder={defaultText} maxHeight={maxHeight} onChange={setDebCode} theme={dracula} />
}
const ControlPanel: FC = () => {
  const clipboard = useClipboard({ timeout: 500 })
  const { setState, code, submitCode, currTagList } = useBlockCodeMirror()
  const handleSplitClick = () => {
    const nextCode = simpleTagsToCode(currTagList, 'split')
    setState({ code: nextCode })
  }
  const handleUnderScoreClick = () => {
    const nextCode = _.replace(code, /[^\S\n]/g, '_')
    setState({ code: nextCode })
  }
  const handleTrimClick = () => {
    const nextCode = simpleTagsToCode(currTagList, 'zip')
    setState({ code: nextCode })
  }
  const handleRefreshClick = () => {
    submitCode()
  }
  const handleCopyCodeClick = () => {
    clipboard.copy(code)
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
