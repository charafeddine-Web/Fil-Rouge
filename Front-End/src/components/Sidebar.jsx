import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Users, 
  Car, 
  Clock, 
  MessageCircle, 
  CreditCard, 
  Settings, 
  BarChart2,
  AlertTriangle,
  Menu, 
  X,
} from 'lucide-react';

const Sidebar = ({ activePage, navItems }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const MobileMenuButton = () => (
    <button 
      onClick={toggleMobileMenu} 
      className="lg:hidden fixed top-4 left-4 z-50 bg-green-600 text-white p-2 rounded-md shadow-md"
      aria-label="Toggle menu"
    >
      {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );

  return (
    <>
      <MobileMenuButton />
      
      {/* Sidebar for desktop and mobile */}
      <aside 
        className={`
          ${isCollapsed ? 'w-20' : 'w-64'} 
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out z-40
        `}
      >
        {/* Top bar with logo and collapse button */}
        <div className="flex items-center justify-between border-b border-gray-100 py-4 px-4">
          <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : ''}`}>
            {!isCollapsed ? (
              <span className="text-xl font-bold text-green-600 ml-2">SwiftCar</span>
            ) : (
              <span className="text-xl font-bold text-green-600">SC</span>
            )}
          </div>
          
          {/* Only show collapse button on large screens */}
          <button 
            onClick={toggleCollapse} 
            className="text-gray-500 hover:text-green-600 focus:outline-none hidden lg:block"
            aria-label="Collapse sidebar"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
          </button>
        </div>
        
        {/* Navigation items */}
        <nav className="mt-6 px-3">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path || '#'}
              className={`
                flex items-center py-3 px-4 my-1 rounded-lg transition-colors duration-200
                ${activePage === item.id 
                  ? 'bg-green-50 text-green-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-green-600'
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              {!isCollapsed && <span className="ml-3 font-medium">{item.title}</span>}
            </Link>
          ))}
        </nav>
        
        {/* Profile section at bottom */}
        <div className={`absolute bottom-0 w-full p-4 border-t border-gray-100 ${isCollapsed ? 'flex justify-center' : ''}`}>
          {!isCollapsed ? (
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold">
                US
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">User Name</p>
                <p className="text-xs text-gray-500">user@example.com</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold">
              US
            </div>
          )}
        </div>
      </aside>
      
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}
      
      <div 
        className={`
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
        `}
      >
        {/* Your page content goes here */}
      </div>
    </>
  );
};

export default Sidebar;