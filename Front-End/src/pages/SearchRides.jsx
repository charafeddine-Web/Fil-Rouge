import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import Button from "../components/Button";
import Header from "../components/Header";
import RideCard from '../components/RideCard';
import { getAllTrajets, searchTrajets } from '../services/trajets';
import Footer from "../components/Footer";
import { toast } from "react-toastify";

const SearchRides = ({user}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Form inputs
  const [departure, setDeparture] = useState(searchParams.get("departure") || "");
  const [destination, setDestination] = useState(searchParams.get("destination") || "");
  const [date, setDate] = useState(searchParams.get("date") || "");
  const [passengers, setPassengers] = useState(searchParams.get("passengers") || 1);
  
  // Filter options
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortBy, setSortBy] = useState("departure_time");
  const [showFilters, setShowFilters] = useState(true);
  
  const [smokeAllowed, setSmokeAllowed] = useState(null);
  const [luggageAllowed, setLuggageAllowed] = useState(null);

  useEffect(() => {
    const fetchAllRides = async () => {
      setLoading(true);
      try {
        const response = await getAllTrajets();
        const allRides = response.data;

        if (Array.isArray(allRides)) {
          setRides(allRides);
          setFilteredRides(allRides);
        } else {
          console.error("Fetched rides is not an array:", allRides);
          setFilteredRides([]); 
        }
      } catch (error) {
        console.error("Error fetching rides:", error);
        setFilteredRides([]);
        toast.error("Error loading rides");
      } finally {
        setLoading(false);
      }
    };
  
    fetchAllRides();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    
    try {
      const searchParams = {
        departure: departure.trim(),
        destination: destination.trim(),
        date: date || null,
        passengers: parseInt(passengers) || null,
        minPrice: priceRange[0] || null,
        maxPrice: priceRange[1] || null,
        smokeAllowed: smokeAllowed || null,
        luggageAllowed: luggageAllowed || null
      };
      
      const searchResults = await searchTrajets(searchParams);
      setRides(searchResults);
      setFilteredRides(searchResults);
      
      if (searchResults.length === 0) {
        toast.info("No rides found for your search");
      } else {
        toast.success(`${searchResults.length} rides found`);
      }
    } catch (error) {
      console.error("Error searching rides:", error);
      if (error.response) {
        console.error("Server error:", error.response.data);
        toast.error(error.response.data.message || "Error during search");
      } else {
        toast.error("Error during search");
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Apply filters when they change 
  useEffect(() => {
    if (hasSearched) {
      const applyFilters = async () => {
        setLoading(true);
        try {
          const searchParams = {
            departure,
            destination,
            date,
            passengers,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            smokeAllowed,
            luggageAllowed
          };
          
          const searchResults = await searchTrajets(searchParams);
          setRides(searchResults);
          
          if (searchResults.length === 0) {
            toast.info("No rides found for these filters");
          }
        } catch (error) {
          console.error("Error applying filters:", error);
          toast.error("Error applying filters");
        } finally {
          setLoading(false);
        }
      };

      const debounceTimeout = setTimeout(() => {
        applyFilters();
      }, 500);

      return () => clearTimeout(debounceTimeout);
    }
  }, [hasSearched, priceRange, smokeAllowed, luggageAllowed]);

  // Client-side sorting and filtering
  const applyClientSideFilters = () => {
    if (!rides.length) return;
    
    let results = [...rides];
    
    // Apply sorting - this is done client-side since it's not part of the API
    results.sort((a, b) => {
      switch (sortBy) {
        case "price_low":
          return a.prix_par_place - b.prix_par_place;
        case "price_high":
          return b.prix_par_place - a.prix_par_place;
        case "rating":
          return (b.conducteur?.rating || 0) - (a.conducteur?.rating || 0);
        case "departure_time":
        default:
          return new Date(a.date_depart) - new Date(b.date_depart);
      }
    });
    
    setFilteredRides(results);
  };

  useEffect(() => {
    applyClientSideFilters();
  }, [rides, sortBy]);

  // Helper functions for formatting
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

  const mappedRides = filteredRides.map(ride => ({
    id: ride.id,
    driver: {
      name: ride.conducteur?.user?.nom || 'Unknown Driver',
      prenom: ride.conducteur?.user?.prenom || 'Unknown Driver',
      image: ride.conducteur?.user?.photoDeProfil || null,
      rating: ride.conducteur?.note_moyenne || 0.0,
      reviewCount: ride.conducteur?.review_count || 0,
      status: ride.conducteur?.status || 'active' 
    },
    departure: {
      datetime: ride.date_depart,
      city: ride.lieu_depart,
      location: ride.point_depart || ride.lieu_depart
    },
    destination: {
      datetime: ride.date_arrivee_prevue,
      city: ride.lieu_arrivee,
      location: ride.point_arrivee || ride.lieu_arrivee
    },
    price: ride.prix_par_place,
    availableSeats: ride.nombre_places,
    smokeAllowed: ride.fumeur_autorise,
    luggageAllowed: ride.bagages_autorises
  }));

  // Generate page title based on search state
  const pageTitle = hasSearched
    ? `${mappedRides.length} rides available from ${departure || "all cities"} to ${destination || "all destinations"}`
    : "All available rides";  

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header/>

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
                    placeholder="Departure city"
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
                    placeholder="Destination city"
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
      
      {/* Main Content Area - Two-column layout */}
      <div className="container mx-auto px-4 py-8 flex-grow max-w-7xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          {hasSearched ? (
            <>
              <span className="text-green-600">{mappedRides.length}</span> rides available from {departure || "all cities"} to {destination || "all destinations"}
            </>
          ) : (
            <>All available rides</>
          )}
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white p-6 rounded-xl shadow-md sticky top-20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden text-green-600 hover:text-green-700"
                >
                  {showFilters ? "Hide" : "Show"}
                </button>
              </div>
              
              <div className={`space-y-8 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Price Range Filter */}
                <div>
                  <h3 className="text-md font-semibold mb-4 flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Price Range
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-600 font-medium">{priceRange[0]} MAD</span>
                    <span className="text-green-600 font-medium">{priceRange[1]} MAD</span>
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
                
                {/* Sort By Filter */}
                <div>
                  <h3 className="text-md font-semibold mb-4 flex items-center text-gray-700">
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
                
                {/* Preferences */}
                <div>
                  <h3 className="text-md font-semibold mb-4 flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    Preferences
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        id="smokeAllowed"
                        type="checkbox"
                        checked={smokeAllowed === true}
                        onChange={(e) => setSmokeAllowed(e.target.checked ? true : null)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="smokeAllowed" className="ml-2 block text-sm text-gray-700">
                        Smoking allowed
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="luggageAllowed"
                        type="checkbox"
                        checked={luggageAllowed === true}
                        onChange={(e) => setLuggageAllowed(e.target.checked ? true : null)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="luggageAllowed" className="ml-2 block text-sm text-gray-700">
                        Luggage allowed
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Apply Filters Button (Mobile Only) */}
                <button 
                  onClick={() => applyClientSideFilters()}
                  className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 lg:hidden"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Content - Ride Listings */}
          <div className="lg:w-3/4">
            {/* No Results */}
            {mappedRides.length === 0 ? (
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
                  <Button className="px-8 py-3">Offer a ride</Button>
                </Link>
              </div>
            ) : (
              /* Ride Cards */
              <RideCard mappedRides={mappedRides} 
              formatDate={formatDate} 
              formatTime={formatTime}
              calculateDuration={calculateDuration}/>
            )}
            
            {mappedRides.length > 10 && (
              <div className="text-center mt-10">
                <Button variant="outline" className="px-8 py-3">
                  Load more rides
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Promotional Section */}
      <div className="bg-green-50 py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 bg-green-500 p-10 text-white">
                <h2 className="text-3xl font-bold mb-4">Want to earn extra income?</h2>
                <p className="mb-8">
                  Share your rides and earn money by filling those empty seats. It's easy, eco-friendly and economical.
                </p>
                <Link to="/register">
                  <Button variant="white" className="px-8 py-3 bg-white text-black">
                    Offer a ride now
                  </Button>
                </Link>
              </div>
              <div className="md:w-1/2 p-10">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Why offer rides?</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-green-100 rounded-lg p-2 mr-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-800">Earn extra income</h4>
                      <p className="text-gray-600">Cover your travel expenses by sharing your journey with others.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-green-100 rounded-lg p-2 mr-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-800">Meet new people</h4>
                      <p className="text-gray-600">Connect with interesting people and enjoy good conversation.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default SearchRides;