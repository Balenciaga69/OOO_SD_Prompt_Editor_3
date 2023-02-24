import React, { FC } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '@/views/layout'
import { Error } from '@/views/pages/Error'
import { EditorPrompt } from '@/views/pages/EditorPrompt'
import { EditorArticle } from '@/views/pages/EditorArticle'
import { Intro } from '@/views/pages/Intro'
import { RD } from './RD'
export const AppRoutes: FC = () => {
  const { EDITOR_ARTICLE, EDITOR_PROMPT, ERROR, INTRO } = RD.PAGE_LINK

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path={`${ERROR}/*`} element={<Error />} />
          <Route path={INTRO} element={<Intro />} />
          <Route path={EDITOR_PROMPT} element={<EditorPrompt />} />
          <Route path={EDITOR_ARTICLE} element={<EditorArticle />} />
          <Route path='editor/*' element={<Navigate to={`/${EDITOR_PROMPT}`} />} />
          <Route path='*' element={<Navigate to={`/${ERROR}`} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
