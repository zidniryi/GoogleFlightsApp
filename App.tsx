import React from 'react';
import {StatusBar} from 'expo-status-bar';
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {AuthProvider, useAuth} from './src/context/AuthContext';
import {LocaleProvider} from './src/context/LocaleContext';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import {LoadingSpinner} from './src/components';

// Import Reactotron configuration (must be imported before everything else in development)
if (__DEV__) {
	import('./src/config/ReactotronConfig');
}

// Custom theme for React Native Paper
const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: '#1976d2',
		accent: '#03dac4',
		background: '#f5f5f5',
		surface: '#ffffff',
		text: '#000000',
		placeholder: '#666666',
	},
};

// Navigation component that handles auth state
const Navigation = () => {
	const {user, loading} = useAuth();

	if (loading) {
		return <LoadingSpinner message="Loading..." />;
	}

	// If user is authenticated, show main app, otherwise show auth screens
	return (
		<NavigationContainer>
			{user ? <AppNavigator /> : <AuthNavigator />}
		</NavigationContainer>
	);
};

export default function App() {
	return (
		<PaperProvider theme={theme}>
			<LocaleProvider>
				<AuthProvider>
					<StatusBar style="auto" />
					<Navigation />
				</AuthProvider>
			</LocaleProvider>
		</PaperProvider>
	);
} 