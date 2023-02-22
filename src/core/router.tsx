import { Layout } from '@/views/layout'
import React, { FC } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
export const AppRoutes: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path='error/*' element={<></>} />
          <Route path='logout' element={<></>} />
          <Route path='auth/*' element={<></>} />
          <Route path='*' element={<Navigate to='/auth' />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
