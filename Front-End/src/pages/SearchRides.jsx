// import { useState, useEffect } from "react";
// import { Link, useSearchParams, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import Loader from "../components/Loader";
// import Button from "../components/Button";
// import { getAllTrajets, searchTrajets } from '../services/trajets';

// const SearchRides = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [rides, setRides] = useState([]);
//   const [filteredRides, setFilteredRides] = useState([]);
//   const [departure, setDeparture] = useState(searchParams.get("departure") || "");
//   const [destination, setDestination] = useState(searchParams.get("destination") || "");
//   const [date, setDate] = useState(searchParams.get("date") || "");
//   const [passengers, setPassengers] = useState(searchParams.get("passengers") || 1);
  
//   // Filter options
//   const [priceRange, setPriceRange] = useState([0, 200]);
//   const [departureTime, setDepartureTime] = useState("any");
//   const [sortBy, setSortBy] = useState("departure_time");
//   const [showFilters, setShowFilters] = useState(false);

//   useEffect(() => {
//     const fetchRides = async () => {
//       try {
//         setTimeout(() => {
//           setLoading(true);
//           if (departure || destination || date || passengers) {
//             const searchResults =  searchTrajets({ departure, destination, date, passengers });
//             setRides(searchResults);
//             setFilteredRides(searchResults);
//           } else {
//             const allRides =  getAllTrajets();
//             setRides(allRides);
//             setFilteredRides(allRides);
//           }
  
//           setLoading(false);


//         }, 1000);
//       } catch (error) {
//         console.error("Error fetching rides:", error);
//         setLoading(false);
//       }
//     };

//     fetchRides();
//   }, [searchParams]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     navigate({
//       pathname: "/trajets/recherche",
//       search: `?departure=${departure}&destination=${destination}&date=${date}&passengers=${passengers}`,
//     });
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//     }, 800);
//   };


//   const applyFilters = () => {
//     let results = [...rides];
    
//     // Apply price filter
//     results = results.filter(
//       (ride) => ride.price >= priceRange[0] && ride.price <= priceRange[1]
//     );
    
//     // Apply departure time filter
//     if (departureTime !== "any") {
//       const now = new Date();
//       const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
//       results = results.filter((ride) => {
//         const departureTime = new Date(ride.departure.datetime);
//         const departureHour = departureTime.getHours();
        
//         switch (departureTime) {
//           case "morning":
//             return departureHour >= 5 && departureHour < 12;
//           case "afternoon":
//             return departureHour >= 12 && departureHour < 17;
//           case "evening":
//             return departureHour >= 17 && departureHour < 21;
//           case "night":
//             return departureHour >= 21 || departureHour < 5;
//           default:
//             return true;
//         }
//       });
//     }
    
//     // Apply sorting
//     results.sort((a, b) => {
//       switch (sortBy) {
//         case "price_low":
//           return a.price - b.price;
//         case "price_high":
//           return b.price - a.price;
//         case "rating":
//           return b.driver.rating - a.driver.rating;
//         case "departure_time":
//         default:
//           return new Date(a.departure.datetime) - new Date(b.departure.datetime);
//       }
//     });
    
//     setFilteredRides(results);
//   };

//   useEffect(() => {
//     applyFilters();
//   }, [priceRange, departureTime, sortBy]);

//   const formatTime = (dateTimeString) => {
//     return new Date(dateTimeString).toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     });
//   };

//   const formatDate = (dateTimeString) => {
//     return new Date(dateTimeString).toLocaleDateString('en-US', {
//       weekday: 'short',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const calculateDuration = (startDateTime, endDateTime) => {
//     const start = new Date(startDateTime);
//     const end = new Date(endDateTime);
//     const durationMs = end - start;
//     const hours = Math.floor(durationMs / (1000 * 60 * 60));
//     const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
//     return `${hours}h ${minutes}m`;
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50 pt-8">
//       {/* Modern Hero Search Section */}
//       <div className="bg-green-50 py-8 shadow-md">
//         <div className="container mx-auto px-4">
//           <form onSubmit={handleSearch} className="bg-white p-6 rounded-xl shadow-lg max-w-5xl mx-auto">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div className="relative">
//                 <label htmlFor="departure" className="block text-sm font-medium text-gray-700 mb-2">From</label>
//                 <div className="relative">
//                   <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                     <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                   </span>
//                   <input
//                     type="text"
//                     id="departure"
//                     value={departure}
//                     onChange={(e) => setDeparture(e.target.value)}
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
//                     placeholder="Enter departure city"
//                     required
//                   />
//                 </div>
//               </div>
              
