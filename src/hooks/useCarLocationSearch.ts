import {useState, useCallback, useRef} from 'react';
import {CarLocation} from '../types';
import {searchCarLocations} from '../services/api';

export const useCarLocationSearch = () => {
	const [locations, setLocations] = useState<CarLocation[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const debounceRef = useRef<NodeJS.Timeout | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	const searchLocations = useCallback(async (query: string) => {
		// Clear previous debounce
		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		// Cancel previous request
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

		// Debounce the search
		debounceRef.current = setTimeout(async () => {
			if (query.trim().length < 2) {
				setLocations([]);
				return;
			}

			try {
				setLoading(true);
				setError(null);

				// Create new abort controller for this request
				abortControllerRef.current = new AbortController();

				const response = await searchCarLocations(query);

				// Check if request was aborted
				if (abortControllerRef.current?.signal.aborted) {
					return;
				}

				if (response.success && response.data) {
					// Sort locations by relevance (closest match first)
					const sortedLocations = response.data.data
						.sort((a, b) => {
							// Prioritize cities and airports
							if (a.class === 'City' && b.class !== 'City') return -1;
							if (b.class === 'City' && a.class !== 'City') return 1;
							if (a.class === 'Airport' && b.class !== 'Airport') return -1;
							if (b.class === 'Airport' && a.class !== 'Airport') return 1;

							// Then sort alphabetically
							return a.entityName.localeCompare(b.entityName);
						});

					setLocations(sortedLocations);
				} else {
					setError(response.error || 'Failed to search locations');
					setLocations([]);
				}
			} catch (err: any) {
				if (err.name !== 'AbortError') {
					setError(err.message || 'Failed to search locations');
					setLocations([]);
				}
			} finally {
				setLoading(false);
			}
		}, 300); // 300ms debounce
	}, []);

	const clearResults = useCallback(() => {
		setLocations([]);
		setError(null);
		setLoading(false);

		// Clear debounce
		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		// Cancel request
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
	}, []);

	return {
		locations,
		loading,
		error,
		searchLocations,
		clearResults,
	};
}; 