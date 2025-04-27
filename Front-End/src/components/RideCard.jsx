import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/Button";


export default function RideCard({ mappedRides, formatDate, formatTime, calculateDuration }) {

    const rides = Array.isArray(mappedRides) ? mappedRides : [];
console.log(rides);
    return (
        <div className="space-y-6">
            {rides.map((ride, index) => (
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
                                        <p className="font-medium text-gray-800">{ride.driver?.name} {ride.driver?.prenom}</p>
                                        <div className="flex items-center">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className={`w-4 h-4 ${i < Math.floor(ride.driver.rating)
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
                                                    <p className="font-medium text-red-800">
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
                                    <p className="text-2xl font-bold text-green-600">{ride.price} MAD</p>
                                    <p className="text-gray-500 text-sm">par personne</p>
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
    )
}