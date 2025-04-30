import api from './api';

// Submit a review for a completed reservation
export const submitReview = (reservationId, note, commentaire) => {
  return api.post('/avis', {
    reservation_id: reservationId,
    note,
    commentaire
  });
};

// Check if a user has already submitted a review for a reservation
export const hasReviewedReservation = (reservationId) => {
  return api.get(`/avis/reservation/${reservationId}`);
};

// Get all reviews for a specific conductor
export const getConductorReviews = (conductorId) => {
  return api.get(`/avis/conducteur/${conductorId}`);
};

// Update an existing review
export const updateReview = (reviewId, note, commentaire) => {
  return api.put(`/avis/${reviewId}`, {
    note,
    commentaire
  });
};
