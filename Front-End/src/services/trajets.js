import api from './api';

export const getAllTrajets = () => api.get('/trajets');
export const getTrajetById = (id) => api.get(`/trajets/${id}`);
export const createTrajet = (data) => api.post('/trajets', data);
export const updateTrajet = (id, data) => api.put(`/trajets/${id}`, data);
export const deleteTrajet = (id) => api.delete(`/trajets/${id}`);

export const cancelTrajet = (rideId) => api.patch(`/trajets/${rideId}/cancel`);
export const en_coursTrajet = (rideId) => api.patch(`/trajets/${rideId}/en_cours`);
export const termineTrajet = (rideId) => api.patch(`/trajets/${rideId}/termine`);



// export const searchTrajets = () => api.get('/trajets/recherche');
export const searchTrajets = async (params) => {
    try {
      const searchParams = {
        lieu_depart: params.departure || '',
        lieu_arrivee: params.destination || '',
        date_depart: params.date || '',
        nombre_places: params.passengers || '',
        min_prix: params.minPrice || '',
        max_prix: params.maxPrice || '',
        fumeur_autorise: params.smokeAllowed,
        bagages_autorises: params.luggageAllowed
      };
      
      const response = await api.get('/trajets/recherche', { params: searchParams });
      return response.data;
    } catch (error) {
      console.error('Error searching trajets:', error);
      throw error;
    }
  };


  // Add this function to your existing API services
export const getTrajetsByDriverId = (driverId) => api.get(`/conducteur/trajets/${driverId}`);