import Navbar from '../components/Navbar';

const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      <Navbar /> {/* Sidebar or topbar for navigation */}
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default UserLayout;
