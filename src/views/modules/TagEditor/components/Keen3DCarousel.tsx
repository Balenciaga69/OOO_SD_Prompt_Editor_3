import { SFIcon } from '@/views/shared/SFIcon'
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { ActionIcon, Box } from '@mantine/core'
import { bindActionCreators } from '@reduxjs/toolkit'
import { KeenSliderPlugin, useKeenSlider } from 'keen-slider/react'
import _ from 'lodash'
import React, { FC, useEffect, useState } from 'react'
import { useTagEditor } from '../TagEditor.hook'
import { CarouselItem } from './CarouselItem'

/**
 * MutationPlugin 為KeenSlider的插件之一，用於監聽slider.container的DOM變化，
 * 並觸發slider.update()更新slider狀態。
 * @param {KeenSlider} slider - KeenSlider 實例
 */
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

/**
 * carouselPlugin 為KeenSlider的插件之一，用於實現3D旋轉的輪播效果，
 * 當slider的detailsChanged事件觸發時，會依據當前slider狀態進行更新。
 * @param {KeenSlider} slider - KeenSlider 實例
 */
const carouselPlugin: KeenSliderPlugin = (slider) => {
  slider.on('detailsChanged', detailsChanged)
  function detailsChanged(): void {
    const slideCount = slider.slides.length
    const z = slideCount * 320
    const containerDeg = 360 * slider.track.details.progress
    const slideDeg = 360 / slideCount
    slider.container.style.transform = `translateZ(-${z}px) rotateY(${-containerDeg}deg)`
    for (let i = 0; i < slider.slides.length; i++) {
      const slideRotation = slideDeg * i
      slider.slides[i].style.transform = `rotateY(${slideRotation}deg) translateZ(${z}px)`
    }
  }
}

/**
 * useKeen3DCarousel 為一個自定義hook，用於獲取與KeenSlider輪播效果相關的狀態和操作。
 * @returns {Object} 返回一個對象，包含 tagGroupList、tagEditorState 和 setGroupID 等狀態和操作。
 */
const useKeen3DCarousel = () => {
  const { tagEditorActions, dispatch, tagEditorState, tagGroupEntities } = useTagEditor()
  const { setGroupID } = tagEditorActions
  const actionCreators = bindActionCreators({ setGroupID }, dispatch)
  const tagGroupList = _.compact(_.values(tagGroupEntities))
  return { tagGroupList, tagEditorState, ...actionCreators }
}
/**
 * Keen3DCarousel 是一個React組件，用於實現基於KeenSlider的3D旋轉輪播效果，
 * 提供輪播的狀態和操作，包括changeSlide()函數和setGroupID()函數。
 * @returns {FC} 返回一個React組件
 */
export const Keen3DCarousel: FC = () => {
  const { setGroupID, tagEditorState, tagGroupList } = useKeen3DCarousel()
  const tagGroupListLength = tagGroupList.length
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    /**
     * KeenSlider配置對象，包括輪播的屬性和事件。
     * @property {boolean} loop - 是否循環播放
     * @property {string} selector - 輪播元素的選擇器
     * @property {string} renderMode - 渲染模式，預設為"native"
     * @property {string} mode - 模式，預設為"free-snap"
     * @property {boolean} drag - 是否可拖拽
     * @property {number} initial - 初始輪播的位置
     * @property {Function} detailsChanged - 當輪播元素變化時觸發的回調函數
     */
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

  /**
   * changeSlide 函數用於變更輪播的位置。
   * @param {string} dir - 變更方向，取值為"left"或"right"
   */
  const changeSlide = (dir: 'left' | 'right'): void => {
    dir === 'left' ? instanceRef.current?.prev() : instanceRef.current?.next()
  }
  const [rel, setRel] = useState(0)

  /**
   * fix delete carousel item bug
   */
  useEffect(() => {
    if (_.isNil(tagGroupList[rel])) return
    const groupID = tagGroupList[rel].id

    setGroupID({ groupID })
  }, [tagGroupListLength, rel])

  /**
   * fix load file bug
   */
  useEffect(() => {
    if (!tagGroupList[rel] || _.isEmpty(tagEditorState.groupID)) return
    if (tagEditorState.groupID === tagGroupList[rel].id) return
    const groupID = tagGroupList[rel].id
    setGroupID({ groupID })
  }, [tagGroupList, tagEditorState.groupID])

  return (
    <Box className='wrapper Keen3DCarousel'>
      <Box className='scene'>
        {tagGroupList.length > 1 && <IconBoxes changeSlide={changeSlide} />}
        <div className='keen-slider' ref={sliderRef}>
          {_.map(tagGroupList, (group, i) => (
            <div key={i} className='carousel__cell'>
              <CarouselItem tagGroup={group} />
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

/**
 * IconBoxes 是一個React組件，用於渲染左右切換輪播的icon。
 * @param {Object} props - 屬性對象，包含changeSlide函數作為回調
 * @param {Function} props.changeSlide - 切換輪播位置的回調函數
 * @returns {ReactNode} 返回一個React節點
 */
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
