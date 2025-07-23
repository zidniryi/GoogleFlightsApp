import Reactotron from 'reactotron-react-native';
import {Platform} from 'react-native';

// Declare global types at the top level
declare global {
	interface Console {
		tron: typeof Reactotron;
	}
}

// Only configure Reactotron in development mode
if (__DEV__) {
	const reactotron = Reactotron
		.configure({
			name: 'GoogleFlightsApp',
			host: Platform.OS === 'ios' ? 'localhost' : '10.0.2.2', // Default Android emulator host
		})
		.useReactNative({
			asyncStorage: false, // there are more options to the async storage.
			networking: {
				// optionally, you can turn it off with false.
				ignoreUrls: /symbolicate/,
			},
			editor: false, // there are more options to editor
			errors: {veto: (stackFrame) => false}, // or turn it off with false
			overlay: false, // just turning off overlay
		})
		.connect();

	// Clear Reactotron on every time we load the app in development
	reactotron.clear!();

	// Make Reactotron available globally for debugging
	console.tron = reactotron;
}

export default Reactotron; 