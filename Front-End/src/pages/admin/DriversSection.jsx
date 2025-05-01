import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Search } from 'lucide-react';
import adminService from '../../services/admin';
import Loader from "../../components/Loader";

export default function DriversSection() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDrivers(search);
      setDrivers(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des conducteurs');
      console.error('Drivers data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      fetchDrivers();
    }
  };

  const handleStatusUpdate = async (driverId, newStatus) => {
    try {
      console.log('le driiiiiiver',driverId,'and new statuuuuuuuuuuus est :',newStatus);
      await adminService.updateUserStatus(driverId, newStatus);
      fetchDrivers(); 
    } catch (err) {
      console.error('Error updating driver status:', err);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Conducteurs</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un conducteur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleSearch}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Véhicule</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {drivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {driver.user.nom} {driver.user.prenom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {driver.user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {driver.vehicule ? `${driver.vehicule.marque} ${driver.vehicule.modele}` : 'Non assigné'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      driver.user.status === 'active' 
                        ? 'bg-green-300 text-green-800'
                        : driver.user.status === 'en_attente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {driver.user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                    <div className="flex space-x-2">
                      {driver.user.status === 'en_attente' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(driver.id, 'active')}
                            className="text-green-600 hover:text-green-900"
                            title="Approuver"
                          >
                            <CheckCircle size={20} />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(driver.id, 'bloqué')}
                            className="text-red-500 font-bold hover:text-red-900"
                            title="Bloquer"
                          >
                            <XCircle size={20} />
                          </button>
                        </>
                      )}
                      {driver.user.status === 'active' && (
                        <button
                          onClick={() => handleStatusUpdate(driver.user.id, 'bloqué')}
                          className="text-black hover:text-red-900"
                          title="Bloquer"
                        >
                          <XCircle size={20} />
                        </button>
                      )}
                      {driver.user.status === 'bloqué' && (
                        <button
                          onClick={() => handleStatusUpdate(driver.user.id, 'active')}
                          className="text-black hover:text-green-900"
                          title="Réactiver"
                        >
                          <CheckCircle size={20} />
                        </button>
                      )}
                    </div>
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