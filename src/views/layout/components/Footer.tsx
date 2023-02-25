import { RD } from '@/core'
import { Container, Flex, Footer as MFooter, Text } from '@mantine/core'
import React, { FC } from 'react'
import { HorizontalLogo } from './HorizontalLogo'

export const Footer: FC = () => {
  const { H } = RD.STYLE.FOOTER
  return (
    <MFooter className='footer z-0' height={H}>
      <Container size='xl' h='100%'>
        <Flex h='100%' direction='column' justify='center' align='end'>
          <HorizontalLogo />
          <Text mt='xs' fz='xs' c='gray'>
            ©2023 Emilio Gonzales
          </Text>
        </Flex>
      </Container>
    </MFooter>
  )
}
