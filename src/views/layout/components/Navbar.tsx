import { RD } from '@/core'
import { SFIcon } from '@/views/shared/SFIcon'
import { ActionIcon, Box, Center, Flex, Navbar as MNavBar } from '@mantine/core'
import React, { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom'
interface IconItemProps {
  to?: string
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
            <SFIcon icon='faInfo' />
          </IconWrapper>
          <IconWrapper to={EDITOR_ARTICLE}>
            <SFIcon icon='faBarChart' />
          </IconWrapper>
          <IconWrapper to={EDITOR_PROMPT}>
            <SFIcon icon='faCode' />
          </IconWrapper>
          <IconWrapper>
            <SFIcon icon='faGear' />
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
      <LinkWrapper to={to}>
        <ActionIcon size='lg' variant='transparent'>
          {children}
        </ActionIcon>
      </LinkWrapper>
    </Center>
  )
}

const LinkWrapper: FC<IconItemProps> = ({ to, children }) => {
  return (
    <>
      {to && <Link to={to}>{children}</Link>}
      {!to && children}
    </>
  )
}
