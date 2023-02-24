import { AppShell, Box } from '@mantine/core'
import React, { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { NavBar } from './Navbar'
import { Footer } from './Footer'
interface Main {
  main: { backgroundColor: string }
}
export const Layout: FC = () => {
  return (
    <>
      <AppShell
        padding={0}
        hidden={false}
        layout='alt'
        navbar={<NavBar />}
        footer={<Footer />}
        styles={(theme): Main => ({
          main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
        })}
      >
        <Box className='z-100 position-relative' bg='dark'>
          <Outlet />
        </Box>
      </AppShell>
    </>
  )
}
