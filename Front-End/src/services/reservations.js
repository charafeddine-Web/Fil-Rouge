import api from './api';

// export const getReservationsByTrajetId = (trajetId) => api.get(`/reservations?trajet_id=${trajetId}`);

export const approveReservation = (reservationId) => api.patch(`/reservations/${reservationId}`, { status: 'confirmee' });
export const rejectReservation = (reservationId) => api.patch(`/reservations/${reservationId}`, { status: 'annulee' });
export const getReservationsByDriverId = (driverId) => api.get(`/reservations?conducteur_id=${driverId}`);
