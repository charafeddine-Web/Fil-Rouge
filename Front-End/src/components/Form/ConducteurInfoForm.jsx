import { useState } from "react";
import { motion } from "framer-motion";
import Input from "../Input";
import Button from "../Button";

const ConducteurInfoForm = ({
  num_permis,
  adresse,
  ville,
  date_naissance,
  sexe,
  photo_permis,
  photo_identite,
  updateFormData,
  prevStep,
  nextStep,
  loading,
  role
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          nextStep(e);
        }}
        className="bg-white rounded-xl  p-2 space-y-3"
      >
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Input
              label="License Number"
              value={num_permis}
              onChange={(e) => updateFormData('num_permis', e.target.value)}
              placeholder="Enter your license number"
              required
              className="w-full rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Input
              label="Date of Birth"
              type="date"
              value={date_naissance}
              onChange={(e) => updateFormData('date_naissance', e.target.value)}
              required
              className="w-full rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Input
            label="Address"
            value={adresse}
            onChange={(e) => updateFormData('adresse', e.target.value)}
            placeholder="Enter your complete address"
            className="w-full rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Input
            label="City"
            value={ville}
            onChange={(e) => updateFormData('ville', e.target.value)}
            placeholder="Enter your city"
            className="w-full rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <div className="flex items-center space-x-6 bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center">
              <input
                type="radio"
                id="male"
                name="sexe"
                value="homme"
                checked={sexe === "homme"}
                onChange={(e) => updateFormData('sexe', e.target.value)}
                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="male" className="ml-2 text-gray-700">Male</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="female"
                name="sexe"
                value="femme"
                checked={sexe === "femme"}
                onChange={(e) => updateFormData('sexe', e.target.value)}
                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="female" className="ml-2 text-gray-700">Female</label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-800">Document Uploads</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">License Photo</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="text-xs text-gray-500">Upload license photo</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => updateFormData('photo_permis', e.target.files[0])}
                    accept="image/jpg, image/jpeg, image/png"
                    required
                  />
                </label>
              </div>
            </div>
            

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Identity Photo</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="text-xs text-gray-500">Upload identity photo</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => updateFormData('photo_identite', e.target.files[0])}
                    accept="image/jpg, image/jpeg, image/png"
                    required
                  />
                </label>
              </div>
            </div>
            {photo_permis && (
                <p className="text-xs text-green-600 mt-1">{photo_permis.name}</p>
                )}
                {photo_identite && (
                <p className="text-xs text-green-600 mt-1">{photo_identite.name}</p>
                )}
          </div>
         

        </div>

        <div className="pt-4">
          <div className="flex space-x-4">
            <Button
              type="button"
              onClick={prevStep}
              variant="outline"
              className="flex-1 py-3 rounded-lg"
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
              loading={loading}
            >
              Continue
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default ConducteurInfoForm;