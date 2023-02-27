import { useMyLocal } from '@/core'
import { AppShell, Box } from '@mantine/core'
import React, { FC, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { NavBar } from './NavBar'

interface Main {
  main: { backgroundColor: string }
}
const useLayout = () => {
  const { load } = useMyLocal()
  useEffect(() => {
    load()
  }, [])
}
export const Layout: FC = () => {
  useLayout()
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
        <Box className='z-100 position-relative overflow-hidden' bg='dark'>
          <Outlet />
        </Box>
      </AppShell>
    </>
  )
}
