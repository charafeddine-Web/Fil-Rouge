import { Users, BarChart2, AlertTriangle, CreditCard, Clock, MapPin, Car, User, CheckCircle, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import Loader from "../../components/Loader";
import { useState } from 'react';

export default function Overview({ stats, recentActivities }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const formatNumber = (number) => {
    return new Intl.NumberFormat('fr-FR').format(number);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date non disponible';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date invalide';
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  const getActivityIcon = (type, statut) => {
    switch (type) {
      case 'reservation':
        return <Calendar className="text-blue-500" size={20} />;
      case 'trajet':
        switch (statut) {
          case 'en_cours':
            return <Car className="text-green-500" size={20} />;
          case 'termine':
            return <CheckCircle className="text-green-500" size={20} />;
          case 'annule':
            return <AlertTriangle className="text-red-500" size={20} />;
          default:
            return <MapPin className="text-purple-500" size={20} />;
        }
      case 'user':
        return <User className="text-blue-500" size={20} />;
      default:
        return <MapPin className="text-purple-500" size={20} />;
    }
  };

  const getActivityColor = (type, status) => {
    switch (type) {
      case 'reservation':
        return 'bg-blue-50 text-blue-700';
      case 'trajet':
        switch (status) {
          case 'en_cours':
            return 'bg-green-50 text-green-700';
          case 'termine':
            return 'bg-green-50 text-green-700';
          case 'annule':
            return 'bg-red-50 text-red-700';
          default:
            return 'bg-purple-50 text-purple-700';
        }
      case 'user':
        return 'bg-blue-50 text-blue-700';
      default:
        return 'bg-purple-50 text-purple-700';
    }
  };

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'conducteur':
        return 'bg-green-100 text-green-800';
      case 'passager':
        return 'bg-blue-100 text-blue-800';
      
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'Administrateur';
      case 'conducteur':
        return 'Conducteur';
      case 'passager':
        return 'Passager';
      default:
        return role || 'Non défini';
    }
  };

  const paginatedActivities = recentActivities?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) || [];

  const totalPages = Math.ceil((recentActivities?.length || 0) / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
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
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Page {currentPage} sur {totalPages}
              </span>
              <div className="flex space-x-1">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`p-1 rounded-md ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-1 rounded-md ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
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
            paginatedActivities.map((activity, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type, activity.status)}`}>
                    {getActivityIcon(activity.type, activity.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900">
                            {activity.nom || ''} {activity.prenom || ''}
                          </p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(activity.role)}`}>
                            {getRoleLabel(activity.role)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {activity.details || 'Activité récente'}
                        </p>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock size={16} className="mr-1" />
                        {formatDate(activity.activity_date)}
                      </div>
                    </div>
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
