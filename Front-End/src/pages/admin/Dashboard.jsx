import { useState } from 'react';
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

import { useLocation, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { useEffect } from 'react';

export default function Dashboard({user,logout}) {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname.split('/').pop();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Données pour les statistiques
  const stats = [
    { title: 'Nouveaux conducteurs', value: '24', change: '+12%', icon: <Users size={20} /> },
    { title: 'Trajets aujourd\'hui', value: '156', change: '+8%', icon: <BarChart2 size={20} /> },
    { title: 'Réclamations actives', value: '7', change: '-3%', icon: <AlertTriangle size={20} /> },
    { title: 'Revenus journaliers', value: '2,450€', change: '+15%', icon: <CreditCard size={20} /> }
  ];
  
  // Données pour les conducteurs en attente de validation
  const pendingDrivers = [
    { id: 'D-4582', name: 'Jean Dupont', status: 'En attente', date: '19/04/2025', vehicle: 'Renault Clio' },
    { id: 'D-4583', name: 'Marie Laurent', status: 'En attente', date: '20/04/2025', vehicle: 'Peugeot 308' },
    { id: 'D-4584', name: 'Thomas Petit', status: 'En attente', date: '20/04/2025', vehicle: 'Citroën C3' }
  ];
  
  // Données pour les réclamations récentes
  const recentClaims = [
    { id: 'C-789', user: 'Sophie Martin', driver: 'Luc Girard', issue: 'Retard important', status: 'Non résolu', date: '20/04/2025' },
    { id: 'C-788', user: 'Pierre Dubois', driver: 'Emma Bernard', issue: 'Comportement inadéquat', status: 'En cours', date: '19/04/2025' },
    { id: 'C-787', user: 'Claire Vincent', driver: 'Hugo Leroy', issue: 'Problème de paiement', status: 'Non résolu', date: '18/04/2025' }
  ];

 

const tabs = [
    { id: 'overview', title: 'Vue d\'ensemble', icon: <BarChart2 size={16} /> },
    { id: 'drivers', title: 'Conducteurs', icon: <Users size={16} /> },
    { id: 'claims', title: 'Réclamations', icon: <AlertTriangle size={16} /> },
    { id: 'payments', title: 'Paiements', icon: <CreditCard size={16} /> },
    { id: 'analytics', title: 'Analyses', icon: <BarChart2 size={16} /> }
  ];
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview stats={stats} pendingDrivers={pendingDrivers} recentClaims={recentClaims} />;
      case 'drivers':
        return <DriversSection pendingDrivers={pendingDrivers} />;
      case 'claims':
        return <Réclamations recentClaims={recentClaims} />;
      case 'payments':
        return <PaymentsSection />;
      case 'analytics':
        return <AnalyticsSection />;
      default:
        return <Overview stats={stats} pendingDrivers={pendingDrivers} recentClaims={recentClaims} />;
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
                <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
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
        onClick={() => navigate('/profile')}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
      >
        Profil
      </button>
      <button
        onClick={() => {
            logout()
        }}
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

        {/* Page Content */}
        <main className="p-4 sm:p-6 max-w-7xl mx-auto">
          {renderTabContent()}  
        </main>
      </div>
    </div>
  );
}
