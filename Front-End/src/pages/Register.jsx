import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { motion } from "framer-motion";
import VehicleInfoForm from "../components/Form/VehicleInfoForm";
import AccountInfoForm from "../components/Form/AccountInfoForm";
import PersonalInfoForm from "../components/Form/PersonalInfoForm";
import StepperIndicator from "../components/StepperIndicator";
import { register } from "../services/auth"; 
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConducteurInfoForm from "../components/Form/ConducteurInfoForm";

const Register = () => {
  const navigate = useNavigate();

  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    password_confirmation: "",
    telephone: "",
    role: "passager",
    // info Vehicle  
    marque: "",
    modele: "",
    immatriculation: "",
    couleur: "",
    nombre_places: 0,

    // Conducteur
    num_permis: "",
    adresse: "",
    ville: "",
    date_naissance: "",
    sexe: "",
    photo_permis: null,
    photo_identite: null
  });
  const [loading, setLoading] = useState(false);

  const updateFormData = (field, value) => {
    setFormData((prevState) => {
      return {
        ...prevState,
        [field]: value
      };
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

    const dataToSend = { ...formData };

    if (formData.role === "passager") {
      delete dataToSend.marque;
      delete dataToSend.modele;
      delete dataToSend.immatriculation;
      delete dataToSend.couleur;
      delete dataToSend.nombre_places;

      delete dataToSend.num_permis;
      delete dataToSend.adresse;
      delete dataToSend.ville;
      delete dataToSend.date_naissance;
      delete dataToSend.sexe;
      delete dataToSend.photo_permis;
      delete dataToSend.photo_identite;

    }

    try {
      const response = await register(dataToSend);
      toast.success("Registration successful! Please check your email for a verification code.");

      setTimeout(() =>  navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`), 1500);
    } catch (error) {
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).flat().forEach((msg) => {
          toast.error(msg);
        });
      } else {
        toast.error("An error has occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 px-4 pb-20">
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
          
          {formData.role === "passager" && (
  <>
    {formStep === 0 && (
      <PersonalInfoForm
        nom={formData.nom}
        prenom={formData.prenom}
        telephone={formData.telephone}
        role={formData.role}
        nextStep={nextStep}
        updateFormData={updateFormData}
      />
    )}
    {formStep === 1 && (
      <AccountInfoForm
        role={formData.role}
        email={formData.email}
        password={formData.password}
        confirmPassword={formData.password_confirmation}
        prevStep={prevStep}
        updateFormData={updateFormData}
        handleSubmit={handleSubmit}
      />
    )}
  </>
)}

{formData.role === "conducteur" && (
  <>
    {formStep === 0 && (
      <PersonalInfoForm
        nom={formData.nom}
        prenom={formData.prenom}
        telephone={formData.telephone}
        role={formData.role}
        nextStep={nextStep}
        updateFormData={updateFormData}
      />
    )}
    {formStep === 1 && (
      <ConducteurInfoForm
        num_permis={formData.num_permis}
        adresse={formData.adresse}
        ville={formData.ville}
        date_naissance={formData.date_naissance}
        sexe={formData.sexe}
        updateFormData={updateFormData}
        prevStep={prevStep}
        nextStep={nextStep}
        handleSubmit={handleSubmit}
        loading={loading}
      />
    )}
    {formStep === 2 && (
      <AccountInfoForm
        role={formData.role}
        email={formData.email}
        password={formData.password}
        confirmPassword={formData.password_confirmation}
        prevStep={prevStep}
        nextStep={nextStep}
        updateFormData={updateFormData}
        handleSubmit={handleSubmit}
      />
    )}
    {formStep === 3 && (
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
    )}
  </>
)}

          
          {/* <div className="relative flex items-center mt-8">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 font-urbanist">or sign up with</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-6">
          </div> */}
          
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
