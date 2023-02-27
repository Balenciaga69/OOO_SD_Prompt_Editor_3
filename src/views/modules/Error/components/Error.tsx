import { Center, Text } from '@mantine/core'
import React, { FC } from 'react'

export const Error: FC = () => {
  return (
    <Center h='100vh'>
      <Text fz={80} fw='bolder'>
        ERROR
      </Text>
    </Center>
  )
}
