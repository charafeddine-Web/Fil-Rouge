import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";
import Button from "../../components/Button";

const MyReservations = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [reservations, setReservations] = useState({
    upcoming: [],
    past: [],
    canceled: []
  });
  
  useEffect(() => {
    // Simulate fetching reservations data
    const fetchReservations = async () => {
      try {
        setTimeout(() => {
          // This would be replaced with an API call in a real application
          const mockReservations = {
            upcoming: [
              {
                id: "res1",
                ride: {
                  id: "r1",
                  departure: {
                    city: "San Francisco",
                    location: "Caltrain Station",
                    datetime: "2025-05-10T08:00:00",
                  },
                  destination: {
                    city: "Los Angeles",
                    location: "Union Station",
                    datetime: "2025-05-10T16:00:00",
                  },
                },
                driver: {
                  id: "d1",
                  name: "Alex Thompson",
                  image: "/images/drivers/alex.jpg",
                  rating: 4.8,
                  verifiedDriver: true,
                },
                passengers: 2,
                price: 90, // Total price for 2 passengers
                currency: "USD",
                status: "confirmed",
                bookingDate: "2025-04-15T10:30:00",
                paymentMethod: "Credit Card (•••• 1234)",
              },
              {
                id: "res2",
                ride: {
                  id: "r2",
                  departure: {
                    city: "Oakland",
                    location: "Jack London Square",
                    datetime: "2025-05-20T09:30:00",
                  },
                  destination: {
                    city: "Sacramento",
                    location: "Capitol Mall",
                    datetime: "2025-05-20T12:00:00",
                  },
                },
                driver: {
                  id: "d2",
                  name: "Emma Davis",
                  image: "/images/drivers/emma.jpg",
                  rating: 4.9,
                  verifiedDriver: true,
                },
                passengers: 1,
                price: 35,
                currency: "USD",
                status: "pending",
                bookingDate: "2025-04-18T14:45:00",
                paymentMethod: "PayPal",
              }
            ],
            past: [
              {
                id: "res3",
                ride: {
                  id: "r3",
                  departure: {
                    city: "San Francisco",
                    location: "Mission District",
                    datetime: "2025-04-01T10:00:00",
                  },
                  destination: {
                    city: "San Jose",
                    location: "Downtown",
                    datetime: "2025-04-01T11:30:00",
                  },
                },
                driver: {
                  id: "d3",
                  name: "Michael Rodriguez",
                  image: "/images/drivers/michael.jpg",
                  rating: 4.6,
                  verifiedDriver: false,
                },
                passengers: 1,
                price: 28,
                currency: "USD",
                status: "completed",
                bookingDate: "2025-03-25T09:15:00",
                paymentMethod: "Credit Card (•••• 5678)",
                userRated: false,
              },
              {
                id: "res4",
                ride: {
                  id: "r4",
                  departure: {
                    city: "Berkeley",
                    location: "UC Berkeley",
                    datetime: "2025-03-15T15:30:00",
                  },
                  destination: {
                    city: "Palo Alto",
                    location: "Stanford University",
                    datetime: "2025-03-15T16:45:00",
                  },
                },
                driver: {
                  id: "d4",
                  name: "Sophia Chen",
                  image: "/images/drivers/sophia.jpg",
                  rating: 4.7,
                  verifiedDriver: true,
                },
                passengers: 2,
                price: 46,
                currency: "USD",
                status: "completed",
                bookingDate: "2025-03-10T11:20:00",
                paymentMethod: "Apple Pay",
                userRated: true,
                userRating: 5,
              }
            ],
            canceled: [
              {
                id: "res5",
                ride: {
                  id: "r5",
                  departure: {
                    city: "San Francisco",
                    location: "Financial District",
                    datetime: "2025-03-05T07:15:00",
                  },
                  destination: {
                    city: "Santa Clara",
                    location: "Levi's Stadium",
                    datetime: "2025-03-05T08:30:00",
                  },
                },
                driver: {
                  id: "d5",
                  name: "James Wilson",
                  image: "/images/drivers/james.jpg",
                  rating: 4.5,
                  verifiedDriver: false,
                },
                passengers: 1,
                price: 30,
                currency: "USD",
                status: "canceled_by_passenger",
                bookingDate: "2025-02-28T16:40:00",
                cancelDate: "2025-03-01T09:15:00",
                refundAmount: 25.50,
                refundStatus: "processed",
              }
            ]
          };
          
          setReservations(mockReservations);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

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
    const durationMs = end - start;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const handleCancelReservation = (reservationId) => {
    if (window.confirm("Are you sure you want to cancel this reservation? Cancellation policy may apply.")) {
      // This would be an API call in a real application
      console.log(`Cancelling reservation ${reservationId}`);
      
      // For this demo, we'll just move the reservation to the canceled list
      const reservation = reservations.upcoming.find(res => res.id === reservationId);
      if (reservation) {
        const updatedReservation = {
          ...reservation,
          status: "canceled_by_passenger",
          cancelDate: new Date().toISOString(),
          refundAmount: Math.round(reservation.price * 0.85 * 100) / 100, // 85% refund for demo
          refundStatus: "processing"
        };
        
        setReservations({
          upcoming: reservations.upcoming.filter(res => res.id !== reservationId),
          past: reservations.past,
          canceled: [...reservations.canceled, updatedReservation]
        });
      }
    }
  };

  const handleRateRide = (reservationId, rating) => {
    // This would be an API call in a real application
    console.log(`Rating reservation ${reservationId} with ${rating} stars`);
    
    // For this demo, we'll just update the reservation
    const updatedPast = reservations.past.map(res => {
      if (res.id === reservationId) {
        return {
          ...res,
          userRated: true,
          userRating: rating
        };
      }
      return res;
    });
    
    setReservations({
      ...reservations,
      past: updatedPast
    });
  };

  const renderRating = (reservation) => {
    if (!reservation.userRated) {
      return (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Rate your experience:</p>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRateRide(reservation.id, star)}
                className="text-gray-300 hover:text-yellow-400 focus:outline-none transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </button>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-1">Your rating:</p>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg 
                key={star}
                className={`w-5 h-5 ${star <= reservation.userRating ? "text-yellow-400" : "text-gray-300"}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            ))}
          </div>
        </div>
      );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Confirmed</span>;
      case "pending":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case "completed":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Completed</span>;
      case "canceled_by_passenger":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Canceled by You</span>;
      case "canceled_by_driver":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Canceled by Driver</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Reservations</h1>
        
        {/* Tabs */}
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
        
        {/* Empty State */}
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
              <Link to="/search">
                <Button>Find a Ride</Button>
              </Link>
            )}
          </div>
        )}
        
        {/* Reservation Cards */}
        <div className="space-y-6">
          {reservations[activeTab].map((reservation, index) => (
            <motion.div
              key={reservation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-6">
                {/* Reservation Header */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {reservation.ride.departure.city} to {reservation.ride.destination.city}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Booked on {formatDate(reservation.bookingDate)} • 
                        Reservation #{reservation.id.substring(3)}
                      </p>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(reservation.status)}
                  </div>
                </div>
                
                {/* Reservation Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column - Trip Details */}
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
                            <p className="font-medium text-gray-900">{formatTime(reservation.ride.departure.datetime)}</p>
                            <p className="ml-2 text-sm text-gray-500">{formatDate(reservation.ride.departure.datetime)}</p>
                          </div>
                          <p className="text-gray-700">{reservation.ride.departure.city}</p>
                          <p className="text-sm text-gray-500">{reservation.ride.departure.location}</p>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <p className="font-medium text-gray-900">{formatTime(reservation.ride.destination.datetime)}</p>
                            <p className="ml-2 text-sm text-gray-500">{formatDate(reservation.ride.destination.datetime)}</p>
                          </div>
                          <p className="text-gray-700">{reservation.ride.destination.city}</p>
                          <p className="text-sm text-gray-500">{reservation.ride.destination.location}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Duration: {calculateDuration(reservation.ride.departure.datetime, reservation.ride.destination.datetime)}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Passengers: {reservation.passengers}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span>Payment: {reservation.paymentMethod}</span>
                    </div>
                    
                    {reservation.status === "canceled_by_passenger" && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">Cancellation date: {formatDate(reservation.cancelDate)}</p>
                        <p className="text-sm font-medium text-gray-700">
                          Refund: ${reservation.refundAmount} ({reservation.refundStatus})
                        </p>
                      </div>
                    )}
                    
                    {reservation.status === "completed" && renderRating(reservation)}
                  </div>
                  
                  {/* Right Column - Driver & Actions */}
                  <div className="border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                    <p className="font-medium text-gray-600 mb-3">Driver</p>
                    <div className="flex items-center mb-4">
                      <div className="relative">
                        <img
                          src={reservation.driver.image}
                          alt={reservation.driver.name}
                          className="w-12 h-12 rounded-full object-cover mr-3"
                        />
                        {reservation.driver.verifiedDriver && (
                          <span className="absolute bottom-0 right-3 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{reservation.driver.name}</p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(reservation.driver.rating) 
                                  ? "text-yellow-400" 
                                  : i < reservation.driver.rating 
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
                            {reservation.driver.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="font-medium text-gray-700 mb-1">Total Price</p>
                      <p className="text-2xl font-bold text-green-600">${reservation.price}</p>
                      {reservation.passengers > 1 && (
                        <p className="text-xs text-gray-500">
                          (${reservation.price / reservation.passengers} per passenger)
                        </p>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Link to={`/rides/${reservation.ride.id}`} className="block">
                        <Button className="w-full">View Ride Details</Button>
                      </Link>
                      
                      {reservation.status === "confirmed" && (
                        <button
                          onClick={() => handleCancelReservation(reservation.id)}
                          className="w-full py-2 px-4 border border-red-500 text-red-500 font-medium rounded-lg hover:bg-red-50 transition-colors focus:outline-none"
                        >
                          Cancel Reservation
                        </button>
                      )}
                      
                      {(reservation.status === "confirmed" || reservation.status === "pending") && (
                        <Link to={`/messages?ride=${reservation.ride.id}`} className="block">
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
          ))}
        </div>
        
        {/* Find More Rides Button */}
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