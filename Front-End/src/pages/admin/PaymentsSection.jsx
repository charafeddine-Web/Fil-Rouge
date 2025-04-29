import Loader from "../../components/Loader";

// Composant section Paiements
export default function PaymentsSection() {
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestion des paiements</h1>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Total aujourd'hui</h3>
            <p className="text-2xl font-bold mt-1">458.75€</p>
            <p className="text-sm text-green-600 font-medium mt-2">+12.5% depuis hier</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Transactions aujourd'hui</h3>
            <p className="text-2xl font-bold mt-1">24</p>
            <p className="text-sm text-green-600 font-medium mt-2">+4 depuis hier</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Transactions en attente</h3>
            <p className="text-2xl font-bold mt-1">3</p>
            <p className="text-sm text-red-600 font-medium mt-2">+1 depuis hier</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Paiements récents</h2>
            <div className="w-full sm:w-auto">
              <select className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="all">Tous les statuts</option>
                <option value="completed">Complétés</option>
                <option value="pending">En attente</option>
                <option value="rejected">Échoués</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 bg-gray-50">
                  <th className="py-3 px-4 font-medium">ID</th>
                  <th className="py-3 px-4 font-medium">Utilisateur</th>
                  <th className="py-3 px-4 font-medium">Montant</th>
                  <th className="py-3 px-4 font-medium">Date</th>
                  <th className="py-3 px-4 font-medium">Statut</th>
                  <th className="py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-700">{payment.id}</td>
                    <td className="py-4 px-4">{payment.user}</td>
                    <td className="py-4 px-4 font-medium">{payment.amount}</td>
                    <td className="py-4 px-4">{payment.date}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
  