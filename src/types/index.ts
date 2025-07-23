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

// Flight Search Types (Updated for Real API)
export interface FlightSearchParams {
	originSkyId: string;
	destinationSkyId: string;
	originEntityId: string;
	destinationEntityId: string;
	date: string; // YYYY-MM-DD format
	returnDate?: string; // For round trips
	cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
	adults: number;
	children?: number;
	infants?: number;
	sortBy?: 'best' | 'cheapest' | 'fastest';
	currency?: string;
	market?: string;
	countryCode?: string;
}

export interface FlightSearchFormValues {
	origin: string;
	destination: string;
	departDate: string;
	returnDate: string;
	adults: number;
	tripType: 'roundTrip' | 'oneWay';
}

// Flight Result Types
export interface FlightPrice {
	raw: number;
	formatted: string;
}

export interface FlightPlace {
	id: string;
	name: string;
	displayCode: string;
	city: string;
	isHighlighted: boolean;
}

export interface FlightCarrier {
	id: number;
	logoUrl: string;
	name: string;
	alternateId?: string;
	allianceId?: number;
}

export interface FlightCarriers {
	marketing: FlightCarrier[];
	operationType: string;
}

export interface FlightPlaceDetailed {
	flightPlaceId: string;
	displayCode: string;
	name: string;
	type: 'Airport' | 'City';
	parent?: {
		flightPlaceId: string;
		displayCode: string;
		name: string;
		type: 'City' | 'Country';
	};
}

export interface FlightSegment {
	id: string;
	origin: FlightPlaceDetailed;
	destination: FlightPlaceDetailed;
	departure: string; // ISO string
	arrival: string; // ISO string
	durationInMinutes: number;
	flightNumber: string;
	marketingCarrier: FlightCarrier;
	operatingCarrier: FlightCarrier;
}

export interface FlightLeg {
	id: string;
	origin: FlightPlace;
	destination: FlightPlace;
	durationInMinutes: number;
	stopCount: number;
	isSmallestStops: boolean;
	departure: string; // ISO string
	arrival: string; // ISO string
	timeDeltaInDays: number;
	carriers: FlightCarriers;
	segments: FlightSegment[];
}

export interface FarePolicy {
	isChangeAllowed: boolean;
	isPartiallyChangeable: boolean;
	isCancellationAllowed: boolean;
	isPartiallyRefundable: boolean;
}

export interface FlightItinerary {
	id: string;
	price: FlightPrice;
	legs: FlightLeg[];
	isSelfTransfer: boolean;
	isProtectedSelfTransfer: boolean;
	farePolicy: FarePolicy;
	eco?: {
		ecoContenderDelta: number;
	};
	tags: string[];
	isMashUp: boolean;
	hasFlexibleOptions: boolean;
	score: number;
}

export interface FlightSearchContext {
	status: 'incomplete' | 'complete';
	totalResults: number;
}

export interface FilterAirport {
	id: string;
	name: string;
}

export interface FilterCity {
	city: string;
	airports: FilterAirport[];
}

export interface StopPrice {
	isPresent: boolean;
	formattedPrice?: string;
}

export interface FilterStats {
	duration: {
		min: number;
		max: number;
	};
	airports: FilterCity[];
	carriers: FlightCarrier[];
	stopPrices: {
		direct: StopPrice;
		one: StopPrice;
		twoOrMore: StopPrice;
	};
}

export interface FlightSearchData {
	context: FlightSearchContext;
	itineraries: FlightItinerary[];
	messages: any[];
	filterStats: FilterStats;
}

export interface FlightSearchResponse {
	status: boolean;
	timestamp: number;
	sessionId: string;
	data: FlightSearchData;
}

// Legacy Flight Types (for backward compatibility)
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

// API Response Types
export interface ApiResponse<T> {
	success: boolean;
	data: T;
	error?: string;
}

