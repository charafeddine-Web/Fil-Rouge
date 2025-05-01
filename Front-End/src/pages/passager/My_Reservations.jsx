import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";
import Button from "../../components/Button";
import { getReservationsByUserId, cancelReservation, submitDriverReview } from "../../services/reservations";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const MyReservations = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [reservations, setReservations] = useState({
    upcoming: [],
    past: [],
    canceled: []
  });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  
  const { user, loadingUser } = useContext(AuthContext);
  
  useEffect(() => {
    const fetchReservations = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await getReservationsByUserId(user.id);
        const allReservations = response.data;

        // Categorize reservations based on status
        const categorizedReservations = {
          upcoming: allReservations.filter(res => 
            ['en_attente'].includes(res.status)
          ),
          past: allReservations.filter(res => 
            ['confirmee'].includes(res.status)
          ),
          canceled: allReservations.filter(res => 
            ['annulee'].includes(res.status)
          )
        };
        
        setReservations(categorizedReservations);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        toast.error("Failed to load your reservations");
      } finally {
        setLoading(false);
      }
    };

    if (!loadingUser) {
      fetchReservations();
    }
  }, [user, loadingUser]);

  const formatDate = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateDuration = (startDateTime, endDateTime) => {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error("Invalid date(s)");
      return "Date invalide";
    }
    const durationMs = end - start;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const handleCancelReservation = async (reservationId) => {
    if (window.confirm("Are you sure you want to cancel this reservation? Cancellation policy may apply.")) {
      try {
        await cancelReservation(reservationId);
        toast.success("Reservation cancelled successfully");
        
        // Refresh the reservations list
        const response = await getReservationsByUserId(user.id);
        const allReservations = response.data;
        const categorizedReservations = {
          upcoming: allReservations.filter(res => 
            ['en_attente'].includes(res.status)
          ),
          past: allReservations.filter(res => 
            ['confirmee'].includes(res.status)
          ),
          canceled: allReservations.filter(res => 
            ['annulee'].includes(res.status)
          )
        };
        
        setReservations(categorizedReservations);
      } catch (error) {
        console.error("Error canceling reservation:", error);
        toast.error("Failed to cancel reservation. Please try again.");
      }
    }
  };

  const handleRateRide = async (reservationId, note_moyenne, commentaire) => {
    try {
      const response = await submitDriverReview(reservationId, note_moyenne, commentaire);
      toast.success("Review submitted successfully");
      
      const reservation = reservations.past.find(res => res.id === reservationId);
      const conducteurId = reservation?.trajet?.conducteur?.id;
      
      const updatedPast = reservations.past.map(res => {
        if (res.id === reservationId) {
          return {
            ...res,
            userRated: true,
            userRating: note_moyenne,
            userComment: commentaire
          };
        }
        
        if (conducteurId && res.trajet?.conducteur?.id === conducteurId) {
          return {
            ...res,
            trajet: {
              ...res.trajet,
              conducteur: {
                ...res.trajet.conducteur,
                note_moyenne: response.data.new_average || res.trajet.conducteur.note_moyenne
              }
            }
          };
        }
        
        return res;
      });
      
      setReservations({
        ...reservations,
        past: updatedPast
      });

      // Reset rating form
      setRating(0);
      setComment("");
      setSelectedReservationId(null);
    } catch (error) {
      console.error("Error rating driver:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to submit review. Please try again.");
      }
    }
  };

  const renderRating = (reservation) => {
    if (reservation.status === "confirmee" && !reservation.userRated && !reservation.avis) {
      return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-md font-semibold text-gray-800 mb-2">Rate your experience with the driver</h3>
          
          <div className="flex items-center mb-3">
            <p className="text-sm text-gray-600 mr-2">Your rating:</p>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => {
                    setRating(star);
                    setSelectedReservationId(reservation.id);
                  }}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="focus:outline-none transition-colors"
                >
                  <svg 
                    className={`w-6 h-6 ${
                      star <= (hoveredStar || (selectedReservationId === reservation.id ? rating : 0)) 
                        ? "text-yellow-400" 
                        : "text-gray-300"
                    }`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="comment" className="block text-sm text-gray-600 mb-1">
              Leave a comment (optional):
            </label>
            <textarea
              id="comment"
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="How was your experience with the driver?"
              value={selectedReservationId === reservation.id ? comment : ""}
              onChange={(e) => {
                setComment(e.target.value);
                setSelectedReservationId(reservation.id);
              }}
            ></textarea>
          </div>
          
          <button
            disabled={selectedReservationId !== reservation.id || rating === 0}
            onClick={() => handleRateRide(reservation.id, rating, comment)}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              selectedReservationId === reservation.id && rating > 0 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Submit Review
          </button>
        </div>
      );
    } else if (reservation.userRated || reservation.avis) {
      const reviewData = reservation.userRated 
        ? { note: reservation.userRating, commentaire: reservation.userComment }
        : reservation.avis;
        
      return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-md font-semibold text-gray-800 mb-2">Your review</h3>
          <div className="flex items-center mb-2">
            <p className="text-sm text-gray-600 mr-2">Your rating:</p>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg 
                  key={star}
                  className={`w-5 h-5 ${star <= (reviewData?.note || 0) ? "text-yellow-400" : "text-gray-300"}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              ))}
            </div>
          </div>
          {reviewData?.commentaire && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Your comment:</p>
              <p className="text-sm text-gray-800 italic">{reviewData.commentaire}</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmee":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Confirmed</span>;
      case "en_attente":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case "annulee":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Canceled</span>;
      default:
        return null;
    }
  };

  // Show loader while user data is being fetched
  if (loadingUser) {
    return <Loader />;
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Please log in to view your reservations</h1>
        <Link to="/login">
          <Button>Go to Login</Button>
        </Link>
      </div>
    );
  }

  // Show loader while reservations are being fetched
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Reservations</h1>
        
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`px-6 py-3 font-medium text-sm focus:outline-none ${
              activeTab === "upcoming"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming ({reservations.upcoming.length})
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm focus:outline-none ${
              activeTab === "past"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("past")}
          >
            Past ({reservations.past.length})
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm focus:outline-none ${
              activeTab === "canceled"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("canceled")}
          >
            Canceled ({reservations.canceled.length})
          </button>
        </div>
        
        {reservations[activeTab].length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {activeTab === "upcoming"
                ? "No upcoming reservations"
                : activeTab === "past"
                ? "No past reservations"
                : "No canceled reservations"}
            </h2>
            <p className="text-gray-600 mb-6">
              {activeTab === "upcoming"
                ? "You don't have any upcoming ride reservations yet."
                : activeTab === "past"
                ? "You haven't completed any rides yet."
                : "You don't have any canceled reservations."}
            </p>
            {activeTab === "upcoming" && (
              <Link to="/offer-ride">
                <Button>Find a Ride</Button>
              </Link>
            )}
          </div>
        )}
        
        <div className="space-y-6">
          {reservations[activeTab].map((reservation, index) => {
            const trajet = reservation.trajet || {};
            const departureCity = trajet.lieu_depart || '';
            const arrivalCity = trajet.lieu_arrivee || '';
            const dateDepart = trajet.date_depart || '';
            const dateArrivee = trajet.date_arrivee_prevue || dateDepart; // Fallback to departure date if arrival date is not available
            
            return (
              <motion.div
                key={reservation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="mr-4">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                          {departureCity} to {arrivalCity}
                        </h2>
                        <p className="text-sm text-gray-500">
                          Booked on {formatDate(reservation.date_reservation)} • 
                          Reservation #{reservation.id}
                        </p>
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(reservation.status)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <div className="flex items-start mb-6">
                        <div className="min-w-8 mr-4">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </div>
                          <div className="h-14 w-px bg-green-200 mx-auto my-1"></div>
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <div className="mb-6">
                            <div className="flex items-center">
                              <p className="font-medium text-gray-900">{formatTime(dateDepart)}</p>
                              <p className="ml-2 text-sm text-gray-500">{formatDate(dateDepart)}</p>
                            </div>
                            <p className="text-gray-700">{departureCity}</p>
                            <p className="text-sm text-gray-500">{trajet.lieu_depart_details || departureCity}</p>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium text-gray-900">{formatTime(dateArrivee)}</p>
                              <p className="ml-2 text-sm text-gray-500">{formatDate(dateArrivee)}</p>
                            </div>
                            <p className="text-gray-700">{arrivalCity}</p>
                            <p className="text-sm text-gray-500">{trajet.lieu_arrivee_details || arrivalCity}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Duration: {calculateDuration(dateDepart, dateArrivee)}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Reserved Seats: {reservation.places_reservees || 1}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span>Payment: {reservation.methode_paiement || "Cash"}</span>
                      </div>
                      
                      <div className="mb-4">
                        <p className="font-medium text-gray-700 mb-1">Price Details</p>
                        
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm text-gray-600">Price per seat:</p>
                          <p className="text-sm font-semibold">${trajet.prix_par_place || "N/A"}</p>
                        </div>
                        
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm text-gray-600">Seats reserved:</p>
                          <p className="text-sm font-semibold">{reservation.places_reservees || 1}</p>
                        </div>
                        
                        <div className="border-t border-gray-200 my-2"></div>
                        
                        <div className="flex justify-between items-center">
                          <p className="text-md font-medium text-gray-800">Total:</p>
                          <p className="text-2xl font-bold text-green-600">
                            ${reservation.prix_total || 
                              (trajet.prix_par_place && reservation.places_reservees 
                                ? (trajet.prix_par_place * reservation.places_reservees).toFixed(2) 
                                : "N/A")}
                          </p>
                        </div>
                      </div>
                      
                      {reservation.status === "annulee" && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">Cancellation date: {formatDate(reservation.date_annulation || reservation.updated_at)}</p>
                          <p className="text-sm font-medium text-gray-700">
                            Refund: ${reservation.prix_total || 
                              (trajet.prix_par_place && reservation.places_reservees 
                                ? (trajet.prix_par_place * reservation.places_reservees).toFixed(2) 
                                : "N/A")} (Processing)
                          </p>
                        </div>
                      )}
                      
                      {activeTab === "past" && renderRating(reservation)}
                    </div>
                    
                    <div className="border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                      <p className="font-medium text-gray-600 mb-3">Driver</p>
                      {trajet.conducteur ? (
                        <div className="flex items-center mb-4">
                          <div className="relative">
                            <img
                              src={trajet.conducteur.image || "https://via.placeholder.com/80"}
                              alt={trajet.conducteur.user.nom || "Driver"}
                              className="w-12 h-12 rounded-full object-cover mr-3"
                            />
                            {trajet.conducteur.user.email_verified && (
                              <span className="absolute bottom-0 right-3 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{trajet.conducteur.user.nom +' '+ trajet.conducteur.user.prenom || "Driver"}</p>
                            {trajet.conducteur.note_moyenne && (
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(trajet.conducteur.note_moyenne) 
                                        ? "text-yellow-400" 
                                        : i < trajet.conducteur.note_moyenne 
                                          ? "text-yellow-200" 
                                          : "text-gray-300"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                  </svg>
                                ))}
                                <span className="ml-1 text-xs text-gray-600">
                                  {trajet.conducteur.note}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 mb-4">Driver information not available</p>
                      )}
                      
                      <div className="space-y-2">
                        <Link to={`/ride/${trajet.id}`} className="block">
                          <Button className="w-full">View Ride Details</Button>
                        </Link>
                        
                        {reservation.status === "en_attente" && (
                          <button
                            onClick={() => handleCancelReservation(reservation.id)}
                            className="w-full py-2 px-4 border border-red-500 text-red-500 font-medium rounded-lg hover:bg-red-50 transition-colors focus:outline-none"
                          >
                            Cancel Reservation
                          </button>
                        )}
                        
                        {(reservation.status === "confirmee" || reservation.status === "en_attente") && (
                          <Link to={`/messages?ride=${trajet.id}`} className="block">
                            <button className="w-full py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none flex items-center justify-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              Message Driver
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {activeTab === "upcoming" && reservations.upcoming.length > 0 && (
          <div className="mt-8 text-center">
            <Link to="/search">
              <Button variant="outline" className="px-6">Find More Rides</Button>
            </Link>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default MyReservations;