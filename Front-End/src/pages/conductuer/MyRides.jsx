
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Loader from "../../components/Loader"
import Button from "../../components/Button"
import { getTrajetsByDriverId } from "../../services/trajets"
import { getConducteurByUserId } from "../../services/conducteur"
import { createTrajet, cancelTrajet, updateTrajet, en_coursTrajet, termineTrajet } from "../../services/trajets"
import { toast } from 'react-toastify';

const MyRide = ({ user }) => {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("planifié")
  const [rides, setRides] = useState({
    planifié: [],
    en_cours: [],
    terminé: [],
    annulé: [],
  })
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentRide, setCurrentRide] = useState(null)
  const [newRideForm, setNewRideForm] = useState({
    departure: {
      city: "",
      location: "",
      date: "",
      time: "",
    },
    destination: {
      city: "",
      location: "",
      date: "",
      time: "",
    },
    availableSeats: 3,
    price: "",
    description: "",
  })
  const [editRideForm, setEditRideForm] = useState({
    departure: {
      city: "",
      location: "",
      date: "",
      time: "",
    },
    destination: {
      city: "",
      location: "",
      date: "",
      time: "",
    },
    availableSeats: 3,
    price: "",
    description: "",
  })
  const [conducteurId, setConducteurId] = useState(null) 
  
  useEffect(() => {
    const fetchDriverRides = async () => {
      try {
        setLoading(true)
        if (!user || !user.id) {
          console.error("No user ID available")
          setLoading(false)
          return
        }
        const conducteurRes = await getConducteurByUserId(user.id)
        console.log('haaaaaaaaay ',conducteurRes)
        const conducteurId = conducteurRes.data.id
        setConducteurId(conducteurId)
        const response = await getTrajetsByDriverId(conducteurId)
        // console.log("API response:", response)

        // Map backend data structure to frontend structure
        const mappedRides = response.data.map((trajet) => ({
          id: trajet.id,
          departure: {
            city: trajet.lieu_depart,
            location: trajet.options?.lieu_depart_details || "",
            datetime: trajet.date_depart,
          },
          destination: {
            city: trajet.lieu_arrivee,
            location: trajet.options?.lieu_arrivee_details || "",
            datetime: trajet.date_arrivee_prevue,
          },
          availableSeats: trajet.nombre_places,
          totalSeats: trajet.nombre_places,
          bookedSeats: 0,
          price: Number.parseFloat(trajet.prix_par_place),
          currency: "USD",
          status: mapStatus(trajet.statut),
          createdAt: trajet.created_at,
          passengers: [],
          estimatedEarnings: Number.parseFloat(trajet.prix_par_place) * trajet.nombre_places,
          description: trajet.description || "",
        }))
        const planifié = mappedRides.filter((ride) => ride.status === "planifié")
        const en_cours = mappedRides.filter((ride) => ride.status === "en_cours")
        const terminé = mappedRides.filter((ride) => ride.status === "terminé")
        const annulé = mappedRides.filter((ride) => ride.status === "annulé")
        setRides({
          planifié,
          en_cours,
          terminé,
          annulé,
        })
      } catch (error) {
        console.error("Error fetching driver rides:", error)
        toast.error("Failed to load rides. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    const mapStatus = (backendStatus) => {
      return backendStatus || "planifié"
    }
    fetchDriverRides()
  }, [user])
  
  const formatDate = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }
  
  const formatTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }
  
  const calculateDuration = (startDateTime, endDateTime) => {
    const start = new Date(startDateTime)
    const end = new Date(endDateTime)
    const durationMs = end - start
    const hours = Math.floor(durationMs / (1000 * 60 * 60))
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }
  
  const handleInputChange = (e, section, field) => {
    const { value } = e.target
    if (section) {
      setNewRideForm({
        ...newRideForm,
        [section]: {
          ...newRideForm[section],
          [field]: value,
        },
      })
    } else {
      setNewRideForm({
        ...newRideForm,
        [field]: value,
      })
    }
  }
  
  const handleEditInputChange = (e, section, field) => {
    const { value } = e.target
    if (section) {
      setEditRideForm({
        ...editRideForm,
        [section]: {
          ...editRideForm[section],
          [field]: value,
        },
      })
    } else {
      setEditRideForm({
        ...editRideForm,
        [field]: value,
      })
    }
  }
  
  const handleSubmitNewRide = async (e) => {
    e.preventDefault()
    if (!conducteurId) {
      console.error("No conducteur ID available")
      toast.error("Unable to create ride: Driver information missing.")
      return
    }
    if (!newRideForm.departure.city || !newRideForm.destination.city) {
      console.error("Departure or destination city is missing")
      toast.error("Please fill in both departure and destination cities.")
      return
    }
    if (!newRideForm.departure.date || !newRideForm.departure.time) {
      console.error("Departure date or time is missing")
      toast.error("Please specify the departure date and time.")
      return
    }
    if (!newRideForm.destination.date || !newRideForm.destination.time) {
      console.error("Destination date or time is missing")
      toast.error("Please specify the destination date and time.")
      return
    }
    if (!newRideForm.availableSeats || isNaN(Number.parseInt(newRideForm.availableSeats))) {
      console.error("Invalid number of seats")
      toast.error("Please specify a valid number of seats.")
      return
    }
    if (!newRideForm.price || isNaN(Number.parseFloat(newRideForm.price))) {
      console.error("Invalid price")
      toast.error("Please specify a valid price.")
      return
    }
    // Prepare data for backend format
    const rideData = {
      conducteur_id: conducteurId,
      lieu_depart: newRideForm.departure.city,
      lieu_arrivee: newRideForm.destination.city,
      date_depart: new Date(`${newRideForm.departure.date}T${newRideForm.departure.time}`).toISOString(),
      date_arrivee_prevue: new Date(`${newRideForm.destination.date}T${newRideForm.destination.time}`).toISOString(),
      nombre_places: Number.parseInt(newRideForm.availableSeats),
      prix_par_place: Number.parseFloat(newRideForm.price),
      description: newRideForm.description,
      options: JSON.stringify({
        lieu_depart_details: newRideForm.departure.location,
        lieu_arrivee_details: newRideForm.destination.location,
      }),
      statut: "planifié",
    }
    try {
      const response = await createTrajet(rideData)
      console.log("Trajet created:", response.data)
      const newRide = {
        id: response.data.id || `ride-${Date.now()}`,
        departure: {
          city: newRideForm.departure.city,
          location: newRideForm.departure.location,
          datetime: new Date(`${newRideForm.departure.date}T${newRideForm.departure.time}`).toISOString(),
        },
        destination: {
          city: newRideForm.destination.city,
          location: newRideForm.destination.location,
          datetime: new Date(`${newRideForm.destination.date}T${newRideForm.destination.time}`).toISOString(),
        },
        availableSeats: Number.parseInt(newRideForm.availableSeats),
        totalSeats: Number.parseInt(newRideForm.availableSeats),
        bookedSeats: 0,
        price: Number.parseFloat(newRideForm.price),
        currency: "USD",
        status: "planifié",
        createdAt: new Date().toISOString(),
        passengers: [],
        estimatedEarnings: Number.parseFloat(newRideForm.price) * Number.parseInt(newRideForm.availableSeats),
        description: newRideForm.description,
      }
      setRides({
        ...rides,
        planifié: [...rides.planifié, newRide],
      })
      setShowAddModal(false)
      setNewRideForm({
        departure: {
          city: "",
          location: "",
          date: "",
          time: "",
        },
        destination: {
          city: "",
          location: "",
          date: "",
          time: "",
        },
        availableSeats: 3,
        price: "",
        description: "",
      })
      toast.success("Ride created successfully!")
    } catch (error) {
      console.error("Error creating trajet:", error.response?.data)
      toast.error("Failed to create ride. Please try again.")
    }
  }
  
  const handleCancelRide = async (rideId) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to cancel this ride? Any passengers will be notified and refunded."
      );
  
      if (!confirm) return;
  
      const response = await cancelTrajet(rideId);
      const canceledRide = response.trajet || response;
  
      toast.success("Ride canceled successfully!");
  
      // Find which section contains the canceled ride
      let foundInKey = null;
      let rideToMove = null;
  
      for (const key of Object.keys(rides)) {
        const foundRide = rides[key].find((ride) => ride.id === rideId);
        if (foundRide) {
          foundInKey = key;
          rideToMove = foundRide;
          break;
        }
      }
  
      if (!foundInKey || !rideToMove) return;
      rideToMove.status = "annulé";
  
      setRides((prevRides) => ({
        ...prevRides,
        [foundInKey]: prevRides[foundInKey].filter((ride) => ride.id !== rideId),
        annulé: [...prevRides.annulé, rideToMove],
      }));
  
    } catch (error) {
      console.error("Cancellation error:", error);
      toast.error("Failed to cancel the ride. Please try again.");
    }
  };

  // New function to handle starting a ride (change status to en_cours)
  const handleStartRide = async (rideId) => {
    try {
      const response = await en_coursTrajet(rideId);
      
      // Find which section contains the ride
      let foundInKey = null;
      let rideToMove = null;
  
      for (const key of Object.keys(rides)) {
        const foundRide = rides[key].find((ride) => ride.id === rideId);
        if (foundRide) {
          foundInKey = key;
          rideToMove = foundRide;
          break;
        }
      }
  
      if (!foundInKey || !rideToMove) return;
      rideToMove.status = "en_cours";
  
      setRides((prevRides) => ({
        ...prevRides,
        [foundInKey]: prevRides[foundInKey].filter((ride) => ride.id !== rideId),
        en_cours: [...prevRides.en_cours, rideToMove],
      }));
      
      toast.success("Ride started successfully!");
    } catch (error) {
      console.error("Error starting ride:", error);
      toast.error("Failed to start the ride. Please try again.");
    }
  };
  
  // New function to handle completing a ride (change status to terminé)
  const handleCompleteRide = async (rideId) => {
    try {
      const response = await termineTrajet(rideId);
      
      // Find which section contains the ride
      let foundInKey = null;
      let rideToMove = null;
  
      for (const key of Object.keys(rides)) {
        const foundRide = rides[key].find((ride) => ride.id === rideId);
        if (foundRide) {
          foundInKey = key;
          rideToMove = foundRide;
          break;
        }
      }
  
      if (!foundInKey || !rideToMove) return;
      rideToMove.status = "terminé";
  
      setRides((prevRides) => ({
        ...prevRides,
        [foundInKey]: prevRides[foundInKey].filter((ride) => ride.id !== rideId),
        terminé: [...prevRides.terminé, rideToMove],
      }));
      
      toast.success("Ride completed successfully!");
    } catch (error) {
      console.error("Error completing ride:", error);
      toast.error("Failed to complete the ride. Please try again.");
    }
  };
  
  const handleOpenEditModal = (ride) => {
    // Extract date and time from datetime strings
    const departureDate = new Date(ride.departure.datetime);
    const destinationDate = new Date(ride.destination.datetime);
    
    // Format dates for input fields
    const formatInputDate = (date) => {
      return date.toISOString().split('T')[0];
    };
    
    // Format times for input fields
    const formatInputTime = (date) => {
      return date.toTimeString().substring(0, 5);
    };
    
    setEditRideForm({
      departure: {
        city: ride.departure.city,
        location: ride.departure.location,
        date: formatInputDate(departureDate),
        time: formatInputTime(departureDate),
      },
      destination: {
        city: ride.destination.city,
        location: ride.destination.location,
        date: formatInputDate(destinationDate),
        time: formatInputTime(destinationDate),
      },
      availableSeats: ride.availableSeats,
      price: ride.price,
      description: ride.description,
    });
    
    setCurrentRide(ride);
    setShowEditModal(true);
  };
  
  const handleSubmitEditRide = async (e) => {
    e.preventDefault();
    if (!currentRide || !currentRide.id) {
      toast.error("Unable to update: Ride information missing.");
      return;
    }
    
    // Validation checks
    if (!editRideForm.departure.city || !editRideForm.destination.city) {
      toast.error("Please fill in both departure and destination cities.");
      return;
    }
    if (!editRideForm.departure.date || !editRideForm.departure.time) {
      toast.error("Please specify the departure date and time.");
      return;
    }
    if (!editRideForm.destination.date || !editRideForm.destination.time) {
      toast.error("Please specify the destination date and time.");
      return;
    }
    if (!editRideForm.availableSeats || isNaN(Number.parseInt(editRideForm.availableSeats))) {
      toast.error("Please specify a valid number of seats.");
      return;
    }
    if (!editRideForm.price || isNaN(Number.parseFloat(editRideForm.price))) {
      toast.error("Please specify a valid price.");
      return;
    }
    
    // Prepare data for backend format
    const rideData = {
      conducteur_id: conducteurId,
      lieu_depart: editRideForm.departure.city,
      lieu_arrivee: editRideForm.destination.city,
      date_depart: new Date(`${editRideForm.departure.date}T${editRideForm.departure.time}`).toISOString(),
      date_arrivee_prevue: new Date(`${editRideForm.destination.date}T${editRideForm.destination.time}`).toISOString(),
      nombre_places: Number.parseInt(editRideForm.availableSeats),
      prix_par_place: Number.parseFloat(editRideForm.price),
      description: editRideForm.description,
      options: JSON.stringify({
        lieu_depart_details: editRideForm.departure.location,
        lieu_arrivee_details: editRideForm.destination.location,
      }),
      statut: currentRide.status,
    };
    
    try {
      const response = await updateTrajet(currentRide.id, rideData);
      console.log("Trajet updated:", response.data);
      
      // Update the ride in the state
      const updatedRide = {
        ...currentRide,
        departure: {
          city: editRideForm.departure.city,
          location: editRideForm.departure.location,
          datetime: new Date(`${editRideForm.departure.date}T${editRideForm.departure.time}`).toISOString(),
        },
        destination: {
          city: editRideForm.destination.city,
          location: editRideForm.destination.location,
          datetime: new Date(`${editRideForm.destination.date}T${editRideForm.destination.time}`).toISOString(),
        },
        availableSeats: Number.parseInt(editRideForm.availableSeats),
        totalSeats: Number.parseInt(editRideForm.availableSeats),
        price: Number.parseFloat(editRideForm.price),
        estimatedEarnings: Number.parseFloat(editRideForm.price) * Number.parseInt(editRideForm.availableSeats),
        description: editRideForm.description,
      };
      
      // Find which section contains the ride
      let foundInKey = null;
      
      for (const key of Object.keys(rides)) {
        if (rides[key].some((ride) => ride.id === currentRide.id)) {
          foundInKey = key;
          break;
        }
      }
      
      if (foundInKey) {
        setRides((prevRides) => ({
          ...prevRides,
          [foundInKey]: prevRides[foundInKey].map((ride) => 
            ride.id === currentRide.id ? updatedRide : ride
          ),
        }));
      }
      
      setShowEditModal(false);
      setCurrentRide(null);
      toast.success("Ride updated successfully!");
    } catch (error) {
      console.error("Error updating trajet:", error.response?.data);
      toast.error("Failed to update ride. Please try again.");
    }
  };
  
  const handleRatePassenger = (rideId, passengerId, rating) => {
    // Update the passenger's rating in the completed rides
    const updatedCompleted = rides.terminé.map((ride) => {
      if (ride.id === rideId) {
        const updatedPassengers = ride.passengers.map((passenger) => {
          if (passenger.id === passengerId) {
            return {
              ...passenger,
              rated: true,
              yourRating: rating,
            }
          }
          return passenger
        })
        return {
          ...ride,
          passengers: updatedPassengers,
        }
      }
      return ride
    })
    setRides({
      ...rides,
      terminé: updatedCompleted,
    })
    toast.success("Passenger rated successfully!");
  }
  
  const getStatusBadge = (status) => {
    switch (status) {
      case "planifié":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Planned</span>
      case "en_cours":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">In Progress</span>
        )
      case "terminé":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Completed</span>
      case "annulé":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Canceled</span>
      default:
        return null
    }
  }
  
  if (loading) {
    return (
      <>
        <Header/>
        <div className="my-20">
        <Loader/>
        </div>
        <Footer/> 
      </>   
    );
  }
  
  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 flex-grow max-w-5xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">My Rides</h1>
            <Button onClick={() => setShowAddModal(true)}>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Offer a New Ride
              </span>
            </Button>
          </div>
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === "planifié"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-700"
                }`}
              onClick={() => setActiveTab("planifié")}
            >
              Planned ({rides.planifié.length})
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === "en_cours"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-700"
                }`}
              onClick={() => setActiveTab("en_cours")}
            >
              In Progress ({rides.en_cours.length})
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === "terminé"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-700"
                }`}
              onClick={() => setActiveTab("terminé")}
            >
              Completed ({rides.terminé.length})
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${activeTab === "annulé"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-700"
                }`}
              onClick={() => setActiveTab("annulé")}
            >
              Canceled ({rides.annulé.length})
            </button>
          </div>
          {/* Empty State */}
          {rides[activeTab].length === 0 &&
            (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {activeTab === "planifié"
                    ? "No planned rides"
                    : activeTab === "en_cours"
                    ? "No rides in progress"
                    : activeTab === "terminé"
                    ? "No completed rides"
                    : "No canceled rides"
                  }
                  </h2>
                <p className="text-gray-600 mb-6">
                  {activeTab === "planifié"
                    ? "You don't have any planned rides at the moment."
                    : activeTab === "en_cours"
                    ? "You don't have any rides in progress."
                    : activeTab === "terminé"
                    ? "You haven't completed any rides yet."
                    : "You don't have any canceled rides."}
                </p>
                <Button onClick={() => setShowAddModal(true)}>Offer a New Ride</Button>
            </div>
          )
        }
        {/* Ride Cards */}
        <div className="space-y-6">
          {rides[activeTab].map((ride, index) => (
            <motion.div
              key={ride.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-6">
                {/* Ride Header */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 5l7 7-7 7M5 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {ride.departure.city} to {ride.destination.city}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Created on {formatDate(ride.createdAt)} • Ride #{ride.id.toString().substring(0, 5)}
                      </p>
                    </div>
                  </div>
                  <div>{getStatusBadge(ride.status)}</div>
                </div>
                {/* Ride Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column - Trip Details */}
                  <div className="md:col-span-2">
                    <div className="flex items-start mb-6">
                      <div className="min-w-8 mr-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </div>
                        <div className="h-14 w-px bg-green-200 mx-auto my-1"></div>
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <div className="mb-6">
                          <div className="flex items-center">
                            <p className="font-medium text-gray-900">{formatTime(ride.departure.datetime)}</p>
                            <p className="ml-2 text-sm text-gray-500">{formatDate(ride.departure.datetime)}</p>
                          </div>
                          <p className="text-gray-700">{ride.departure.city}</p>
                          <p className="text-sm text-gray-500">{ride.departure.location}</p>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <p className="font-medium text-gray-900">{formatTime(ride.destination.datetime)}</p>
                            <p className="ml-2 text-sm text-gray-500">{formatDate(ride.destination.datetime)}</p>
                          </div>
                          <p className="text-gray-700">{ride.destination.city}</p>
                          <p className="text-sm text-gray-500">{ride.destination.location}</p>
                        </div>
                      </div>
                    </div>
                    {/* Trip Info */}
                    <div className="flex flex-wrap gap-4 text-sm mb-4">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-gray-700">
                          {calculateDuration(ride.departure.datetime, ride.destination.datetime)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span className="text-gray-700">
                          {ride.availableSeats} seats available
                        </span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-gray-700">
                          ${ride.price} per seat
                        </span>
                      </div>
                    </div>
                    {/* Description */}
                    {ride.description && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
                        <p className="text-gray-600 text-sm">{ride.description}</p>
                      </div>
                    )}
                  </div>
                  {/* Right Column - Actions */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Ride Status</h3>
                      <div className="flex items-center justify-between gap-2">
                        {/* Status Update Icons */}
                        {activeTab === "planifié" && (
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-200 transition-colors"
                              onClick={() => handleStartRide(ride.id)}
                              title="Start Ride"
                            >
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div 
                              className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-200 transition-colors"
                              onClick={() => handleCancelRide(ride.id)}
                              title="Cancel Ride"
                            >
                              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                            <div 
                              className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors"
                              onClick={() => handleOpenEditModal(ride)}
                              title="Edit Ride"
                            >
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </div>
                          </div>
                        )}
                        {activeTab === "en_cours" && (
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors"
                              onClick={() => handleCompleteRide(ride.id)}
                              title="Complete Ride"
                            >
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div 
                              className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-200 transition-colors"
                              onClick={() => handleCancelRide(ride.id)}
                              title="Cancel Ride"
                            >
                              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Earnings</h3>
                      <p className="text-xl font-semibold text-gray-900">
                        ${(ride.bookedSeats * ride.price).toFixed(2)} 
                        <span className="text-sm text-gray-500 font-normal ml-1">
                          / ${ride.estimatedEarnings}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {ride.bookedSeats} of {ride.totalSeats} seats booked
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Passengers</h3>
                      {ride.passengers && ride.passengers.length > 0 ? (
                        <div className="space-y-3">
                          {ride.passengers.map((passenger) => (
                            <div key={passenger.id} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-200 rounded-full mr-2 overflow-hidden">
                                  {passenger.profileImage ? (
                                    <img
                                      src={passenger.profileImage}
                                      alt={passenger.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700">{passenger.name}</p>
                                  <p className="text-xs text-gray-500">{passenger.seats} seat(s)</p>
                                </div>
                              </div>
                              {ride.status === "terminé" && !passenger.rated && (
                                <div className="flex space-x-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                      key={star}
                                      className="w-5 h-5 text-gray-300 cursor-pointer hover:text-yellow-400"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                      onClick={() => handleRatePassenger(ride.id, passenger.id, star)}
                                    >
                                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                  ))}
                                </div>
                              )}
                              {ride.status === "terminé" && passenger.rated && (
                                <div className="flex space-x-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                      key={star}
                                      className={`w-5 h-5 ${
                                        star <= passenger.yourRating ? "text-yellow-400" : "text-gray-300"
                                      }`}
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No passengers yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
    
    {/* Add New Ride Modal */}
    {showAddModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Offer a new ride</h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowAddModal(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmitNewRide}>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Departure</h3>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">City</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                    placeholder="City"
                    value={newRideForm.departure.city}
                    onChange={(e) => handleInputChange(e, "departure", "city")}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Exact location (optional)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                    placeholder="e.g. Airport, Train Station"
                    value={newRideForm.departure.location}
                    onChange={(e) => handleInputChange(e, "departure", "location")}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                      value={newRideForm.departure.date}
                      onChange={(e) => handleInputChange(e, "departure", "date")}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Time</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                      value={newRideForm.departure.time}
                      onChange={(e) => handleInputChange(e, "departure", "time")}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Destination</h3>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">City</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                    placeholder="City"
                    value={newRideForm.destination.city}
                    onChange={(e) => handleInputChange(e, "destination", "city")}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Exact location (optional)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                    placeholder="e.g. Airport, City Center"
                    value={newRideForm.destination.location}
                    onChange={(e) => handleInputChange(e, "destination", "location")}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                      value={newRideForm.destination.date}
                      onChange={(e) => handleInputChange(e, "destination", "date")}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Time</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                      value={newRideForm.destination.time}
                      onChange={(e) => handleInputChange(e, "destination", "time")}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Available seats</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={newRideForm.availableSeats}
                  onChange={(e) => handleInputChange(e, null, "availableSeats")}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Price per seat ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="0.00"
                  value={newRideForm.price}
                  onChange={(e) => handleInputChange(e, null, "price")}
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-1">Description (optional)</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 h-20"
                placeholder="Any details about your ride..."
                value={newRideForm.description}
                onChange={(e) => handleInputChange(e, null, "description")}
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 rounded-md text-white hover:bg-green-700"
              >
                Create Ride
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
        

       {/* Edit Ride Modal */}
    {showEditModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Ride</h2>
            <button
              onClick={() => setShowEditModal(false)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmitEditRide}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Departure */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">Departure</h3>
                <div>
                  <label htmlFor="editDepartureCity" className="block text-sm font-medium text-gray-700 mb-1">
                    City*
                  </label>
                  <input
                    id="editDepartureCity"
                    type="text"
                    value={editRideForm.departure.city}
                    onChange={(e) => handleEditInputChange(e, "departure", "city")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="City name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="editDepartureLocation" className="block text-sm font-medium text-gray-700 mb-1">
                    Specific Location (optional)
                  </label>
                  <input
                    id="editDepartureLocation"
                    type="text"
                    value={editRideForm.departure.location}
                    onChange={(e) => handleEditInputChange(e, "departure", "location")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="Meeting point, address, etc."
                  />
                </div>
                <div>
                  <label htmlFor="editDepartureDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Date*
                  </label>
                  <input
                    id="editDepartureDate"
                    type="date"
                    value={editRideForm.departure.date}
                    onChange={(e) => handleEditInputChange(e, "departure", "date")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="editDepartureTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Time*
                  </label>
                  <input
                    id="editDepartureTime"
                    type="time"
                    value={editRideForm.departure.time}
                    onChange={(e) => handleEditInputChange(e, "departure", "time")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>
              
              {/* Destination */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">Destination</h3>
                <div>
                  <label htmlFor="editDestinationCity" className="block text-sm font-medium text-gray-700 mb-1">
                    City*
                  </label>
                  <input
                    id="editDestinationCity"
                    type="text"
                    value={editRideForm.destination.city}
                    onChange={(e) => handleEditInputChange(e, "destination", "city")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="City name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="editDestinationLocation" className="block text-sm font-medium text-gray-700 mb-1">
                    Specific Location (optional)
                  </label>
                  <input
                    id="editDestinationLocation"
                    type="text"
                    value={editRideForm.destination.location}
                    onChange={(e) => handleEditInputChange(e, "destination", "location")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="Drop-off point, address, etc."
                  />
                </div>
                <div>
                  <label htmlFor="editDestinationDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Date*
                  </label>
                  <input
                    id="editDestinationDate"
                    type="date"
                    value={editRideForm.destination.date}
                    onChange={(e) => handleEditInputChange(e, "destination", "date")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="editDestinationTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Time*
                  </label>
                  <input
                    id="editDestinationTime"
                    type="time"
                    value={editRideForm.destination.time}
                    onChange={(e) => handleEditInputChange(e, "destination", "time")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Ride Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="editAvailableSeats" className="block text-sm font-medium text-gray-700 mb-1">
                  Available Seats*
                </label>
                <input
                  id="editAvailableSeats"
                  type="number"
                  min="1"
                  max="8"
                  value={editRideForm.availableSeats}
                  onChange={(e) => handleEditInputChange(e, null, "availableSeats")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="editPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Seat ($)*
                </label>
                <input
                  id="editPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editRideForm.price}
                  onChange={(e) => handleEditInputChange(e, null, "price")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="editDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                id="editDescription"
                value={editRideForm.description}
                onChange={(e) => handleEditInputChange(e, null, "description")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 h-24"
                placeholder="Add any additional details about your ride"
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </motion.div>
      </div>
    )}



    
  </>
)
}

export default MyRide;