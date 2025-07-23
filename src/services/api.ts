import axios, {AxiosInstance, AxiosResponse} from 'axios';
import {FlightSearchParams, FlightSearchResponse, ApiResponse, LocaleResponse, NearbyAirportsResponse, LocationCoordinates} from '../types';
import {logApiRequest, logApiResponse, logError} from '../utils/ReactotronLogger';

// API Configuration
const API_BASE_URL = 'https://sky-scrapper.p.rapidapi.com';
const API_KEY = process.env.EXPO_PUBLIC_RAPIDAPI_KEY || 'YOUR_RAPIDAPI_KEY_HERE';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'X-RapidAPI-Key': API_KEY,
		'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
		'Content-Type': 'application/json',
	},
	timeout: 10000,
});

// Generic API helper function (following user preference for apiGet helper)
export const apiGet = async <T>(
	endpoint: string,
	params?: Record<string, any>
): Promise<ApiResponse<T>> => {
	try {
		// Log the request to Reactotron
		logApiRequest('GET', `${API_BASE_URL}${endpoint}`, params);

		const response: AxiosResponse<T> = await apiClient.get(endpoint, {params});

		// Log successful response to Reactotron
		logApiResponse('GET', `${API_BASE_URL}${endpoint}`, response.data, true);

		return {
			success: true,
			data: response.data,
		};
	} catch (error: any) {
		// Log error to both console and Reactotron
		const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
		logError('API GET Error:', {endpoint, params, error: errorMessage});

		// Log failed response to Reactotron
		logApiResponse('GET', `${API_BASE_URL}${endpoint}`, error.response?.data || error.message, false);

		return {
			success: false,
			data: {} as T,
			error: errorMessage,
		};
	}
};

// Generic API POST helper
export const apiPost = async <T>(
	endpoint: string,
	data?: Record<string, any>
): Promise<ApiResponse<T>> => {
	try {
		// Log the request to Reactotron
		logApiRequest('POST', `${API_BASE_URL}${endpoint}`, data);

		const response: AxiosResponse<T> = await apiClient.post(endpoint, data);

		// Log successful response to Reactotron
		logApiResponse('POST', `${API_BASE_URL}${endpoint}`, response.data, true);

		return {
			success: true,
			data: response.data,
		};
	} catch (error: any) {
		// Log error to both console and Reactotron
		const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
		logError('API POST Error:', {endpoint, data, error: errorMessage});

		// Log failed response to Reactotron
		logApiResponse('POST', `${API_BASE_URL}${endpoint}`, error.response?.data || error.message, false);

		return {
			success: false,
			data: {} as T,
			error: errorMessage,
		};
	}
};

// Flight Search API with optional locale support
export const searchFlights = async (
	searchParams: FlightSearchParams,
	locale?: string
): Promise<ApiResponse<FlightSearchResponse>> => {
	const params = {
		from: searchParams.origin,
		to: searchParams.destination,
		depart: searchParams.departDate,
		return: searchParams.returnDate,
		adults: searchParams.adults,
		children: searchParams.children || 0,
		infants: searchParams.infants || 0,
		cabinClass: searchParams.cabinClass || 'economy',
		currency: 'USD',
		...(locale && {locale}), // Add locale if provided
	};

	// Use different endpoint based on trip type
	const endpoint = searchParams.tripType === 'roundTrip'
		? '/api/v1/flights/search-roundtrip'
		: '/api/v1/flights/search-oneway';

	return apiGet<FlightSearchResponse>(endpoint, params);
};

// Get Flight Details
export const getFlightDetails = async (
	flightId: string
): Promise<ApiResponse<any>> => {
	return apiGet(`/api/v1/flights/details/${flightId}`);
};

// Get Airport Suggestions with optional locale support
export const getAirportSuggestions = async (
	query: string,
	locale?: string
): Promise<ApiResponse<any>> => {
	const params = {
		query,
		...(locale && {locale}), // Add locale if provided
	};
	return apiGet('/api/v1/flights/search-airports', params);
};

// Get Available Locales/Languages
export const getLocales = async (): Promise<ApiResponse<LocaleResponse>> => {
	return apiGet<LocaleResponse>('/api/v1/getLocale');
};

// Get Nearby Airports based on coordinates
export const getNearbyAirports = async (
	coordinates: LocationCoordinates,
	locale?: string
): Promise<ApiResponse<NearbyAirportsResponse>> => {
	const params = {
		lat: coordinates.latitude,
		lng: coordinates.longitude,
		locale: locale || 'en-US',
	};
	return apiGet<NearbyAirportsResponse>('/api/v1/flights/getNearByAirports', params);
};

// Mock flight data for development/testing
export const getMockFlights = () => {
	return {
		success: true,
		data: {
			flights: [
				{
					id: '1',
					airline: 'United Airlines',
					flightNumber: 'UA123',
					departureAirport: 'JFK',
					arrivalAirport: 'LAX',
					departureTime: '2024-02-01T08:00:00Z',
					arrivalTime: '2024-02-01T11:30:00Z',
					duration: '5h 30m',
					price: 299,
					stops: 0,
					currency: 'USD',
					available: true,
				},
				{
					id: '2',
					airline: 'American Airlines',
					flightNumber: 'AA456',
					departureAirport: 'JFK',
					arrivalAirport: 'LAX',
					departureTime: '2024-02-01T14:00:00Z',
					arrivalTime: '2024-02-01T17:45:00Z',
					duration: '5h 45m',
					price: 345,
					stops: 1,
					currency: 'USD',
					available: true,
				},
				{
					id: '3',
					airline: 'Delta Airlines',
					flightNumber: 'DL789',
					departureAirport: 'JFK',
					arrivalAirport: 'LAX',
					departureTime: '2024-02-01T20:00:00Z',
					arrivalTime: '2024-02-01T23:20:00Z',
					duration: '5h 20m',
					price: 275,
					stops: 0,
					currency: 'USD',
					available: true,
				},
			],
			searchId: 'mock-search-123',
			totalResults: 3,
			currency: 'USD',
		},
	};
};

export default apiClient; 