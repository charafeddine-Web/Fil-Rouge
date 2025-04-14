import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import {AuthContext} from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import UserLayout from './layouts/UserLayout';
// import AdminLayout from './layouts/AdminLayout';

// Pages publiques
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchRides from './pages/SearchRides';
import RideDetails from './pages/RideDetails';
import NotFound from './pages/NotFound';

// Pages utilisateur
import OfferRide from './pages/OfferRide';
import MyRides from './pages/MyRides';
import Reservations from './pages/Reservations';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';

// Pages admin
// import Dashboard from './admin/Dashboard';
// import UsersList from './admin/UsersList';
// import RidesList from './admin/RidesList';
// import Reports from './admin/Reports';
// import Settings from './admin/Settings';

function App() {
  const { user } = useContext(AuthContext);

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  const AdminRoute = ({ children }) => {
    return user && user.role === 'admin' ? children : <Navigate to="/" />;
  };

  return (
    <Router>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
         
          <Route path="/search" element={<SearchRides />} />
          <Route path="/ride/:id" element={<RideDetails />} />
        </Route>

        <Route element={<PrivateRoute><UserLayout /></PrivateRoute>}>
          <Route path="/offer-ride" element={<OfferRide />} /> 
          <Route path="/my-rides" element={<MyRides />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/profile" element={<Profile />} />
           <Route path="/edit-profile" element={<EditProfile />} />
        </Route>

        {/* Layout Admin */}
        {/* <Route element={<AdminRoute><AdminLayout /></AdminRoute>}> */}
          {/* <Route path="/admin/dashboard" element={<Dashboard />} /> */}
          {/* <Route path="/admin/users" element={<UsersList />} /> */}
          {/* <Route path="/admin/rides" element={<RidesList />} /> */}
          {/* <Route path="/admin/reports" element={<Reports />} /> */}
          {/* <Route path="/admin/settings" element={<Settings />} /> */}
        {/* </Route> */}

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
