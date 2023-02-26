import { Box } from '@mantine/core'
import React, { FC, useEffect, useRef } from 'react'
import { BlockCodeMirror } from './BlockCodeMirror'
import { BlockTagVisual } from './BlockTagVisual'
import '../TagEditor.scss'
import { useLocation } from 'react-router-dom'

export const TagEditor: FC = () => {
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
