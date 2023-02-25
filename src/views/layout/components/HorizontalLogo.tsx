import { RD } from '@/core'
import { Box, Code } from '@mantine/core'
import React, { FC } from 'react'
import { Link } from 'react-router-dom'

export const HorizontalLogo: FC = () => {
  const { WIDE_LOGO } = RD.IMG

  const { INTRO } = RD.PAGE_LINK

  const { UPDATE_VERSION } = RD.AUTHOR
  return (
    <Link to={INTRO}>
      <Box className='pointer'>
        <Box className='text-center'>
          <img src={WIDE_LOGO} alt='logo' width={100} />
        </Box>
        <Code className='text-nowrap'>更新:{UPDATE_VERSION}</Code>
      </Box>
    </Link>
  )
}
