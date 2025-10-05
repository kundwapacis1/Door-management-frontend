import React from 'react'
import { Route , Routes } from 'react-router-dom';
import LandingPage from '../pages/LandingPage'
import {LoginPage} from '../pages/LoginPage';


export default function AppRoutes() {
  return (
    <div>
      <Routes>
         <Route path='/' element={<LandingPage/>}/>
            <Route path='/login' element={<LoginPage/>}/>
      </Routes>
    </div>
  )
}
