import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Button from "../components/Button";
import { getTrajetById } from "../services/trajets";
import { createReservation } from "../services/reservations";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const RideDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [ride, setRide] = useState(null);
  const [seats, setSeats] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRideDetails = async () => {
      if (!id) {
        setError("No ride ID provided");
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching ride details for ID:', id);
        const response = await getTrajetById(id);
        console.log('Ride details response:', response);
        
        if (!response.data) {
          setError("No data received from the server");
          setLoading(false);
          return;
        }

        const rideData = response.data;
        console.log('Ride data:', rideData);
        
        setRide({
          id: rideData.id,
          driver: {
            id: rideData.conducteur?.id,
            name: rideData.conducteur?.user?.nom || 'Unknown Driver',
            prenom: rideData.conducteur?.user?.prenom || 'Unknown Driver',
            rating: rideData.conducteur?.note_moyenne || 0.0,
            reviewCount: rideData.conducteur?.review_count || 0,
            image: rideData.conducteur?.user?.photoDeProfil || '/placeholder-avatar.jpg',
            joinedDate: new Date(rideData.conducteur?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
            verifiedDriver: true,
          },
          departure: {
            city: rideData.lieu_depart,
            location: rideData.point_depart || rideData.lieu_depart,
            address: rideData.point_depart || rideData.lieu_depart,
            datetime: rideData.date_depart,
          },
          destination: {
            city: rideData.lieu_arrivee,
            location: rideData.point_arrivee || rideData.lieu_arrivee,
            address: rideData.point_arrivee || rideData.lieu_arrivee,
            datetime: rideData.date_arrivee_prevue,
          },
          vehicle: {
            make: rideData.conducteur?.vehicule?.marque || 'Unknown',
            model: rideData.conducteur?.vehicule?.modele || 'Unknown',
            year: rideData.conducteur?.vehicule?.annee || 'Unknown',
            color: rideData.conducteur?.vehicule?.couleur || 'Unknown',
            licensePlate: rideData.conducteur?.vehicule?.immatriculation || 'Unknown',
            image: '/images/vehicles/default.jpg',
          },
          price: rideData.prix_par_place,
          currency: "MAD",
          availableSeats: rideData.nombre_places,
          totalSeats: rideData.conducteur?.vehicule?.nombre_places || 4,
          amenities: [
            rideData.fumeur_autorise ? "Smoking allowed" : "No smoking",
            rideData.bagages_autorises ? "Luggage space" : "No luggage",
            "Air conditioning",
            "USB charger",
          ],
          rules: [
            rideData.fumeur_autorise ? "Smoking allowed" : "No smoking",
            rideData.bagages_autorises ? "Luggage allowed" : "No luggage",
            "Music by agreement",
          ],
          description: `Comfortable ride from ${rideData.lieu_depart} to ${rideData.lieu_arrivee}.`,
          cancellationPolicy: "Free cancellation up to 24 hours before departure",
        });
      } catch (error) {
        console.error("Error fetching ride details:", error);
        setError(error.response?.data?.message || "Error loading ride details");
        toast.error(error.response?.data?.message || "Error loading ride details");
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info("You must be logged in to book a ride");
      navigate('/login');
      return;
    }
    
    if (user.role !== 'passager') {
      toast.error("You must have a passenger account to book a ride");
      return;
    }
    
    try {
      setLoading(true);
      const reservationData = {
        trajet_id: ride.id,
        passager_id: user.id,
        nombre_places: seats,
        places_reservees: seats,
        prix_total: ride.prix_par_place * seats,
        status: 'en_attente',
        date_reservation: new Date().toISOString(),
        message: "I would like to book this ride"
      };
      
      console.log("Creating reservation with data:", reservationData);
      const response = await createReservation(reservationData);
      
      if (response.data) {
        toast.success("Reservation created successfully!");
        
        // Refresh ride details to update available seats
        try {
          const updatedRideResponse = await getTrajetById(id);
          if (updatedRideResponse.data) {
            const rideData = updatedRideResponse.data;
            setRide(prevRide => ({
              ...prevRide,
              availableSeats: rideData.nombre_places
            }));
          }
        } catch (refreshError) {
          console.error("Error refreshing ride details:", refreshError);
        }
        
        navigate('/Myreservations');
      }
    } catch (error) {
      console.error("Error creating reservation:", error);
      
      if (error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to perform this action.");
      } else if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || "Invalid reservation data.");
      } else if (error.response?.status === 409) {
        toast.error("You already have a reservation for this trip or no seats are available.");
      } else if (error.response?.data?.message && error.response.data.message.includes("places disponibles")) {
        // Specific error for no available seats
        toast.error("Sorry, all seats for this trip are booked.");
        // Disable the booking button and update UI
        setRide(prevRide => ({
          ...prevRide,
          availableSeats: 0
        }));
      } else {
        toast.error(error.response?.data?.message || "Error creating reservation");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateTimeString).toLocaleDateString('en-US', options);
  };

  const calculateDuration = (startDateTime, endDateTime) => {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    const durationMs = end - start;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

 
  if (loading) {
    return (
      <>
        <Header/>
        <div className="my-20">
        <Loader/>
        </div>
        <Footer/> 
      </>   
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link to="/offer-ride">
              <Button>Back to Search</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Ride Not Found</h1>
            <p className="text-gray-600 mb-6">The ride you're looking for doesn't exist or has been removed.</p>
            <Link to="/offer-ride">
              <Button>Search for Rides</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="text-gray-600 hover:text-green-500">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <Link to="/search" className="ml-1 text-gray-600 hover:text-green-500 md:ml-2">
                    Search
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-1 text-gray-500 md:ml-2">
                    {ride.departure.city} to {ride.destination.city}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ride Information */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="bg-green-600 text-white p-6">
                  <h1 className="text-2xl font-bold mb-4">
                    {ride.departure.city} to {ride.destination.city}
                  </h1>
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <div>
                      <p className="text-lg">
                        {formatDateTime(ride.departure.datetime)}
                      </p>
                      <p className="text-sm opacity-90">{ride.departure.location}</p>
                    </div>
                    <div className="flex items-center my-2 md:my-0">
                      <div className="h-1 w-10 bg-white rounded-full mx-4"></div>
                      <div className="text-center">
                        <p className="font-bold">{calculateDuration(ride.departure.datetime, ride.destination.datetime)}</p>
                        <p className="text-xs">Duration</p>
                      </div>
                      <div className="h-1 w-10 bg-white rounded-full mx-4"></div>
                    </div>
                    <div>
                      <p className="text-lg">
                        {formatDateTime(ride.destination.datetime)}
                      </p>
                      <p className="text-sm opacity-90">{ride.destination.location}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Driver Information */}
                  <div className="flex items-center mb-6">
                    <img
                      src={ride.driver.image}
                      alt={ride.driver.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h2 className="text-xl font-semibold">{ride.driver.name} {ride.driver.prenom}</h2>
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1">{ride.driver.rating}</span>
                        <span className="text-gray-500 ml-1">({ride.driver.reviewCount} reviews)</span>
                      </div>
                      <p className="text-gray-600">Member since {ride.driver.joinedDate}</p>
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Vehicle Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600">Make</p>
                        <p className="font-medium">{ride.vehicle.make}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Model</p>
                        <p className="font-medium">{ride.vehicle.model}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Year</p>
                        <p className="font-medium">{ride.vehicle.year}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Color</p>
                        <p className="font-medium">{ride.vehicle.color}</p>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {ride.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Rules */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Rules</h3>
                    <ul className="list-disc list-inside text-gray-600">
                      {ride.rules.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-600">{ride.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {ride.price} MAD
                  </h2>
                  <p className="text-gray-600">per seat</p>
                </div>

                <form onSubmit={handleBooking}>
                  <div className="mb-6">
                    <label htmlFor="seats" className="block text-sm font-medium text-gray-700 mb-2">
                      Number of seats
                    </label>
                    <select
                      id="seats"
                      value={seats}
                      onChange={(e) => setSeats(parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {[...Array(ride.availableSeats)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? 'seat' : 'seats'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-6">
                    <p className="text-2xl font-bold text-gray-800">
                      {ride.price * seats} MAD
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={ride.availableSeats <= 0}
                  >
                    {ride.availableSeats > 0 ? 'Book' : 'Full'}
                  </Button>
                </form>

                {ride.availableSeats <= 0 && (
                  <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
                    This ride is full. All seats are booked.
                  </div>
                )}

                <div className="mt-6 text-sm text-gray-600">
                  <p className="mb-2">Cancellation Policy:</p>
                  <p>{ride.cancellationPolicy}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default RideDetails;