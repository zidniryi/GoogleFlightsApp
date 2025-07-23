import {useState, useCallback, useRef} from 'react';
import {HotelDestination} from '../types';
import {searchHotelDestinations} from '../services/api';
import {useLocale} from '../context/LocaleContext';

export const useHotelDestinationSearch = () => {
	const [destinations, setDestinations] = useState<HotelDestination[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const {currentLocale} = useLocale();

	const debounceRef = useRef<NodeJS.Timeout | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	const searchDestinations = useCallback(async (query: string) => {
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
				setDestinations([]);
				return;
			}

			try {
				setLoading(true);
				setError(null);

				// Create new abort controller for this request
				abortControllerRef.current = new AbortController();

				const response = await searchHotelDestinations(
					query,
					currentLocale?.id
				);

				// Check if request was aborted
				if (abortControllerRef.current?.signal.aborted) {
					return;
				}

				if (response.success && response.data) {
					// Filter and sort destinations
					const filteredDestinations = response.data.data
						.filter((dest) => {
							// Filter by entity types that make sense for hotels
							return ['city', 'region', 'hotel', 'poi'].includes(dest.entityType);
						})
						.sort((a, b) => {
							// Sort by score (relevance) descending, then by name
							if (b.score !== a.score) {
								return b.score - a.score;
							}
							return a.entityName.localeCompare(b.entityName);
						});

					setDestinations(filteredDestinations);
				} else {
					setError(response.error || 'Failed to search destinations');
					setDestinations([]);
				}
			} catch (err: any) {
				if (err.name !== 'AbortError') {
					setError(err.message || 'Failed to search destinations');
					setDestinations([]);
				}
			} finally {
				setLoading(false);
			}
		}, 300); // 300ms debounce
	}, [currentLocale]);

	const clearResults = useCallback(() => {
		setDestinations([]);
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
		destinations,
		loading,
		error,
		searchDestinations,
		clearResults,
	};
}; 