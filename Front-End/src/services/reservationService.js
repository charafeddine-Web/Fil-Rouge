import api from './api';

export const getReservationsByUserId = (userId) => api.get(`/reservations?user_id=${userId}`);

export const getReservationsByDriverId = (driverId) => api.get(`/reservations?conducteur_id=${driverId}`);

export const approveReservation = (reservationId) => api.patch(`/reservations/${reservationId}`, { status: 'confirmee' });

export const rejectReservation = (reservationId) => api.patch(`/reservations/${reservationId}`, { status: 'annulee' });

export const cancelReservation = (reservationId) => api.patch(`/reservations/${reservationId}`, { status: 'annulee' }); 