import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Button from "../components/Button";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState("");
  const [departure, setDeparture] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Features data
  const features = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Save Money",
      description:
        "Split travel costs with other passengers and save up to 75% compared to traditional transportation.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Eco-Friendly",
      description:
        "Reduce your carbon footprint by sharing rides. One carpool can save up to 1 ton of CO2 emissions yearly.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      title: "Community",
      description:
        "Connect with like-minded travelers, make new friends, and enjoy social travel experiences.",
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Regular Commuter",
      image: "/images/testimonials/sarah.jpg",
      text: "CarShare has transformed my daily commute. I've saved thousands this year and met amazing people along the way!",
    },
    {
      name: "Mike Thompson",
      role: "Weekend Traveler",
      image: "/images/testimonials/mike.jpg",
      text: "Finding rides to visit my family on weekends was always a hassle until I discovered CarShare. Now it's just a few clicks away!",
    },
    {
      name: "Emily Chen",
      role: "Student",
      image: "/images/testimonials/emily.jpg",
      text: "As a college student on a budget, CarShare is a lifesaver. Affordable, reliable, and environmentally friendly too!",
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality
    console.log("Searching for rides from", departure, "to", destination, "on", date);
    // Redirect to search results page
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-green-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row items-center"
          >
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Share Your Ride, Save the Planet
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Connect with fellow travelers, reduce costs, and minimize your carbon footprint with our easy-to-use carpooling platform.
              </p>
              
              {/* Search Form */}
              <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
                <div className="mt-4">
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
                <Button type="submit" className="w-full mt-6">
                  Find Rides
                </Button>
              </form>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <img
                src="/images/hero-image.svg"
                alt="Carpooling illustration"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose CarShare?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform offers the best carpooling experience with benefits for both drivers and passengers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-gray-50 p-8 rounded-lg shadow-md text-center"
              >
                <div className="mx-auto mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started with CarShare is simple and straightforward.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center md:space-x-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 md:mb-0 text-center md:w-1/4"
            >
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Search</h3>
              <p className="text-gray-600">Find available rides that match your route and schedule</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 md:mb-0 text-center md:w-1/4"
            >
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Book</h3>
              <p className="text-gray-600">Reserve your seat with secure online payment</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center md:w-1/4"
            >
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Travel</h3>
              <p className="text-gray-600">Meet your driver at the pickup point and enjoy your journey</p>
            </motion.div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/register">
              <Button>Get Started Now</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Thousands of travelers trust CarShare for their daily commutes and long-distance trips.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-gray-50 p-8 rounded-lg shadow-md"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{testimonial.name}</h3>
                    <p className="text-green-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Sharing Rides?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Join thousands of users who are already saving money, reducing emissions, and making new connections.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register">
              <Button className="bg-white text-green-600 hover:bg-gray-100">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button className="bg-transparent border-2 border-white hover:bg-white hover:text-green-600">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;