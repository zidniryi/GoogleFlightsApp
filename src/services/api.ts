import axios, {AxiosInstance, AxiosResponse} from 'axios';
import {FlightSearchParams, FlightSearchResponse, ApiResponse, LocaleResponse, NearbyAirportsResponse, LocationCoordinates, SearchAirportResponse} from '../types';
import {logApiRequest, logApiResponse, logError} from '../utils/ReactotronLogger';

// API Configuration
const API_BASE_URL = 'https://sky-scrapper.p.rapidapi.com';
const API_KEY = process.env.EXPO_PUBLIC_RAPIDAPI_KEY;

// Create axios instance
const apiClient: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
		'x-rapidapi-key': API_KEY,
		'Content-Type': 'application/json',
	},
	timeout: 30000, // 30 seconds
});

// Generic API request helper
const apiGet = async <T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> => {
	try {
		logApiRequest('GET', `${API_BASE_URL}${endpoint}`, params);

		const response: AxiosResponse<T> = await apiClient.get(endpoint, {
			params,
		});

		logApiResponse('GET', `${API_BASE_URL}${endpoint}`, response.data, true);

		return {
			success: true,
			data: response.data,
			error: undefined,
		};
	} catch (error: any) {
		const errorMessage = error.response?.data?.message || error.message || 'API request failed';
		logError(`API Error (${endpoint}):`, error);

		return {
			success: false,
			data: null as any,
			error: errorMessage,
		};
	}
};

// Flight search with enhanced locale support
export const searchFlights = async (
	params: FlightSearchParams,
	locale?: string
): Promise<ApiResponse<FlightSearchResponse>> => {
	const searchParams = {
		...params,
		locale: locale || 'en-US',
	};
	return apiGet<FlightSearchResponse>('/api/v1/flights/search', searchParams);
};

// Airport suggestions with locale support
export const getAirportSuggestions = async (
	query: string,
	locale?: string
): Promise<ApiResponse<any>> => {
	const params = {
		query,
		locale: locale || 'en-US',
	};
	return apiGet<any>('/api/v1/flights/searchAirport', params);
};

// Get flight details
export const getFlightDetails = async (flightId: string): Promise<ApiResponse<any>> => {
	return apiGet<any>(`/api/v1/flights/${flightId}`);
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

// Search Airports by query
export const searchAirports = async (
	query: string,
	locale?: string
): Promise<ApiResponse<SearchAirportResponse>> => {
	const params = {
		query,
		locale: locale || 'en-US',
	};
	return apiGet<SearchAirportResponse>('/api/v1/flights/searchAirport', params);
};

// Mock flight data for development/testing
export const getMockFlights = (): ApiResponse<FlightSearchResponse> => {
	return {
		success: true,
		data: {
			flights: [
				{
					id: '1',
					airline: 'Delta Airlines',
					flightNumber: 'DL123',
					departureAirport: 'JFK',
					arrivalAirport: 'LAX',
					departureTime: '08:00',
					arrivalTime: '11:30',
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
					departureTime: '14:30',
					arrivalTime: '18:15',
					duration: '5h 45m',
					price: 349,
					stops: 1,
					currency: 'USD',
					available: true,
				},
			],
			searchId: 'mock-search-123',
			totalResults: 2,
			currency: 'USD',
		},
		error: undefined,
	};
}; 