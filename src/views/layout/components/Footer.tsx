import { RD } from '@/core'
import { Flex, Footer as MFooter, Text } from '@mantine/core'
import React, { FC } from 'react'
import { HorizontalLogo } from './HorizontalLogo'
import { Link } from 'react-router-dom'

export const Footer: FC = () => {
  const { H } = RD.STYLE.FOOTER
  const { AUTHOR_NAME, GITHUB_URL } = RD.AUTHOR
  return (
    <MFooter className='footer z-0' height={H}>
      <Flex h='100%' direction='column' justify='center' align='end' className='me-md-5 me-2'>
        <HorizontalLogo />
        <Link to={GITHUB_URL}>
          <Text mt='xs' fz='xs' c='gray'>
            ©2023 {AUTHOR_NAME}
          </Text>
        </Link>
      </Flex>
    </MFooter>
  )
}
