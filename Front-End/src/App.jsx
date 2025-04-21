import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import {AuthContext} from './context/AuthContext';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages publiques
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import SearchRides from './pages/SearchRides';
import RideDetails from './pages/RideDetails';
import HowItWorks from './pages/HowItWorks'
import NotFound from './pages/NotFound';

// Pages utilisateur
import OfferRide from './pages/OfferRide';
import MyRides from './pages/conductuer/MyRides';
import Reservations from './pages/conductuer/Reservations';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import My_Reservations from './pages/passager/My_Reservations';
import Messaging from  "./pages/Messaging";
import DriverDashboard from './pages/conductuer/DriverDashboard';

// Pages admin
import Dashboard from './pages/admin/Dashboard';
import DriversSection from './pages/admin/DriversSection';
import Réclamations from './pages/admin/Réclamations';
import PaymentsSection from './pages/admin/PaymentsSection';
import AnalyticsSection from './pages/admin/AnalyticsSection';
// import Settings from './admin/Settings';

function App() {
  const { user ,loadingUser } = useContext(AuthContext);

  const PrivateRoute = ({ children }) => {
    if (loadingUser) return null;
    return user ? children : <Navigate to="/login" />;
  };

  const AdminRoute = ({ children }) => {
    if (loadingUser) return null; 

    return user && user.role === 'admin' ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
   
        <Route element={<PublicLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
          
            <Route path="/" element={< Home />} />
            <Route path="/offer-ride" element={<SearchRides />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/ride/:id" element={<RideDetails />} />
        </Route>

        <Route element={<PrivateRoute><UserLayout /></PrivateRoute>}>
          {/* <Route path="/offer-ride" element={<SearchRides />} />  */}
          <Route path="/my-rides" element={<MyRides />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/Messaging" element={<Messaging />} />
          <Route path="/dashboard" element={<DriverDashboard />} />
          <Route path="/Myreservations" element={<My_Reservations />} />
          <Route path="/profile" element={<Profile />} />
           <Route path="/edit-profile" element={<EditProfile />} />
        </Route>



        {/* Layout Admin */}
        <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/DriversSection" element={<DriversSection />} />
          <Route path="/dashboard/claims" element={<Réclamations />} />
          <Route path="/dashboard/payments" element={<PaymentsSection />} />
          <Route path="/dashboard/analytics" element={<AnalyticsSection />} />
          {/* <Route path="/admin/rides" element={<RidesList />} />
          <Route path="/admin/reports" element={<Reports />} /> */}
          {/* <Route path="/admin/settings" element={<Settings />} /> */}
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} />
    </Router>
  );
}

export default App;
