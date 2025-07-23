import {useState, useEffect} from 'react';
import * as Location from 'expo-location';
import {Platform} from 'react-native';
import {LocationCoordinates} from '../types';
import {logError, log} from '../utils/ReactotronLogger';

interface GeolocationState {
	coordinates: LocationCoordinates | null;
	loading: boolean;
	error: string | null;
	hasPermission: boolean | null;
}

interface UseGeolocationReturn extends GeolocationState {
	getCurrentLocation: () => Promise<void>;
	clearError: () => void;
}

export const useGeolocationWithExpo = (): UseGeolocationReturn => {
	const [state, setState] = useState<GeolocationState>({
		coordinates: null,
		loading: false,
		error: null,
		hasPermission: null,
	});

	const clearError = () => {
		setState(prev => ({...prev, error: null}));
	};

	const getCurrentLocation = async (): Promise<void> => {
		setState(prev => ({...prev, loading: true, error: null}));

		try {
			// Request permission first
			const {status} = await Location.requestForegroundPermissionsAsync();

			if (status !== 'granted') {
				setState(prev => ({
					...prev,
					loading: false,
					error: 'Location access denied. Please enable location services in your device settings.',
					hasPermission: false,
				}));
				return;
			}

			// Get current position
			const location = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.High,
				timeInterval: 10000,
				distanceInterval: 1,
			});

			const coordinates: LocationCoordinates = {
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				accuracy: location.coords.accuracy || undefined,
			};

			setState({
				coordinates,
				loading: false,
				error: null,
				hasPermission: true,
			});

			log('Expo geolocation success:', coordinates);
		} catch (error: any) {
			let errorMessage = 'Failed to get location';
			let hasPermission = false;

			if (error.code === 'E_LOCATION_SERVICES_DISABLED') {
				errorMessage = 'Location services are disabled. Please enable location services in your device settings.';
				hasPermission = false;
			} else if (error.code === 'E_LOCATION_UNAVAILABLE') {
				errorMessage = 'Location information is unavailable. Please check your GPS settings.';
				hasPermission = true;
			} else if (error.code === 'E_LOCATION_TIMEOUT') {
				errorMessage = 'Location request timed out. Please try again.';
				hasPermission = true;
			} else {
				errorMessage = error.message || 'An unknown error occurred while retrieving location.';
				hasPermission = false;
			}

			setState(prev => ({
				...prev,
				loading: false,
				error: errorMessage,
				hasPermission,
			}));

			logError('Expo geolocation error:', {error, errorMessage});
		}
	};

	// Check permission status on mount
	useEffect(() => {
		const checkPermission = async () => {
			try {
				const {status} = await Location.getForegroundPermissionsAsync();
				setState(prev => ({
					...prev,
					hasPermission: status === 'granted',
				}));
			} catch (err) {
				logError('Permission check error:', err);
				setState(prev => ({
					...prev,
					hasPermission: false,
				}));
			}
		};

		checkPermission();
	}, []);

	return {
		...state,
		getCurrentLocation,
		clearError,
	};
};

export default useGeolocationWithExpo; 