//               <div className="relative">
//                 <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">To</label>
//                 <div className="relative">
//                   <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                     <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                   </span>
//                   <input
//                     type="text"
//                     id="destination"
//                     value={destination}
//                     onChange={(e) => setDestination(e.target.value)}
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
//                     placeholder="Enter destination city"
//                     required
//                   />
//                 </div>
//               </div>
              
//               <div className="relative">
//                 <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">When</label>
//                 <div className="relative">
//                   <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                     <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                   </span>
//                   <input
//                     type="date"
//                     id="date"
//                     value={date}
//                     onChange={(e) => setDate(e.target.value)}
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
//                     required
//                   />
//                 </div>
//               </div>
              
//               <div className="relative">
//                 <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
//                 <div className="flex">
//                   <div className="relative flex-grow">
//                     <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                       <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//                       </svg>
//                     </span>
//                     <select
//                       id="passengers"
//                       value={passengers}
//                       onChange={(e) => setPassengers(e.target.value)}
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
//                     >
//                       {[1, 2, 3, 4, 5, 6].map((num) => (
//                         <option key={num} value={num}>{num}</option>
//                       ))}
//                     </select>
//                     <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                       <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </span>
//                   </div>
//                   <Button type="submit" className="rounded-l-none px-6 py-3">
//                     <span className="mr-2">Search</span>
//                     <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                     </svg>
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
      
//       {/* Main Content Area */}
//       <div className="container mx-auto px-4 py-8 flex-grow max-w-6xl">
//         <div className="flex flex-col md:flex-row justify-between items-center mb-8">
//           <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
//             <span className="text-green-600">{filteredRides.length}</span> rides available from {departure || "San Francisco"} to {destination || "Los Angeles"}
//           </h1>
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className="flex items-center text-green-600 hover:text-green-800 bg-white px-4 py-2 rounded-lg shadow-sm transition-all hover:shadow border border-green-100"
//           >
//             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//             </svg>
//             {showFilters ? "Hide Filters" : "Show Filters"}
//           </button>
//         </div>
        
//         {/* Filters Panel */}
//         {showFilters && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.3 }}
//             className="mb-8"
//           >
//             <div className="bg-white p-6 rounded-xl shadow-md">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                 <div>
//                   <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-700">
//                     <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     Price Range
//                   </h3>
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-green-600 font-medium">${priceRange[0]}</span>
//                     <span className="text-green-600 font-medium">${priceRange[1]}</span>
//                   </div>
//                   <input
//                     type="range"
//                     min="0"
//                     max="200"
//                     value={priceRange[1]}
//                     onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
//                     className="w-full h-2 bg-green-100 rounded-lg appearance-none cursor-pointer"
//                   />
//                 </div>
                
//                 <div>
//                   <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-700">
//                     <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     Departure Time
//                   </h3>
//                   <div className="relative">
//                     <select
//                       value={departureTime}
//                       onChange={(e) => setDepartureTime(e.target.value)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
//                     >
//                       <option value="any">Any time</option>
//                       <option value="morning">Morning (5am - 12pm)</option>
//                       <option value="afternoon">Afternoon (12pm - 5pm)</option>
//                       <option value="evening">Evening (5pm - 9pm)</option>
//                       <option value="night">Night (9pm - 5am)</option>
//                     </select>
//                     <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                       <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </span>
//                   </div>
//                 </div>
                
//                 <div>
//                   <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-700">
//                     <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
//                     </svg>
//                     Sort By
//                   </h3>
//                   <div className="relative">
//                     <select
//                       value={sortBy}
//                       onChange={(e) => setSortBy(e.target.value)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
//                     >
//                       <option value="departure_time">Departure Time</option>
//                       <option value="price_low">Price: Low to High</option>
//                       <option value="price_high">Price: High to Low</option>
//                       <option value="rating">Driver Rating</option>
//                     </select>
//                     <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                       <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}
        
