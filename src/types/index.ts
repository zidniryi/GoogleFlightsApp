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
	FlightDetails: {flight: Flight};
};

export type AuthStackParamList = {
	SignIn: undefined;
	SignUp: undefined;
};

export type MainTabParamList = {
	Search: undefined;
	Results: {searchParams: FlightSearchParams; flights: Flight[]} | undefined;
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