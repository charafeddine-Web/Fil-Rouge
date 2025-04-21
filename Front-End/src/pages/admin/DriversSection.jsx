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
} from 'lucide-react';// Composant section Conducteurs
export default function DriversSection({ pendingDrivers }) {
    const [searchTerm, setSearchTerm] = useState('');
    
    const allDrivers = [
      ...pendingDrivers,
      { id: 'D-4581', name: 'Paul Martin', status: 'Actif', date: '15/04/2025', vehicle: 'Volkswagen Golf' },
      { id: 'D-4580', name: 'Lucie Bernard', status: 'Actif', date: '12/04/2025', vehicle: 'Toyota Yaris' },
      { id: 'D-4579', name: 'Antoine Dubois', status: 'Inactif', date: '08/04/2025', vehicle: 'Ford Focus' },
    ];
    
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestion des conducteurs</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Tous les conducteurs</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Rechercher un conducteur..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto">
                Ajouter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 bg-gray-50">
                  <th className="py-3 px-4 font-medium">ID</th>
                  <th className="py-3 px-4 font-medium">Nom</th>
                  <th className="py-3 px-4 font-medium">Statut</th>
                  <th className="py-3 px-4 font-medium">Date d'inscription</th>
                  <th className="py-3 px-4 font-medium">Véhicule</th>
                  <th className="py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allDrivers.map((driver) => (
                  <tr key={driver.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-700">{driver.id}</td>
                    <td className="py-4 px-4">{driver.name}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
          
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
            <div className="text-sm text-gray-500 order-2 sm:order-1">
              Affichage de 1 à {allDrivers.length} sur {allDrivers.length} conducteurs
            </div>
            <div className="flex space-x-2 order-1 sm:order-2">
              <button className="px-3 py-1 border rounded hover:bg-gray-50 transition-colors">Précédent</button>
              <button className="px-3 py-1 bg-green-600 text-white rounded">1</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50 transition-colors">Suivant</button>
            </div>
          </div>
        </div>
      </div>
    );
  }