//         {/* No Results */}
//         {filteredRides.length === 0 ? (
//           <div className="text-center py-16 bg-white rounded-xl shadow-md">
//             <svg
//               className="w-20 h-20 text-gray-300 mx-auto mb-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
//               />
//             </svg>
//             <h2 className="text-2xl font-bold text-gray-800 mb-3">No rides found</h2>
//             <p className="text-gray-600 mb-8 max-w-md mx-auto">
//               Try adjusting your search criteria or check back later for new rides.
//             </p>
//             <Link to="/offer-ride">
//               <Button className="px-8 py-3">Offer a Ride Instead</Button>
//             </Link>
//           </div>
//         ) : (
//           /* Ride Cards */
//           <div className="space-y-6">
//             {filteredRides.map((ride, index) => (
//               <motion.div
//                 key={ride.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4, delay: index * 0.1 }}
//                 className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//               >
//                 <div className="p-6">
//                   <div className="flex flex-col md:flex-row md:items-center">
//                     {/* Driver Info */}
//                     <div className="md:w-1/5 mb-6 md:mb-0 md:border-r md:border-gray-100 md:pr-4">
//                       <div className="flex items-center">
//                         <div className="relative">
//                           <img
//                             src={ride.driver.image}
//                             alt={ride.driver.name}
//                             className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-green-100"
//                           />
//                           {ride.driver.verifiedDriver && (
//                             <span className="absolute bottom-0 right-4 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
//                               <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                               </svg>
//                             </span>
//                           )}
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-800">{ride.driver.name}</p>
//                           <div className="flex items-center">
//                             <div className="flex">
//                               {[...Array(5)].map((_, i) => (
//                                 <svg
//                                   key={i}
//                                   className={`w-4 h-4 ${
//                                     i < Math.floor(ride.driver.rating) 
//                                       ? "text-yellow-400" 
//                                       : i < ride.driver.rating 
//                                         ? "text-yellow-200" 
//                                         : "text-gray-300"
//                                   }`}
//                                   fill="currentColor"
//                                   viewBox="0 0 20 20"
//                                 >
//                                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
//                                 </svg>
//                               ))}
//                             </div>
//                             <span className="ml-1 text-sm text-gray-600">
//                               {ride.driver.rating} ({ride.driver.reviewCount})
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
                    
//                     {/* Trip Info */}
//                     <div className="md:w-3/5 mb-6 md:mb-0 md:px-4">
//                       <div className="flex flex-col md:flex-row md:items-center justify-between">
//                         {/* Departure */}
//                         <div className="text-center md:text-left mb-4 md:mb-0">
//                           <p className="text-xl font-bold text-gray-800">
//                             {formatTime(ride.departure.datetime)}
//                           </p>
//                           <p className="text-gray-700 font-medium">{ride.departure.city}</p>
//                           <p className="text-sm text-gray-500">{ride.departure.location}</p>
//                           <p className="text-xs text-gray-400 mt-1">{formatDate(ride.departure.datetime)}</p>
//                         </div>
                        
//                         {/* Trip Duration */}
//                         <div className="hidden md:flex flex-col items-center px-6">
//                           <div className="text-sm font-medium text-gray-500 mb-2">
//                             {calculateDuration(ride.departure.datetime, ride.destination.datetime)}
//                           </div>
//                           <div className="relative w-32">
//                             <div className="absolute w-full h-0.5 bg-green-100 top-1/2 transform -translate-y-1/2"></div>
//                             <div className="absolute left-0 w-3 h-3 bg-green-500 rounded-full top-1/2 transform -translate-y-1/2"></div>
//                             <div className="absolute right-0 w-3 h-3 bg-green-500 rounded-full top-1/2 transform -translate-y-1/2"></div>
//                           </div>
//                         </div>
                        
//                         {/* Destination */}
//                         <div className="text-center md:text-right">
//                           <p className="text-xl font-bold text-gray-800">
//                             {formatTime(ride.destination.datetime)}
//                           </p>
//                           <p className="text-gray-700 font-medium">{ride.destination.city}</p>
//                           <p className="text-sm text-gray-500">{ride.destination.location}</p>
//                           <p className="text-xs text-gray-400 mt-1">{formatDate(ride.destination.datetime)}</p>
//                         </div>
//                       </div>
                      
