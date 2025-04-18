import { useState } from "react";
import { motion } from "framer-motion";
import Input from "../Input";
import Button from "../Button";

const VehicleInfoForm = ({ marque, modele, immatriculation, couleur, nombre_places, updateFormData, prevStep, handleSubmit }) => {
  const [loading, setLoading] = useState(false);
  
  return (
    <motion.form 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input 
            label="Brand" 
            value={marque}
            onChange={(e) => updateFormData('marque', e.target.value)}
            placeholder="Renault"
            required
          />
        </div>
        <div>
          <Input 
            label="Model" 
            value={modele}
            onChange={(e) => updateFormData('modele', e.target.value)}
            placeholder="Clio"
            required
          />
        </div>
      </div>
      
      <div>
        <Input 
          label="License Plate" 
          value={immatriculation}
          onChange={(e) => updateFormData('immatriculation', e.target.value)}
          placeholder="AB-123-CD"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input 
            label="Color" 
            value={couleur}
            onChange={(e) => updateFormData('couleur', e.target.value)}
            placeholder="Blue"
            required
          />
        </div>
        <div>
          <Input 
            label="Number of Seats" 
            type="number" 
            min="1"
            max="9"
            value={nombre_places}
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
          Back
        </Button>
        <Button 
          type="submit" 
          className="flex-1"
          loading={loading}
        >
          Create Account
        </Button>
      </div>
    </motion.form>
  );
};

export default VehicleInfoForm;
