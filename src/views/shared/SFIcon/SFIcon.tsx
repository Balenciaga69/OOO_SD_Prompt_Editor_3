import * as faIcons from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import React, { FC } from 'react'
type Icon = keyof typeof faIcons

interface Props {
  icon: Icon
  iconProps?: Omit<FontAwesomeIconProps, 'icon'>
}

export const SFIcon: FC<Props> = ({ icon, iconProps }: Props) => {
  return <FontAwesomeIcon {...iconProps} icon={faIcons[icon] as never} />
}
