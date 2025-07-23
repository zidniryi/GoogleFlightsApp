import axios, {AxiosInstance, AxiosResponse} from 'axios';
import {FlightSearchParams, FlightSearchResponse, ApiResponse} from '../types';

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
		const response: AxiosResponse<T> = await apiClient.get(endpoint, {params});
		return {
			success: true,
			data: response.data,
		};
	} catch (error: any) {
		console.error('API Error:', error);
		return {
			success: false,
			data: {} as T,
			error: error.response?.data?.message || error.message || 'An error occurred',
		};
	}
};

// Generic API POST helper
export const apiPost = async <T>(
	endpoint: string,
	data?: Record<string, any>
): Promise<ApiResponse<T>> => {
	try {
		const response: AxiosResponse<T> = await apiClient.post(endpoint, data);
		return {
			success: true,
			data: response.data,
		};
	} catch (error: any) {
		console.error('API Error:', error);
		return {
			success: false,
			data: {} as T,
			error: error.response?.data?.message || error.message || 'An error occurred',
		};
	}
};

// Flight Search API
export const searchFlights = async (
	searchParams: FlightSearchParams
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

// Get Airport Suggestions
export const getAirportSuggestions = async (
	query: string
): Promise<ApiResponse<any>> => {
	return apiGet('/api/v1/flights/search-airports', {query});
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