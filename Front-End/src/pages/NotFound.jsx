import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Car, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const [carPosition, setCarPosition] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCarPosition((prev) => (prev > 100 ? -20 : prev + 0.5));
    }, 30);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 px-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            y: [0, 15, 0],
            x: [0, 0, 0]
          }} 
          transition={{ 
            repeat: Infinity, 
            duration: 10,
            ease: "easeInOut" 
          }}
          className="absolute top-10 right-1/4 w-64 h-64 rounded-full bg-green-100 opacity-30"
        ></motion.div>
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            x: [0, -10, 0]
          }} 
          transition={{ 
            repeat: Infinity, 
            duration: 15,
            ease: "easeInOut" 
          }}
          className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full bg-green-200 opacity-20"
        ></motion.div>
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
          }} 
          transition={{ 
            repeat: Infinity, 
            duration: 8,
            ease: "easeInOut" 
          }}
          className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-green-300 opacity-20"
        ></motion.div>
      </div>
      
      <div className="absolute bottom-10 left-0 right-0 h-10 bg-gray-200 opacity-70">
        <div className="absolute top-1/2 left-0 right-0 h-1 flex items-center">
          <div className="w-full flex">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="h-1 w-10 mx-4 bg-white rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
      
      <motion.div 
        className="absolute bottom-14"
        style={{ left: `${carPosition}%` }}
      >
        {/* <Car size={50} className="text-green-500" /> */}
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden z-10"
      >
        <div className="h-2 bg-gradient-to-r from-green-400 via-green-500 to-green-400"></div>
        <div className="px-8 pt-8 pb-8 text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  y: [0, -5, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3,
                  ease: "easeInOut"
                }}
              >
                <MapPin size={60} className="text-green-500" />
              </motion.div>
              <motion.div
                animate={{ 
                  opacity: [0, 0.5, 0],
                  scale: [0.8, 1.5, 0.8]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeOut"
                }}
                className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"
              >
                <div className="w-12 h-12 rounded-full border-2 border-green-500"></div>
              </motion.div>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h1 className="text-6xl font-bold text-gray-800 font-urbanist mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 font-urbanist mb-4">Destination Not Found</h2>
            <p className="text-gray-500 mb-8 font-urbanist">
              Oops! It seems you've taken a wrong turn. This route doesn't exist on our carpooling map.
            </p>
          </motion.div>
          
          <div className="flex flex-col space-y-4">
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-300"
              >
                <ArrowLeft size={18} className="mr-2" />
                Back to Home
              </motion.button>
            </Link>
            
            <Link to="/rides">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-300"
              >
                Find Available Rides
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;