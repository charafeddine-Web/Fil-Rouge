import api from './api'; 

export const getConducteurByUserId = (userId) =>api.get(`/conducteur/user/${userId}`);
// export const getReservationsByDriverId = (conducteurid) =>api.get(`/conducteur/reservation/${conducteurid}`);

