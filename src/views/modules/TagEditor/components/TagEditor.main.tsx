import { Box } from '@mantine/core'
import React, { FC, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useTagEditor } from '../TagEditor.hook'
import '../TagEditor.scss'
import { BlockCodeMirror } from './BlockCodeMirror'
import { BlockTagVisual } from './BlockTagVisual'
const useHook = () => {
  const { dispatch, thisActions } = useTagEditor()
  const { initTagEditor } = thisActions
  useEffect(() => {
    initTagEditor()
  }, [dispatch, initTagEditor])
}
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
