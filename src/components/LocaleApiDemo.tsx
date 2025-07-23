import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {CustomButton} from './CustomButton';
import {CustomText} from './CustomText';
import {CustomCard} from './CustomCard';
import {LoadingSpinner} from './LoadingSpinner';
import {LanguageInline} from './LanguageSelector';
import {useLocale} from '../context/LocaleContext';
import {useLocalizedApi} from '../hooks/useLocalizedApi';
import {getLocales} from '../services/api';

export const LocaleApiDemo: React.FC = () => {
	const {currentLocale} = useLocale();
	const {getAirportSuggestions} = useLocalizedApi();
	const [loading, setLoading] = useState(false);
	const [apiResponse, setApiResponse] = useState<any>(null);

	const testApiWithLocale = async () => {
		setLoading(true);
		setApiResponse(null);

		try {
			// Example 1: Get locales (doesn't use locale param but shows API structure)
			const localeResponse = await getLocales();

			// Example 2: Airport search with automatic locale injection
			const airportResponse = await getAirportSuggestions('New York');

			setApiResponse({
				success: localeResponse.success && airportResponse.success,
				localeUsed: currentLocale?.id || 'en-US',
				totalLanguages: localeResponse.data?.data?.length || 0,
				sampleLanguages: localeResponse.data?.data?.slice(0, 3) || [],
				airportResults: airportResponse.success ? airportResponse.data?.slice?.(0, 2) || [] : [],
				timestamp: new Date().toISOString(),
			});
		} catch (error: any) {
			setApiResponse({
				success: false,
				error: error.message,
				localeUsed: currentLocale?.id || 'en-US',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<CustomCard variant="outlined" padding="medium" margin="small">
			<CustomText variant="titleMedium" weight="bold" style={styles.title}>
				API Integration Demo
			</CustomText>

			<CustomText variant="bodyMedium" style={styles.description}>
				This demonstrates how the selected language can be used in API calls.
			</CustomText>

			<View style={styles.currentLanguage}>
				<LanguageInline showLabel />
			</View>

			<CustomButton
				variant="primary"
				onPress={testApiWithLocale}
				loading={loading}
				style={styles.testButton}
			>
				Test API with Current Language
			</CustomButton>

			{loading && (
				<LoadingSpinner
					size="medium"
					message="Making API call..."
					style={styles.loader}
				/>
			)}

			{apiResponse && (
				<View style={styles.responseContainer}>
					<CustomText variant="titleSmall" weight="medium">
						API Response:
					</CustomText>

					<View style={styles.responseItem}>
						<CustomText variant="bodySmall" color="secondary">Status:</CustomText>
						<CustomText variant="bodyMedium" color={apiResponse.success ? "success" : "error"}>
							{apiResponse.success ? 'Success' : 'Failed'}
						</CustomText>
					</View>

					<View style={styles.responseItem}>
						<CustomText variant="bodySmall" color="secondary">Locale Used:</CustomText>
						<CustomText variant="bodyMedium">{apiResponse.localeUsed}</CustomText>
					</View>

					{apiResponse.success && (
						<>
							<View style={styles.responseItem}>
								<CustomText variant="bodySmall" color="secondary">Total Languages:</CustomText>
								<CustomText variant="bodyMedium">{apiResponse.totalLanguages}</CustomText>
							</View>

							<View style={styles.responseItem}>
								<CustomText variant="bodySmall" color="secondary">Sample Languages:</CustomText>
								<CustomText variant="bodyMedium">
									{apiResponse.sampleLanguages.map((lang: any) => lang.text).join(', ')}
								</CustomText>
							</View>

							<View style={styles.responseItem}>
								<CustomText variant="bodySmall" color="secondary">Airport Results:</CustomText>
								<CustomText variant="bodyMedium">
									{apiResponse.airportResults.length > 0
										? apiResponse.airportResults.map((airport: any) => airport.name || airport.PlaceName || 'Unknown').join(', ')
										: 'No results'
									}
								</CustomText>
							</View>
						</>
					)}

					{apiResponse.error && (
						<View style={styles.responseItem}>
							<CustomText variant="bodySmall" color="secondary">Error:</CustomText>
							<CustomText variant="bodyMedium" color="error">{apiResponse.error}</CustomText>
						</View>
					)}

					<View style={styles.responseItem}>
						<CustomText variant="bodySmall" color="secondary">Timestamp:</CustomText>
						<CustomText variant="bodySmall">{apiResponse.timestamp}</CustomText>
					</View>
				</View>
			)}

			<View style={styles.integration}>
				<CustomText variant="labelMedium" color="secondary">
					Integration Example:
				</CustomText>
				<CustomText variant="bodySmall" style={styles.codeExample}>
					{`// Using the hook:\nconst {searchFlights} = useLocalizedApi();\n\n// Automatically includes locale:\nawait searchFlights(searchParams);\n// → Sends locale: '${currentLocale?.id || 'en-US'}'`}
				</CustomText>
			</View>
		</CustomCard>
	);
};

const styles = StyleSheet.create({
	title: {
		marginBottom: 8,
	},
	description: {
		marginBottom: 16,
		lineHeight: 20,
	},
	currentLanguage: {
		marginBottom: 16,
		padding: 12,
		backgroundColor: '#f8f9fa',
		borderRadius: 8,
	},
	testButton: {
		marginBottom: 16,
	},
	loader: {
		marginBottom: 16,
	},
	responseContainer: {
		backgroundColor: '#f8f9fa',
		padding: 12,
		borderRadius: 8,
		marginBottom: 16,
		gap: 8,
	},
	responseItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		gap: 8,
	},
	integration: {
		backgroundColor: '#f0f0f0',
		padding: 12,
		borderRadius: 8,
		gap: 8,
	},
	codeExample: {
		fontFamily: 'monospace',
		backgroundColor: '#ffffff',
		padding: 8,
		borderRadius: 4,
		fontSize: 12,
		lineHeight: 16,
	},
});

export default LocaleApiDemo; 