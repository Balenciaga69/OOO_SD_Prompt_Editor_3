import { Layout } from '@/views/layout'
import { EditorPrompt } from '@/views/modules/EditorPrompt'
import { Error } from '@/views/modules/Error'
import { Intro } from '@/views/modules/Intro'
import React, { FC } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
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
