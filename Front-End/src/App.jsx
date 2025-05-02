import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import {AuthContext} from './context/AuthContext';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import UserLayout from './layouts/UserLayout';

// Pages publiques
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import SearchRides from './pages/SearchRides';
import RideDetails from './pages/RideDetails';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Pages utilisateur
// import OfferRide from './pages/OfferRide';
import MyRides from './pages/conductuer/MyRides';
import Reservations from './pages/conductuer/Reservations';
import Profile from './pages/Profile';
import My_Reservations from './pages/passager/My_Reservations';
import DriverDashboard from './pages/conductuer/DriverDashboard';
import Chat from './pages/Chat';
import RealtimeChat from './pages/RealtimeChat';

// Pages admin
import Dashboard from './pages/admin/Dashboard';


function App() {
  const { user ,loadingUser,logout } = useContext(AuthContext);

  const PrivateRoute = ({ children }) => {
    if (loadingUser) return null;
    return user ? children : <Navigate to="/login" />;
  };

  const AdminRoute = ({ children }) => {
    if (loadingUser) return null; 
    return user && user.role === 'admin' ? children : <Navigate to="/login" />;
  };

  const ConducteurRoute = ({ children }) => {
    if (loadingUser) return null;
    return user && user.role === 'conducteur' ? children : <Navigate to="/login" />;
  };

  const PassagerRoute = ({ children }) => {
    if (loadingUser) return null;
    return user && user.role === 'passager' ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        
        <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ride/:id" element={<RideDetails />} />
        </Route>

        {/* Routes pour les conducteurs */}
        <Route element={<ConducteurRoute><UserLayout /></ConducteurRoute>}>
          <Route path="/dashboard" element={<DriverDashboard user={user} />} />
          <Route path="/my-rides" element={<MyRides user={user}/>} />
          <Route path="/reservations" element={<Reservations />} />
        </Route>

        {/* Routes pour les passagers */}
        <Route element={<PassagerRoute><UserLayout /></PassagerRoute>}>
          <Route path="/offer-ride" element={<SearchRides user={user}/>} />
          <Route path="/Myreservations" element={<My_Reservations />} />
          <Route path="/ride/:id" element={<RideDetails />} /> 
        </Route>

        {/* Routes communes pour utilisateurs authentifiés */}
        <Route element={<PrivateRoute><UserLayout /></PrivateRoute>}>
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:userId" element={<Chat />} />
          <Route path="/realtime-chat" element={<RealtimeChat />} />
          <Route path="/realtime-chat/:userId" element={<RealtimeChat />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Routes pour les administrateurs */}
        <Route element={<AdminRoute><UserLayout /></AdminRoute>}>
          <Route path="/admin/:tabId" element={<Dashboard user={user} logout={logout}/>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} draggable   
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover/>
    </Router>
  );
}

export default App;
