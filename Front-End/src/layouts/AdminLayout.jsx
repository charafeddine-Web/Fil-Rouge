import Sidebar from '../components/Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
