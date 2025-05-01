import api from './api';

export const submitReview = (reservationId, note, commentaire) => {
  return api.post('/avis', {
    reservation_id: reservationId,
    note,
    commentaire
  });
};

export const hasReviewedReservation = (reservationId) => {
  return api.get(`/avis/reservation/${reservationId}`);
};

export const getConductorReviews = (conductorId) => {
  return api.get(`/avis/conducteur/${conductorId}`);
};

export const updateReview = (reviewId, note, commentaire) => {
  return api.put(`/avis/${reviewId}`, {
    note,
    commentaire
  });
};
