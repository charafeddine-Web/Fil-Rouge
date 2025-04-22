import api from './api'; 

export const getConducteurByUserId = (userId) =>api.get(`/conducteur/user/${userId}`);

