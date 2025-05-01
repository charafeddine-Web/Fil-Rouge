import Loader from "../../components/Loader";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState, useEffect } from 'react';
import adminService from '../../services/admin';

// Composant section Analyses
export default function AnalyticsSection() {
    const [loading, setLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const data = await adminService.getAnalytics();
                setAnalyticsData(data);
            } catch (err) {
                setError('Erreur lors du chargement des données');
                console.error('Error fetching analytics:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    // Couleurs pour les graphiques
    const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'];

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-4">
                {error}
            </div>
        );
    }

    // Transformer les données du backend pour les graphiques
    const monthlyData = analyticsData?.daily_reservations?.map(item => ({
        name: new Date(item.date).toLocaleDateString('fr-FR', { month: 'short' }),
        reservations: item.count,
        users: analyticsData.user_growth.find(u => u.date === item.date)?.count || 0,
        revenue: analyticsData.revenue.find(r => r.date === item.date)?.total || 0
    })) || [];

    // Calculer les totaux
    const totalReservations = analyticsData?.daily_reservations?.reduce((acc, curr) => acc + curr.count, 0) || 0;
    const totalUsers = analyticsData?.user_growth?.reduce((acc, curr) => acc + curr.count, 0) || 0;
    const totalRevenue = Number(analyticsData?.revenue?.reduce((acc, curr) => acc + (curr.total || 0), 0)) || 0;

    // Données pour les graphiques circulaires
    const roleData = [
        { name: 'Passagers', value: analyticsData?.role_stats?.passagers || 0 },
        { name: 'Conducteurs', value: analyticsData?.role_stats?.conducteurs || 0 }
    ];

    const vehicleData = Object.entries(analyticsData?.vehicle_stats || {}).map(([type, count]) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        value: count
    }));

    // Calculer les pourcentages de croissance
    const calculateGrowth = (data) => {
        if (!data || data.length < 2) return 0;
        const lastValue = data[data.length - 1].count;
        const previousValue = data[data.length - 2].count;
        return previousValue === 0 ? 0 : ((lastValue - previousValue) / previousValue) * 100;
    };

    const reservationsGrowth = calculateGrowth(analyticsData?.daily_reservations) || 0;
    const usersGrowth = calculateGrowth(analyticsData?.user_growth) || 0;
    const revenueGrowth = calculateGrowth(analyticsData?.revenue) || 0;

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Analyses et statistiques</h1>
                {/* <div className="flex space-x-2 mt-3 sm:mt-0">
                    <select className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value="year">Année 2025</option>
                        <option value="last_year">Année 2024</option>
                        <option value="all">Toutes les données</option>
                    </select>
                    <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Exporter
                    </button>
                </div> */}
            </div>
            
            {/* Graphiques des tendances */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Tendances mensuelles</h2>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="users" stroke="#10B981" name="Nouveaux utilisateurs" />
                            <Line yAxisId="left" type="monotone" dataKey="reservations" stroke="#3B82F6" name="Réservations" />
                            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#8B5CF6" name="Revenus (€)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                    <div className="flex items-center">
                        <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-600">Nouveaux utilisateurs</span>
                    </div>
                    <div className="flex items-center">
                        <div className="h-3 w-3 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-600">Réservations</span>
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
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Répartition des rôles</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={roleData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {roleData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {roleData.map((entry, index) => (
                            <div key={`role-${index}`} className="flex items-center">
                                <div className={`h-3 w-3 rounded-full mr-2 bg-${['green', 'blue'][index]}-500`}></div>
                                <span className="text-sm text-gray-600">{entry.name} ({entry.value})</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Types de véhicules</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={vehicleData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {vehicleData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {vehicleData.map((entry, index) => (
                            <div key={`vehicle-${index}`} className="flex items-center">
                                <div className={`h-3 w-3 rounded-full mr-2 bg-${['green', 'blue', 'purple', 'yellow'][index]}-500`}></div>
                                <span className="text-sm text-gray-600">{entry.name} ({entry.value})</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Statistiques principales */}
            {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Statistiques principales</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <p className="text-gray-500 text-sm">Total utilisateurs</p>
                        <p className="text-2xl font-bold mt-1">{totalUsers}</p>
                        <p className={`text-sm ${usersGrowth >= 0 ? 'text-green-600' : 'text-red-600'} mt-2`}>
                            {usersGrowth >= 0 ? '+' : ''}{usersGrowth.toFixed(1)}% ce mois
                        </p>
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <p className="text-gray-500 text-sm">Total réservations</p>
                        <p className="text-2xl font-bold mt-1">{totalReservations}</p>
                        <p className={`text-sm ${reservationsGrowth >= 0 ? 'text-green-600' : 'text-red-600'} mt-2`}>
                            {reservationsGrowth >= 0 ? '+' : ''}{reservationsGrowth.toFixed(1)}% ce mois
                        </p>
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <p className="text-gray-500 text-sm">Revenus totaux</p>
                        <p className="text-2xl font-bold mt-1">{totalRevenue.toFixed(2)}€</p>
                        <p className={`text-sm ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'} mt-2`}>
                            {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}% ce mois
                        </p>
                    </div>
                </div>
            </div> */}
        </div>
    );
}