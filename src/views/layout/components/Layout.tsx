import { AppShell, Navbar } from '@mantine/core'
import React, { FC, ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
interface Main {
  main: { backgroundColor: string }
}
interface DemoItemProp {
  children: ReactNode
}
export const Layout: FC = () => {
  return (
    <>
      <DemoItem>
        <Outlet />
      </DemoItem>
    </>
  )
}
const DemoItem: FC<DemoItemProp> = (prop: DemoItemProp) => {
  return (
    <AppShell
      padding='md'
      navbar={
        <Navbar width={{ base: 60 }} height='100%' p='xs'>
          {/* Navbar content */}
        </Navbar>
      }
      styles={(theme): Main => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      {prop.children}
    </AppShell>
  )
}
