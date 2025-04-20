import { useState } from 'react';
import { BarChart2, Users, AlertTriangle, CreditCard, Settings } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'overview', title: 'Vue d\'ensemble', icon: <BarChart2 size={20} /> },
    { id: 'drivers', title: 'Conducteurs', icon: <Users size={20} /> },
    { id: 'claims', title: 'Réclamations', icon: <AlertTriangle size={20} /> },
    { id: 'payments', title: 'Paiements', icon: <CreditCard size={20} /> },
    { id: 'analytics', title: 'Analyses', icon: <BarChart2 size={20} /> },
    { id: 'settings', title: 'Paramètres', icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white">
      <div className="p-4">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <p className="text-gray-400 text-sm">Plateforme de covoiturage</p>
      </div>
      <nav className="mt-8">
        {navItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center py-3 px-4 cursor-pointer ${
              activeTab === item.id ? 'bg-blue-600' : 'hover:bg-gray-800'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.title}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;