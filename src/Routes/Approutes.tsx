
import { Route , Routes } from 'react-router-dom';
import LandingPage from '../pages/LandingPage'
import {LoginPage} from '../pages/LoginPage';
import DoorControlPage from '../pages/DoorControlPage';
import ViewLogsPage from '../pages/ViewLogsPage';
import UserDashboard from '../pages/UserDashboard';
import AdDashboard from '../pages/AdDashboard';
import ProtectedRoute from '../component/ProtectedRoute';


export default function AppRoutes() {
  return (
    <div>
      <Routes>
         <Route path='/' element={<LandingPage/>}/>
         <Route path='/login' element={<LoginPage/>}/>
         <Route path="/userdashboard" element={
           <ProtectedRoute requiredRole="user">
             <UserDashboard />
           </ProtectedRoute>
         } />
         <Route path="/admindashboard" element={
           <ProtectedRoute requiredRole="admin">
             <AdDashboard />
           </ProtectedRoute>
         } />
        <Route path="/door-control" element={
          <ProtectedRoute>
            <DoorControlPage />
          </ProtectedRoute>
        } />
        <Route path="/view-logs" element={
          <ProtectedRoute>
            <ViewLogsPage />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}
