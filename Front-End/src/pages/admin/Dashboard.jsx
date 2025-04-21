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
import { useLocation, useNavigate } from 'react-router-dom';



export default function Dashboard() {
//   const [activeTab, setActiveTab] = useState('overview');
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname.split('/').pop(); // ex: 'drivers'

  
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

  // Navigation tabs
//   const tabs = [
//     { id: 'overview', title: 'Vue d\'ensemble', icon: <BarChart2 size={16} /> },
//     { id: 'drivers', title: 'Conducteurs', icon: <Users size={16} /> },
//     { id: 'claims', title: 'Réclamations', icon: <AlertTriangle size={16} /> },
//     { id: 'payments', title: 'Paiements', icon: <CreditCard size={16} /> },
//     { id: 'analytics', title: 'Analyses', icon: <BarChart2 size={16} /> }
//   ];

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
<Sidebar navItems={tabs.map(tabs => ({
        ...tabs,
        onClick: () => navigate(`/admin/${tab.id}`)
      }))} />
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
                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                    A
                  </div>
                  <span className="font-medium text-gray-700 hidden sm:inline">Admin</span>
                  <ChevronDown size={16} className="text-gray-500" />
                </div>
              </div>
            </div>
            
            {/* Navigation Tabs */}
            {/* <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center py-4 px-6 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div> */}
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

// Composant pour un bloc statistique
function StatCard({ stat }) {
  const isPositiveChange = stat.change.startsWith('+');
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow transition-shadow border border-gray-100">
      <div className="flex justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
          <p className="text-2xl font-bold mt-1">{stat.value}</p>
        </div>
        <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
          {stat.icon}
        </div>
      </div>
      <div className={`text-sm mt-4 flex items-center ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
        <span className="font-medium">{stat.change}</span>
        <span className="ml-1 text-gray-500"> depuis hier</span>
      </div>
    </div>
  );
}

// Composant Vue d'ensemble
function Overview({ stats, pendingDrivers, recentClaims }) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vue d'ensemble</h1>
        <div className="mt-2 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Filter size={16} className="mr-2" />
            Filtrer
          </button>
        </div>
      </div>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>
      
      {/* Deux sections côte à côte */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conducteurs en attente */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Conducteurs en attente</h2>
            <button className="text-green-600 text-sm font-medium hover:text-green-700">Voir tout</button>
          </div>
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3 pl-4 pr-2">ID</th>
                  <th className="pb-3 px-2">Nom</th>
                  <th className="pb-3 px-2">Véhicule</th>
                  <th className="pb-3 pr-4 pl-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingDrivers.map((driver) => (
                  <tr key={driver.id} className="border-b group hover:bg-gray-50">
                    <td className="py-3 pl-4 pr-2 font-medium text-gray-700">{driver.id}</td>
                    <td className="py-3 px-2">{driver.name}</td>
                    <td className="py-3 px-2">{driver.vehicle}</td>
                    <td className="py-3 pr-4 pl-2">
                      <div className="flex space-x-2 opacity-70 group-hover:opacity-100">
                        <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                          <CheckCircle size={16} />
                        </button>
                        <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                          <AlertTriangle size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Réclamations récentes */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Réclamations récentes</h2>
            <button className="text-green-600 text-sm font-medium hover:text-green-700">Voir tout</button>
          </div>
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3 pl-4 pr-2">ID</th>
                  <th className="pb-3 px-2">Utilisateur</th>
                  <th className="pb-3 px-2">Problème</th>
                  <th className="pb-3 pr-4 pl-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentClaims.map((claim) => (
                  <tr key={claim.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 pl-4 pr-2 font-medium text-gray-700">{claim.id}</td>
                    <td className="py-3 px-2">{claim.user}</td>
                    <td className="py-3 px-2">{claim.issue}</td>
                    <td className="py-3 pr-4 pl-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        claim.status === 'Non résolu' 
                          ? 'bg-red-100 text-red-800' 
                          : claim.status === 'En cours' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

