import { Box } from '@mantine/core'
import React, { FC, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useTagEditor } from '../TagEditor.hook'
import '../TagEditor.scss'
import { BlockCodeMirror } from './BlockCodeMirror'
import { BlockTagVisual } from './BlockTagVisual'

/**
 * 用於初始化 TagEditor 的自訂 Hook
 */
const useHook = () => {
  const { dispatch, tagEditorActions } = useTagEditor()
  const { initialize } = tagEditorActions
  useEffect(() => {
    dispatch(initialize())
  }, [dispatch, initialize])
}

/**
 * 用於顯示 TagEditor 的 function component，包含 BlockTagVisual 和 BlockCodeMirror 元件
 * @returns {JSX.Element} 返回一個 React 元件，顯示 TagEditor 內容
 */
export const TagEditor: FC = () => {
  useHook()
  const location = useLocation()
  const codeRef = useRef<HTMLDivElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const { current: codeElement } = codeRef
    const { current: visualElement } = visualRef
    if (!codeElement || !visualElement) return
    if (location.hash === '#editor') {
      codeElement.scrollIntoView({ behavior: 'smooth' })
    }
    if (location.hash === '#visual') {
      visualElement.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location])
  return (
    <Box px='xl'>
      <Box className='h-100vh mh-100vh' ref={visualRef}>
        <BlockTagVisual />
      </Box>
      <Box className='h-100vh mh-100vh' ref={codeRef}>
        <BlockCodeMirror />
      </Box>
    </Box>
  )
}
