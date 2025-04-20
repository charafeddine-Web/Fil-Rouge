import { useState } from 'react';
import { Users, MessageSquare, AlertTriangle, CreditCard, BarChart2, CheckCircle, Settings, Bell, Search, ChevronDown } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
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

  // Sélection de l'onglet actif
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview stats={stats} pendingDrivers={pendingDrivers} recentClaims={recentClaims} />;
      case 'drivers':
        return <DriversSection pendingDrivers={pendingDrivers} />;
      case 'claims':
        return <ClaimsSection recentClaims={recentClaims} />;
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
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="p-4">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <p className="text-gray-400 text-sm">Plateforme de covoiturage</p>
        </div>
        <nav className="mt-8">
          <SidebarLink 
            icon={<BarChart2 size={20} />} 
            title="Vue d'ensemble" 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')} 
          />
          <SidebarLink 
            icon={<Users size={20} />} 
            title="Conducteurs" 
            active={activeTab === 'drivers'} 
            onClick={() => setActiveTab('drivers')} 
          />
          <SidebarLink 
            icon={<AlertTriangle size={20} />} 
            title="Réclamations" 
            active={activeTab === 'claims'} 
            onClick={() => setActiveTab('claims')} 
          />
          <SidebarLink 
            icon={<CreditCard size={20} />} 
            title="Paiements" 
            active={activeTab === 'payments'} 
            onClick={() => setActiveTab('payments')} 
          />
          <SidebarLink 
            icon={<BarChart2 size={20} />} 
            title="Analyses" 
            active={activeTab === 'analytics'} 
            onClick={() => setActiveTab('analytics')} 
          />
          <SidebarLink 
            icon={<Settings size={20} />} 
            title="Paramètres" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  A
                </div>
                <span className="font-medium">Admin</span>
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {renderTabContent()}  
        </main>
      </div>
    </div>
  );
}

