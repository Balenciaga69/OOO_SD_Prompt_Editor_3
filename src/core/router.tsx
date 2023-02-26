import { Layout } from '@/views/layout'
import { Error } from '@/views/modules/Error'
import { Intro } from '@/views/modules/Intro'
import React, { FC } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RD } from './RD'
import { TagEditor } from '@/views/modules/TagEditor'

export const AppRoutes: FC = () => {
  const { TAG, TAG_VISUAL, TAG_EDITOR, ERROR, INTRO } = RD.PAGE_LINK
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path={`${ERROR}/*`} element={<Error />} />
          <Route path={INTRO} element={<Intro />} />
          <Route path={TAG} element={<TagEditor />} />
          <Route path={TAG_EDITOR} element={<TagEditor />} />
          <Route path={TAG_VISUAL} element={<TagEditor />} />
          <Route path='*' element={<Navigate to={`/${ERROR}`} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