//                       {/* Mobile Trip Duration */}
//                       <div className="md:hidden flex items-center justify-center my-4">
//                         <div className="h-0.5 w-16 bg-green-100 mx-3"></div>
//                         <p className="text-sm font-medium text-gray-500">
//                           {calculateDuration(ride.departure.datetime, ride.destination.datetime)}
//                         </p>
//                         <div className="h-0.5 w-16 bg-green-100 mx-3"></div>
//                       </div>
//                     </div>
                    
//                     {/* Price & Action */}
//                     <div className="md:w-1/5 flex flex-col md:items-end md:border-l md:border-gray-100 md:pl-4">
//                       <div className="mb-4 text-center md:text-right">
//                         <p className="text-2xl font-bold text-green-600">${ride.price}</p>
//                         <div className="flex items-center justify-center md:justify-end mt-1">
//                           <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
//                           </svg>
//                           <p className="text-sm text-gray-500">
//                             {ride.availableSeats} {ride.availableSeats === 1 ? "seat" : "seats"} left
//                           </p>
//                         </div>
//                       </div>
//                       <Link to={`/rides/${ride.id}`} className="w-full">
//                         <Button className="w-full py-3">View Details</Button>
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}
        
//         {/* Bottom CTA */}
//         <div className="mt-12 text-center bg-white rounded-xl shadow-md p-8">
//           <h3 className="text-xl font-semibold text-gray-800 mb-3">Don't see a ride that works for you?</h3>
//           <p className="text-gray-600 mb-6 max-w-lg mx-auto">
//             Offer your own ride and earn money while traveling! It's simple to create a listing and connect with people heading your way.
//           </p>
//           <Link to="/register">
//             <Button className="bg-green-600 text-green-600 border-2 border-green-600 hover:bg-green-50 px-8 py-3">
//               <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//               Offer a Ride
//             </Button>
//           </Link>
//         </div>
//       </div>
      
//       <Footer />
//     </div>
//   );
// };



import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import Button from "../components/Button";
import { getAllTrajets, searchTrajets } from '../services/trajets';

