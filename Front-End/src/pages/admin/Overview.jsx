import { Users, BarChart2, AlertTriangle, CreditCard, Clock, MapPin, Car, User } from 'lucide-react';
import Loader from "../../components/Loader";

export default function Overview({ stats, recentActivities }) {
  const formatNumber = (number) => {
    return new Intl.NumberFormat('us-US').format(number);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('us-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('us-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (status) => {
    switch (status) {
      case 'en_cours':
        return <Car className="text-blue-500" size={20} />;
      case 'termine':
        return <CheckCircle className="text-green-500" size={20} />;
      default:
        return <MapPin className="text-purple-500" size={20} />;
    }
  };

  const getActivityColor = (status) => {
    switch (status) {
      case 'en_cours':
        return 'bg-blue-50 text-blue-700';
      case 'termine':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-purple-50 text-purple-700';
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'driver':
        return 'bg-green-100 text-green-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Utilisateurs</p>
              <p className="text-2xl font-semibold">{formatNumber(stats?.total_users || 0)}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Users className="text-blue-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Conducteurs</p>
              <p className="text-2xl font-semibold">{formatNumber(stats?.total_drivers || 0)}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <Users className="text-green-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Trajets Actifs</p>
              <p className="text-2xl font-semibold">{formatNumber(stats?.active_rides || 0)}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <BarChart2 className="text-yellow-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Revenus Totaux</p>
              <p className="text-2xl font-semibold">{formatCurrency(stats?.total_revenue || 0)}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <CreditCard className="text-purple-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Activités Récentes</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800">Voir tout</button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {!recentActivities ? (
            <div className="p-6 text-center text-gray-500">
              <Loader />
            </div>
          ) : recentActivities.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Aucune activité récente
            </div>
          ) : (
            recentActivities.map((activity, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.statut)}`}>
                    {getActivityIcon(activity.statut)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900">{activity.nom} {activity.prenom}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(activity.role)}`}>
                            {activity.role === 'admin' ? 'Administrateur' : 
                             activity.role === 'driver' ? 'Conducteur' : 
                             'Utilisateur'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {activity.statut === 'en_cours' ? 'A commencé un trajet' : 
                           activity.statut === 'termine' ? 'A terminé un trajet' : 
                           'A créé un trajet'}
                        </p>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock size={16} className="mr-1" />
                        {formatDate(activity.activity_date)}
                      </div>
                    </div>
                    {activity.details && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p>{activity.details}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
