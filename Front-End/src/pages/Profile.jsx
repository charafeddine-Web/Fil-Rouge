import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // User profile state
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    bio: "",
    profileImage: null,
    address: "",
    city: "",
    country: "",
    preferredLanguage: "english",
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      newRideRequests: true,
      rideUpdates: true,
      promotions: false
    },
    verifications: {
      email: true,
      phone: false,
      identity: false,
      drivingLicense: false
    }
  });
  
  // Simulated data loading
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setProfile({
        firstName: "Thomas",
        lastName: "Martin",
        email: "thomas.martin@example.com",
        phone: "+33 6 12 34 56 78",
        birthDate: "1990-05-15",
        bio: "Passionate about travel and meeting new people. I commute regularly between Paris and Lyon for work.",
        profileImage: "/api/placeholder/150/150",
        address: "123 Rue de la Paix",
        city: "Paris",
        country: "France",
        preferredLanguage: "french",
        notifications: {
          emailNotifications: true,
          smsNotifications: true,
          newRideRequests: true,
          rideUpdates: true,
          promotions: false
        },
        verifications: {
          email: true,
          phone: true,
          identity: false,
          drivingLicense: true
        }
      });
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setProfile({
        ...profile,
        [section]: {
          ...profile[section],
          [field]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setProfile({
        ...profile,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };
  
  const handleImageChange = (e) => {
    // In a real app, this would handle file uploads
    setProfile({
      ...profile,
      profileImage: URL.createObjectURL(e.target.files[0])
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1500);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            {!isEditing && (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Edit Profile
              </Button>
            )}
          </div>
          
          {/* Success Message */}
          {saveSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Profile updated successfully!</span>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Profile Header */}
            <div className="bg-green-600 px-6 py-4">
              <div className="flex items-center">
                <div className="relative">
                  <img 
                    src={profile.profileImage || "/api/placeholder/150/150"} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full border-4 border-white object-cover"
                  />
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={handleImageChange}
                        accept="image/*" 
                      />
                    </label>
                  )}
                </div>
                <div className="ml-6">
                  <h2 className="text-2xl font-bold text-white">{profile.firstName} {profile.lastName}</h2>
                  <p className="text-green-100">Member since January 2023</p>
                </div>
              </div>
            </div>
            
            {/* Profile Content */}
            <form onSubmit={handleSubmit}>
              <div className="p-6">
                {/* Personal Information */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 mb-1">First Name</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          name="firstName" 
                          value={profile.firstName} 
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                          required 
                        />
                      ) : (
                        <p className="text-gray-800">{profile.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Last Name</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          name="lastName" 
                          value={profile.lastName} 
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                          required 
                        />
                      ) : (
                        <p className="text-gray-800">{profile.lastName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Email</label>
                      {isEditing ? (
                        <input 
                          type="email" 
                          name="email" 
                          value={profile.email} 
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                          required 
                        />
                      ) : (
                        <p className="text-gray-800">{profile.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Phone Number</label>
                      {isEditing ? (
                        <input 
                          type="tel" 
                          name="phone" 
                          value={profile.phone} 
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                        />
                      ) : (
                        <p className="text-gray-800">{profile.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Date of Birth</label>
                      {isEditing ? (
                        <input 
                          type="date" 
                          name="birthDate" 
                          value={profile.birthDate} 
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                        />
                      ) : (
                        <p className="text-gray-800">{new Date(profile.birthDate).toLocaleDateString()}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Preferred Language</label>
                      {isEditing ? (
                        <select 
                          name="preferredLanguage" 
                          value={profile.preferredLanguage} 
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="english">English</option>
                          <option value="french">French</option>
                          <option value="german">German</option>
                          <option value="spanish">Spanish</option>
                        </select>
                      ) : (
                        <p className="text-gray-800 capitalize">{profile.preferredLanguage}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Address */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 mb-1">Street Address</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          name="address" 
                          value={profile.address} 
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                        />
                      ) : (
                        <p className="text-gray-800">{profile.address}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">City</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          name="city" 
                          value={profile.city} 
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                        />
                      ) : (
                        <p className="text-gray-800">{profile.city}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Country</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          name="country" 
                          value={profile.country} 
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                        />
                      ) : (
                        <p className="text-gray-800">{profile.country}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Bio */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">About Me</h3>
                  {isEditing ? (
                    <textarea 
                      name="bio" 
                      value={profile.bio} 
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                      placeholder="Tell others about yourself..."
                    ></textarea>
                  ) : (
                    <p className="text-gray-800">{profile.bio}</p>
                  )}
                </div>
                
                {/* Verification Status */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Verifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg border ${profile.verifications.email ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center">
                        {profile.verifications.email ? (
                          <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-4.707-5.293a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 9.414l-3.293 3.293a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="font-medium">Email</span>
                      </div>
                      <p className="text-sm mt-1 text-gray-600">
                        {profile.verifications.email ? 'Verified' : 'Not verified'}
                      </p>
                    </div>
                    
                    <div className={`p-4 rounded-lg border ${profile.verifications.phone ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center">
                        {profile.verifications.phone ? (
                          <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-4.707-5.293a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 9.414l-3.293 3.293a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="font-medium">Phone</span>
                      </div>
                      <p className="text-sm mt-1 text-gray-600">
                        {profile.verifications.phone ? 'Verified' : 'Not verified'}
                      </p>
                    </div>
                    
                    <div className={`p-4 rounded-lg border ${profile.verifications.identity ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center">
                        {profile.verifications.identity ? (
                          <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-4.707-5.293a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 9.414l-3.293 3.293a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="font-medium">ID Verification</span>
                      </div>
                      <p className="text-sm mt-1 text-gray-600">
                        {profile.verifications.identity ? 'Verified' : 'Not verified'}
                      </p>
                      {!profile.verifications.identity && (
                        <Button 
                          type="button"
                          className="mt-2 text-sm bg-green-600 hover:bg-green-700 text-white py-1 px-3"
                          onClick={() => navigate('/verify-identity')}
                        >
                          Verify Now
                        </Button>
                      )}
                    </div>
                    
                    <div className={`p-4 rounded-lg border ${profile.verifications.drivingLicense ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center">
                        {profile.verifications.drivingLicense ? (
                          <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-4.707-5.293a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 9.414l-3.293 3.293a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="font-medium">Driving License</span>
                      </div>
                      <p className="text-sm mt-1 text-gray-600">
                        {profile.verifications.drivingLicense ? 'Verified' : 'Not verified'}
                      </p>
                      {!profile.verifications.drivingLicense && (
                        <Button 
                          type="button"
                          className="mt-2 text-sm bg-green-600 hover:bg-green-700 text-white py-1 px-3"
                          onClick={() => navigate('/verify-license')}
                        >
                          Verify Now
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Notification Preferences */}
                {isEditing && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Notification Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="notifications.emailNotifications" 
                          name="notifications.emailNotifications" 
                          checked={profile.notifications.emailNotifications} 
                          onChange={handleInputChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" 
                        />
                        <label htmlFor="notifications.emailNotifications" className="ml-2 text-gray-700">
                          Email Notifications
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="notifications.smsNotifications" 
                          name="notifications.smsNotifications" 
                          checked={profile.notifications.smsNotifications} 
                          onChange={handleInputChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" 
                        />
                        <label htmlFor="notifications.smsNotifications" className="ml-2 text-gray-700">
                          SMS Notifications
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="notifications.newRideRequests" 
                          name="notifications.newRideRequests" 
                          checked={profile.notifications.newRideRequests} 
                          onChange={handleInputChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" 
                        />
                        <label htmlFor="notifications.newRideRequests" className="ml-2 text-gray-700">
                          New Ride Requests
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="notifications.rideUpdates" 
                          name="notifications.rideUpdates" 
                          checked={profile.notifications.rideUpdates} 
                          onChange={handleInputChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" 
                        />
                        <label htmlFor="notifications.rideUpdates" className="ml-2 text-gray-700">
                          Ride Updates
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="notifications.promotions" 
                          name="notifications.promotions" 
                          checked={profile.notifications.promotions} 
                          onChange={handleInputChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" 
                        />
                        <label htmlFor="notifications.promotions" className="ml-2 text-gray-700">
                          Promotions and News
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Form Actions */}
              {isEditing && (
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    onClick={() => setIsEditing(false)}
                    className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </div>
          
          {/* Account Actions */}
          {!isEditing && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => navigate('/change-password')}
                className="block w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-4 py-2"
              >
                Change Password
              </Button>
              <Button 
                onClick={() => navigate('/payment-methods')}
                className="block w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-4 py-2"
              >
                Payment Methods
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;