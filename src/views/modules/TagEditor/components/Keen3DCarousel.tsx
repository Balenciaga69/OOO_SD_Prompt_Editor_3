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
 * KeenSlider 的異動插件，用於在輪播項目內容發生異動時重新計算物件數量和更新輪播器。
 * 透過 MutationObserver 監聽元素異動事件，當事件發生時觸發 KeenSlider 的更新方法。
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
 * KeenSlider 的輪播插件，用於實現 3D 輪播效果。
 * 透過監聽詳細資訊改變事件，計算容器和每個輪播項目的旋轉角度和位置，並且套用至對應的元素上。
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
 * 提供給 Keen3DCarousel 使用的 Hook，用於從 TagEditor 中取得標籤分組數據和編輯狀態，
 * 以及提供設置 groupID 的方法。
 */
const useKeen3DCarousel = () => {
  const { tagEditorActions, dispatch, tagEditorState, tagGroupEntities } = useTagEditor()
  const { setGroupID } = tagEditorActions
  const actionCreators = bindActionCreators({ setGroupID }, dispatch)
  const tagGroupList = _.compact(_.values(tagGroupEntities))
  return { tagGroupList, tagEditorState, ...actionCreators }
}

/**
 * 使用 KeenSlider 套件實現的 3D 輪播功能，並且根據標籤分組的數據進行呈現。
 * 透過 useEffect 監聽狀態變化，當 tagGroupList 或 rel 改變時，更新標籤分組的 groupID。
 */
export const Keen3DCarousel: FC = () => {
  const { setGroupID, tagEditorState, tagGroupList } = useKeen3DCarousel()
  const tagGroupListLength = tagGroupList.length
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

  /*
   * 使用 useEffect 監聽狀態變化，當 tagGroupList 或 rel 改變時，更新標籤分組的 groupID
   */
  useEffect(() => {
    if (_.isNil(tagGroupList[rel])) return
    const groupID = tagGroupList[rel].id

    setGroupID({ groupID })
  }, [tagGroupListLength, rel])

  /*
   * 使用 useEffect 監聽狀態變化，當 tagEditorState.groupID 改變時，更新標籤分組的 groupID
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
