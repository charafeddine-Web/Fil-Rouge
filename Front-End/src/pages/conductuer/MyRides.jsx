"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Loader from "../../components/Loader"
import Button from "../../components/Button"
import { getTrajetsByDriverId } from "../../services/trajets"
import { getConducteurByUserId } from "../../services/conducteur"
import { createTrajet } from "../../services/trajets"
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
        const conducteurId = conducteurRes.data.id
        setConducteurId(conducteurId)
        // console.log('conducteuuuuuuuuuuuuuur',conducteurId)
        const response = await getTrajetsByDriverId(conducteurId)
        console.log("API response:", response)
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
      } finally {
        setLoading(false)
      }
    }
    // Helper function to map backend status to frontend status
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
  const handleSubmitNewRide = async (e) => {
    e.preventDefault()
    if (!conducteurId) {
      console.error("No conducteur ID available")
      alert("Unable to create ride: Driver information missing.")
      return
    }
    if (!newRideForm.departure.city || !newRideForm.destination.city) {
      console.error("Departure or destination city is missing")
      alert("Please fill in both departure and destination cities.")
      return
    }
    if (!newRideForm.departure.date || !newRideForm.departure.time) {
      console.error("Departure date or time is missing")
      alert("Please specify the departure date and time.")
      return
    }
    if (!newRideForm.destination.date || !newRideForm.destination.time) {
      console.error("Destination date or time is missing")
      alert("Please specify the destination date and time.")
      return
    }
    if (!newRideForm.availableSeats || isNaN(Number.parseInt(newRideForm.availableSeats))) {
      console.error("Invalid number of seats")
      alert("Please specify a valid number of seats.")
      return
    }
    if (!newRideForm.price || isNaN(Number.parseFloat(newRideForm.price))) {
      console.error("Invalid price")
      alert("Please specify a valid price.")
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
    } catch (error) {
      console.error("Error creating trajet:", error.response?.data)
    }
  }

  const handleCancelRide = (rideId) => {
    if (window.confirm("Are you sure you want to cancel this ride? Any passengers will be notified and refunded.")) {
      setRides({
        ...rides,
        active: rides.active.filter((ride) => ride.id !== rideId),
      })
    }
  }

  const handleRatePassenger = (rideId, passengerId, rating) => {
    // Update the passenger's rating in the completed rides
    const updatedCompleted = rides.completed.map((ride) => {
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
      completed: updatedCompleted,
    })
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
    return <Loader />
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
                    : activeTab === "annulé"
                    ? "No canceled rides"
                    :'walo'
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
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Duration: {calculateDuration(ride.departure.datetime, ride.destination.datetime)}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-gray-700">{ride.description}</p>
                    </div>
                    {ride.status === "completed" && ride.driverRating && (
                      <div className="flex items-center mb-4">
                        <p className="text-sm font-medium text-gray-700 mr-2">Your rating for this ride:</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${star <= ride.driverRating ? "text-yellow-400" : "text-gray-300"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          ))}
                          <span className="ml-1 text-xs text-gray-600">({ride.driverRating})</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Right Column - Passengers & Actions */}
                  <div className="border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                    <div className="mb-4">
                      <p className="font-medium text-gray-700 mb-1">Price per Passenger</p>
                      <p className="text-2xl font-bold text-green-600">${ride.price}</p>
                    </div>
                    {ride.status === "completed" ? (
                      <div className="mb-4">
                        <p className="font-medium text-gray-700 mb-1">Total Earnings</p>
                        <p className="text-2xl font-bold text-green-600">${ride.earnings}</p>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <p className="font-medium text-gray-700 mb-1">Potential Earnings</p>
                        <p className="text-2xl font-bold text-green-600">
                          ${ride.estimatedEarnings || ride.price * ride.totalSeats}
                        </p>
                      </div>
                    )}
                    <div className="mb-4">
                      <p className="font-medium text-gray-700 mb-1">
                        {ride.status === "draft" ? "Planned Seats" : "Seats"}
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="bg-gray-100 rounded-lg px-3 py-1">
                          <span className="text-gray-800 font-medium">{ride.bookedSeats}</span>
                          <span className="text-gray-500 text-sm"> booked</span>
                        </div>
                        <div className="bg-gray-100 rounded-lg px-3 py-1">
                          <span className="text-gray-800 font-medium">{ride.availableSeats}</span>
                          <span className="text-gray-500 text-sm"> available</span>
                        </div>
                      </div>
                    </div>
                    {/* Passengers Section */}
                    {ride.passengers.length > 0 && (
                      <div className="mb-4">
                        <p className="font-medium text-gray-700 mb-2">Passengers</p>
                        <div className="space-y-3">
                          {ride.passengers.map((passenger) => (
                            <div key={passenger.id} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <img
                                  src={passenger.image || "/placeholder.svg"}
                                  alt={passenger.name}
                                  className="w-8 h-8 rounded-full object-cover mr-2"
                                />
                                <div>
                                  <p className="text-sm font-medium text-gray-800">{passenger.name}</p>
                                  <div className="flex items-center">
                                    <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                    </svg>
                                    <span className="ml-1 text-xs text-gray-600">{passenger.rating}</span>
                                  </div>
                                </div>
                              </div>
                              {ride.status === "completed" && !passenger.rated && (
                                <div className="flex space-x-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      onClick={() => handleRatePassenger(ride.id, passenger.id, star)}
                                      className="text-gray-300 hover:text-yellow-400 focus:outline-none transition-colors"
                                    >
                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                      </svg>
                                    </button>
                                  ))}
                                </div>
                              )}
                              {ride.status === "completed" && passenger.rated && (
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                  </svg>
                                  <span className="ml-1 text-xs text-gray-600">{passenger.yourRating}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {ride.passengers.length === 0 && <p className="text-sm text-gray-500">No passengers yet</p>}
                  </div>
                </div>
                {/* Ride Actions */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-2">
                  {ride.status === "planifié" && (
                    <>
                      <Button variant="secondary" onClick={() => handleCancelRide(ride.id)}>
                        Cancel Ride
                      </Button>
                      <Button variant="secondary" as={Link} to={`/edit-ride/${ride.id}`}>
                        Edit Ride
                      </Button>
                      <Button as={Link} to={`/ride/${ride.id}`}>
                        View Details
                      </Button>
                    </>
                  )}
                  {ride.status === "en_cours" && (
                    <Button as={Link} to={`/ride/${ride.id}`}>
                      View Details
                    </Button>
                  )}
                  {ride.status === "terminé" && (
                    <Button as={Link} to={`/ride/${ride.id}`}>
                      View Details
                    </Button>
                  )}
                  {ride.status === "annulé" && (
                    <Button as={Link} to={`/ride/${ride.id}`}>
                      View Details
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Add New Ride Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Offer a New Ride</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmitNewRide}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Departure Fields */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Departure</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">City</label>
                        <input
                          type="text"
                          className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                          value={newRideForm.departure.city}
                          onChange={(e) => handleInputChange(e, "departure", "city")}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Location</label>
                        <input
                          type="text"
                          className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                          value={newRideForm.departure.location}
                          onChange={(e) => handleInputChange(e, "departure", "location")}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Date</label>
                        <input
                          type="date"
                          className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                          value={newRideForm.departure.date}
                          onChange={(e) => handleInputChange(e, "departure", "date")}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Time</label>
                        <input
                          type="time"
                          className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                          value={newRideForm.departure.time}
                          onChange={(e) => handleInputChange(e, "departure", "time")}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  {/* Destination Fields */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Destination</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">City</label>
                        <input
                          type="text"
                          className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                          value={newRideForm.destination.city}
                          onChange={(e) => handleInputChange(e, "destination", "city")}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Location</label>
                        <input
                          type="text"
                          className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                          value={newRideForm.destination.location}
                          onChange={(e) => handleInputChange(e, "destination", "location")}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Date</label>
                        <input
                          type="date"
                          className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                          value={newRideForm.destination.date}
                          onChange={(e) => handleInputChange(e, "destination", "date")}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Time</label>
                        <input
                          type="time"
                          className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                          value={newRideForm.destination.time}
                          onChange={(e) => handleInputChange(e, "destination", "time")}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Other Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Available Seats</label>
                    <input
                      type="number"
                      min="1"
                      max="8"
                      className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                      value={newRideForm.availableSeats}
                      onChange={(e) => handleInputChange(e, null, "availableSeats")}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Price per Passenger ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                      value={newRideForm.price}
                      onChange={(e) => handleInputChange(e, null, "price")}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Description</label>
                    <textarea
                      className="w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
                      rows="4"
                      value={newRideForm.description}
                      onChange={(e) => handleInputChange(e, null, "description")}
                      placeholder="Add details about your ride (e.g., stops, amenities, preferences)"
                    ></textarea>
                  </div>
                </div>
                {/* Modal Actions */}
                <div className="mt-6 flex justify-end space-x-2">
                  <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Ride</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
      <Footer />
    </div >
    </>
     )
}
export default MyRide
