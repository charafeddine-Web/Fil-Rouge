import api from './api';
import axios from 'axios';

// export const getReservationsByTrajetId = (trajetId) => api.get(`/reservations?trajet_id=${trajetId}`);

export const approveReservation = (reservationId) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;
  console.log("Current user role for approveReservation:", role);
  
  const requestData = { status: 'confirmee' };
  console.log(`Making approve reservation request to /reservations/${reservationId}`, requestData);
  
  return api.patch(`/reservations/${reservationId}`, requestData);
};

export const rejectReservation = (reservationId) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;
  console.log("Current user role for rejectReservation:", role);
  
  const requestData = { status: 'annulee' };
  console.log(`Making reject reservation request to /reservations/${reservationId}`, requestData);
  return api.patch(`/reservations/${reservationId}`, requestData);
};

// export const getReservationsByDriverId = () => api.get(`/conducteur/reservations`);
export const getReservationsByDriverId = (driverId) => api.get(`/reservations?conducteur_id=${driverId}`);

export const getReservationsByTrajetId = (trajetId) => api.get(`/reservations?trajet_id=${trajetId}`);

export const getReservations = (trajetId) => api.get(`/reservations?trajet_id=${trajetId}`);

export const createReservation = (reservationData) => {
  console.log("Sending reservation data to API:", reservationData);
  return api.post('/reservations', reservationData);
};

export const cancelReservation = (reservationId) =>  api.patch(`/reservations/${reservationId}/cancel`, { status: 'annulee' });
// export const cancelReservation = (reservationId) => api.delete(`/reservations/${reservationId}`, { status: 'annulee' });

// export const getReservationsByUserId = () => api.get(`/passager/reservations`);

// export const getReservationsByUserId = (userId) => api.get(`/reservations/${userId}`);
export const getReservationsByUserId = (userId) => api.get(`/reservations/${userId}`);

// Add this new function to submit a review
export const submitDriverReview = async (reservationId, note, commentaire) => {
  try {
    const response = await api.post('/avis', {
      reservation_id: reservationId,
      note: note,
      commentaire: commentaire
    });
    return response;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};