// Composant pour un lien du sidebar
function SidebarLink({ icon, title, active, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center py-3 px-4 cursor-pointer ${active ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
    >
      <span className="mr-3">{icon}</span>
      <span>{title}</span>
    </div>
  );
}

// Composant pour un bloc statistique
function StatCard({ stat }) {
  const isPositiveChange = stat.change.startsWith('+');
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between">
        <div>
          <p className="text-gray-500 text-sm">{stat.title}</p>
          <p className="text-2xl font-bold mt-1">{stat.value}</p>
        </div>
        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
          {stat.icon}
        </div>
      </div>
      <div className={`text-sm mt-4 ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
        {stat.change} depuis hier
      </div>
    </div>
  );
}

// Composant Vue d'ensemble
function Overview({ stats, pendingDrivers, recentClaims }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Vue d'ensemble</h1>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>
      
      {/* Deux sections côte à côte */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conducteurs en attente */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Conducteurs en attente de validation</h2>
            <button className="text-blue-600 text-sm">Voir tout</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">ID</th>
                  <th className="pb-2">Nom</th>
                  <th className="pb-2">Véhicule</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingDrivers.map((driver) => (
                  <tr key={driver.id} className="border-b">
                    <td className="py-3">{driver.id}</td>
                    <td className="py-3">{driver.name}</td>
                    <td className="py-3">{driver.vehicle}</td>
                    <td className="py-3">
                      <div className="flex space-x-2">
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
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Réclamations récentes</h2>
            <button className="text-blue-600 text-sm">Voir tout</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">ID</th>
                  <th className="pb-2">Utilisateur</th>
                  <th className="pb-2">Problème</th>
                  <th className="pb-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentClaims.map((claim) => (
                  <tr key={claim.id} className="border-b">
                    <td className="py-3">{claim.id}</td>
                    <td className="py-3">{claim.user}</td>
                    <td className="py-3">{claim.issue}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
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

// Composant section Conducteurs
function DriversSection({ pendingDrivers }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Données de conducteurs plus complètes
  const allDrivers = [
    ...pendingDrivers,
    { id: 'D-4581', name: 'Paul Martin', status: 'Actif', date: '15/04/2025', vehicle: 'Volkswagen Golf' },
    { id: 'D-4580', name: 'Lucie Bernard', status: 'Actif', date: '12/04/2025', vehicle: 'Toyota Yaris' },
    { id: 'D-4579', name: 'Antoine Dubois', status: 'Inactif', date: '08/04/2025', vehicle: 'Ford Focus' },
  ];
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestion des conducteurs</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Tous les conducteurs</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Rechercher un conducteur..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Ajouter
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3 px-4">ID</th>
                <th className="pb-3 px-4">Nom</th>
                <th className="pb-3 px-4">Statut</th>
                <th className="pb-3 px-4">Date d'inscription</th>
                <th className="pb-3 px-4">Véhicule</th>
                <th className="pb-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allDrivers.map((driver) => (
                <tr key={driver.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4">{driver.id}</td>
                  <td className="py-4 px-4">{driver.name}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      driver.status === 'Actif' 
                        ? 'bg-green-100 text-green-800' 
                        : driver.status === 'En attente' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {driver.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">{driver.date}</td>
                  <td className="py-4 px-4">{driver.vehicle}</td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Settings size={16} />
                      </button>
                      {driver.status === 'En attente' && (
                        <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                          <CheckCircle size={16} />
                        </button>
                      )}
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
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Affichage de 1 à {allDrivers.length} sur {allDrivers.length} conducteurs
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded">Précédent</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
            <button className="px-3 py-1 border rounded">Suivant</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant section Réclamations
function ClaimsSection({ recentClaims }) {
  // Données des réclamations plus complètes
  const allClaims = [
    ...recentClaims,
    { id: 'C-786', user: 'Michel Blanc', driver: 'Julie Moreau', issue: 'Itinéraire modifié', status: 'Résolu', date: '17/04/2025' },
    { id: 'C-785', user: 'Isabelle Roux', driver: 'David Mercier', issue: 'Annulation tardive', status: 'Résolu', date: '16/04/2025' },
  ];
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestion des réclamations</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Réclamations récentes</h2>
          <div className="flex items-center space-x-2">
            <select className="border border-gray-300 rounded-lg px-4 py-2">
              <option value="all">Tous les statuts</option>
              <option value="unresolved">Non résolus</option>
              <option value="in-progress">En cours</option>
              <option value="resolved">Résolus</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3 px-4">ID</th>
                <th className="pb-3 px-4">Utilisateur</th>
                <th className="pb-3 px-4">Conducteur</th>
                <th className="pb-3 px-4">Problème</th>
                <th className="pb-3 px-4">Date</th>
                <th className="pb-3 px-4">Statut</th>
                <th className="pb-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allClaims.map((claim) => (
                <tr key={claim.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4">{claim.id}</td>
                  <td className="py-4 px-4">{claim.user}</td>
                  <td className="py-4 px-4">{claim.driver}</td>
                  <td className="py-4 px-4">{claim.issue}</td>
                  <td className="py-4 px-4">{claim.date}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      claim.status === 'Résolu' 
                        ? 'bg-green-100 text-green-800' 
                        : claim.status === 'En cours' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {claim.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Composant section Paiements
function PaymentsSection() {
  // Données pour les paiements récents
  const recentPayments = [
    { id: 'P-4560', user: 'Alexandre Durand', amount: '25.50€', status: 'Complété', date: '20/04/2025' },
    { id: 'P-4559', user: 'Émilie Petit', amount: '18.75€', status: 'Complété', date: '20/04/2025' },
    { id: 'P-4558', user: 'Nicolas Simon', amount: '32.00€', status: 'En attente', date: '19/04/2025' },
    { id: 'P-4557', user: 'Sarah Martin', amount: '15.25€', status: 'Complété', date: '19/04/2025' },
    { id: 'P-4556', user: 'Thomas Robin', amount: '22.50€', status: 'Échoué', date: '18/04/2025' },
  ];
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestion des paiements</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total aujourd'hui</h3>
          <p className="text-2xl font-bold mt-1">458.75€</p>
          <p className="text-sm text-green-600 mt-2">+12.5% depuis hier</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Transactions aujourd'hui</h3>
          <p className="text-2xl font-bold mt-1">24</p>
          <p className="text-sm text-green-600 mt-2">+4 depuis hier</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Transactions en attente</h3>
          <p className="text-2xl font-bold mt-1">3</p>
          <p className="text-sm text-red-600 mt-2">+1 depuis hier</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Paiements récents</h2>
          <div className="flex items-center space-x-2">
            <select className="border border-gray-300 rounded-lg px-4 py-2">
              <option value="all">Tous les statuts</option>
              <option value="completed">Complétés</option>
              <option value="pending">En attente</option>
              <option value="rejected">Échoués</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3 px-4">ID</th>
                <th className="pb-3 px-4">Utilisateur</th>
                <th className="pb-3 px-4">Montant</th>
                <th className="pb-3 px-4">Date</th>
                <th className="pb-3 px-4">Statut</th>
                <th className="pb-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.map((payment) => (
                <tr key={payment.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4">{payment.id}</td>
                  <td className="py-4 px-4">{payment.user}</td>
                  <td className="py-4 px-4">{payment.amount}</td>
                  <td className="py-4 px-4">{payment.date}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      payment.status === 'Complété' 
                        ? 'bg-green-100 text-green-800' 
                        : payment.status === 'En attente' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Composant section Analyses
function AnalyticsSection() {
  // Données pour les graphiques
  const monthlyData = [
    { name: 'Jan', users: 400, rides: 240, amt: 400 },
    { name: 'Fév', users: 500, rides: 320, amt: 500 },
    { name: 'Mar', users: 600, rides: 450, amt: 600 },
    { name: 'Avr', users: 750, rides: 520, amt: 700 },
  ];
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analyses de performance</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Vue d'ensemble des utilisations</h2>
          <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
            <p className="text-gray-500">Graphique d'utilisation mensuelle</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Répartition des trajets</h2>
          <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
            <p className="text-gray-500">Graphique de répartition des trajets</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Performance par région</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3 px-4">Région</th>
                <th className="pb-3 px-4">Utilisateurs</th>
                <th className="pb-3 px-4">Trajets</th>
                <th className="pb-3 px-4">Taux de conversion</th>
                <th className="pb-3 px-4">Revenus</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-4 px-4">Paris</td>
                <td className="py-4 px-4">1,245</td>
                <td className="py-4 px-4">875</td>
                <td className="py-4 px-4">70.3%</td>
                <td className="py-4 px-4">9,560€</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-4">Lyon</td>
                <td className="py-4 px-4">865</td>
                <td className="py-4 px-4">540</td>
                <td className="py-4 px-4">62.4%</td>
                <td className="py-4 px-4">5,820€</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-4">Marseille</td>
                <td className="py-4 px-4">720</td>
                <td className="py-4 px-4">485</td>
                <td className="py-4 px-4">67.4%</td>
                <td className="py-4 px-4">5,245€</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-4">Bordeaux</td>
                <td className="py-4 px-4">540</td>
                <td className="py-4 px-4">320</td>
                <td className="py-4 px-4">59.3%</td>
                <td className="py-4 px-4">3,670€</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Tendances récentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Croissance des utilisateurs</p>
            <p className="text-xl font-bold mt-1">+15%</p>
            <p className="text-xs text-green-600 mt-2">Depuis le mois dernier</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Augmentation des trajets</p>
            <p className="text-xl font-bold mt-1">+10%</p>
            <p className="text-xs text-green-600 mt-2">Depuis le mois dernier</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Taux de satisfaction</p>
            <p className="text-xl font-bold mt-1">92%</p>
            <p className="text-xs text-green-600 mt-2">Basé sur les avis</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant section Paramètres
function SettingsSection() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    commissionRate: 10,
    maxRidesPerDay: 5,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveSettings = () => {
    // Simuler l'enregistrement des paramètres
    alert('Paramètres enregistrés avec succès !');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Préférences de notification</h2>
        <div className="space-y-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-600">Notifications par email</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="pushNotifications"
              checked={settings.pushNotifications}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-600">Notifications push</span>
          </label>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Paramètres de la plateforme</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Taux de commission (%)</label>
            <input
              type="number"
              name="commissionRate"
              value={settings.commissionRate}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nombre maximum de trajets par jour</label>
            <input
              type="number"
              name="maxRidesPerDay"
              value={settings.maxRidesPerDay}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}