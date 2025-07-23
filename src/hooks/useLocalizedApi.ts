import {useLocale} from '../context/LocaleContext';
import {
	searchFlights as baseSearchFlights,
	getAirportSuggestions as baseGetAirportSuggestions,
	getFlightDetails,
} from '../services/api';
import {FlightSearchParams, FlightSearchResponse, ApiResponse} from '../types';

/**
 * Custom hook that provides API functions with automatic locale injection
 * This ensures all API calls use the user's selected language
 */
export const useLocalizedApi = () => {
	const {currentLocale} = useLocale();

	const searchFlights = async (
		searchParams: FlightSearchParams
	): Promise<ApiResponse<FlightSearchResponse>> => {
		return baseSearchFlights(searchParams, currentLocale?.id);
	};

	const getAirportSuggestions = async (
		query: string
	): Promise<ApiResponse<any>> => {
		return baseGetAirportSuggestions(query, currentLocale?.id);
	};

	// Flight details don't typically need locale, but we can pass it anyway
	const getFlightDetailsWithLocale = async (
		flightId: string
	): Promise<ApiResponse<any>> => {
		// You could extend this API call to include locale if the API supports it
		return getFlightDetails(flightId);
	};

	return {
		searchFlights,
		getAirportSuggestions,
		getFlightDetails: getFlightDetailsWithLocale,
		currentLocale,
	};
};

export default useLocalizedApi; 