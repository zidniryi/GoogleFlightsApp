// User and Authentication Types
export interface User {
	id: string;
	email: string;
	name: string;
	token: string;
}

export interface AuthContextType {
	user: User | null;
	login: (email: string, password: string) => Promise<void>;
	signup: (email: string, password: string, name: string) => Promise<void>;
	logout: () => Promise<void>;
	loading: boolean;
}

// Flight Types
export interface Flight {
	id: string;
	airline: string;
	flightNumber: string;
	departureAirport: string;
	arrivalAirport: string;
	departureTime: string;
	arrivalTime: string;
	duration: string;
	price: number;
	stops: number;
	currency: string;
	available: boolean;
}

export interface FlightDetails extends Flight {
	segments: FlightSegment[];
	priceBreakdown: PriceBreakdown;
	baggage: BaggageInfo;
	aircraft: string;
	cabin: string;
}

export interface FlightSegment {
	id: string;
	airline: string;
	flightNumber: string;
	departureAirport: string;
	arrivalAirport: string;
	departureTime: string;
	arrivalTime: string;
	duration: string;
	aircraft: string;
}

export interface PriceBreakdown {
	baseFare: number;
	taxes: number;
	fees: number;
	total: number;
	currency: string;
}

export interface BaggageInfo {
	cabin: string;
	checked: string;
}

// Search Types
export interface FlightSearchParams {
	origin: string;
	destination: string;
	departDate: string;
	returnDate?: string;
	adults: number;
	children?: number;
	infants?: number;
	cabinClass?: 'economy' | 'premium' | 'business' | 'first';
	tripType: 'oneWay' | 'roundTrip';
}

export interface FlightSearchResponse {
	flights: Flight[];
	searchId: string;
	totalResults: number;
	currency: string;
}

// Airport Types
export interface Airport {
	code: string;
	name: string;
	city: string;
	country: string;
}

// Locale/Language Types
export interface Locale {
	id: string;
	text: string;
}

export interface LocaleResponse {
	status: boolean;
	message: string;
	timestamp: number;
	data: Locale[];
}

// Nearby Airports Types
export interface AirportPresentation {
	title: string;
	suggestionTitle: string;
	subtitle: string;
}

export interface FlightParams {
	skyId: string;
	entityId: string;
	flightPlaceType: string;
	localizedName: string;
}

export interface HotelParams {
	entityId: string;
	entityType: string;
	localizedName: string;
}

export interface AirportNavigation {
	entityId: string;
	entityType: string;
	localizedName: string;
	relevantFlightParams: FlightParams;
	relevantHotelParams: HotelParams;
}

export interface NearbyAirport {
	presentation: AirportPresentation;
	navigation: AirportNavigation;
}

export interface CurrentAirport extends NearbyAirport {
	skyId: string;
	entityId: string;
}

export interface NearbyAirportsData {
	current: CurrentAirport;
	nearby: NearbyAirport[];
	recent: NearbyAirport[];
}

export interface NearbyAirportsResponse {
	status: boolean;
	timestamp: number;
	data: NearbyAirportsData;
}

export interface LocationCoordinates {
	latitude: number;
	longitude: number;
	accuracy?: number;
}

// Airport Search Types
export interface SearchAirportResult {
	skyId: string;
	entityId: string;
	presentation: AirportPresentation;
	navigation: AirportNavigation;
}

export interface SearchAirportResponse {
	status: boolean;
	timestamp: number;
	data: SearchAirportResult[];
}

// Generic Airport Type (for components that handle both nearby and search results)
export type AirportSearchItem = NearbyAirport | CurrentAirport | SearchAirportResult;

// API Response Types
export interface ApiResponse<T> {
	success: boolean;
	data: T;
	message?: string;
	error?: string;
}

// Navigation Types
export type RootStackParamList = {
	Auth: undefined;
	Main: undefined;
	NearbyAirports: {
		selectionMode?: 'departure' | 'arrival';
		onAirportSelect?: (airport: NearbyAirport | CurrentAirport) => void;
	};
	LanguageSelector: undefined;
};

export type AuthStackParamList = {
	SignIn: undefined;
	SignUp: undefined;
};

export type MainTabParamList = {
	Search: {
		preselectedDeparture?: {
			code: string;
			name: string;
		};
		preselectedArrival?: {
			code: string;
			name: string;
		};
	} | undefined;
	Results: {
		searchParams: FlightSearchParams;
		flights: Flight[];
	};
	Profile: undefined;
};

// Form Types
export interface SignInFormValues {
	email: string;
	password: string;
}

export interface SignUpFormValues {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export interface FlightSearchFormValues {
	origin: string;
	destination: string;
	departDate: string;
	returnDate: string;
	adults: number;
	tripType: 'oneWay' | 'roundTrip';
} 