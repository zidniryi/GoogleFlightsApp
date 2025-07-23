import {useState, useCallback, useRef} from 'react';
import {searchAirports} from '../services/api';
import {SearchAirportResult, SearchAirportResponse} from '../types';
import {useLocale} from '../context/LocaleContext';
import {logError} from '../utils/ReactotronLogger';

interface UseAirportSearchReturn {
	// Search state
	results: SearchAirportResult[];
	loading: boolean;
	error: string | null;
	query: string;

	// Search actions
	searchAirports: (query: string) => Promise<void>;
	clearResults: () => void;
	clearError: () => void;
	setQuery: (query: string) => void;

	// Filtered results
	airports: SearchAirportResult[];
	cities: SearchAirportResult[];
	countries: SearchAirportResult[];
}

const SEARCH_DEBOUNCE_MS = 300;

export const useAirportSearch = (): UseAirportSearchReturn => {
	const [results, setResults] = useState<SearchAirportResult[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [query, setQuery] = useState('');
	const {currentLocale} = useLocale();

	// Debounce timer
	const debounceTimer = useRef<NodeJS.Timeout | null>(null);
	const abortController = useRef<AbortController | null>(null);

	const clearResults = () => {
		setResults([]);
		setError(null);
	};

	const clearError = () => {
		setError(null);
	};

	const performSearch = async (searchQuery: string): Promise<void> => {
		if (!searchQuery.trim() || searchQuery.length < 2) {
			clearResults();
			return;
		}

		// Cancel previous request
		if (abortController.current) {
			abortController.current.abort();
		}
		abortController.current = new AbortController();

		setLoading(true);
		setError(null);

		try {
			const response = await searchAirports(searchQuery.trim(), currentLocale?.id);

			if (response.success && response.data.status) {
				setResults(response.data.data || []);
			} else {
				throw new Error(response.error || 'Failed to search airports');
			}
		} catch (err: any) {
			if (err.name !== 'AbortError') {
				const errorMessage = err.message || 'Failed to search airports';
				setError(errorMessage);
				logError('Airport search error:', err);
			}
		} finally {
			setLoading(false);
		}
	};

	const debouncedSearch = useCallback((searchQuery: string) => {
		// Clear existing timer
		if (debounceTimer.current) {
			clearTimeout(debounceTimer.current);
		}

		// Set new timer
		debounceTimer.current = setTimeout(() => {
			performSearch(searchQuery);
		}, SEARCH_DEBOUNCE_MS);
	}, [currentLocale?.id]);

	const searchAirportsAction = async (searchQuery: string): Promise<void> => {
		setQuery(searchQuery);
		debouncedSearch(searchQuery);
	};

	// Filter results by type
	const airports = results.filter(item => item.navigation.entityType === 'AIRPORT');
	const cities = results.filter(item => item.navigation.entityType === 'CITY');
	const countries = results.filter(item => item.navigation.entityType === 'COUNTRY');

	return {
		// Search state
		results,
		loading,
		error,
		query,

		// Search actions
		searchAirports: searchAirportsAction,
		clearResults,
		clearError,
		setQuery,

		// Filtered results
		airports,
		cities,
		countries,
	};
};

export default useAirportSearch; 