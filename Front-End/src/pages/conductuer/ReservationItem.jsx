
const ReservationItem = ({ reservation, onApprove, onReject, loading, formatDateTime }) => (
  <li className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors duration-200">
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <p className="text-lg font-medium text-gray-900 truncate">
            Reservation #{reservation.id}
          </p>
          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            reservation.status === 'confirmee' ? 'bg-green-100 text-green-800' : 
            reservation.status === 'annulee' ? 'bg-red-100 text-red-800' : 
            'bg-yellow-100 text-yellow-800'
          }`}>
            {reservation.status === 'confirmee' ? 'Approved' : 
             reservation.status === 'annulee' ? 'Rejected' : 
             'Pending'}
          </span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-4">
          {/* Trip Information */}
          <div className="col-span-2">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Trip Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {reservation.trajet?.lieu_depart} → {reservation.trajet?.lieu_arrivee}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Trip Date: {formatDateTime(reservation.trajet?.date_depart)}
              </div>
            </div>
          </div>

          {/* Reservation Details */}
          <div className="col-span-2">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Reservation Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Reservation Date: {formatDateTime(reservation.date_reservation)}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Seats Reserved: {reservation.places_reservees}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Total Price: {reservation.prix_total} €
              </div>
            </div>
          </div>
        </div>
      </div>
      {reservation.status === 'en_attente' && (
        <div className="ml-4 flex-shrink-0 flex space-x-2">
          <button
            onClick={() => onApprove(reservation.id)}
            disabled={loading}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            Approve
          </button>
          <button
            onClick={() => onReject(reservation.id)}
            disabled={loading}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  </li>
);

  export default ReservationItem;
  