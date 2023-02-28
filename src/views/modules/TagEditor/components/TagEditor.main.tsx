import { Box } from '@mantine/core'
import { bindActionCreators } from '@reduxjs/toolkit'
import React, { FC, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import '../TagEditor.scss'
import { useTagEditor } from '../useTagEditor'
import { BlockCodeMirror } from './BlockCodeMirror'
import { BlockTagVisual } from './BlockTagVisual'
const useHook = () => {
  const { dispatch, myActions } = useTagEditor()
  const { initTagEditor } = myActions
  const actionCreators = bindActionCreators({ initTagEditor }, dispatch)
  useEffect(() => {
    actionCreators.initTagEditor()
  }, [])
}
export const TagEditor: FC = () => {
  useHook()
  const location = useLocation()
  const codeRef = useRef<HTMLDivElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!codeRef.current || !visualRef.current) return
    if (location.hash === '#editor') {
      codeRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    if (location.hash === '#visual') {
      visualRef.current.scrollIntoView({ behavior: 'smooth' })
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
