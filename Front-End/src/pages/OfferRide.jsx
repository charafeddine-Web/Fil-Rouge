import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";

const OfferRide = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Route details
    departureCity: "",
    departureLocation: "",
    departureAddress: "",
    destinationCity: "",
    destinationLocation: "",
    destinationAddress: "",
    
    // Date and time
    departureDate: "",
    departureTime: "",
    estimatedArrivalTime: "",
    
    // Vehicle details
    vehicle: "",
    licensePlate: "",
    seats: 3,
    
    // Price and preferences
    price: "",
    description: "",
    amenities: {
      airConditioning: false,
      usbCharger: false,
      petFriendly: false,
      luggageSpace: false,
      smoking: false,
      music: false,
    },
    rules: {
      noSmoking: false,
      noFood: false,
      musicByAgreement: false,
      noAlcohol: false,
    },
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      if (name.startsWith("amenities.")) {
        const amenityName = name.split(".")[1];
        setFormData({
          ...formData,
          amenities: {
            ...formData.amenities,
            [amenityName]: checked,
          },
        });
      } else if (name.startsWith("rules.")) {
        const ruleName = name.split(".")[1];
        setFormData({
          ...formData,
          rules: {
            ...formData.rules,
            [ruleName]: checked,
          },
        });
      } else {
        setFormData({
          ...formData,
          [name]: checked,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the data to an API
    console.log("Submitting ride offer:", formData);
    
    // Show success and redirect
    setStep(4);
  };

  // Array of vehicles for the select dropdown
  const vehicles = [
    { value: "", label: "Select your vehicle" },
    { value: "toyota_prius", label: "Toyota Prius" },
    { value: "honda_civic", label: "Honda Civic" },
    { value: "ford_focus", label: "Ford Focus" },
    { value: "tesla_model_3", label: "Tesla Model 3" },
    { value: "volkswagen_golf", label: "Volkswagen Golf" },
    { value: "add_new", label: "Add a new vehicle" },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Offer a Ride</h1>
            <p className="text-gray-600">
              Share your journey with others, reduce travel costs, and help the environment.
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {["Route Details", "Schedule & Vehicle", "Preferences"].map((label, index) => (
                <span
                  key={index}
                  className={`text-sm font-medium ${
                    step > index + 1 ? "text-green-600" : step === index + 1 ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  Step {index + 1}: {label}
                </span>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Form Steps */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Route Details</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Departure</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="departureCity" className="block text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          id="departureCity"
                          name="departureCity"
                          value={formData.departureCity}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Enter city name"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="departureLocation" className="block text-gray-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          id="departureLocation"
                          name="departureLocation"
                          value={formData.departureLocation}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Train station, airport, etc."
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label htmlFor="departureAddress" className="block text-gray-700 mb-1">
                        Address (optional)
                      </label>
                      <input
                        type="text"
                        id="departureAddress"
                        name="departureAddress"
                        value={formData.departureAddress}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Exact address for pickup"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Destination</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="destinationCity" className="block text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          id="destinationCity"
                          name="destinationCity"
                          value={formData.destinationCity}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Enter city name"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="destinationLocation" className="block text-gray-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          id="destinationLocation"
                          name="destinationLocation"
                          value={formData.destinationLocation}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Train station, airport, etc."
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label htmlFor="destinationAddress" className="block text-gray-700 mb-1">
                        Address (optional)
                      </label>
                      <input
                        type="text"
                        id="destinationAddress"
                        name="destinationAddress"
                        value={formData.destinationAddress}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Exact address for drop-off"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <Button type="button" onClick={nextStep} className="bg-green-600 hover:bg-green-700 text-white">
                    Next: Schedule & Vehicle
                  </Button>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Schedule & Vehicle</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Date and Time</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="departureDate" className="block text-gray-700 mb-1">
                          Departure Date
                        </label>
                        <input
                          type="date"
                          id="departureDate"
                          name="departureDate"
                          value={formData.departureDate}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="departureTime" className="block text-gray-700 mb-1">
                          Departure Time
                        </label>
                        <input
                          type="time"
                          id="departureTime"
                          name="departureTime"
                          value={formData.departureTime}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label htmlFor="estimatedArrivalTime" className="block text-gray-700 mb-1">
                        Estimated Arrival Time
                      </label>
                      <input
                        type="time"
                        id="estimatedArrivalTime"
                        name="estimatedArrivalTime"
                        value={formData.estimatedArrivalTime}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Vehicle Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="vehicle" className="block text-gray-700 mb-1">
                          Vehicle
                        </label>
                        <select
                          id="vehicle"
                          name="vehicle"
                          value={formData.vehicle}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        >
                          {vehicles.map((vehicle) => (
                            <option key={vehicle.value} value={vehicle.value}>
                              {vehicle.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="licensePlate" className="block text-gray-700 mb-1">
                          License Plate
                        </label>
                        <input
                          type="text"
                          id="licensePlate"
                          name="licensePlate"
                          value={formData.licensePlate}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Enter license plate"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label htmlFor="seats" className="block text-gray-700 mb-1">
                        Available Seats
                      </label>
                      <div className="flex items-center">
                        <input
                          type="range"
                          id="seats"
                          name="seats"
                          min="1"
                          max="7"
                          value={formData.seats}
                          onChange={handleChange}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="ml-4 font-medium text-gray-700">{formData.seats}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between">
                  <Button type="button" onClick={prevStep} className="bg-gray-600 hover:bg-gray-700 text-white">
                    Back
                  </Button>
                  <Button type="button" onClick={nextStep} className="bg-green-600 hover:bg-green-700 text-white">
                    Next: Price & Preferences
                  </Button>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Price & Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="price" className="block text-lg font-medium mb-2">
                      Price per Passenger (€)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter price in euros"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-lg font-medium mb-2">
                      Trip Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Add any additional information about your trip (optional)"
                    ></textarea>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries({
                        airConditioning: "Air Conditioning",
                        usbCharger: "USB Charger",
                        petFriendly: "Pet Friendly",
                        luggageSpace: "Extra Luggage Space",
                        smoking: "Smoking Allowed",
                        music: "Music",
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`amenities.${key}`}
                            name={`amenities.${key}`}
                            checked={formData.amenities[key]}
                            onChange={handleChange}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <label htmlFor={`amenities.${key}`} className="ml-2 text-gray-700">
                            {label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Rules</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries({
                        noSmoking: "No Smoking",
                        noFood: "No Food",
                        musicByAgreement: "Music by Agreement",
                        noAlcohol: "No Alcohol",
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`rules.${key}`}
                            name={`rules.${key}`}
                            checked={formData.rules[key]}
                            onChange={handleChange}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <label htmlFor={`rules.${key}`} className="ml-2 text-gray-700">
                            {label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between">
                  <Button type="button" onClick={prevStep} className="bg-gray-600 hover:bg-gray-700 text-white">
                    Back
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                    Publish Ride
                  </Button>
                </div>
              </form>
            )}
            
            {step === 4 && (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Ride Published Successfully!</h2>
                <p className="text-gray-600 mb-8">
                  Your ride from {formData.departureCity} to {formData.destinationCity} on{" "}
                  {formData.departureDate} has been published. You'll be notified when passengers request to join.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    type="button"
                    onClick={() => navigate("/my-rides")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    View My Rides
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OfferRide;