// Navigation Types
export type RootStackParamList = {
	Main: undefined;
	NearbyAirports: {
		selectionMode?: 'departure' | 'arrival';
		onAirportSelect?: (airport: any) => void;
	};
	LanguageSelector: undefined;
	FlightDetails: {
		flightId: string;
		legs: Array<{
			destination: string;
			origin: string;
			date: string;
		}>;
		adults: number;
		itinerary?: FlightItinerary; // Optional for quick preview
	};
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
	};
	Results: {
		searchParams: FlightSearchParams;
		flights?: Flight[]; // Legacy support
		response?: FlightSearchResponse; // New format
	};
	Hotels: {
		preselectedDestination?: HotelDestination;
	};
	Cars: {
		preselectedPickupLocation?: CarLocation;
		preselectedDropoffLocation?: CarLocation;
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

// Flight Details Types (for getFlightDetails API)
export interface FlightDetailsLeg {
	id: string;
	origin: {
		id: string;
		name: string;
		displayCode: string;
		city: string;
	};
	destination: {
		id: string;
		name: string;
		displayCode: string;
		city: string;
	};
	segments: FlightDetailsSegment[];
	duration: number;
	stopCount: number;
	departure: string; // ISO string
	arrival: string; // ISO string
	dayChange: number;
}

export interface FlightDetailsSegment {
	id: string;
	origin: {
		id: string;
		name: string;
		displayCode: string;
		city: string;
	};
	destination: {
		id: string;
		name: string;
		displayCode: string;
		city: string;
	};
	duration: number;
	dayChange: number;
	flightNumber: string;
	departure: string; // ISO string
	arrival: string; // ISO string
	marketingCarrier: CarrierDetails;
	operatingCarrier: CarrierDetails;
}

export interface CarrierDetails {
	id: string;
	name: string;
	displayCode: string;
	displayCodeType: string;
	logo: string;
	altId: string;
}

export interface BookingAgent {
	id: string;
	name: string;
	isCarrier: boolean;
	bookingProposition: string;
	url: string;
	price: number;
	rating: {
		value: number;
		count: number;
	};
	updateStatus: string;
	segments: FlightDetailsSegment[];
	isDirectDBookUrl: boolean;
	quoteAge: number;
}

export interface PricingOption {
	agents: BookingAgent[];
	totalPrice: number;
}

export interface SafetyAttributes {
	carrierID: string;
	carrierName: string;
	faceMasksCompulsory: boolean | null;
	aircraftDeepCleanedDaily: boolean | null;
	attendantsWearPPE: boolean | null;
	cleaningPacksProvided: boolean | null;
	foodServiceChanges: boolean | null;
	safetyUrl: string | null;
}

export interface FlightDetailsItinerary {
	legs: FlightDetailsLeg[];
	pricingOptions: PricingOption[];
	isTransferRequired: boolean;
	destinationImage: string;
	operatingCarrierSafetyAttributes: SafetyAttributes[];
	flexibleTicketPolicies: any[];
}

export interface FlightDetailsData {
	itinerary: FlightDetailsItinerary;
	pollingCompleted: boolean;
}

export interface FlightDetailsResponse {
	status: boolean;
	timestamp: number;
	data: FlightDetailsData;
}

export interface FlightDetailsParams {
	legs: Array<{
		destination: string;
		origin: string;
		date: string;
	}>;
	adults: number;
	currency?: string;
	locale?: string;
	market?: string;
	cabinClass?: string;
	countryCode?: string;
}

// Hotel Types (for hotel search and booking)
export interface HotelDestination {
	hierarchy: string;
	location: string; // "latitude, longitude"
	score: number;
	entityName: string;
	entityId: string;
	entityType: 'city' | 'region' | 'airport' | 'hotel' | 'poi';
	suggestItem: string; // HTML formatted suggestion with {strong} tags
	class: string; // e.g., "City", "FirstLevelNationAdministrativeDivision", "Airport"
	pois: any[] | null;
}

export interface HotelDestinationSearchResponse {
	status: boolean;
	timestamp: number;
	data: HotelDestination[];
}

export interface HotelDestinationSearchParams {
	query: string;
	locale?: string;
}

export interface LocationCoordinates {
	latitude: number;
	longitude: number;
}

export interface ParsedLocation {
	latitude: number;
	longitude: number;
}

// Hotel Search Form Data
export interface HotelSearchFormData {
	destination: HotelDestination | null;
	checkIn: Date | null;
	checkOut: Date | null;
	guests: {
		adults: number;
		children: number;
		rooms: number;
	};
}

// Hotel Search Filters
export interface HotelSearchFilters {
	priceRange: {
		min: number;
		max: number;
	};
	starRating: number[];
	amenities: string[];
	guestRating: number;
	propertyType: string[];
	sortBy: 'price' | 'rating' | 'distance' | 'popularity';
}

// Car Rental Types
export interface CarLocation {
	hierarchy: string;
	location: string; // "latitude, longitude"
	entityName: string;
	highlight: {
		entity_name: string;
		hierarchy: string;
	};
	entityId: string;
	class: 'City' | 'Airport' | 'Region';
}

export interface CarLocationSearchResponse {
	status: boolean;
	timestamp: number;
	data: CarLocation[];
}

export interface CarLocationSearchParams {
	query: string;
}

export interface CarSearchFormData {
	pickupLocation: CarLocation | null;
	dropoffLocation: CarLocation | null;
	pickupDate: Date | null;
	dropoffDate: Date | null;
	pickupTime: string;
	dropoffTime: string;
	sameLocation: boolean;
	driverAge: number;
}

export interface CarSearchFilters {
	priceRange: {
		min: number;
		max: number;
	};
	carType: string[];
	transmission: 'automatic' | 'manual' | 'both';
	fuelPolicy: string[];
	supplier: string[];
	sortBy: 'price' | 'rating' | 'distance' | 'car_type';
} 