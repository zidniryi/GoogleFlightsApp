import React, {useState} from 'react';
import {StyleSheet, View, ScrollView, Pressable, Alert} from 'react-native';
import {IconButton, Divider} from 'react-native-paper';
import {
	CustomButton,
	CustomText,
	CustomCard,
	LoadingSpinner,
	EmptyState,
	SafeAreaContainer,
} from './index';
import {useGeolocationWithExpo} from '../hooks/useGeolocationWithExpo';
import {useLocalizedApi} from '../hooks/useLocalizedApi';
import {getNearbyAirports} from '../services/api';
import {NearbyAirport, CurrentAirport, NearbyAirportsResponse} from '../types';
import {useLocale} from '../context/LocaleContext';

interface NearbyAirportsProps {
	onAirportSelect?: (airport: NearbyAirport | CurrentAirport) => void;
	showCurrentLocation?: boolean;
	maxAirports?: number;
}

export const NearbyAirports: React.FC<NearbyAirportsProps> = ({
	onAirportSelect,
	showCurrentLocation = true,
	maxAirports = 10,
}) => {
	const {coordinates, loading: locationLoading, error: locationError, getCurrentLocation, clearError} = useGeolocationWithExpo();
	const {currentLocale} = useLocale();
	const [airportsData, setAirportsData] = useState<NearbyAirportsResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleGetLocation = async () => {
		clearError();
		setError(null);
		await getCurrentLocation();
	};

	const fetchNearbyAirports = async () => {
		if (!coordinates) {
			setError('Location coordinates are required');
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const response = await getNearbyAirports(coordinates, currentLocale?.id);

			if (response.success && response.data.status) {
				setAirportsData(response.data);
			} else {
				throw new Error(response.error || 'Failed to fetch nearby airports');
			}
		} catch (err: any) {
			const errorMessage = err.message || 'Failed to load nearby airports';
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const handleAirportPress = (airport: NearbyAirport | CurrentAirport) => {
		onAirportSelect?.(airport);
		Alert.alert(
			'Airport Selected',
			`Selected: ${airport.presentation.title} (${airport.navigation.relevantFlightParams.skyId})`,
			[{text: 'OK'}]
		);
	};

	const getAirportIcon = (airportCode: string) => {
		const iconMap: Record<string, string> = {
			'BOM': '🛫', 'DEL': '✈️', 'BLR': '🛬', 'MAA': '🛫', 'HYD': '✈️',
			'PNQ': '🛬', 'AMD': '🛫', 'DXB': '✈️', 'SIN': '🛬', 'LHR': '🛫',
		};
		return iconMap[airportCode] || '🏢';
	};

	const getDistanceText = (isCurrentAirport: boolean) => {
		return isCurrentAirport ? 'Current Location' : 'Nearby';
	};

	const renderAirportCard = (airport: NearbyAirport | CurrentAirport, isCurrentAirport = false) => {
		const skyId = airport.navigation.relevantFlightParams.skyId;

		return (
			<Pressable
				key={`${isCurrentAirport ? 'current' : 'nearby'}-${airport.navigation.entityId}`}
				style={[styles.airportCard, isCurrentAirport && styles.currentAirportCard]}
				onPress={() => handleAirportPress(airport)}
				android_ripple={{color: '#e3f2fd'}}
			>
				<View style={styles.airportContent}>
					<View style={[styles.airportIcon, isCurrentAirport && styles.currentAirportIcon]}>
						<CustomText variant="headlineSmall" style={styles.iconText}>
							{getAirportIcon(skyId)}
						</CustomText>
					</View>

					<View style={styles.airportDetails}>
						<View style={styles.airportHeader}>
							<CustomText
								variant="titleMedium"
								weight="bold"
								numberOfLines={1}
								color={isCurrentAirport ? "primary" : "onSurface"}
							>
								{airport.presentation.title}
							</CustomText>
							<View style={[styles.codeChip, isCurrentAirport && styles.currentCodeChip]}>
								<CustomText
									variant="labelSmall"
									weight="bold"
									style={isCurrentAirport ? styles.currentCodeText : styles.codeText}
								>
									{skyId}
								</CustomText>
							</View>
						</View>

						<CustomText variant="bodyMedium" color="secondary" numberOfLines={1}>
							📍 {airport.presentation.subtitle}
						</CustomText>

						<View style={styles.airportFooter}>
							<CustomText variant="bodySmall" color="secondary">
								{getDistanceText(isCurrentAirport)}
							</CustomText>
							{isCurrentAirport && (
								<CustomText variant="bodySmall" color="primary" weight="medium">
									✓ Your Location
								</CustomText>
							)}
						</View>
					</View>

					<IconButton
						icon="chevron-right"
						size={20}
						iconColor={isCurrentAirport ? "#1976d2" : "#666"}
					/>
				</View>
			</Pressable>
		);
	};

	const renderContent = () => {
		if (locationError) {
			return (
				<EmptyState
					title="Location Access Needed"
					description={locationError}
					actionLabel="Enable Location"
					onAction={handleGetLocation}
				/>
			);
		}

		if (!coordinates) {
			return (
				<View style={styles.locationPrompt}>
					<View style={styles.promptIcon}>
						<CustomText variant="displayMedium">📍</CustomText>
					</View>
					<CustomText variant="headlineSmall" weight="bold" align="center" style={styles.promptTitle}>
						Find Nearby Airports
					</CustomText>
					<CustomText variant="bodyMedium" color="secondary" align="center" style={styles.promptDescription}>
						We'll use your current location to find airports near you for easier flight search.
					</CustomText>
					<CustomButton
						variant="primary"
						onPress={handleGetLocation}
						loading={locationLoading}
						style={styles.locationButton}
					>
						📍 Get My Location
					</CustomButton>
				</View>
			);
		}

		if (loading) {
			return (
				<View style={styles.loadingContainer}>
					<LoadingSpinner
						size="large"
						message="Finding nearby airports..."
					/>
					<View style={styles.loadingShimmer}>
						{[...Array(4)].map((_, index) => (
							<View key={index} style={styles.shimmerCard}>
								<View style={styles.shimmerIcon} />
								<View style={styles.shimmerContent}>
									<View style={styles.shimmerTitle} />
									<View style={styles.shimmerSubtitle} />
								</View>
							</View>
						))}
					</View>
				</View>
			);
		}

		if (error) {
			return (
				<EmptyState
					title="Failed to Load Airports"
					description={error}
					actionLabel="Try Again"
					onAction={fetchNearbyAirports}
				/>
			);
		}

		if (!airportsData?.data) {
			return (
				<View style={styles.fetchPrompt}>
					<CustomText variant="headlineSmall" weight="bold" align="center">
						Ready to Find Airports
					</CustomText>
					<CustomText variant="bodyMedium" color="secondary" align="center" style={styles.fetchDescription}>
						Location detected. Tap below to find nearby airports.
					</CustomText>
					<CustomButton
						variant="primary"
						onPress={fetchNearbyAirports}
						style={styles.fetchButton}
					>
						🔍 Find Nearby Airports
					</CustomButton>
				</View>
			);
		}

		const {current, nearby} = airportsData.data;
		const displayAirports = nearby.slice(0, maxAirports);

		return (
			<ScrollView showsVerticalScrollIndicator={false} style={styles.airportsList}>
				{showCurrentLocation && current && (
					<>
						<CustomText variant="titleMedium" weight="bold" style={styles.sectionTitle}>
							📍 Current Location
						</CustomText>
						{renderAirportCard(current, true)}

						{displayAirports.length > 0 && (
							<>
								<Divider style={styles.divider} />
								<CustomText variant="titleMedium" weight="bold" style={styles.sectionTitle}>
									✈️ Nearby Airports ({displayAirports.length})
								</CustomText>
							</>
						)}
					</>
				)}

				{displayAirports.map((airport) => renderAirportCard(airport))}

				{displayAirports.length === 0 && (
					<EmptyState
						title="No Nearby Airports"
						description="No airports found in your area. Try a different location."
						actionLabel="Refresh"
						onAction={fetchNearbyAirports}
					/>
				)}
			</ScrollView>
		);
	};

	return (
		<CustomCard variant="elevated" padding="medium" margin="small">
			<View style={styles.header}>
				<View style={styles.headerContent}>
					<CustomText variant="headlineSmall" weight="bold" color="primary">
						Nearby Airports
					</CustomText>
					<CustomText variant="bodySmall" color="secondary">
						{coordinates ? `📍 ${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}` : 'Location needed'}
					</CustomText>
				</View>
				{airportsData && (
					<IconButton
						icon="refresh"
						size={24}
						onPress={fetchNearbyAirports}
						disabled={loading}
					/>
				)}
			</View>

			<View style={styles.content}>
				{renderContent()}
			</View>
		</CustomCard>
	);
};

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 16,
	},
	headerContent: {
		flex: 1,
	},
	content: {
		minHeight: 200,
	},
	locationPrompt: {
		alignItems: 'center',
		paddingVertical: 20,
	},
	promptIcon: {
		marginBottom: 16,
	},
	promptTitle: {
		marginBottom: 8,
	},
	promptDescription: {
		marginBottom: 24,
		lineHeight: 20,
	},
	locationButton: {
		minWidth: 200,
	},
	fetchPrompt: {
		alignItems: 'center',
		paddingVertical: 20,
	},
	fetchDescription: {
		marginVertical: 16,
		lineHeight: 20,
	},
	fetchButton: {
		minWidth: 200,
	},
	loadingContainer: {
		paddingVertical: 20,
	},
	loadingShimmer: {
		marginTop: 20,
		gap: 12,
	},
	shimmerCard: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f8f9fa',
		borderRadius: 12,
		padding: 16,
	},
	shimmerIcon: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: '#e9ecef',
		marginRight: 16,
	},
	shimmerContent: {
		flex: 1,
	},
	shimmerTitle: {
		height: 16,
		backgroundColor: '#e9ecef',
		borderRadius: 4,
		marginBottom: 8,
		width: '70%',
	},
	shimmerSubtitle: {
		height: 12,
		backgroundColor: '#f1f3f4',
		borderRadius: 4,
		width: '50%',
	},
	airportsList: {
		flex: 1,
	},
	sectionTitle: {
		marginBottom: 12,
		paddingHorizontal: 4,
	},
	divider: {
		marginVertical: 16,
		backgroundColor: '#e9ecef',
	},
	airportCard: {
		backgroundColor: '#ffffff',
		borderRadius: 12,
		marginBottom: 8,
		borderWidth: 1,
		borderColor: '#e9ecef',
		elevation: 1,
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 1},
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	currentAirportCard: {
		borderColor: '#1976d2',
		borderWidth: 2,
		backgroundColor: '#f0f7ff',
	},
	airportContent: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
	},
	airportIcon: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: '#f8f9fa',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 16,
	},
	currentAirportIcon: {
		backgroundColor: '#e3f2fd',
	},
	iconText: {
		fontSize: 20,
	},
	airportDetails: {
		flex: 1,
	},
	airportHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 4,
	},
	codeChip: {
		backgroundColor: '#f0f0f0',
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 6,
	},
	currentCodeChip: {
		backgroundColor: '#1976d2',
	},
	codeText: {
		fontSize: 11,
		color: '#666',
	},
	currentCodeText: {
		color: '#ffffff',
	},
	airportFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 8,
	},
});

export default NearbyAirports; 