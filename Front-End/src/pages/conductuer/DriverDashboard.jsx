import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import { getTrajetsByDriverId} from "../../services/trajets";
import {getConducteurByUserId} from "../../services/conducteur";
import { getReservationsByDriverId, approveReservation, cancelReservation } from "../../services/reservations";
import RideItem from './RideItem';
import ReservationItem from './ReservationItem';
import { toast } from "react-toastify";

const DriverDashboard = ({user}) => {
  const [loading, setLoading] = useState(true);
  const [driverData, setDriverData] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [reservations, setReservations] = useState([]);
  const [reservationLoading, setReservationLoading] = useState(false);

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        setLoading(true);
        if (!user || !user.id) {
          console.error("No user ID available")
          setLoading(false)
          return
        }
        const conducteurRes = await getConducteurByUserId(user.id)
        const conducteurId = conducteurRes.data.id
        const response = await getTrajetsByDriverId(conducteurId);
        
        let reservationsData = [];
        try {
          const reservationsRes = await getReservationsByDriverId();
          reservationsData = reservationsRes.data;
          console.log('reservationdta ',reservationsData)

        } catch (error) {
          console.warn("Reservations endpoint not available yet:", error);
        }
        
        // Transform API data to match expected structure
        const transformedData = {
          id: conducteurId,
          name: `${user.prenom} ${user.nom}`,
          profileImage: conducteurRes.data.photoDeProfil || "/api/placeholder/100/100",
          rating: parseFloat(conducteurRes.data.note_moyenne) || 0,
          totalRides: response.data.length || 0,
          earningsThisMonth: response.data.reduce((sum, ride) => 
            ride.statut === 'terminé' ? sum + parseFloat(ride.prix_par_place) : sum, 0),
          earningsTotal: response.data.reduce((sum, ride) => 
            ride.statut === 'terminé' ? sum + parseFloat(ride.prix_par_place) : sum, 0),
          isVerified: conducteurRes.data.status === 'active',
          upcomingRides: response.data
            .filter(ride => ride.statut === 'planifié' || ride.statut === 'en_cours')
            .map(ride => ({
              id: ride.id,
              departure: {
                city: ride.lieu_depart,
                location: ride.lieu_depart,
                datetime: ride.date_depart
              },
              destination: {
                city: ride.lieu_arrivee,
                location: ride.lieu_arrivee
              },
              price: parseFloat(ride.prix_par_place),
              passengers: ride.nombre_places,
              status: ride.statut,
              description: ride.description,
              bagagesAutorises: ride.bagages_autorises,
              animauxAutorises: ride.animaux_autorises,
              fumeurAutorise: ride.fumeur_autorise,
              options: ride.options
            })),
          completedRides: response.data
            .filter(ride => ride.statut === 'terminé')
            .map(ride => ({
              id: ride.id,
              departure: {
                city: ride.lieu_depart,
                location: ride.lieu_depart,
                datetime: ride.date_depart
              },
              destination: {
                city: ride.lieu_arrivee,
                location: ride.lieu_arrivee
              },
              price: parseFloat(ride.prix_par_place),
              passengers: ride.nombre_places,
              status: ride.statut,
              description: ride.description,
              bagagesAutorises: ride.bagages_autorises,
              animauxAutorises: ride.animaux_autorises,
              fumeurAutorise: ride.fumeur_autorise,
              options: ride.options
            })),
          driverInfo: {
            numPermis: conducteurRes.data.num_permis || '',
            disponibilite: conducteurRes.data.disponibilite || false,
            adresse: conducteurRes.data.adresse || '',
            ville: conducteurRes.data.ville || '',
            dateNaissance: conducteurRes.data.date_naissance || '',
            sexe: conducteurRes.data.sexe || '',
            photoPermis: conducteurRes.data.photo_permis || '',
            photoIdentite: conducteurRes.data.photo_identite || ''
          }
        };

        setDriverData(transformedData);
        setReservations(reservationsData);
      } catch (error) {
        console.error("Error fetching driver data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverData();
  }, []);

  const handleApproveReservation = async (reservationId) => {
    try {
      setReservationLoading(true);
      console.log("Approving reservation ID:", reservationId);
      
      const response = await approveReservation(reservationId);
      console.log("Approval response:", response);
      
      // Refresh all data after approval
      const conducteurRes = await getConducteurByUserId(user.id);
      const conducteurId = conducteurRes.data.id;
      const response2 = await getTrajetsByDriverId(conducteurId);
      const reservationsRes = await getReservationsByDriverId();
      
      setDriverData(prevData => ({
        ...prevData,
        upcomingRides: response2.data
          .filter(ride => ride.statut === 'planifié' || ride.statut === 'en_cours')
          .map(ride => ({
            id: ride.id,
            departure: {
              city: ride.lieu_depart,
              location: ride.lieu_depart,
              datetime: ride.date_depart
            },
            destination: {
              city: ride.lieu_arrivee,
              location: ride.lieu_arrivee
            },
            price: parseFloat(ride.prix_par_place),
            passengers: ride.nombre_places,
            status: ride.statut,
            description: ride.description,
            bagagesAutorises: ride.bagages_autorises,
            animauxAutorises: ride.animaux_autorises,
            fumeurAutorise: ride.fumeur_autorise,
            options: ride.options
          }))
      }));
      setReservations(reservationsRes.data);
      
      toast.success("Reservation confirmed successfully!");
    } catch (error) {
      console.error("Error approving reservation:", error);
      
      if (error.response?.status === 403) {
        toast.error("You are not authorized to confirm this reservation.");
      } else {
        toast.error("Error confirming the reservation.");
      }
    } finally {
      setReservationLoading(false);
    }
  };

  const handleRejectReservation = async (reservationId) => {
    try {
      setReservationLoading(true);
      console.log("Rejecting reservation ID:", reservationId);
      
      const response = await cancelReservation(reservationId);
      console.log("Rejection response:", response);
      
      // Refresh all data after rejection
      const conducteurRes = await getConducteurByUserId(user.id);
      const conducteurId = conducteurRes.data.id;
      const response2 = await getTrajetsByDriverId(conducteurId);
      const reservationsRes = await getReservationsByDriverId();
      
      setDriverData(prevData => ({
        ...prevData,
        upcomingRides: response2.data
          .filter(ride => ride.statut === 'planifié' || ride.statut === 'en_cours')
          .map(ride => ({
            id: ride.id,
            departure: {
              city: ride.lieu_depart,
              location: ride.lieu_depart,
              datetime: ride.date_depart
            },
            destination: {
              city: ride.lieu_arrivee,
              location: ride.lieu_arrivee
            },
            price: parseFloat(ride.prix_par_place),
            passengers: ride.nombre_places,
            status: ride.statut,
            description: ride.description,
            bagagesAutorises: ride.bagages_autorises,
            animauxAutorises: ride.animaux_autorises,
            fumeurAutorise: ride.fumeur_autorise,
            options: ride.options
          }))
      }));
      setReservations(reservationsRes.data);
      
      toast.success("Reservation rejected successfully!");
    } catch (error) {
      console.error("Error rejecting reservation:", error);
      
      if (error.response?.status === 403) {
        toast.error("You are not authorized to reject this reservation.");
      } else {
        toast.error("Error rejecting the reservation.");
      }
    } finally {
      setReservationLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateTime = (dateString) => {
    return `${formatDate(dateString)} à ${formatTime(dateString)}`;
  };

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
    <div className="min-h-screen bg-gray-50">
      <Header/>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
          <div className="md:flex md:items-center md:justify-between mb-6">
            {/* <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
              Driver's dashboard
              </h2>
            </div> */}
          </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveSection("overview")}
              className={`${
                activeSection === "overview"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("upcoming")}
              className={`${
                activeSection === "upcoming"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Upcoming Rides
            </button>
            <button
              onClick={() => setActiveSection("history")}
              className={`${
                activeSection === "history"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              History
            </button>
            <button
              onClick={() => setActiveSection("reservations")}
              className={`${
                activeSection === "reservations"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Reservations
            </button>
          </nav>
        </div>

        {/* Dashboard Content */}
        {activeSection === "overview" && driverData && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Stats Cards */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Trajets à venir
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {driverData.upcomingRides?.length || 0}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total des trajets
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {driverData.totalRides}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Revenus ce mois
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {driverData.earningsThisMonth.toFixed(2)} €
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Note moyenne
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {driverData.rating}/5
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Profile Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg sm:col-span-2">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Profil Conducteur
                </h3>
                <div className="mt-5 flex items-center">
                  <img
                    className="h-20 w-20 rounded-full object-cover"
                    src={driverData.profileImage}
                    alt={driverData.name}
                  />
                  <div className="ml-4">
                    <h4 className="text-xl font-semibold text-gray-900">
                      {driverData.name}
                    </h4>
                    <p className="flex items-center text-sm text-gray-500">
                      {driverData.isVerified && (
                        <span className="flex items-center text-green-600">
                          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Conducteur vérifié
                        </span>
                      )}
                    </p>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Numéro de permis: {driverData.driverInfo.numPermis}</p>
                      <p>Ville: {driverData.driverInfo.ville}</p>
                      <p>Disponibilité: {driverData.driverInfo.disponibilite ? 'Disponible' : 'Non disponible'}</p>
                    </div>
                    <Link to="/profile">
                      <button className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Modifier le profil
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Ride Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg sm:col-span-2">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Prochain trajet
                </h3>
                {driverData.upcomingRides.length > 0 ? (
                  <div className="mt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-3xl font-bold text-gray-900">
                          {driverData.upcomingRides[0].departure.city}
                        </div>
                        <svg className="h-5 w-5 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <div className="text-3xl font-bold text-gray-900">
                          {driverData.upcomingRides[0].destination.city}
                        </div>
                      </div>
                      <div className="text-lg font-semibold text-green-600">
                        {driverData.upcomingRides[0].price.toFixed(2)} €
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDateTime(driverData.upcomingRides[0].departure.datetime)}
                      </div>
                      <div className="flex items-center mt-1">
                        <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {driverData.upcomingRides[0].departure.location}
                      </div>
                      <div className="flex items-center mt-1">
                        <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        {driverData.upcomingRides[0].passengers} passagers
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 text-center py-6">
                    <p className="text-gray-500">Aucun trajet à venir</p>
                    <Link to="/rides/new">
                      <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Proposer un trajet
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSection === "upcoming" && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {driverData.upcomingRides.length > 0 ? (
                driverData.upcomingRides.map((ride) => (
                  <li key={ride.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-lg font-medium text-green-600 truncate">
                            {ride.departure.city} → {ride.destination.city}
                          </p>
                          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            ride.status === "Confirmé" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {ride.status}
                          </span>
                        </div>
                        <div className="text-lg font-medium text-gray-900">
                          {ride.price.toFixed(2)} €
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex sm:space-x-6">
                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{formatDateTime(ride.departure.datetime)}</span>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span>{ride.passengers} places disponibles</span>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            <span>{ride.price.toFixed(2)}€ par place</span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm sm:mt-0">
                          <div className="flex space-x-2">
                            {ride.bagagesAutorises && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Bagages
                              </span>
                            )}
                            {ride.animauxAutorises && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Animaux
                              </span>
                            )}
                            {ride.fumeurAutorise && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Fumeur
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm sm:mt-0">
                          <Link to={`/rides/${ride.id}`} className="text-green-600 hover:text-green-900">
                            Voir les détails
                            <svg className="ml-1 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Aucun trajet à venir
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Proposez un nouveau trajet pour commencer à gagner de l'argent.
                  </p>
                  <div className="mt-6">
                    <Link to="/rides/new">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Proposer un trajet
                      </button>
                    </Link>
                  </div>
                </li>
              )}
            </ul>
          </div>
        )}

        {activeSection === "history" && (
          <div className="space-y-6">
            {/* Completed Rides */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Completed Rides
                </h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {driverData.completedRides.length > 0 ? (
                  driverData.completedRides.map((ride) => (
                    <RideItem key={ride.id} ride={ride} formatDateTime={formatDateTime} />
                  ))
                ) : (
                  <li className="px-4 py-12 text-center">
                    <p className="text-sm text-gray-500">No completed rides</p>
                  </li>
                )}
              </ul>
            </div>

            {/* Completed Reservations */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Completed Reservations
                </h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {reservations.filter(res => res.status === 'confirmee' || res.status === 'annulee').length > 0 ? (
                  reservations
                    .filter(res => res.status === 'confirmee' || res.status === 'annulee')
                    .map((reservation) => (
                      <ReservationItem
                        formatDateTime={formatDateTime}
                        key={reservation.id}
                        reservation={reservation}
                        onApprove={handleApproveReservation}
                        onReject={handleRejectReservation}
                        loading={reservationLoading}
                      />
                    ))
                ) : (
                  <li className="px-4 py-12 text-center">
                    <p className="text-sm text-gray-500">No completed reservations</p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {activeSection === "reservations" && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Pending Reservations
              </h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {reservations.filter(res => res.status === 'en_attente').length > 0 ? (
                reservations
                  .filter(res => res.status === 'en_attente')
                  .map((reservation) => (
                    <ReservationItem
                     formatDateTime={formatDateTime}
                      key={reservation.id}
                      reservation={reservation}
                      onApprove={handleApproveReservation}
                      onReject={handleRejectReservation}
                      loading={reservationLoading}
                    />
                  ))
              ) : (
                <li className="px-4 py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No pending reservations
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    New reservations will appear here.
                  </p>
                </li>
              )}
            </ul>
          </div>
        )}

        {/* {activeSection === "vehicle" && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Informations sur le véhicule
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Détails de votre véhicule enregistré pour les covoiturages.
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Modèle
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {driverData.vehicle.model}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Année
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {driverData.vehicle.year}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Couleur
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {driverData.vehicle.color}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Plaque d'immatriculation
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {driverData.vehicle.licensePlate}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Nombre de places
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {driverData.vehicle.seats}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="px-4 py-5 sm:px-6">
              <Link to="/vehicle/edit">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Modifier le véhicule
                </button>
              </Link>
            </div>
          </div>
        )} */}
      </main>

      <Footer/>
    </div>
  );
}

export default DriverDashboard;