import api from './api';

const adminService = {
    // Dashboard
    getDashboardStats: async () => {
        try {
            const response = await api.get('/admin/dashboard');
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    },

    // Analytics
    getAnalytics: async () => {
        try {
            const response = await api.get('/admin/analytics');
            return response.data;
        } catch (error) {
            console.error('Error fetching analytics:', error);
            throw error;
        }
    },

    // Recent Activities
    getRecentActivities: async () => {
        try {
            const response = await api.get('/admin/dashboard/activities');
            return response.data;
        } catch (error) {
            console.error('Error fetching recent activities:', error);
            throw error;
        }
    },

    // Revenue Stats
    getRevenueStats: async () => {
        try {
            const response = await api.get('/admin/dashboard/revenue');
            return response.data;
        } catch (error) {
            console.error('Error fetching revenue stats:', error);
            throw error;
        }
    },

    // User Management
    getUsers: async (search = '') => {
        try {
            const response = await api.get('/admin/users', {
                params: { search }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    updateUserStatus: async (userId, status) => {
        try {
            const response = await api.patch(`/admin/users/${userId}/status`, { status: status });
            return response.data;
        } catch (error) {
            console.error('Error updating user status:', error);
            throw error;
        }
    },

    // Driver Management
    getDrivers: async (search = '') => {
        try {
            const response = await api.get('/admin/drivers', {
                params: { search }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching drivers:', error);
            throw error;
        }
    },

    // updateDriverStatus: async (driverId, status) => {
    //     try {
    //         const response = await api.patch(`/admin/drivers/${driverId}/status`, { statut: status });
    //         return response.data;
    //     } catch (error) {
    //         console.error('Error updating driver status:', error);
    //         throw error;
    //     }
    // },

    // Ride Management
    getRides: async (search = '', status = '') => {
        try {
            const response = await api.get('/admin/rides', {
                params: { search, status }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching rides:', error);
            throw error;
        }
    },

    updateRideStatus: async (rideId, status) => {
        try {
            const response = await api.patch(`/admin/rides/${rideId}/status`, { statut: status });
            return response.data;
        } catch (error) {
            console.error('Error updating ride status:', error);
            throw error;
        }
    },

    // Reservation Management
    getReservations: async (search = '') => {
        try {
            const response = await api.get('/admin/reservations', {
                params: { search }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching reservations:', error);
            throw error;
        }
    },

    // Complaints Management
    getComplaints: async (search = '') => {
        try {
            const response = await api.get('/admin/complaints', {
                params: { search }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching complaints:', error);
            throw error;
        }
    },

    updateComplaintStatus: async (complaintId, status) => {
        try {
            const response = await api.patch(`/admin/complaints/${complaintId}/status`, { statut: status });
            return response.data;
        } catch (error) {
            console.error('Error updating complaint status:', error);
            throw error;
        }
    },

    // Payment Management
    getPayments: async (search = '') => {
        try {
            const response = await api.get('/admin/payments', {
                params: { search }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching payments:', error);
            throw error;
        }
    },

    getPaymentStats: async () => {
        try {
            const response = await api.get('/admin/payments/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching payment stats:', error);
            throw error;
        }
    }
};

export default adminService; 