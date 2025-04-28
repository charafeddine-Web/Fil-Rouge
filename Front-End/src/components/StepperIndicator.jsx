const StepperIndicator = ({ formStep, role }) => {
  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      <div className="flex flex-col items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${formStep === 0 ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800'}`}
        >
          1
        </div>
        <span className="text-xs mt-1 font-urbanist">Personal</span>
      </div>
      
      <div className={`flex-1 h-1 ${formStep >= 1 ? 'bg-green-300' : 'bg-gray-200'}`}></div>

      {role === "conducteur" && (
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${formStep === 1 ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800'}`}
          >
            2
          </div>
          <span className="text-xs mt-1 font-urbanist">Driver Info</span>
        </div>
      )}

      {role === "conducteur" && (
        <div className={`flex-1 h-1 ${formStep >= 2 ? 'bg-green-300' : 'bg-gray-200'}`}></div>
      )}

      <div className="flex flex-col items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${formStep === (role === "conducteur" ? 2 : 1) ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800'}`}
        >
          {role === "conducteur" ? 3 : 2}
        </div>
        <span className="text-xs mt-1 font-urbanist">Account</span>
      </div>
      
      {role === "conducteur" && (
        <div className={`flex-1 h-1 ${formStep >= 3 ? 'bg-green-300' : 'bg-gray-200'}`}></div>
      )}

      {role === "conducteur" && (
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${formStep === 3 ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800'}`}
          >
            4
          </div>
          <span className="text-xs mt-1 font-urbanist">Vehicle</span>
        </div>
      )}
    </div>
  );
};

export default StepperIndicator;
