import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { format } from 'date-fns';

const ChatTripInfo = ({ contactId }) => {
  const [tripInfo, setTripInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTripInfo = async () => {
      if (!contactId) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/chat/trip/${contactId}`);
        
        if (response.data && response.data.status && response.data.trip) {
          setTripInfo(response.data.trip);
        } else {
          setTripInfo(null);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching trip info:', err);
        setError('Failed to load trip information');
        setLoading(false);
      }
    };

    fetchTripInfo();
  }, [contactId]);

  if (loading) {
    return (
      <div className="bg-gray-50 p-3 rounded-lg mb-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return null; 
  }

  if (!tripInfo) {
    return null; 
  }

  const formattedDate = tripInfo.date_depart ? 
    format(new Date(tripInfo.date_depart), 'dd MMM yyyy HH:mm') : 
    'Date not available';

  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
      <h3 className="font-semibold text-blue-800 mb-2">Trip Information</h3>
      
      <div className="flex items-center text-gray-700 mb-2">
        <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <span>{formattedDate}</span>
      </div>
      
      <div className="flex items-start text-gray-700 mb-2">
        <svg className="w-4 h-4 mr-2 mt-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        <div>
          <p className="font-medium">From: <span className="font-normal">{tripInfo.lieu_depart}</span></p>
          <p className="font-medium">To: <span className="font-normal">{tripInfo.lieu_arrivee}</span></p>
        </div>
      </div>
      
      {tripInfo.places_reservees && (
        <div className="flex items-center text-gray-700">
          <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <span>Reserved seats: {tripInfo.places_reservees}</span>
        </div>
      )}
    </div>
  );
};

export default ChatTripInfo; 