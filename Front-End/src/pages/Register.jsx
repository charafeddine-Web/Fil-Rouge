import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { motion } from "framer-motion";
import VehicleInfoForm from "../components/Form/VehicleInfoForm";
import AccountInfoForm from "../components/Form/AccountInfoForm";
import PersonalInfoForm from "../components/Form/PersonalInfoForm";
import StepperIndicator from "../components/StepperIndicator";

const Register = () => {
  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
    telephone: "",
    role: "passenger",
    // info Vehicle  
    marque: "",
    modele: "",
    immatriculation: "",
    couleur: "",
    nombre_places: 0
  });
  const [loading, setLoading] = useState(false);

  const updateFormData = (field, value) => {
    setFormData((prevState) => {
      return {
        ...prevState,
        [field]: value
      }
    });
  };

  const nextStep = (e) => {
    e.preventDefault();
    setFormStep(formStep + 1);
  };

  const prevStep = (e) => {
    e.preventDefault();
    setFormStep(formStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      console.log("Form submitted:", formData);
      // Here you would typically redirect the user or show a success message
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 px-4">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            y: [0, 15, 0],
            x: [0, 5, 0]
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
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden z-10"
      >
        <div className="h-2 bg-gradient-to-r from-green-400 via-green-500 to-green-400"></div>
        <div className="px-8 pt-8 pb-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 font-urbanist">Create an Account</h2>
            <p className="text-gray-500 mt-2 font-urbanist">
              Join our carpooling community
              {formData.role === "driver" ? " as a driver" : " as a passenger"}
            </p>
          </div>
          
          <StepperIndicator formStep={formStep} role={formData.role} />
          
          {formStep === 0 && 
            <PersonalInfoForm 
              nom={formData.nom} 
              prenom={formData.prenom} 
              telephone={formData.telephone} 
              role={formData.role}
              nextStep={nextStep} 
              updateFormData={updateFormData}
            />
          }

          {formStep === 1 && 
            <AccountInfoForm 
              role={formData.role} 
              email={formData.email} 
              password={formData.password} 
              confirmPassword={formData.confirmPassword}
              prevStep={prevStep}
              nextStep={nextStep}
              updateFormData={updateFormData}
              handleSubmit={handleSubmit}
            />
          }
          
          {formStep === 2 && formData.role === "conducteur" && 
            <VehicleInfoForm 
              marque={formData.marque}
              modele={formData.modele}
              immatriculation={formData.immatriculation}
              couleur={formData.couleur}
              nombre_places={formData.nombre_places}
              updateFormData={updateFormData}
              prevStep={prevStep}
              handleSubmit={handleSubmit}
            />
          }
          
          <div className="relative flex items-center mt-8">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 font-urbanist">or sign up with</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-6">
            <button 
              type="button" 
              className="flex justify-center items-center py-2.5 px-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.033s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.79-1.677-4.184-2.702-6.735-2.702-5.522 0-10 4.478-10 10s4.478 10 10 10c8.396 0 10.249-7.85 9.426-11.748l-9.426 0.083z" fill="#4285F4"/>
              </svg>
            </button>
            <button 
              type="button" 
              className="flex justify-center items-center py-2.5 px-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-0.732 0-1.325 0.593-1.325 1.325v21.351c0 0.731 0.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463 0.099 2.795 0.143v3.24l-1.918 0.001c-1.504 0-1.795 0.715-1.795 1.763v2.313h3.587l-0.467 3.622h-3.12v9.293h6.116c0.73 0 1.323-0.593 1.323-1.325v-21.35c0-0.732-0.593-1.325-1.325-1.325z" fill="#3b5998"/>
              </svg>
            </button>
            <button 
              type="button" 
              className="flex justify-center items-center py-2.5 px-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#000000"/>
              </svg>
            </button>
          </div>
          
          <p className="mt-8 text-center text-sm text-gray-500 font-urbanist">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="font-semibold text-green-500 hover:text-green-600"
            >
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
