import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Locale} from '../types';
import {getLocales} from '../services/api';
import {logError} from '../utils/ReactotronLogger';

interface LocaleContextType {
	currentLocale: Locale | null;
	availableLocales: Locale[];
	setLocale: (locale: Locale) => Promise<void>;
	loading: boolean;
	error: string | null;
	refreshLocales: () => Promise<void>;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const STORAGE_KEY = '@GoogleFlightsApp:selectedLocale';

// Default locale
const DEFAULT_LOCALE: Locale = {
	id: 'en-US',
	text: 'English (US)'
};

interface LocaleProviderProps {
	children: ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({children}) => {
	const [currentLocale, setCurrentLocale] = useState<Locale | null>(DEFAULT_LOCALE);
	const [availableLocales, setAvailableLocales] = useState<Locale[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Load saved locale from storage
	const loadSavedLocale = async () => {
		try {
			const savedLocale = await AsyncStorage.getItem(STORAGE_KEY);
			if (savedLocale) {
				const locale: Locale = JSON.parse(savedLocale);
				setCurrentLocale(locale);
			}
		} catch (err) {
			logError('Failed to load saved locale:', err);
			// Use default locale if loading fails
			setCurrentLocale(DEFAULT_LOCALE);
		}
	};

	// Save locale to storage
	const saveLocale = async (locale: Locale) => {
		try {
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(locale));
		} catch (err) {
			logError('Failed to save locale:', err);
		}
	};

	// Fetch available locales from API
	const fetchLocales = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await getLocales();

			if (response.success && response.data.status) {
				setAvailableLocales(response.data.data);
			} else {
				throw new Error(response.error || 'Failed to fetch locales');
			}
		} catch (err: any) {
			const errorMessage = err.message || 'Failed to load available languages';
			setError(errorMessage);
			logError('Failed to fetch locales:', err);

			// Set default locales as fallback
			setAvailableLocales([
				DEFAULT_LOCALE,
				{id: 'es-ES', text: 'Spanish'},
				{id: 'fr-FR', text: 'French'},
				{id: 'de-DE', text: 'German'},
				{id: 'zh-CN', text: 'Chinese, Simplified'},
				{id: 'ja-JP', text: 'Japanese'},
			]);
		} finally {
			setLoading(false);
		}
	};

	// Set current locale
	const setLocale = async (locale: Locale) => {
		setCurrentLocale(locale);
		await saveLocale(locale);
	};

	// Refresh locales
	const refreshLocales = async () => {
		await fetchLocales();
	};

	// Initialize context
	useEffect(() => {
		const initializeLocale = async () => {
			await loadSavedLocale();
			await fetchLocales();
		};

		initializeLocale();
	}, []);

	const value: LocaleContextType = {
		currentLocale,
		availableLocales,
		setLocale,
		loading,
		error,
		refreshLocales,
	};

	return (
		<LocaleContext.Provider value={value}>
			{children}
		</LocaleContext.Provider>
	);
};

// Hook to use locale context
export const useLocale = (): LocaleContextType => {
	const context = useContext(LocaleContext);
	if (context === undefined) {
		throw new Error('useLocale must be used within a LocaleProvider');
	}
	return context;
};

export default LocaleContext; 