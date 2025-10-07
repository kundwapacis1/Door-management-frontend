
import { Route , Routes } from 'react-router-dom';
import LandingPage from '../pages/LandingPage'
import {LoginPage} from '../pages/LoginPage';
import DoorControlPage from '../pages/DoorControlPage';
import ViewLogsPage from '../pages/ViewLogsPage';
import UserDashboard from '../pages/UserDashboard';


export default function AppRoutes() {
  return (
    <div>
      <Routes>
         <Route path='/' element={<LandingPage/>}/>
         <Route path='/login' element={<LoginPage/>}/>
         <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/door-control" element={<DoorControlPage />} />
        <Route path="/view-logs" element={<ViewLogsPage />} />
      </Routes>
    </div>
  )
}
