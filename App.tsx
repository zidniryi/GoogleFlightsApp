import React from 'react';
import {StatusBar} from 'expo-status-bar';
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import {AuthProvider} from './src/context/AuthContext';
import {LocaleProvider} from './src/context/LocaleContext';
import AppNavigator from './src/navigation/AppNavigator';

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

export default function App() {
	return (
		<PaperProvider theme={theme}>
			<LocaleProvider>
				<AuthProvider>
					<StatusBar style="auto" />
					<AppNavigator />
				</AuthProvider>
			</LocaleProvider>
		</PaperProvider>
	);
} 