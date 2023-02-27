import { RD } from '@/core'
import { Flex, List, Footer as MFooter, Text } from '@mantine/core'
import React, { FC } from 'react'
import { HorizontalLogo } from './HorizontalLogo'
import { Link } from 'react-router-dom'

export const Footer: FC = () => {
  const { H } = RD.STYLE.FOOTER
  const { AUTHOR_NAME, GITHUB_URL, ABOUT_ME, INSTAGRAM, VERSION_1, VERSION_2 } = RD.AUTHOR
  return (
    <MFooter className='footer z-0' height={H}>
      <Flex justify='stretch' align='center' h='100%'>
        <Flex maw={900} h='100%' w='100%' justify='space-around' align='center' wrap='wrap' className='ms-md-5 ms-2 '>
          <Link to={INSTAGRAM}>
            <Text c='gray'>Instagram</Text>
          </Link>
          <Link to={ABOUT_ME}>
            <Text c='gray'>About Me</Text>
          </Link>
          <Link to={VERSION_1}>
            <Text c='gray'>Version 1</Text>
          </Link>
          <Link to={VERSION_2}>
            <Text c='gray'>Version 2</Text>
          </Link>
        </Flex>
        <Flex h='100%' direction='column' justify='center' align='center' className='me-md-5 me-2 ms-auto '>
          <HorizontalLogo />
          <Link to={GITHUB_URL}>
            <Text mt='xs' fz='xs' c='gray'>
              ©2023 {AUTHOR_NAME}
            </Text>
          </Link>
        </Flex>
      </Flex>
    </MFooter>
  )
}
