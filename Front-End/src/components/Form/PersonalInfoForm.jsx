import { motion } from "framer-motion";
import Input from "../Input";
import Button from "../Button";
import { useState } from "react";

const PersonalInfoForm = ({ nom, prenom, telephone, role, updateFormData, nextStep }) => {
  return (
    <motion.form 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      onSubmit={(e) => {
        e.preventDefault();
        nextStep(e);
      }} 
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input 
            label="Last Name" 
            value={nom}
            onChange={(e) => updateFormData('nom', e.target.value)}
            placeholder="Smith"
            required
          />
        </div>
        <div>
          <Input 
            label="First Name" 
            value={prenom}
            onChange={(e) => updateFormData('prenom', e.target.value)}
            placeholder="John"
            required
          />
        </div>
      </div>
      
      <div>
        <Input 
          label="Phone"
          value={telephone}
          onChange={(e) => updateFormData('telephone', e.target.value)}
          placeholder="+1234567890"
        />
      </div>
      
      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">I am signing up as</label>
        <div className="grid grid-cols-2 gap-4">
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${role === 'passager' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}
            onClick={() => updateFormData('role', 'passager')}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border-2 mr-2 flex items-center justify-center ${role === 'passager' ? 'border-green-500' : 'border-gray-300'}`}>
                {role === 'passager' && <div className="w-3 h-3 rounded-full bg-green-500"></div>}
              </div>
              <span className="font-medium">Passenger</span>
            </div>
          </div>
          
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${role === 'conducteur' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}
            onClick={() => updateFormData('role', 'conducteur')}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border-2 mr-2 flex items-center justify-center ${role === 'conducteur' ? 'border-green-500' : 'border-gray-300'}`}>
                {role === 'conducteur' && <div className="w-3 h-3 rounded-full bg-green-500"></div>}
              </div>
              <span className="font-medium">Driver</span>
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
};

export default PersonalInfoForm;
