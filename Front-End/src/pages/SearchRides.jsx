import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Button from "../components/Button";

const SearchRides = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [departure, setDeparture] = useState(searchParams.get("departure") || "");
  const [destination, setDestination] = useState(searchParams.get("destination") || "");
  const [date, setDate] = useState(searchParams.get("date") || "");
  const [passengers, setPassengers] = useState(searchParams.get("passengers") || 1);
  
  // Filter options
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [departureTime, setDepartureTime] = useState("any");
  const [sortBy, setSortBy] = useState("departure_time");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Simulate fetching rides data
    const fetchRides = async () => {
      try {
        // In a real app, this would be an API call with the search parameters
        setTimeout(() => {
          const mockRides = [
            {
              id: "r1",
              driver: {
                id: "d1",
                name: "Alex Thompson",
                rating: 4.8,
                reviewCount: 127,
                image: "/images/drivers/alex.jpg",
                verifiedDriver: true,
              },
              departure: {
                city: searchParams.get("departure") || "San Francisco",
                location: "Caltrain Station",
                datetime: "2025-04-20T08:00:00",
              },
              destination: {
                city: searchParams.get("destination") || "Los Angeles",
                location: "Union Station",
                datetime: "2025-04-20T16:00:00",
              },
              price: 45,
              currency: "USD",
              availableSeats: 3,
              totalSeats: 4,
            },
            {
              id: "r2",
              driver: {
                id: "d2",
                name: "Emma Davis",
                rating: 4.9,
                reviewCount: 86,
                image: "/images/drivers/emma.jpg",
                verifiedDriver: true,
              },
              departure: {
                city: searchParams.get("departure") || "San Francisco",
                location: "Civic Center",
                datetime: "2025-04-20T10:30:00",
              },
              destination: {
                city: searchParams.get("destination") || "Los Angeles",
                location: "Hollywood Blvd",
                datetime: "2025-04-20T18:45:00",
              },
              price: 55,
              currency: "USD",
              availableSeats: 2,
              totalSeats: 3,
            },
            {
              id: "r3",
              driver: {
                id: "d3",
                name: "Michael Rodriguez",
                rating: 4.6,
                reviewCount: 42,
                image: "/images/drivers/michael.jpg",
                verifiedDriver: false,
              },
              departure: {
                city: searchParams.get("departure") || "San Francisco",
                location: "Golden Gate Park",
                datetime: "2025-04-20T06:15:00",
              },
              destination: {
                city: searchParams.get("destination") || "Los Angeles",
                location: "Santa Monica",
                datetime: "2025-04-20T14:30:00",
              },
              price: 40,
              currency: "USD",
              availableSeats: 4,
              totalSeats: 4,
            },
            {
              id: "r4",
              driver: {
                id: "d4",
                name: "Sophia Chen",
                rating: 4.7,
                reviewCount: 103,
                image: "/images/drivers/sophia.jpg",
                verifiedDriver: true,
              },
              departure: {
                city: searchParams.get("departure") || "San Francisco",
                location: "Financial District",
                datetime: "2025-04-20T12:00:00",
              },
              destination: {
                city: searchParams.get("destination") || "Los Angeles",
                location: "Downtown LA",
                datetime: "2025-04-20T20:15:00",
              },
              price: 60,
              currency: "USD",
              availableSeats: 1,
              totalSeats: 3,
            },
            {
              id: "r5",
              driver: {
                id: "d5",
                name: "James Wilson",
                rating: 4.5,
                reviewCount: 67,
                image: "/images/drivers/james.jpg",
                verifiedDriver: false,
              },
              departure: {
                city: searchParams.get("departure") || "San Francisco",
                location: "Mission District",
                datetime: "2025-04-20T15:45:00",
              },
              destination: {
                city: searchParams.get("destination") || "Los Angeles",
                location: "LAX Airport",
                datetime: "2025-04-20T23:30:00",
              },
              price: 50,
              currency: "USD",
              availableSeats: 2,
              totalSeats: 2,
            },
          ];
          setRides(mockRides);
          setFilteredRides(mockRides);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching rides:", error);
        setLoading(false);
      }
    };

    fetchRides();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate({
      pathname: "/search",
      search: `?departure=${departure}&destination=${destination}&date=${date}&passengers=${passengers}`,
    });
    setLoading(true);
    // In a real app, this would trigger a new API call
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const applyFilters = () => {
    let results = [...rides];
    
    // Apply price filter
    results = results.filter(
      (ride) => ride.price >= priceRange[0] && ride.price <= priceRange[1]
    );
    
    // Apply departure time filter
    if (departureTime !== "any") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      results = results.filter((ride) => {
        const departureTime = new Date(ride.departure.datetime);
        const departureHour = departureTime.getHours();
        
        switch (departureTime) {
          case "morning":
            return departureHour >= 5 && departureHour < 12;
          case "afternoon":
            return departureHour >= 12 && departureHour < 17;
          case "evening":
            return departureHour >= 17 && departureHour < 21;
          case "night":
            return departureHour >= 21 || departureHour < 5;
          default:
            return true;
        }
      });
    }
    
    // Apply sorting
    results.sort((a, b) => {
      switch (sortBy) {
        case "price_low":
          return a.price - b.price;
        case "price_high":
          return b.price - a.price;
        case "rating":
          return b.driver.rating - a.driver.rating;
        case "departure_time":
        default:
          return new Date(a.departure.datetime) - new Date(b.departure.datetime);
      }
    });
    
    setFilteredRides(results);
  };

  useEffect(() => {
    applyFilters();
  }, [priceRange, departureTime, sortBy]);

  const formatTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      
      <div className="bg-green-50 py-6">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="departure" className="block text-gray-700 mb-1">From</label>
                <input
                  type="text"
                  id="departure"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter departure city"
                  required
                />
              </div>
              <div>
                <label htmlFor="destination" className="block text-gray-700 mb-1">To</label>
                <input
                  type="text"
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter destination city"
                  required
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-gray-700 mb-1">When</label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="passengers" className="block text-gray-700 mb-1">Passengers</label>
                <div className="flex">
                  <select
                    id="passengers"
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <Button type="submit" className="rounded-l-none">
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {filteredRides.length} rides available from {departure || "San Francisco"} to {destination || "Los Angeles"}
          </h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-green-600 hover:text-green-800"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
        
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Price Range</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-green-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Departure Time</h3>
                  <select
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="any">Any time</option>
                    <option value="morning">Morning (5am - 12pm)</option>
                    <option value="afternoon">Afternoon (12pm - 5pm)</option>
                    <option value="evening">Evening (5pm - 9pm)</option>
                    <option value="night">Night (9pm - 5am)</option>
                  </select>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="departure_time">Departure Time</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="rating">Driver Rating</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {filteredRides.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No rides found</h2>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or check back later for new rides.
            </p>
            <Link to="/offer-ride">
              <Button>Offer a Ride Instead</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRides.map((ride, index) => (
              <motion.div
                key={ride.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 mb-4 md:mb-0">
                      <div className="flex items-center">
                        <img
                          src={ride.driver.image}
                          alt={ride.driver.name}
                          className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                        <div>
                          <p className="font-medium">{ride.driver.name}</p>
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
                            <span className="ml-1 text-sm text-gray-600">
                              {ride.driver.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-2/4 mb-4 md:mb-0">
                      <div className="flex flex-col md:flex-row md:justify-between mb-2">
                        <div className="mb-2 md:mb-0">
                          <p className="text-lg font-semibold">
                            {formatTime(ride.departure.datetime)}
                          </p>
                          <p className="text-gray-700">{ride.departure.city}</p>
                          <p className="text-sm text-gray-500">{ride.departure.location}</p>
                        </div>
                        
                        <div className="hidden md:flex flex-col items-center justify-center px-4">
                          <p className="text-sm text-gray-500 mb-1">
                            {calculateDuration(ride.departure.datetime, ride.destination.datetime)}
                          </p>
                          <div className="relative w-24">
                            <div className="absolute w-full h-0.5 bg-gray-300 top-1/2 transform -translate-y-1/2"></div>
                            <div className="absolute left-0 w-3 h-3 bg-green-500 rounded-full top-1/2 transform -translate-y-1/2"></div>
                            <div className="absolute right-0 w-3 h-3 bg-green-500 rounded-full top-1/2 transform -translate-y-1/2"></div>
                          </div>
                        </div>
                        
                        <div className="mb-2 md:mb-0">
                          <p className="text-lg font-semibold">
                            {formatTime(ride.destination.datetime)}
                          </p>
                          <p className="text-gray-700">{ride.destination.city}</p>
                          <p className="text-sm text-gray-500">{ride.destination.location}</p>
                        </div>
                      </div>
                      
                      <div className="md:hidden flex items-center justify-center my-3">
                        <div className="h-0.5 w-16 bg-gray-300 mx-3"></div>
                        <p className="text-sm text-gray-500">
                          {calculateDuration(ride.departure.datetime, ride.destination.datetime)}
                        </p>
                        <div className="h-0.5 w-16 bg-gray-300 mx-3"></div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"></path>
                        </svg>
                        <span>{formatDate(ride.departure.datetime)}</span>
                      </div>
                    </div>
                    
                    <div className="md:w-1/4 flex flex-col items-start md:items-end justify-between">
                      <div className="mb-4">
                        <p className="text-2xl font-bold text-green-600">${ride.price}</p>
                        <p className="text-sm text-gray-500">
                          {ride.availableSeats} {ride.availableSeats === 1 ? "seat" : "seats"} left
                        </p>
                      </div>
                      <Link to={`/rides/${ride.id}`} className="w-full md:w-auto">
                        <Button className="w-full">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Don't see a ride that works for you? Offer your own and earn money while traveling!
          </p>
          <Link to="/offer-ride">
            <Button className="bg-white text-green-600 border border-green-600 hover:bg-green-50">
              Offer a Ride
            </Button>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SearchRides;