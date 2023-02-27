import { SFIcon } from '@/views/shared/SFIcon'
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { ActionIcon, Box } from '@mantine/core'
import { bindActionCreators } from '@reduxjs/toolkit'
import { KeenSliderPlugin, useKeenSlider } from 'keen-slider/react'
import _ from 'lodash'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { useTagEditor } from '../useTagEditor'
import { CarouselItem } from './CarouselItem'

const MutationPlugin: KeenSliderPlugin = (slider) => {
  const config = { childList: true }

  const observer = new MutationObserver(function (mutations) {
    _.forEach(mutations, () => slider.update())
  })
  slider.on('created', () => {
    observer.observe(slider.container, config)
  })
  slider.on('destroyed', () => {
    observer.disconnect()
  })
}

const carouselPlugin: KeenSliderPlugin = (slider) => {
  slider.on('detailsChanged', detailsChanged)
  function detailsChanged(): void {
    const slideCount = slider.slides.length

    const z = slideCount * 300

    const containerDeg = 360 * slider.track.details.progress

    const slideDeg = 360 / slideCount
    slider.container.style.transform = `translateZ(-${z}px) rotateY(${-containerDeg}deg)`
    _.forEach(slider.slides, (slide, i) => {
      const slideRotation = slideDeg * i
      slide.style.transform = `rotateY(${slideRotation}deg) translateZ(${z}px)`
    })
  }
}

const useKeen3DCarousel = () => {
  const { allTagBlock, myActions, dispatch, myState } = useTagEditor()
  const { setState } = myActions
  const actionCreators = bindActionCreators({ setState }, dispatch)
  return { allTagBlock, ...actionCreators, myState }
}

export const Keen3DCarousel: FC = () => {
  const { allTagBlock, setState } = useKeen3DCarousel()
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      selector: '.carousel__cell',
      renderMode: 'custom',
      mode: 'snap',
      drag: false,
      initial: 0,
      detailsChanged(slider) {
        setRel(slider.track.details.rel)
      },
    },
    [carouselPlugin, MutationPlugin]
  )
  const changeSlide = (dir: 'left' | 'right'): void => {
    dir === 'left' ? instanceRef.current?.prev() : instanceRef.current?.next()
  }
  const [rel, setRel] = useState(0)
  useEffect(() => {
    if (allTagBlock[rel]) {
      const blockID = allTagBlock[rel].id
      setState({ blockID })
    }
  }, [allTagBlock, rel])
  return (
    <Box className='wrapper Keen3DCarousel'>
      <Box className='scene'>
        {allTagBlock.length > 1 && <IconBoxes changeSlide={changeSlide} />}
        <div className='keen-slider' ref={sliderRef}>
          {_.map(allTagBlock, (tagBlock, i) => (
            <div key={i} className='carousel__cell'>
              <CarouselItem tagBlock={tagBlock} />
            </div>
          ))}
        </div>
      </Box>
    </Box>
  )
}
interface IconBoxesProps {
  changeSlide: (dir: 'left' | 'right') => void
}
const IconBoxes: FC<IconBoxesProps> = (props) => {
  const { changeSlide } = props
  const iconProps: Omit<FontAwesomeIconProps, 'icon'> = { size: '3x', className: 'pointer', opacity: 0.5 }
  return (
    <>
      <Box className='left'>
        <ActionIcon variant='transparent' radius='xl' size='xl' onClick={() => changeSlide('left')}>
          <SFIcon icon='faChevronLeft' iconProps={iconProps} />
        </ActionIcon>
      </Box>
      <Box className='right'>
        <ActionIcon variant='transparent' radius='xl' size='xl' onClick={() => changeSlide('right')}>
          <SFIcon icon='faChevronRight' iconProps={iconProps} />
        </ActionIcon>
      </Box>
    </>
  )
}
