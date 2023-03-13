import { simpleTagsToCode } from '@/utils/old-parser-from-angular'
import { Box, Button, Flex, Group, Paper, Text } from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import { bindActionCreators } from '@reduxjs/toolkit'
import { dracula } from '@uiw/codemirror-theme-dracula'
import CodeMirror from '@uiw/react-codemirror'
import _ from 'lodash'
import React, { FC, useEffect } from 'react'
import { useTagEditor } from '../TagEditor.hook'

/*
 * 此函數為使用 Block CodeMirror 編輯器的 Hook。
 */
const useBlockCodeMirror = () => {
  const { dispatch, tagEditorActions, tagEditorState, currentAtomList } = useTagEditor()
  const { setInputText, submitInputText, setPrevInputText } = tagEditorActions
  const actionCreators = bindActionCreators({ setInputText, setPrevInputText, submitInputText }, dispatch)
  const setNextInputText = (text: string) => {
    actionCreators.setInputText({ inputText: text })
    actionCreators.setPrevInputText({ prevInputText: text })
  }
  return { setNextInputText, currentAtomList, tagEditorState, ...actionCreators }
}

/*
 * 顯示程式碼區塊以及控制面板，並將當前的 Atom List 轉換為程式碼文字輸入框的內容
 * 使用 useBlockCodeMirror hook 取得 currentAtomList 和 setNextInputText，並在 useEffect 中執行轉換邏輯
 * 返回程式碼區塊和控制面板組件的容器 Box
 */
export const BlockCodeMirror: FC = () => {
  const { currentAtomList, setNextInputText } = useBlockCodeMirror()

  useEffect(() => {
    const updatedInputText = simpleTagsToCode(currentAtomList, 'split')
    setNextInputText(updatedInputText)
  }, [currentAtomList])

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

/*
 * 程式碼區塊組件，用於顯示程式碼及編輯
 */
const CodePanel: FC = () => {
  const { setInputText, tagEditorState } = useBlockCodeMirror()
  const { inputText } = tagEditorState
  const defaultText = `(masterpiece:1.2),((ultra-detail)),[1Girl]...`
  const maxHeight = 'calc(100vh - 24px)'
  return <CodeMirror value={inputText} placeholder={defaultText} maxHeight={maxHeight} onChange={(text) => setInputText({ inputText: text })} theme={dracula} />
}

/*
 * 控制面板
 * 用於顯示並處理編輯器的一些操作，包括將標籤轉成程式碼、加底線、切割和複製等等。
 */
const ControlPanel: FC = () => {
  const clipboard = useClipboard({ timeout: 500 })
  const { submitInputText, currentAtomList, tagEditorState, setNextInputText } = useBlockCodeMirror()
  const { inputText, prevInputText } = tagEditorState

  const handleSplitClick = () => {
    const nextText = simpleTagsToCode(currentAtomList, 'split')
    setNextInputText(nextText)
  }

  const handleUnderScoreClick = () => {
    const nextText = _.trim(_.replace(inputText, /[^\S\n]/g, '_'))
    setNextInputText(nextText)
  }

  const handleMinClick = () => {
    const nextText = simpleTagsToCode(currentAtomList, 'zip')
    setNextInputText(nextText)
  }

  const handleRefreshClick = () => {
    submitInputText()
  }

  const handleCopyCodeClick = () => {
    clipboard.copy(inputText)
  }

  const isSameInputText = () => {
    return prevInputText === inputText
  }

  const getDangerColor = () => {
    return isSameInputText() ? undefined : 'red'
  }

  return (
    <Paper radius='xl' p='sm'>
      <Group>
        <Button variant='filled' w='7rem' radius='xl' color='gray' onClick={handleSplitClick}>
          <Text color={getDangerColor()}>Split</Text>
        </Button>
        <Button variant='filled' w='7rem' radius='xl' color='gray' onClick={handleMinClick}>
          <Text color={getDangerColor()}>Min</Text>
        </Button>
        <Button variant='filled' w='7rem' radius='xl' color='gray' onClick={handleUnderScoreClick}>
          UnderLine
        </Button>
        <Button variant='filled' w='7rem' radius='xl' color='gray' onClick={handleCopyCodeClick}>
          CopyCode
        </Button>
        <Flex ml='auto' align='center'>
          <Text color='red' mx='md'>
            {isSameInputText() ? '' : '* Not Yet Refresh'}
          </Text>
          <Button variant='filled' w='6rem' radius='xl' color='yellow' onClick={handleRefreshClick}>
            Refresh
          </Button>
        </Flex>
      </Group>
    </Paper>
  )
}
