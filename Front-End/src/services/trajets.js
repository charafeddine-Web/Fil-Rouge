import api from './api';

export const getAllTrajets = async () => {
  try {
    console.log('Fetching all trajets');
    const response = await api.get('/trajets');
    console.log('All trajets response:', response.data);
    return response;
  } catch (error) {
    console.error('Error fetching all trajets:', error);
    throw error;
  }
};

export const getTrajetById = async (id) => {
  try {
    console.log('Fetching trajet with ID:', id);
    const response = await api.get(`/trajets/${id}`);
    console.log('Trajet response:', response.data);
    return response;
  } catch (error) {
    console.error('Error fetching trajet:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    throw error;
  }
};

export const createTrajet = (data) => api.post('/trajets', data);
export const updateTrajet = (id, data) => api.put(`/trajets/${id}`, data);
export const deleteTrajet = (id) => api.delete(`/trajets/${id}`);

export const cancelTrajet = (rideId) => api.patch(`/trajets/${rideId}/cancel`);
export const en_coursTrajet = (rideId) => api.patch(`/trajets/${rideId}/en_cours`);
export const termineTrajet = (rideId) => api.patch(`/trajets/${rideId}/termine`);



// export const searchTrajets = () => api.get('/trajets/recherche');
export const searchTrajets = async (params) => {
    try {
      // Formater la date si elle existe
      let formattedDate = null;
      if (params.date) {
        const date = new Date(params.date);
        formattedDate = date.toISOString().split('T')[0]; 
      }

      const searchParams = {
        lieu_depart: params.departure || null,
        lieu_arrivee: params.destination || null,
        date_depart: formattedDate,
        nombre_places: params.passengers || null,
        min_prix: params.minPrice || null,
        max_prix: params.maxPrice || null,
        fumeur_autorise: params.smokeAllowed || null,
        bagages_autorises: params.luggageAllowed || null
      };
      
      // Remove null values from the params
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] === null) {
          delete searchParams[key];
        }
      });
      
      const response = await api.get('/trajets/recherche', { params: searchParams });
      return response.data;
    } catch (error) {
      console.error('Error searching trajets:', error);
      throw error;
    }
  };


export const getTrajetsByDriverId = (driverId) => api.get(`/conducteur/trajets/${driverId}`);