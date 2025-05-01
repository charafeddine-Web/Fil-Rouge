
import Loader from "../../components/Loader";

// Composant section Réclamations
export default function ClaimsSection({ recentClaims }) {
    // Données des réclamations plus complètes
    const allClaims = [
      ...recentClaims,
      { id: 'C-786', user: 'Michel Blanc', driver: 'Julie Moreau', issue: 'Itinéraire modifié', status: 'Résolu', date: '17/04/2025' },
      { id: 'C-785', user: 'Isabelle Roux', driver: 'David Mercier', issue: 'Annulation tardive', status: 'Résolu', date: '16/04/2025' },
    ];
    
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestion des réclamations</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Réclamations récentes</h2>
            <div className="w-full sm:w-auto">
              <select className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="all">Tous les statuts</option>
                <option value="unresolved">Non résolus</option>
                <option value="in-progress">En cours</option>
                <option value="resolved">Résolus</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 bg-gray-50">
                  <th className="py-3 px-4 font-medium">ID</th>
                  <th className="py-3 px-4 font-medium">Utilisateur</th>
                  <th className="py-3 px-4 font-medium">Conducteur</th>
                  <th className="py-3 px-4 font-medium">Problème</th>
                  <th className="py-3 px-4 font-medium">Date</th>
                  <th className="py-3 px-4 font-medium">Statut</th>
                  <th className="py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allClaims.map((claim) => (
                  <tr key={claim.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-700">{claim.id}</td>
                    <td className="py-4 px-4">{claim.user}</td>
                    <td className="py-4 px-4">{claim.driver}</td>
                    <td className="py-4 px-4">{claim.issue}</td>
                    <td className="py-4 px-4">{claim.date}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                      <button className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
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