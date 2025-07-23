import {useLocale} from '../context/LocaleContext';
import {
	searchFlights as baseSearchFlights,
	getAirportSuggestions as baseGetAirportSuggestions,
	getFlightDetails,
	getNearbyAirports as baseGetNearbyAirports,
	searchAirports as baseSearchAirports,
} from '../services/api';
import {FlightSearchParams, FlightSearchResponse, ApiResponse, LocationCoordinates, NearbyAirportsResponse, SearchAirportResponse} from '../types';

/**
 * Custom hook that provides API functions with automatic locale injection
 * All API calls will automatically include the user's selected language
 */
export const useLocalizedApi = () => {
	const {currentLocale} = useLocale();

	const searchFlights = async (
		params: FlightSearchParams
	): Promise<ApiResponse<FlightSearchResponse>> => {
		return baseSearchFlights(params, currentLocale?.id);
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

	const getNearbyAirports = async (
		coordinates: LocationCoordinates
	): Promise<ApiResponse<NearbyAirportsResponse>> => {
		return baseGetNearbyAirports(coordinates, currentLocale?.id);
	};

	const searchAirports = async (
		query: string
	): Promise<ApiResponse<SearchAirportResponse>> => {
		return baseSearchAirports(query, currentLocale?.id);
	};

	return {
		searchFlights,
		getAirportSuggestions,
		getFlightDetails: getFlightDetailsWithLocale,
		getNearbyAirports,
		searchAirports,
		currentLocale,
	};
};

export default useLocalizedApi; 