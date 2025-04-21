
// Composant section Analyses
export default function AnalyticsSection() {
    // Données pour les graphiques
    const monthlyData = [
      { name: 'Jan', users: 400, rides: 240, revenue: 9500 },
      { name: 'Fév', users: 450, rides: 300, revenue: 12000 },
      { name: 'Mar', users: 520, rides: 340, revenue: 14000 },
      { name: 'Avr', users: 580, rides: 390, revenue: 16500 },
      { name: 'Mai', users: 620, rides: 420, revenue: 18000 },
      { name: 'Jun', users: 650, rides: 450, revenue: 19500 },
      { name: 'Jul', users: 680, rides: 470, revenue: 20500 },
      { name: 'Aoû', users: 700, rides: 490, revenue: 21500 },
      { name: 'Sep', users: 720, rides: 510, revenue: 22000 },
      { name: 'Oct', users: 750, rides: 530, revenue: 23000 },
      { name: 'Nov', users: 780, rides: 550, revenue: 24000 },
      { name: 'Déc', users: 800, rides: 580, revenue: 25500 },
    ];
    
    // Données pour les graphiques circulaires
    const vehicleTypeData = [
      { name: 'Citadines', value: 45 },
      { name: 'Berlines', value: 30 },
      { name: 'SUV', value: 15 },
      { name: 'Utilitaires', value: 10 }
    ];
    
    const userAgeData = [
      { name: '18-25', value: 25 },
      { name: '26-35', value: 40 },
      { name: '36-45', value: 20 },
      { name: '46+', value: 15 }
    ];
  
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Analyses et statistiques</h1>
          <div className="flex space-x-2 mt-3 sm:mt-0">
            <select className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="year">Année 2025</option>
              <option value="last_year">Année 2024</option>
              <option value="all">Toutes les données</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Exporter
            </button>
          </div>
        </div>
        
        {/* Graphiques des tendances */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Tendances mensuelles</h2>
          <div className="h-80">
            {/* Ici on placerait un composant LineChart de Recharts */}
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
              <p className="text-gray-500">Graphique des tendances mensuelles</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Utilisateurs</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Trajets</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Revenus (€)</span>
            </div>
          </div>
        </div>
        
        {/* Graphiques circulaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Types de véhicules</h2>
            <div className="h-64">
              {/* Ici on placerait un composant PieChart de Recharts */}
              <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                <p className="text-gray-500">Graphique des types de véhicules</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
              {vehicleTypeData.map((entry, index) => (
                <div key={`vehicle-${index}`} className="flex items-center">
                  <div className={`h-3 w-3 rounded-full mr-2 bg-${['green', 'blue', 'purple', 'yellow'][index]}-500`}></div>
                  <span className="text-sm text-gray-600">{entry.name} ({entry.value}%)</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Âge des utilisateurs</h2>
            <div className="h-64">
              {/* Ici on placerait un composant PieChart de Recharts */}
              <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                <p className="text-gray-500">Graphique des âges utilisateurs</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
              {userAgeData.map((entry, index) => (
                <div key={`age-${index}`} className="flex items-center">
                  <div className={`h-3 w-3 rounded-full mr-2 bg-${['green', 'blue', 'purple', 'yellow'][index]}-500`}></div>
                  <span className="text-sm text-gray-600">{entry.name} ({entry.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Statistiques additionnelles */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Statistiques principales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-gray-500 text-sm">Total utilisateurs</p>
              <p className="text-2xl font-bold mt-1">4,856</p>
              <p className="text-sm text-green-600 mt-2">+15% ce mois</p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-gray-500 text-sm">Total conducteurs</p>
              <p className="text-2xl font-bold mt-1">728</p>
              <p className="text-sm text-green-600 mt-2">+8% ce mois</p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-gray-500 text-sm">Trajets complétés</p>
              <p className="text-2xl font-bold mt-1">24,159</p>
              <p className="text-sm text-green-600 mt-2">+12% ce mois</p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-gray-500 text-sm">Revenus totaux</p>
              <p className="text-2xl font-bold mt-1">357,850€</p>
              <p className="text-sm text-green-600 mt-2">+18% ce mois</p>
            </div>
          </div>
        </div>
        
        {/* Tableau des tendances par ville */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance par ville</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 bg-gray-50">
                  <th className="py-3 px-4 font-medium">Ville</th>
                  <th className="py-3 px-4 font-medium">Utilisateurs</th>
                  <th className="py-3 px-4 font-medium">Conducteurs</th>
                  <th className="py-3 px-4 font-medium">Trajets</th>
                  <th className="py-3 px-4 font-medium">Revenus</th>
                  <th className="py-3 px-4 font-medium">Évolution</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium">Paris</td>
                  <td className="py-4 px-4">1,428</td>
                  <td className="py-4 px-4">215</td>
                  <td className="py-4 px-4">8,540</td>
                  <td className="py-4 px-4 font-medium">124,650€</td>
                  <td className="py-4 px-4 text-green-600">+21%</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium">Lyon</td>
                  <td className="py-4 px-4">845</td>
                  <td className="py-4 px-4">130</td>
                  <td className="py-4 px-4">4,320</td>
                  <td className="py-4 px-4 font-medium">72,540€</td>
                  <td className="py-4 px-4 text-green-600">+15%</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium">Marseille</td>
                  <td className="py-4 px-4">720</td>
                  <td className="py-4 px-4">105</td>
                  <td className="py-4 px-4">3,850</td>
                  <td className="py-4 px-4 font-medium">62,350€</td>
                  <td className="py-4 px-4 text-green-600">+12%</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium">Bordeaux</td>
                  <td className="py-4 px-4">590</td>
                  <td className="py-4 px-4">85</td>
                  <td className="py-4 px-4">2,950</td>
                  <td className="py-4 px-4 font-medium">48,750€</td>
                  <td className="py-4 px-4 text-green-600">+18%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium">Lille</td>
                  <td className="py-4 px-4">480</td>
                  <td className="py-4 px-4">65</td>
                  <td className="py-4 px-4">2,380</td>
                  <td className="py-4 px-4 font-medium">39,450€</td>
                  <td className="py-4 px-4 text-yellow-600">+8%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }