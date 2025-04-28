import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await api.get('/conducteur/reservations');
                setReservations(response.data);
            } catch (error) {
                console.error('Error fetching reservations:', error);
                toast.error('Failed to load reservations');
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    const handleStatusChange = async (reservationId, newStatus) => {
        try {
            await api.patch(`/reservations/${reservationId}`, {
                statut: newStatus
            });
            
            setReservations(prevReservations =>
                prevReservations.map(reservation =>
                    reservation.id === reservationId
                        ? { ...reservation, statut: newStatus }
                        : reservation
                )
            );
            
            toast.success(`Reservation ${newStatus === 'confirmee' ? 'accepted' : 'rejected'} successfully`);
        } catch (error) {
            console.error('Error updating reservation status:', error);
            toast.error('Failed to update reservation status');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">My Ride Reservations</h1>
            
            {reservations.length === 0 ? (
                <div className="text-center text-gray-500">
                    No reservations found
                </div>
            ) : (
                <div className="grid gap-6">
                    {reservations.map((reservation) => (
                        <div key={reservation.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-semibold mb-2">
                                        {reservation.trajet.depart} → {reservation.trajet.arrivee}
                                    </h2>
                                    <p className="text-gray-600">
                                        Date: {new Date(reservation.trajet.date_depart).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-600">
                                        Time: {new Date(reservation.trajet.date_depart).toLocaleTimeString()}
                                    </p>
                                    <p className="text-gray-600">
                                        Passenger: {reservation.passager.name}
                                    </p>
                                    <p className="text-gray-600">
                                        Status: <span className={`font-semibold ${
                                            reservation.statut === 'en_attente' ? 'text-yellow-600' :
                                            reservation.statut === 'confirmee' ? 'text-green-600' :
                                            reservation.statut === 'annulee' ? 'text-red-600' :
                                            'text-gray-600'
                                        }`}>
                                            {reservation.statut}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {reservation.statut === 'en_attente' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusChange(reservation.id, 'confirmee')}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(reservation.id, 'annulee')}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reservations;