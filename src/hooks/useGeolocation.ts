import {useState, useEffect} from 'react';
import Geolocation from '@react-native-community/geolocation';
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

export const useGeolocation = (): UseGeolocationReturn => {
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

		const options = {
			enableHighAccuracy: true,
			timeout: 15000,
			maximumAge: 300000, // 5 minutes
		};

		try {
			const position = await new Promise<any>((resolve, reject) => {
				Geolocation.getCurrentPosition(
					(position) => resolve(position),
					(error) => reject(error),
					options
				);
			});

			const coordinates: LocationCoordinates = {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
				accuracy: position.coords.accuracy,
			};

			setState({
				coordinates,
				loading: false,
				error: null,
				hasPermission: true,
			});

			log('Geolocation success:', coordinates);
		} catch (error: any) {
			let errorMessage = 'Failed to get location';
			let hasPermission = false;

			switch (error.code) {
				case 1: // PERMISSION_DENIED
					errorMessage = 'Location access denied. Please enable location services in your device settings.';
					hasPermission = false;
					break;
				case 2: // POSITION_UNAVAILABLE
					errorMessage = 'Location information is unavailable. Please check your GPS settings.';
					hasPermission = true;
					break;
				case 3: // TIMEOUT
					errorMessage = 'Location request timed out. Please try again.';
					hasPermission = true;
					break;
				default:
					errorMessage = 'An unknown error occurred while retrieving location.';
					hasPermission = false;
					break;
			}

			setState(prev => ({
				...prev,
				loading: false,
				error: errorMessage,
				hasPermission,
			}));

			logError('Geolocation error:', {error, errorMessage});
		}
	};

	// Check permission status on mount (Android/iOS only)
	useEffect(() => {
		const checkPermission = async () => {
			if (Platform.OS !== 'web') {
				try {
					// For React Native, we can't easily check permissions without requesting
					// We'll set it to null initially and update based on the first request
					setState(prev => ({
						...prev,
						hasPermission: null,
					}));
				} catch (err) {
					logError('Permission check error:', err);
				}
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

export default useGeolocation; 