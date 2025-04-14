
const OfferRide = ()=>{

    return (
        <h1>OfferRide</h1>
    );
};

export default OfferRide



// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import Button from "../components/Button";

// const OfferRide = () => {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     // Route details
//     departureCity: "",
//     departureLocation: "",
//     departureAddress: "",
//     destinationCity: "",
//     destinationLocation: "",
//     destinationAddress: "",
    
//     // Date and time
//     departureDate: "",
//     departureTime: "",
//     estimatedArrivalTime: "",
    
//     // Vehicle details
//     vehicle: "",
//     licensePlate: "",
//     seats: 3,
    
//     // Price and preferences
//     price: "",
//     description: "",
//     amenities: {
//       airConditioning: false,
//       usbCharger: false,
//       petFriendly: false,
//       luggageSpace: false,
//       smoking: false,
//       music: false,
//     },
//     rules: {
//       noSmoking: false,
//       noFood: false,
//       musicByAgreement: false,
//       noAlcohol: false,
//     },
//   });
  
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
    
//     if (type === "checkbox") {
//       if (name.startsWith("amenities.")) {
//         const amenityName = name.split(".")[1];
//         setFormData({
//           ...formData,
//           amenities: {
//             ...formData.amenities,
//             [amenityName]: checked,
//           },
//         });
//       } else if (name.startsWith("rules.")) {
//         const ruleName = name.split(".")[1];
//         setFormData({
//           ...formData,
//           rules: {
//             ...formData.rules,
//             [ruleName]: checked,
//           },
//         });
//       } else {
//         setFormData({
//           ...formData,
//           [name]: checked,
//         });
//       }
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value,
//       });
//     }
//   };
  
//   const nextStep = () => {
//     setStep(step + 1);
//     window.scrollTo(0, 0);
//   };
  
//   const prevStep = () => {
//     setStep(step - 1);
//     window.scrollTo(0, 0);
//   };
  
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // In a real app, this would send the data to an API
//     console.log("Submitting ride offer:", formData);
    
//     // Show success and redirect
//     setStep(4);
//   };

//   // Array of vehicles for the select dropdown
//   const vehicles = [
//     { value: "", label: "Select your vehicle" },
//     { value: "toyota_prius", label: "Toyota Prius" },
//     { value: "honda_civic", label: "Honda Civic" },
//     { value: "ford_focus", label: "Ford Focus" },
//     { value: "tesla_model_3", label: "Tesla Model 3" },
//     { value: "volkswagen_golf", label: "Volkswagen Golf" },
//     { value: "add_new", label: "Add a new vehicle" },
//   ];
  
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
      
//       <div className="container mx-auto px-4 py-8 flex-grow">
//         <div className="max-w-3xl mx-auto">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-gray-800 mb-4">Offer a Ride</h1>
//             <p className="text-gray-600">
//               Share your journey with others, reduce travel costs, and help the environment.
//             </p>
//           </div>
          
//           {/* Progress Bar */}
//           <div className="mb-8">
//             <div className="flex justify-between mb-2">
//               {["Route Details", "Schedule & Vehicle", "Preferences"].map((label, index) => (
//                 <span
//                   key={index}
//                   className={`text-sm font-medium ${
//                     step > index + 1 ? "text-green-600" : step === index + 1 ? "text-green-600" : "text-gray-500"
//                   }`}
//                 >
//                   Step {index + 1}: {label}
//                 </span>
//               ))}
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2.5">
//               <div
//                 className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
//                 style={{ width: `${((step - 1) / 3) * 100}%` }}
//               ></div>
//             </div>
//           </div>
          
//           {/* Form Steps */}
//           <motion.div
//             key={step}
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -20 }}
//             transition={{ duration: 0.3 }}
//           >
//             {step === 1 && (
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-semibold mb-6">Route Details</h2>
                
//                 <div className="space-y-6">
//                   <div>
//                     <h3 className="text-lg font-medium mb-4">Departure</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label htmlFor="departureCity" className="block text-gray-700 mb-1">