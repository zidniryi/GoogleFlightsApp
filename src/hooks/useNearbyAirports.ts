import {useState, useEffect} from 'react';
import {useGeolocationWithExpo} from './useGeolocationWithExpo';
import {useLocale} from '../context/LocaleContext';
import {getNearbyAirports} from '../services/api';
import {NearbyAirportsResponse, NearbyAirport, CurrentAirport} from '../types';
import {logError} from '../utils/ReactotronLogger';

interface UseNearbyAirportsReturn {
	// Geolocation state
	coordinates: ReturnType<typeof useGeolocationWithExpo>['coordinates'];
	locationLoading: boolean;
	locationError: string | null;
	hasLocationPermission: boolean | null;
	getCurrentLocation: () => Promise<void>;

	// Airports state
	airportsData: NearbyAirportsResponse | null;
	airportsLoading: boolean;
	airportsError: string | null;
	fetchNearbyAirports: () => Promise<void>;

	// Combined state and helpers
	isReady: boolean;
	currentAirport: CurrentAirport | null;
	nearbyAirports: NearbyAirport[];
	allAirports: (NearbyAirport | CurrentAirport)[];
	refreshAll: () => Promise<void>;
	clearErrors: () => void;
}

export const useNearbyAirports = (autoFetch = false): UseNearbyAirportsReturn => {
	const {
		coordinates,
		loading: locationLoading,
		error: locationError,
		hasPermission: hasLocationPermission,
		getCurrentLocation,
		clearError: clearLocationError,
	} = useGeolocationWithExpo();

	const {currentLocale} = useLocale();

	const [airportsData, setAirportsData] = useState<NearbyAirportsResponse | null>(null);
	const [airportsLoading, setAirportsLoading] = useState(false);
	const [airportsError, setAirportsError] = useState<string | null>(null);

	const clearErrors = () => {
		clearLocationError();
		setAirportsError(null);
	};

	const fetchNearbyAirports = async (): Promise<void> => {
		if (!coordinates) {
			setAirportsError('Location coordinates are required');
			return;
		}

		setAirportsLoading(true);
		setAirportsError(null);

		try {
			const response = await getNearbyAirports(coordinates, currentLocale?.id);

			if (response.success && response.data.status) {
				setAirportsData(response.data);
				setAirportsError(null);
			} else {
				throw new Error(response.error || 'Failed to fetch nearby airports');
			}
		} catch (err: any) {
			const errorMessage = err.message || 'Failed to load nearby airports';
			setAirportsError(errorMessage);
			logError('Failed to fetch nearby airports:', err);
		} finally {
			setAirportsLoading(false);
		}
	};

	const refreshAll = async (): Promise<void> => {
		clearErrors();
		await getCurrentLocation();
		// fetchNearbyAirports will be called by useEffect when coordinates change
	};

	// Auto-fetch airports when coordinates are available and autoFetch is enabled
	useEffect(() => {
		if (coordinates && autoFetch && !airportsData) {
			fetchNearbyAirports();
		}
	}, [coordinates, autoFetch]);

	// Derived state
	const isReady = !!coordinates && !locationLoading && !airportsLoading;
	const currentAirport = airportsData?.data?.current || null;
	const nearbyAirports = airportsData?.data?.nearby || [];
	const allAirports: (NearbyAirport | CurrentAirport)[] = [
		...(currentAirport ? [currentAirport] : []),
		...nearbyAirports,
	];

	return {
		// Geolocation
		coordinates,
		locationLoading,
		locationError,
		hasLocationPermission,
		getCurrentLocation,

		// Airports
		airportsData,
		airportsLoading,
		airportsError,
		fetchNearbyAirports,

		// Combined
		isReady,
		currentAirport,
		nearbyAirports,
		allAirports,
		refreshAll,
		clearErrors,
	};
};

export default useNearbyAirports; 