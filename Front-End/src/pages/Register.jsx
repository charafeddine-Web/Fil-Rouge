import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { motion } from "framer-motion";

const Register = () => {
  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
    telephone: "",
    role: "passager",
    // Vehicle information for driver
    marque: "",
    modele: "",
    immatriculation: "",
    couleur: "",
    nombre_places: 0
  });
  const [loading, setLoading] = useState(false);

  const updateFormData = (field, value) => {
    
    setFormData((prevState) => ({
      ...prevState,
      [field]: value
    }));
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
    // setTimeout(() => {
    //   setLoading(false);
    //   console.log("Form submitted:", formData);
    // }, 1500);
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formStep === 0 ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800'}`}>
            1
          </div>
          <span className="text-xs mt-1 font-urbanist">Personal</span>
        </div>
        <div className={`flex-1 h-1 ${formStep >= 1 ? 'bg-green-300' : 'bg-gray-200'}`}></div>
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formStep === 1 ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800'}`}>
            2
          </div>
          <span className="text-xs mt-1 font-urbanist">Account</span>
        </div>
        {formData.role === "conducteur" && (
          <>
            <div className={`flex-1 h-1 ${formStep >= 2 ? 'bg-green-300' : 'bg-gray-200'}`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formStep === 2 ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800'}`}>
                3
              </div>
              <span className="text-xs mt-1 font-urbanist">Vehicle</span>
            </div>
          </>
        )}
      </div>
    );
  };

  const PersonalInfoForm = () => (
    <motion.form 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      onSubmit={nextStep} 
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input 
            label="Nom" 
            value={formData.nom}
            onChange={(e) =>  updateFormData('nom', e.target.value)}
            placeholder="Dupont"
            required
          />
        </div>
        <div>
          <Input 
            label="Prénom" 
            value={formData.prenom}
            onChange={(e) => updateFormData('prenom', e.target.value)}
            placeholder="Jean"
            required
          />
        </div>
      </div>
      
      <div>
        <Input 
          label="Téléphone"
          value={formData.telephone}
          onChange={(e) => updateFormData('telephone', e.target.value)}
          placeholder="+33612345678"
        />
      </div>

      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Je m'inscris en tant que</label>
        <div className="grid grid-cols-2 gap-4">
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${formData.role === 'passager' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}
            onClick={() => updateFormData('role', 'passager')}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border-2 mr-2 flex items-center justify-center ${formData.role === 'passager' ? 'border-green-500' : 'border-gray-300'}`}>
                {formData.role === 'passager' && <div className="w-3 h-3 rounded-full bg-green-500"></div>}
              </div>
              <span className="font-medium">Passager</span>
            </div>
          </div>
          
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${formData.role === 'conducteur' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}
            onClick={() => updateFormData('role', 'conducteur')}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border-2 mr-2 flex items-center justify-center ${formData.role === 'conducteur' ? 'border-green-500' : 'border-gray-300'}`}>
                {formData.role === 'conducteur' && <div className="w-3 h-3 rounded-full bg-green-500"></div>}
              </div>
              <span className="font-medium">Conducteur</span>
            </div>
          </div>
        </div>
      </div>
        
      <div>
        <Button 
          type="submit" 
          fullWidth
        >
          Continue
        </Button>
      </div>
    </motion.form>
  );

  const AccountInfoForm = () => (
    <motion.form 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      onSubmit={formData.role === "conducteur" ? nextStep : handleSubmit} 
      className="space-y-4"
    >
      <div>
        <Input 
          label="Email" 
          type="email" 
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
          placeholder="votre@email.com"
          required
        />
      </div>
      
      <div>
        <Input 
          label="Mot de passe" 
          type="password" 
          value={formData.password}
          onChange={(e) => updateFormData('password', e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>
      
      <div>
        <Input 
          label="Confirmer le mot de passe" 
          type="password" 
          value={formData.confirmPassword}
          onChange={(e) => updateFormData('confirmPassword', e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>
      
      <div className="flex space-x-4">
        <Button 
          type="button" 
          onClick={prevStep}
          variant="outline"
          className="flex-1"
        >
          Retour
        </Button>
        <Button 
          type="submit" 
          className="flex-1"
          loading={formData.role === "passager" ? loading : false}
        >
          {formData.role === "conducteur" ? "Continuer" : "Créer un compte"}
        </Button>
      </div>
    </motion.form>
  );

  const VehicleInfoForm = () => (
    <motion.form 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit} 
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input 
            label="Marque" 
            value={formData.marque}
            onChange={(e) => updateFormData('marque', e.target.value)}
            placeholder="Renault"
            required
          />
        </div>
        <div>
          <Input 
            label="Modèle" 
            value={formData.modele}
            onChange={(e) => updateFormData('modele', e.target.value)}
            placeholder="Clio"
            required
          />
        </div>
      </div>
      
      <div>
        <Input 
          label="Immatriculation" 
          value={formData.immatriculation}
          onChange={(e) => updateFormData('immatriculation', e.target.value)}
          placeholder="AB-123-CD"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input 
            label="Couleur" 
            value={formData.couleur}
            onChange={(e) => updateFormData('couleur', e.target.value)}
            placeholder="Bleu"
            required
          />
        </div>
        <div>
          <Input 
            label="Nombre de places" 
            type="number" 
            min="1"
            max="9"
            value={formData.nombre_places}
            onChange={(e) => updateFormData('nombre_places', parseInt(e.target.value) || 1)}
            required
          />
        </div>
      </div>
      
      <div className="flex space-x-4">
        <Button 
          type="button" 
          onClick={prevStep}
          variant="outline"
          className="flex-1"
        >
          Retour
        </Button>
        <Button 
          type="submit" 
          className="flex-1"
          loading={loading}
        >
          Créer un compte
        </Button>
      </div>
    </motion.form>
  );

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
            <h2 className="text-3xl font-bold text-gray-800 font-urbanist">Créer un compte</h2>
            <p className="text-gray-500 mt-2 font-urbanist">
              Rejoignez notre communauté de covoiturage
              {formData.role === "conducteur" ? " en tant que conducteur" : " en tant que passager"}
            </p>
          </div>
          
          {renderStepIndicator()}
          
          {formStep === 0 && <PersonalInfoForm />}
          {formStep === 1 && <AccountInfoForm />}
          {formStep === 2 && formData.role === "conducteur" && <VehicleInfoForm />}
          
          <div className="relative flex items-center mt-8">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 font-urbanist">ou inscrivez-vous avec</span>
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
            Vous avez déjà un compte?{" "}
            <Link 
              to="/login" 
              className="font-semibold text-green-500 hover:text-green-600"
            >
              Connectez-vous
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;