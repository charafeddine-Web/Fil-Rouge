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
    <div className="min-h-screen flex flex-col bg-gray-50 pt-8">
      {/* Modern Hero Search Section */}
      <div className="bg-green-50 py-8 shadow-md">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="bg-white p-6 rounded-xl shadow-lg max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="relative">
                <label htmlFor="departure" className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    id="departure"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    placeholder="Enter departure city"
                    required
                  />
                </div>
              </div>
              
              <div className="relative">
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    id="destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    placeholder="Enter destination city"
                    required
                  />
                </div>
              </div>
              
              <div className="relative">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">When</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    required
                  />
                </div>
              </div>
              
              <div className="relative">
                <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
                <div className="flex">
                  <div className="relative flex-grow">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                    <select
                      id="passengers"
                      value={passengers}
                      onChange={(e) => setPassengers(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </div>
                  <Button type="submit" className="rounded-l-none px-6 py-3">
                    <span className="mr-2">Search</span>
                    <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-8 flex-grow max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            <span className="text-green-600">{filteredRides.length}</span> rides available from {departure || "San Francisco"} to {destination || "Los Angeles"}
          </h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-green-600 hover:text-green-800 bg-white px-4 py-2 rounded-lg shadow-sm transition-all hover:shadow border border-green-100"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
        
        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Price Range
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-600 font-medium">${priceRange[0]}</span>
                    <span className="text-green-600 font-medium">${priceRange[1]}</span>
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
                  <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Departure Time
                  </h3>
                  <div className="relative">
                    <select
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
                    >
                      <option value="any">Any time</option>
                      <option value="morning">Morning (5am - 12pm)</option>
                      <option value="afternoon">Afternoon (12pm - 5pm)</option>
                      <option value="evening">Evening (5pm - 9pm)</option>
                      <option value="night">Night (9pm - 5am)</option>
                    </select>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                    Sort By
                  </h3>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
                    >
                      <option value="departure_time">Departure Time</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="rating">Driver Rating</option>
                    </select>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* No Results */}
        {filteredRides.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <svg
              className="w-20 h-20 text-gray-300 mx-auto mb-6"
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
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No rides found</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Try adjusting your search criteria or check back later for new rides.
            </p>
            <Link to="/offer-ride">
              <Button className="px-8 py-3">Offer a Ride Instead</Button>
            </Link>
          </div>
        ) : (
          /* Ride Cards */
          <div className="space-y-6">
            {filteredRides.map((ride, index) => (
              <motion.div
                key={ride.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center">
                    {/* Driver Info */}
                    <div className="md:w-1/5 mb-6 md:mb-0 md:border-r md:border-gray-100 md:pr-4">
                      <div className="flex items-center">
                        <div className="relative">
                          <img
                            src={ride.driver.image}
                            alt={ride.driver.name}
                            className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-green-100"
                          />
                          {ride.driver.verifiedDriver && (
                            <span className="absolute bottom-0 right-4 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{ride.driver.name}</p>
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
                              {ride.driver.rating} ({ride.driver.reviewCount})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Trip Info */}
                    <div className="md:w-3/5 mb-6 md:mb-0 md:px-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        {/* Departure */}
                        <div className="text-center md:text-left mb-4 md:mb-0">
                          <p className="text-xl font-bold text-gray-800">
                            {formatTime(ride.departure.datetime)}
                          </p>
                          <p className="text-gray-700 font-medium">{ride.departure.city}</p>
                          <p className="text-sm text-gray-500">{ride.departure.location}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatDate(ride.departure.datetime)}</p>
                        </div>
                        
                        {/* Trip Duration */}
                        <div className="hidden md:flex flex-col items-center px-6">
                          <div className="text-sm font-medium text-gray-500 mb-2">
                            {calculateDuration(ride.departure.datetime, ride.destination.datetime)}
                          </div>
                          <div className="relative w-32">
                            <div className="absolute w-full h-0.5 bg-green-100 top-1/2 transform -translate-y-1/2"></div>
                            <div className="absolute left-0 w-3 h-3 bg-green-500 rounded-full top-1/2 transform -translate-y-1/2"></div>
                            <div className="absolute right-0 w-3 h-3 bg-green-500 rounded-full top-1/2 transform -translate-y-1/2"></div>
                          </div>
                        </div>
                        
                        {/* Destination */}
                        <div className="text-center md:text-right">
                          <p className="text-xl font-bold text-gray-800">
                            {formatTime(ride.destination.datetime)}
                          </p>
                          <p className="text-gray-700 font-medium">{ride.destination.city}</p>
                          <p className="text-sm text-gray-500">{ride.destination.location}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatDate(ride.destination.datetime)}</p>
                        </div>
                      </div>
                      
                      {/* Mobile Trip Duration */}
                      <div className="md:hidden flex items-center justify-center my-4">
                        <div className="h-0.5 w-16 bg-green-100 mx-3"></div>
                        <p className="text-sm font-medium text-gray-500">
                          {calculateDuration(ride.departure.datetime, ride.destination.datetime)}
                        </p>
                        <div className="h-0.5 w-16 bg-green-100 mx-3"></div>
                      </div>
                    </div>
                    
                    {/* Price & Action */}
                    <div className="md:w-1/5 flex flex-col md:items-end md:border-l md:border-gray-100 md:pl-4">
                      <div className="mb-4 text-center md:text-right">
                        <p className="text-2xl font-bold text-green-600">${ride.price}</p>
                        <div className="flex items-center justify-center md:justify-end mt-1">
                          <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                          <p className="text-sm text-gray-500">
                            {ride.availableSeats} {ride.availableSeats === 1 ? "seat" : "seats"} left
                          </p>
                        </div>
                      </div>
                      <Link to={`/rides/${ride.id}`} className="w-full">
                        <Button className="w-full py-3">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-white rounded-xl shadow-md p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Don't see a ride that works for you?</h3>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Offer your own ride and earn money while traveling! It's simple to create a listing and connect with people heading your way.
          </p>
          <Link to="/register">
            <Button className="bg-green-600 text-green-600 border-2 border-green-600 hover:bg-green-50 px-8 py-3">
              <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
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