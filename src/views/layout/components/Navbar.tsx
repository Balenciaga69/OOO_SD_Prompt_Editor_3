import { RD, useMyLocal } from '@/core'
import { GroupMixer } from '@/views/modules/GroupMixer'
import { SFIcon } from '@/views/shared/SFIcon'
import { SToolTip } from '@/views/shared/SToolTip'
import { ActionIcon, Box, Center, Flex, Navbar as MNavBar } from '@mantine/core'
import React, { FC, ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'

interface IconItemProps {
  to?: string
  children: ReactNode
  label?: string
  onClick?: () => void
}
export const Navbar: FC = () => {
  const { load, save } = useMyLocal()
  const { W } = RD.STYLE.NAV_BAR
  const { TAG_VISUAL, TAG_EDITOR } = RD.PAGE_LINK
  const { GITHUB_WHITE } = RD.IMG
  const { GITHUB_URL } = RD.AUTHOR
  const [openGroupMixer, setOpenGroupMixer] = useState(false)
  const TopBox: FC = () => (
    <>
      <GroupMixer opened={openGroupMixer} onClose={() => setOpenGroupMixer(false)} />
      <Box h={50} />
      <Box className='text-center'>
        <IconWrapper label='Grouping' onClick={() => setOpenGroupMixer(true)}>
          <SFIcon icon='faLayerGroup' />
        </IconWrapper>
        <IconWrapper label='Sorting' to={TAG_VISUAL}>
          <SFIcon icon='faChartSimple' />
        </IconWrapper>
        <IconWrapper label='Typing' to={TAG_EDITOR}>
          <SFIcon icon='faCode' />
        </IconWrapper>
        {/* <IconWrapper label='Setting'>
        <SFIcon icon='faGear' />
      </IconWrapper> */}
      </Box>
    </>
  )
  const BottomBox: FC = () => (
    <Box mt='auto'>
      <Box mb='xl'>
        <IconWrapper label='Save localStorage' onClick={save}>
          <SFIcon icon='faFileExport' />
        </IconWrapper>
        <IconWrapper label='Load LocalStorage' onClick={load}>
          <SFIcon icon='faFileImport' />
        </IconWrapper>
      </Box>
      <IconWrapper label='Repository' to={GITHUB_URL}>
        <img width='100%' src={GITHUB_WHITE} alt='github-icon' />
      </IconWrapper>
    </Box>
  )
  return (
    <MNavBar width={{ base: W }} height='100%' py='md' px='md' zIndex={200}>
      <Flex direction='column' gap='md'>
        <TopBox />
      </Flex>
      <BottomBox />
    </MNavBar>
  )
}

const IconWrapper: FC<IconItemProps> = ({ to, children, label = '', onClick }) => {
  return (
    <SToolTip label={label}>
      <Center mt='lg'>
        <LinkWrapper to={to}>
          <ActionIcon size='lg' variant='transparent' onClick={onClick}>
            {children}
          </ActionIcon>
        </LinkWrapper>
      </Center>
    </SToolTip>
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
