import {  
  AlertTriangle, 
  CheckCircle,
  Filter
} from 'lucide-react';
export default function Overview({ stats, pendingDrivers, recentClaims }) {
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
