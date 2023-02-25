import { Layout } from '@/views/layout'
import { EditorPrompt } from '@/views/pages/EditorPrompt'
import { Error } from '@/views/pages/Error'
import { Intro } from '@/views/pages/Intro'
import React, { FC } from 'react'
import { BrowserRouter, HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RD } from './RD'

export const AppRoutes: FC = () => {
  const { PROMPT, PROMPT_CODE, PROMPT_VISUAL, ERROR, INTRO } = RD.PAGE_LINK
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path={`${ERROR}/*`} element={<Error />} />
          <Route path={INTRO} element={<Intro />} />
          <Route path={PROMPT} element={<EditorPrompt />} />
          <Route path={PROMPT_CODE} element={<EditorPrompt />} />
          <Route path={PROMPT_VISUAL} element={<EditorPrompt />} />
          <Route path='*' element={<Navigate to={`/${ERROR}`} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