const SearchRides = () => {
  const [searchParams] = useSearchParams();
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
  const [departureTime, setDepartureTime] = useState("any");
  const [sortBy, setSortBy] = useState("departure_time");
  const [showFilters, setShowFilters] = useState(false);
  
  const [smokeAllowed, setSmokeAllowed] = useState(null);
  const [luggageAllowed, setLuggageAllowed] = useState(null);


  useEffect(() => {
    const fetchAllRides = async () => {
      setLoading(true);
      try {
        const response = await getAllTrajets();
        const allRides = response.data;

        // Ensure it's an array before setting it
        if (Array.isArray(allRides)) {
          setRides(allRides);
          setFilteredRides(allRides);
        } else {
          console.error("Fetched rides is not an array:", allRides);
          setFilteredRides([]); // Set it to empty array if not an array
        }
      } catch (error) {
        console.error("Error fetching rides:", error);
        setFilteredRides([]);
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
      navigate({
        pathname: "/search",
        search: `?departure=${departure}&destination=${destination}&date=${date}&passengers=${passengers}`,
      });
      
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
      setFilteredRides(searchResults);
    } catch (error) {
      console.error("Error searching rides:", error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters when they change (but only after initial search has been done)
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
        } catch (error) {
          console.error("Error applying filters:", error);
        } finally {
          setLoading(false);
        }
      };

      // Use a debounce to avoid too many API calls when filters change
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
    
    // Apply departure time filter if it's not handled by the API
    if (departureTime !== "any") {
      results = results.filter((ride) => {
        const departureTime = new Date(ride.date_depart);
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
  }, [rides, departureTime, sortBy]);

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
    return <Loader />;
  }

  // Map your backend data to match your frontend display requirements
  const mappedRides = filteredRides.map(ride => ({
    id: ride.id,
    driver: {
      name: ride.conducteur?.nom || 'Unknown Driver',
      image: ride.conducteur?.image || '/placeholder-avatar.jpg',
      rating: ride.conducteur?.rating || 4.5,
      reviewCount: ride.conducteur?.review_count || 0,
      verifiedDriver: true
    },
    departure: {
      datetime: ride.date_depart,
      city: ride.lieu_depart,
      location: ride.point_depart || ride.lieu_depart
    },
    destination: {
      datetime: ride.date_arrivee,
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
    ? `${mappedRides.length} rides available from ${departure || "all locations"} to ${destination || "all destinations"}`
    : "All available rides";

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
      
      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-8 flex-grow max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            {hasSearched ? (
              <>
                <span className="text-green-600">{mappedRides.length}</span> rides available from {departure || "all locations"} to {destination || "all destinations"}
              </>
            ) : (
              <>All available rides</>
            )}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                
                {/* Added additional filters based on your backend API */}
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-gray-100">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-700">
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
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
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
              <Button className="px-8 py-3">Offer a Ride Instead</Button>
            </Link>
          </div>
        ) : (
          /* Ride Cards */
          <div className="space-y-6">
            {mappedRides.map((ride, index) => (
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
<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              ))}
                            </div>
                            <span className="text-sm text-gray-500 ml-1">
                              ({ride.driver.reviewCount})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Trip Info */}
                    <div className="md:w-3/5 mb-6 md:mb-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="flex-1">
                          <div className="flex items-start">
                            <div className="mt-1 mr-4">
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                              <div className="w-0.5 h-10 bg-gray-200 ml-1.5"></div>
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            </div>
                            <div>
                              <div className="mb-4">
                                <p className="font-medium text-gray-800">
                                  {formatTime(ride.departure.datetime)}
                                </p>
                                <h3 className="text-lg font-bold">{ride.departure.city}</h3>
                                <p className="text-gray-500 text-sm">{ride.departure.location}</p>
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">
                                  {formatTime(ride.destination.datetime)}
                                </p>
                                <h3 className="text-lg font-bold">{ride.destination.city}</h3>
                                <p className="text-gray-500 text-sm">{ride.destination.location}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-4 flex flex-col justify-center">
                          <p className="text-gray-600 text-sm flex items-center mb-2">
                            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {calculateDuration(ride.departure.datetime, ride.destination.datetime)} trip
                          </p>
                          <p className="text-gray-600 text-sm flex items-center">
                            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(ride.departure.datetime)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Price and Book */}
                    <div className="md:w-1/5 flex flex-col md:items-end">
                      <div className="text-right mb-4">
                        <p className="text-2xl font-bold text-green-600">${ride.price}</p>
                        <p className="text-gray-500 text-sm">per person</p>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className={`w-5 h-5 ${ride.smokeAllowed ? 'text-green-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                          <path fillRule="evenodd" d="M10 4a1 1 0 100 2 1 1 0 000-2zm-4 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-500">{ride.smokeAllowed ? 'Smoking allowed' : 'No smoking'}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-4">
                        <svg className={`w-5 h-5 ${ride.luggageAllowed ? 'text-green-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M14 5a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h8zm0 1H6a1 1 0 00-1 1v9a1 1 0 001 1h8a1 1 0 001-1V7a1 1 0 00-1-1z" />
                          <path d="M7 4a1 1 0 011-1h4a1 1 0 011 1v1H7V4z" />
                        </svg>
                        <span className="text-sm text-gray-500">{ride.luggageAllowed ? 'Luggage allowed' : 'No luggage'}</span>
                      </div>
                      <Link to={`/ride/${ride.id}`}>
                        <Button size="sm" className="w-full flex items-center justify-center">
                          <span>Book Seat</span>
                          <span className="ml-2 bg-white bg-opacity-30 rounded-full w-6 h-6 flex items-center justify-center">
                            {ride.availableSeats}
                          </span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Show more button if there are many rides */}
        {mappedRides.length > 10 && (
          <div className="text-center mt-10">
            <Button variant="outline" className="px-8 py-3">
              Load More Rides
            </Button>
          </div>
        )}
      </div>
      
      {/* Promotional Section */}
      <div className="bg-green-50 py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 bg-green-500 p-10 text-white">
                <h2 className="text-3xl font-bold mb-4">Want to earn extra income?</h2>
                <p className="mb-8">
                  Share your rides and make money by filling those empty seats. It's easy, eco-friendly, and economical.
                </p>
                <Link to="/offer-ride">
                  <Button variant="white" className="px-8 py-3">
                    Offer a Ride Now
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
                      <p className="text-gray-600">Make your travel pay for itself by sharing your ride with others.</p>
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
      
    </div>
  );
};

export default SearchRides;