import { Outlet } from 'react-router-dom';

const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      <main className="flex-1 mt-10 p-6 bg-gray-50 overflow-y-auto">
      <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
