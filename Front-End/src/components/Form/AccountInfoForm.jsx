import { useState } from "react";
import { motion } from "framer-motion";
import Input from "../Input";
import Button from "../Button";

const AccountInfoForm = ({ role, email, password, password_confirmation, prevStep, nextStep, updateFormData, handleSubmit }) => {
  const [loading, setLoading] = useState(false);
  
  return (
    <motion.form 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      onSubmit={(e) => {
        e.preventDefault();
        if (role === "conducteur") {
          nextStep(e);
        } else {
          handleSubmit(e);
        }
      }}
      className="space-y-4"
    >
      <div>
        <Input 
          label="Email" 
          type="email" 
          value={email}
          onChange={(e) => updateFormData('email', e.target.value)}
          placeholder="your@email.com"
          required
        />
      </div>
      
      <div>
        <Input 
          label="Password" 
          type="password" 
          value={password}
          onChange={(e) => updateFormData('password', e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>
      
      <div>
        <Input 
          label="Confirm Password" 
          type="password" 
          value={password_confirmation}
          onChange={(e) => updateFormData('password_confirmation', e.target.value)}
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
          Back
        </Button>
        <Button 
          type="submit" 
          className="flex-1"
          loading={role === "passager" ? loading : false}
        >
          {role === "conducteur" ? "Continue" : "Create Account"}
        </Button>
      </div>
    </motion.form>
  );
};

export default AccountInfoForm;
