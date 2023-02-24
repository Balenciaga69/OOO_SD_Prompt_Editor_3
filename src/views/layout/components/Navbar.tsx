import { RD } from '@/core'
import { SFIcon } from '@/views/shared/SFIcon'
import { ActionIcon, Box, Center, Flex, Navbar as MNavBar, Text } from '@mantine/core'
import React, { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { HorizontalLogo } from './HorizontalLogo'
interface IconItemProps {
  to: string
  children: ReactNode
}
export const NavBar: FC = () => {
  const { W } = RD.STYLE.NAV_BAR
  const { EDITOR_PROMPT, EDITOR_ARTICLE, INTRO } = RD.PAGE_LINK
  const { GITHUB_WHITE } = RD.IMG
  const { GITHUB_URL } = RD.AUTHOR
  return (
    <MNavBar width={{ base: W }} height='100%' py='md' px='md'>
      <Flex direction='column' gap='md'>
        <Box className='text-center'>
          <IconWrapper to={INTRO}>
            <SFIcon icon='faLightbulb' />
          </IconWrapper>
          <IconWrapper to={EDITOR_ARTICLE}>
            <SFIcon icon='faThLarge' />
          </IconWrapper>
          <IconWrapper to={EDITOR_PROMPT}>
            <SFIcon icon='faCode' />
          </IconWrapper>
        </Box>
      </Flex>
      <Box mt='auto'>
        <IconWrapper to={GITHUB_URL}>
          <img width='100%' src={GITHUB_WHITE} alt='github-icon' />
        </IconWrapper>
      </Box>
    </MNavBar>
  )
}
const IconWrapper: FC<IconItemProps> = ({ to, children }) => {
  return (
    <Center mt='lg'>
      <Link to={to}>
        <ActionIcon size='lg' variant='transparent'>
          {children}
        </ActionIcon>
      </Link>
    </Center>
  )
}
