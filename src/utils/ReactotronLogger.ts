/* eslint-disable no-console */

/**
 * Reactotron Logger Utilities
 * Provides helper functions for logging to Reactotron in development mode
 */

/**
 * Log messages to Reactotron if available, otherwise fallback to console.log
 */
export const log = (message: string, data?: any) => {
	if (__DEV__ && console.tron) {
		console.tron.log(message, data);
	} else {
		console.log(message, data);
	}
};

/**
 * Log warning messages to Reactotron
 */
export const logWarn = (message: string, data?: any) => {
	if (__DEV__ && console.tron) {
		console.tron.warn(data ? `${message} ${JSON.stringify(data)}` : message);
	} else {
		console.warn(message, data);
	}
};

/**
 * Log error messages to Reactotron
 */
export const logError = (message: string, error?: any) => {
	if (__DEV__ && console.tron) {
		console.tron.error(message, error);
	} else {
		console.error(message, error);
	}
};

/**
 * Display data in Reactotron
 */
export const display = (config: {
	name: string;
	value?: any;
	preview?: string;
	transform?: any;
}) => {
	if (__DEV__ && console.tron) {
		console.tron.display(config);
	} else {
		console.log(`[${config.name}]`, config.value || config.preview);
	}
};

/**
 * Log API requests and responses
 */
export const logApiRequest = (method: string, url: string, params?: any) => {
	if (__DEV__ && console.tron) {
		console.tron.log(`🌐 API ${method.toUpperCase()}`, {
			url,
			params,
			timestamp: new Date().toISOString(),
		});
	}
};

export const logApiResponse = (method: string, url: string, response: any, success: boolean) => {
	const emoji = success ? '✅' : '❌';
	if (__DEV__ && console.tron) {
		console.tron.log(`${emoji} API ${method.toUpperCase()} Response`, {
			url,
			success,
			data: response,
			timestamp: new Date().toISOString(),
		});
	}
};

/**
 * Create a benchmark timer
 */
export const benchmark = (name: string) => {
	if (__DEV__ && console.tron) {
		return console.tron.benchmark(name);
	}
	// Fallback for non-Reactotron environments
	const start = Date.now();
	return {
		stop: () => {
			const duration = Date.now() - start;
			console.log(`⏱️ ${name}: ${duration}ms`);
			return duration;
		},
	};
};

export default {
	log,
	logWarn,
	logError,
	display,
	logApiRequest,
	logApiResponse,
	benchmark,
}; 