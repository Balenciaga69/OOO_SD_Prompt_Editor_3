import { Tooltip } from '@mantine/core'
import React, { ReactNode } from 'react'
import { FC } from 'react'
interface Props {
  label: string
  children: ReactNode
}
export const SToolTip: FC<Props> = (props) => {
  const { label, children } = props
  return (
    <Tooltip zIndex={9999} withArrow label={label}>
      {children}
    </Tooltip>
  )
}
