import axios, {AxiosInstance, AxiosResponse} from 'axios';
import {FlightSearchParams, FlightSearchResponse, ApiResponse, LocaleResponse, NearbyAirportsResponse, LocationCoordinates, SearchAirportResponse, FlightDetailsParams, FlightDetailsResponse} from '../types';
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

// Flight search with real API parameters
export const searchFlights = async (
	params: FlightSearchParams,
	locale?: string
): Promise<ApiResponse<FlightSearchResponse>> => {
	const searchParams = {
		originSkyId: params.originSkyId,
		destinationSkyId: params.destinationSkyId,
		originEntityId: params.originEntityId,
		destinationEntityId: params.destinationEntityId,
		date: params.date,
		...(params.returnDate && {returnDate: params.returnDate}),
		cabinClass: params.cabinClass || 'economy',
		adults: params.adults,
		...(params.children && {children: params.children}),
		...(params.infants && {infants: params.infants}),
		sortBy: params.sortBy || 'best',
		currency: params.currency || 'USD',
		market: locale || params.market || 'en-US',
		countryCode: params.countryCode || 'US',
	};
	return apiGet<FlightSearchResponse>('/api/v1/flights/searchFlights', searchParams);
};

// Get flight details with pricing options
export const getFlightDetails = async (
	params: FlightDetailsParams,
	locale?: string
): Promise<ApiResponse<FlightDetailsResponse>> => {
	const detailsParams = {
		legs: JSON.stringify(params.legs),
		adults: params.adults,
		currency: params.currency || 'USD',
		locale: locale || params.locale || 'en-US',
		market: params.market || 'en-US',
		cabinClass: params.cabinClass || 'economy',
		countryCode: params.countryCode || 'US',
	};
	return apiGet<FlightDetailsResponse>('/api/v1/flights/getFlightDetails', detailsParams);
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

// Mock flight data for development/testing (using legacy format)
export const getMockFlights = (): ApiResponse<any> => {
	return {
		success: true,
		data: {
			status: true,
			timestamp: Date.now(),
			sessionId: 'mock-session-123',
			data: {
				context: {
					status: 'complete',
					totalResults: 2,
				},
				itineraries: [
					{
						id: 'mock-1',
						price: {
							raw: 299,
							formatted: '$299',
						},
						legs: [
							{
								id: 'mock-leg-1',
								origin: {
									id: 'JFK',
									name: 'New York John F. Kennedy',
									displayCode: 'JFK',
									city: 'New York',
									isHighlighted: false,
								},
								destination: {
									id: 'LAX',
									name: 'Los Angeles',
									displayCode: 'LAX',
									city: 'Los Angeles',
									isHighlighted: false,
								},
								durationInMinutes: 330,
								stopCount: 0,
								isSmallestStops: true,
								departure: '2024-02-20T08:00:00',
								arrival: '2024-02-20T11:30:00',
								timeDeltaInDays: 0,
								carriers: {
									marketing: [
										{
											id: 1,
											logoUrl: 'https://logos.skyscnr.com/images/airlines/favicon/DL.png',
											name: 'Delta Airlines',
										},
									],
									operationType: 'fully_operated',
								},
								segments: [],
							},
						],
						isSelfTransfer: false,
						isProtectedSelfTransfer: false,
						farePolicy: {
							isChangeAllowed: false,
							isPartiallyChangeable: false,
							isCancellationAllowed: false,
							isPartiallyRefundable: false,
						},
						tags: ['cheapest', 'fastest'],
						isMashUp: false,
						hasFlexibleOptions: false,
						score: 0.95,
					},
				],
				messages: [],
				filterStats: {
					duration: {
						min: 330,
						max: 400,
					},
					airports: [],
					carriers: [],
					stopPrices: {
						direct: {
							isPresent: true,
							formattedPrice: '$299',
						},
						one: {
							isPresent: false,
						},
						twoOrMore: {
							isPresent: false,
						},
					},
				},
			},
		},
		error: undefined,
	};
}; 