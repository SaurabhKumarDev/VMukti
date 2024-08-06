import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SignUp from './components/SignUp';
import FetchUser from './components/FetchUser';
import LoggedInUser from './components/LoggedInUser';
import EditUser from './components/EditUser';
import SpecificUser from './components/SpecificUser';
import OwnLoginInfo from './components/OwnLoginInfo';
import Setting from './components/Settings';
import AllCamera from './components/Camera/AllCamera';
import UserCamera from './components/Camera/UserCamera';
import URLCamera from './components/Camera/URLCamera';
import AddCamera from './components/Camera/AddCamera';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/signup' element={<SignUp />} />
                <Route path='/loggedinuser' element={<LoggedInUser />} />
                <Route path='/fetchuser' element={<FetchUser />} />
                <Route path="/edituser/:id" element={<EditUser />} />
                <Route path="/specificuser/:id" element={<SpecificUser />} />
                <Route path='/loginfo' element={<OwnLoginInfo />} />
                <Route path='/settings' element={<Setting />} />
                <Route path='/cameradashboard' element={<AllCamera />} />
                <Route path='/camera/:userId' element={<UserCamera />} />
                <Route path='/url/camera' element={<URLCamera />} />
                <Route path='/camera/add/:customerId' element={<AddCamera />} />
            </Routes>
        </Router>
    );
}

export default App;