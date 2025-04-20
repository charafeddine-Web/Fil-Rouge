import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* <Sidebar /> */}
      <div className="flex-1  overflow-y-auto">
        <Outlet/>
      </div>
    </div>
  );
};

export default AdminLayout;
