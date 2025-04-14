import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Button from "../components/Button";

const RideDetails = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ride, setRide] = useState(null);
  const [seats, setSeats] = useState(1);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    // Simulate fetching ride details
    const fetchRideDetails = async () => {
      try {
        // This would be an API call in a production app
        setTimeout(() => {
          setRide({
            id: rideId,
            driver: {
              id: "d123",
              name: "Alex Thompson",
              rating: 4.8,
              reviewCount: 127,
              image: "/images/drivers/alex.jpg",
              joinedDate: "January 2023",
              verifiedDriver: true,
            },
            departure: {
              city: "San Francisco",
              location: "Caltrain Station",
              address: "700 4th St, San Francisco, CA 94107",
              datetime: "2025-04-20T08:00:00",
            },
            destination: {
              city: "Los Angeles",
              location: "Union Station",
              address: "800 N Alameda St, Los Angeles, CA 90012",
              datetime: "2025-04-20T16:00:00",
            },
            vehicle: {
              make: "Toyota",
              model: "Prius",
              year: 2023,
              color: "Blue",
              licensePlate: "ECO-4321",
              image: "/images/vehicles/prius.jpg",
            },
            price: 45,
            currency: "USD",
            availableSeats: 3,
            totalSeats: 4,
            amenities: ["Air conditioning", "USB charger", "Pet friendly", "Luggage space"],
            rules: ["No smoking", "No food", "Music by agreement"],
            description: "Comfortable drive from SF to LA along the coastal route. I'll make one quick stop for refreshments midway. Looking for friendly passengers who enjoy light conversation but also respect quiet time.",
            cancellationPolicy: "Free cancellation up to 24 hours before departure",
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching ride details:", error);
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [rideId]);

  const handleBooking = (e) => {
    e.preventDefault();
    // In a real app, this would submit the booking to an API
    console.log(`Booking ${seats} seat(s) for ride ${rideId}`);
    setShowBookingModal(true);
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
    return <Loader />;
  }

  if (!ride) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Ride Not Found</h1>
            <p className="text-gray-600 mb-6">The ride you're looking for doesn't exist or has been removed.</p>
            <Link to="/search">
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
      <Header />
      
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
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <img
                        src={ride.driver.image}
                        alt={ride.driver.name}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h2 className="text-xl font-semibold">{ride.driver.name}</h2>
                        <div className="flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(ride.driver.rating) 
                                    ? "text-yellow-400" 
                                    : i < ride.driver.rating 
                                      ? "text-yellow-200" 
                                      : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-gray-600">
                            {ride.driver.rating} ({ride.driver.reviewCount} reviews)
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Member since {ride.driver.joinedDate}
                          {ride.driver.verifiedDriver && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Verified Driver
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">About this ride</h3>
                    <p className="text-gray-700">{ride.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Vehicle</h3>
                      <div className="flex items-center">
                        <img
                          src={ride.vehicle.image}
                          alt={`${ride.vehicle.make} ${ride.vehicle.model}`}
                          className="w-24 h-24 object-cover rounded-md mr-4"
                        />
                        <div>
                          <p className="font-medium">
                            {ride.vehicle.make} {ride.vehicle.model} ({ride.vehicle.year})
                          </p>
                          <p className="text-gray-600">{ride.vehicle.color}</p>
                          <p className="text-sm text-gray-500">License: {ride.vehicle.licensePlate}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                      <ul className="grid grid-cols-2 gap-2">
                        {ride.amenities.map((amenity, index) => (
                          <li key={index} className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            <span>{amenity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Ride Rules</h3>
                    <ul className="space-y-2">
                      {ride.rules.map((rule, index) => (
                        <li key={index} className="flex items-center">
                          <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd"></path>
                          </svg>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Pickup & Drop-off</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium text-gray-800 mb-2">Pickup</h4>
                        <p className="text-gray-700 mb-1">{ride.departure.location}</p>
                        <p className="text-gray-600 text-sm">{ride.departure.address}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium text-gray-800 mb-2">Drop-off</h4>
                        <p className="text-gray-700 mb-1">{ride.destination.location}</p>
                        <p className="text-gray-600 text-sm">{ride.destination.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Booking Panel */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6 sticky top-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">${ride.price}</h2>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {ride.availableSeats} seats left
                </span>
              </div>
              
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label htmlFor="seats" className="block text-gray-700 mb-1">
                    Number of seats
                  </label>
                  <select
                    id="seats"
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {[...Array(ride.availableSeats)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1} {i === 0 ? "seat" : "seats"}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Price per seat</span>
                    <span>${ride.price}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Service fee</span>
                    <span>${(ride.price * 0.10).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${((ride.price + ride.price * 0.10) * seats).toFixed(2)}</span>
                  </div>
                </div>
                
                <Button type="submit" className="w-full">
                  Book {seats} {seats === 1 ? "Seat" : "Seats"}
                </Button>
                
                <p className="text-sm text-gray-500 text-center">
                  {ride.cancellationPolicy}
                </p>
              </form>
              
              <div className="mt-6">
                <Button
                  type="button"
                  className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  onClick={() => navigate(-1)}
                >
                  Back to Search
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Booking Confirmation Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Booking Successful!</h2>
              <p className="text-gray-600 mt-2">
                You've booked {seats} {seats === 1 ? "seat" : "seats"} from {ride.departure.city} to {ride.destination.city}.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-md p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {new Date(ride.departure.datetime).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Booking Reference</p>
                  <p className="font-medium">BK{Math.floor(Math.random() * 10000)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Departure</p>
                  <p className="font-medium">
                    {new Date(ride.departure.datetime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount Paid</p>
                  <p className="font-medium">
                    ${((ride.price + ride.price * 0.10) * seats).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <Link to="/my-bookings">
                <Button className="w-full">View My Bookings</Button>
              </Link>
              <button
                onClick={() => setShowBookingModal(false)}
                className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default RideDetails;