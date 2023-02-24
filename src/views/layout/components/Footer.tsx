import { RD } from '@/core'
import { Box, Center, Text, Container, Flex, Grid, Footer as MFooter } from '@mantine/core'
import React, { FC } from 'react'
import { HorizontalLogo } from './HorizontalLogo'

export const Footer: FC = () => {
  const { H } = RD.STYLE.FOOTER
  return (
    <MFooter className='footer z-0' height={H}>
      <Container size='xl' h='100%'>
        <Grid grow gutter='xs' h='100%' py='lg'>
          <Grid.Col lg={3} xs={6} />
          <Grid.Col lg={3} xs={6} />
          <Grid.Col lg={3} xs={6} />
          <Grid.Col lg={3} xs={6}>
            <Flex direction='column' justify='center' align='end'>
              <HorizontalLogo />
              <Text mt='xs' fz='xs' c='gray'>
                ©2023 Emilio Gonzales
              </Text>
            </Flex>
          </Grid.Col>
        </Grid>
      </Container>
    </MFooter>
  )
}
