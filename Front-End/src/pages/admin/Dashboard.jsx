import { useState, useEffect } from 'react';
import { 
  Users, 
  BarChart2, 
  AlertTriangle, 
  CreditCard,
  CheckCircle,
  Search,
  Bell,
  ChevronDown,
  Settings,
  Filter
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import AnalyticsSection from './AnalyticsSection';
import DriversSection from './DriversSection';
import PaymentsSection from './PaymentsSection';
import Réclamations from './Réclamations';
import Overview from './Overview';
import adminService from '../../services/admin';
import authService from '../../services/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import Loader from "../../components/Loader";

export default function Dashboard({user, logout}) {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname.split('/').pop();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [recentActivities, setRecentActivities] = useState(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (!authService.isAdmin()) {
      navigate('/');
      return;
    }

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [dashboardStats, analytics, recentActivities] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getAnalytics(),
          adminService.getRecentActivities()
        ]);
        setDashboardData(dashboardStats);
        setAnalyticsData(analytics);
        setRecentActivities(recentActivities);
        setError(null);
      } catch (err) {
        console.error('Dashboard data error:', err);
        if (err.response?.status === 401) {
          authService.logout();
          navigate('/login');
        } else {
          setError('Erreur lors du chargement des données');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    logout();
    navigate('/login');
  };

  const tabs = [
    { id: 'overview', title: 'Vue d\'ensemble', icon: <BarChart2 size={16} /> },
    { id: 'drivers', title: 'Conducteurs', icon: <Users size={16} /> },
    { id: 'analytics', title: 'Analyses', icon: <BarChart2 size={16} /> },
    { id: 'claims', title: 'Réclamations', icon: <AlertTriangle size={16} /> },
    { id: 'payments', title: 'Paiements', icon: <CreditCard size={16} /> }
  ];
  
  const renderTabContent = () => {
    if (loading) {
      return <Loader />;
    }
  

    if (error) {
      return <div className="text-red-500 text-center">{error}</div>;
    }

    switch (activeTab) {
      case 'overview':
        return <Overview stats={dashboardData?.stats} recentActivities={recentActivities} />;
      case 'drivers':
        return <DriversSection />;
      case 'claims':
        return <Réclamations />;
      case 'payments':
        return <PaymentsSection />;
      case 'analytics':
        return <AnalyticsSection data={analyticsData} />;
      default:
        return <Overview stats={dashboardData?.stats} recentActivities={dashboardData?.recent_activities} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar tabs={tabs} activeTab={activeTab} user={user} />

      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between p-4">
              <div className="relative flex-1 max-w-xs">
               
              </div>
              <div className="flex items-center space-x-4">
              
                <div className="relative" ref={menuRef}>
                  <div
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                      {user.nom[0]}
                    </div>
                    <span className="font-medium text-gray-700 hidden sm:inline">
                      {user.nom} {user.prenom}
                    </span>
                    <ChevronDown size={16} className="text-gray-500" />
                  </div>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                      
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 max-w-7xl mx-auto">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}
