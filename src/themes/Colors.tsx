// Google Flights App Color Theme
export const Colors = {
	// Primary Brand Colors
	primary: {
		main: '#1976d2',
		light: '#42a5f5',
		dark: '#1565c0',
		50: '#e3f2fd',
		100: '#bbdefb',
		200: '#90caf9',
		300: '#64b5f6',
		400: '#42a5f5',
		500: '#1976d2',
		600: '#1565c0',
		700: '#0d47a1',
		800: '#0277bd',
		900: '#01579b',
	},

	// Secondary/Accent Colors
	secondary: {
		main: '#03dac4',
		light: '#4eedda',
		dark: '#00a693',
		50: '#e0f7fa',
		100: '#b2ebf2',
		200: '#80deea',
		300: '#4dd0e1',
		400: '#26c6da',
		500: '#03dac4',
		600: '#00acc1',
		700: '#0097a7',
		800: '#00838f',
		900: '#006064',
	},

	// Neutral Colors
	neutral: {
		white: '#ffffff',
		black: '#000000',
		50: '#fafafa',
		100: '#f5f5f5',
		200: '#eeeeee',
		300: '#e0e0e0',
		400: '#bdbdbd',
		500: '#9e9e9e',
		600: '#757575',
		700: '#616161',
		800: '#424242',
		900: '#212121',
	},

	// Text Colors
	text: {
		primary: '#212121',
		secondary: '#666666',
		disabled: '#9e9e9e',
		inverse: '#ffffff',
		placeholder: '#757575',
	},

	// Background Colors
	background: {
		default: '#fafafa',
		paper: '#ffffff',
		elevated: '#ffffff',
		input: '#f5f5f5',
		overlay: 'rgba(0, 0, 0, 0.5)',
	},

	// Border Colors
	border: {
		light: '#e0e0e0',
		main: '#bdbdbd',
		dark: '#9e9e9e',
		input: '#d1d5db',
		focus: '#1976d2',
	},

	// Semantic Colors
	semantic: {
		success: {
			main: '#4caf50',
			light: '#81c784',
			dark: '#388e3c',
			background: '#e8f5e8',
		},
		warning: {
			main: '#ff9800',
			light: '#ffb74d',
			dark: '#f57c00',
			background: '#fff3e0',
		},
		error: {
			main: '#f44336',
			light: '#e57373',
			dark: '#d32f2f',
			background: '#ffebee',
		},
		info: {
			main: '#2196f3',
			light: '#64b5f6',
			dark: '#1976d2',
			background: '#e3f2fd',
		},
	},

	// Flight-specific Colors
	flight: {
		airline: {
			united: '#003366',
			american: '#cc0000',
			delta: '#003366',
			southwest: '#304cb2',
			jetblue: '#0066cc',
		},
		price: {
			low: '#4caf50',
			medium: '#ff9800',
			high: '#f44336',
		},
		status: {
			onTime: '#4caf50',
			delayed: '#ff9800',
			cancelled: '#f44336',
			boarding: '#2196f3',
		},
	},

	// Gradients
	gradients: {
		primary: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
		secondary: 'linear-gradient(135deg, #03dac4 0%, #4eedda 100%)',
		sunset: 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)',
		ocean: 'linear-gradient(135deg, #2196f3 0%, #03dac4 100%)',
		success: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
		error: 'linear-gradient(135deg, #f44336 0%, #e57373 100%)',
	},

	// Shadow Colors
	shadow: {
		light: 'rgba(0, 0, 0, 0.1)',
		medium: 'rgba(0, 0, 0, 0.15)',
		dark: 'rgba(0, 0, 0, 0.25)',
		primary: 'rgba(25, 118, 210, 0.2)',
	},

	// Interactive States
	interactive: {
		hover: 'rgba(25, 118, 210, 0.04)',
		pressed: 'rgba(25, 118, 210, 0.12)',
		selected: 'rgba(25, 118, 210, 0.08)',
		disabled: 'rgba(0, 0, 0, 0.12)',
	},
};

// Color utility functions
export const ColorUtils = {
	// Add opacity to any color
	withOpacity: (color: string, opacity: number) => {
		if (color.startsWith('#')) {
			const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
			return `${color}${alpha}`;
		}
		if (color.startsWith('rgb(')) {
			return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
		}
		return color;
	},

	// Get contrasting text color
	getContrastText: (backgroundColor: string) => {
		// Simple logic - in a real app you'd calculate luminance
		const darkColors = [
			Colors.primary.main,
			Colors.primary.dark,
			Colors.semantic.error.main,
			Colors.neutral[800],
			Colors.neutral[900],
		];

		return darkColors.includes(backgroundColor)
			? Colors.text.inverse
			: Colors.text.primary;
	},

	// Get flight status color
	getFlightStatusColor: (status: 'onTime' | 'delayed' | 'cancelled' | 'boarding') => {
		return Colors.flight.status[status];
	},

	// Get price tier color
	getPriceTierColor: (tier: 'low' | 'medium' | 'high') => {
		return Colors.flight.price[tier];
	},
};

// Export default theme object for React Native Paper
export const PaperTheme = {
	colors: {
		primary: Colors.primary.main,
		primaryContainer: Colors.primary.light,
		secondary: Colors.secondary.main,
		secondaryContainer: Colors.secondary.light,
		tertiary: Colors.neutral[600],
		tertiaryContainer: Colors.neutral[100],
		surface: Colors.background.paper,
		surfaceVariant: Colors.background.input,
		surfaceDisabled: Colors.interactive.disabled,
		background: Colors.background.default,
		error: Colors.semantic.error.main,
		errorContainer: Colors.semantic.error.background,
		onPrimary: Colors.text.inverse,
		onPrimaryContainer: Colors.text.primary,
		onSecondary: Colors.text.inverse,
		onSecondaryContainer: Colors.text.primary,
		onTertiary: Colors.text.inverse,
		onTertiaryContainer: Colors.text.primary,
		onSurface: Colors.text.primary,
		onSurfaceVariant: Colors.text.secondary,
		onSurfaceDisabled: Colors.text.disabled,
		onError: Colors.text.inverse,
		onErrorContainer: Colors.text.primary,
		onBackground: Colors.text.primary,
		outline: Colors.border.main,
		outlineVariant: Colors.border.light,
		inverseSurface: Colors.neutral[800],
		inverseOnSurface: Colors.text.inverse,
		inversePrimary: Colors.primary.light,
		shadow: Colors.shadow.medium,
		scrim: Colors.background.overlay,
		backdrop: Colors.background.overlay,
	},
};

export default Colors; 