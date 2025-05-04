import api from './api'; 

export const getConducteurByUserId = (userId) => api.get(`/conducteur/user/${userId}`);

export const getReservationsByDriverId = (conducteurId) => api.get(`/conducteur/reservation/${conducteurId}`);

export const updateConducteur = (data, token) => {
  return api.put('/conducteur/profile', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    }
  });
};

