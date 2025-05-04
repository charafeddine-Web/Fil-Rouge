import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Search, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import adminService from '../../services/admin';
import Loader from "../../components/Loader";

export default function DriversSection() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [expandedDriver, setExpandedDriver] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

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
      await adminService.updateUserStatus(driverId, newStatus);
      fetchDrivers(); 
    } catch (err) {
      console.error('Error updating driver status:', err);
    }
  };

  const toggleDetails = (driverId) => {
    if (expandedDriver === driverId) {
      setExpandedDriver(null);
    } else {
      setExpandedDriver(driverId);
    }
  };

  const openModal = (driver) => {
    setSelectedDriver(driver);
    setModalOpen(true);
    console.log("Documents du conducteur:", driver);
    // Vérifier différentes structures possibles de données
    const permisPath = driver.photo_permis || driver.photoPermis || 
                      (driver.documents && driver.documents.permis) || 
                      (driver.user && driver.user.photo_permis);
    
    const identitePath = driver.photo_identite || driver.photoIdentite || 
                        (driver.documents && driver.documents.identite) || 
                        (driver.user && driver.user.photo_identite);
    
    console.log("Photo permis trouvée:", permisPath);
    console.log("Photo identité trouvée:", identitePath);
  };

  // Helper pour trouver le chemin d'une photo
  const getPhotoPath = (driver, type) => {
    if (type === 'permis') {
      return driver.photo_permis || driver.photoPermis || 
             (driver.documents && driver.documents.permis) || 
             (driver.user && driver.user.photo_permis);
    } else if (type === 'identite') {
      return driver.photo_identite || driver.photoIdentite || 
             (driver.documents && driver.documents.identite) || 
             (driver.user && driver.user.photo_identite);
    }
    return null;
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Conducteurs</h1>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un conducteur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleSearch}
            className="w-full md:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left border-b">
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">N° Permis</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Véhicule</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {drivers.map((driver) => (
                <React.Fragment key={driver.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {driver.photo_de_profil ? (
                            <img className="h-10 w-10 rounded-full object-cover" src={driver.photo_de_profil} alt="" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-medium">
                              {driver.user.prenom?.charAt(0)}{driver.user.nom?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{driver.user.nom} {driver.user.prenom}</div>
                          <div className="text-sm text-gray-500">{driver.ville || "Non spécifié"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.num_permis || "Non spécifié"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.vehicule ? `${driver.vehicule.marque} ${driver.vehicule.modele}` : 'Non assigné'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        driver.user.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : driver.user.status === 'en_attente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {driver.user.status === 'active' ? 'Actif' : 
                         driver.user.status === 'en_attente' ? 'En attente' : 'Bloqué'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => toggleDetails(driver.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Détails"
                        >
                          {expandedDriver === driver.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        <button
                          onClick={() => openModal(driver)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Voir les documents"
                        >
                          <Eye size={18} />
                        </button>
                        {driver.user.status === 'en_attente' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(driver.id, 'active')}
                              className="text-green-600 hover:text-green-900"
                              title="Approuver"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(driver.id, 'bloqué')}
                              className="text-red-500 hover:text-red-900"
                              title="Bloquer"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        {driver.user.status === 'active' && (
                          <button
                            onClick={() => handleStatusUpdate(driver.user.id, 'bloqué')}
                            className="text-red-500 hover:text-red-900"
                            title="Bloquer"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                        {driver.user.status === 'bloqué' && (
                          <button
                            onClick={() => handleStatusUpdate(driver.user.id, 'active')}
                            className="text-green-600 hover:text-green-900"
                            title="Réactiver"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedDriver === driver.id && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <h4 className="font-semibold text-gray-700 mb-2">Informations personnelles</h4>
                            <div className="space-y-1 text-sm">
                              <p><span className="text-gray-500">Adresse:</span> {driver.adresse || "Non spécifié"}</p>
                              <p><span className="text-gray-500">Ville:</span> {driver.ville || "Non spécifié"}</p>
                              <p><span className="text-gray-500">Date de naissance:</span> {driver.date_naissance ? new Date(driver.date_naissance).toLocaleDateString() : "Non spécifié"}</p>
                              <p><span className="text-gray-500">Sexe:</span> {driver.sexe || "Non spécifié"}</p>
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <h4 className="font-semibold text-gray-700 mb-2">Informations de conduite</h4>
                            <div className="space-y-1 text-sm">
                              <p><span className="text-gray-500">Numéro de permis:</span> {driver.num_permis || "Non spécifié"}</p>
                              <p><span className="text-gray-500">Disponibilité:</span> {driver.disponibilite ? "Disponible" : "Non disponible"}</p>
                              <p><span className="text-gray-500">Note moyenne:</span> {driver.note_moyenne ? `${driver.note_moyenne}/5` : "Aucune"}</p>
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <h4 className="font-semibold text-gray-700 mb-2">Documents</h4>
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="text-gray-500">Photo d'identité:</span> 
                                {driver.photo_identite ? (
                                  <span className="ml-2 text-green-600">Téléchargée</span>
                                ) : (
                                  <span className="ml-2 text-red-600">Non téléchargée</span>
                                )}
                              </p>
                              <p>
                                <span className="text-gray-500">Photo du permis:</span> 
                                {driver.photo_permis ? (
                                  <span className="ml-2 text-green-600">Téléchargée</span>
                                ) : (
                                  <span className="ml-2 text-red-600">Non téléchargée</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal pour afficher les documents */}
      {modalOpen && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Documents de {selectedDriver.user.prenom} {selectedDriver.user.nom}
                </h3>
                <button 
                  onClick={() => setModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-2">Permis de conduire</h4>
                  {getPhotoPath(selectedDriver, 'permis') ? (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={getPhotoPath(selectedDriver, 'permis')} 
                        alt="Permis de conduire" 
                        className="w-full max-h-[400px] object-contain"
                        onError={(e) => {
                          console.error("Erreur de chargement de l'image du permis");
                          e.target.src = "https://via.placeholder.com/400x300?text=Image+non+disponible";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
                      Document non fourni
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-2">Pièce d'identité</h4>
                  {getPhotoPath(selectedDriver, 'identite') ? (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={getPhotoPath(selectedDriver, 'identite')} 
                        alt="Pièce d'identité" 
                        className="w-full max-h-[400px] object-contain"
                        onError={(e) => {
                          console.error("Erreur de chargement de l'image d'identité");
                          e.target.src = "https://via.placeholder.com/400x300?text=Image+non+disponible";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
                      Document non fourni
                    </div>
                  )}
                </div>

                {/* Affichage des URLs pour débug */}
                <div className="text-xs text-gray-500 mt-4 bg-gray-50 p-2 rounded">
                  <p>URL permis: {getPhotoPath(selectedDriver, 'permis') || "Non disponible"}</p>
                  <p>URL identité: {getPhotoPath(selectedDriver, 'identite') || "Non disponible"}</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                {selectedDriver.user.status === 'en_attente' && (
                  <>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedDriver.id, 'active');
                        setModalOpen(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Approuver
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedDriver.id, 'bloqué');
                        setModalOpen(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Refuser
                    </button>
                  </>
                )}
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}