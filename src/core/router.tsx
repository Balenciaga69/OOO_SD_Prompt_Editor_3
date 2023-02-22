import React, { FC } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '@/views/layout'
import { Error } from '@/views/pages/Error'
import { EditorPrompt } from '@/views/pages/EditorPrompt'
import { EditorArticle } from '@/views/pages/EditorArticle'
import { Intro } from '@/views/pages/Intro'
export const AppRoutes: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path='error/*' element={<Error />} />
          <Route path='intro' element={<Intro />} />
          <Route path='editor/prompt' element={<EditorPrompt />} />
          <Route path='editor/article' element={<EditorArticle />} />
          <Route path='*' element={<Navigate to='/error' />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
