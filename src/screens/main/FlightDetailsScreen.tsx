import React, {useState, useEffect} from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	RefreshControl,
	Image,
	Dimensions,
} from 'react-native';
import {
	Text,
	Appbar,
	Card,
	Chip,
	Divider,
	FAB,
} from 'react-native-paper';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {BookingAgentCard, CustomText, LoadingSpinner, EmptyState} from '../../components';
import {RootStackParamList, FlightDetailsData, BookingAgent} from '../../types';
import {format} from 'date-fns';
import {getFlightDetails} from '../../services/api';
import {useLocale} from '../../context/LocaleContext';

type FlightDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FlightDetails'>;
type FlightDetailsScreenRouteProp = RouteProp<RootStackParamList, 'FlightDetails'>;

interface Props {
	navigation: FlightDetailsScreenNavigationProp;
	route: FlightDetailsScreenRouteProp;
}

const {width: screenWidth} = Dimensions.get('window');

const FlightDetailsScreen: React.FC<Props> = ({navigation, route}) => {
	const {legs, adults, itinerary: previewItinerary} = route.params;
	const {currentLocale} = useLocale();

	const [flightDetails, setFlightDetails] = useState<FlightDetailsData | null>(null);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Load flight details
	useEffect(() => {
		loadFlightDetails();
	}, []);

	const loadFlightDetails = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await getFlightDetails({
				legs,
				adults,
				currency: 'USD',
				cabinClass: 'economy',
			}, currentLocale?.id);

			if (response.success) {
				setFlightDetails(response.data.data);
			} else {
				setError(response.error || 'Failed to load flight details');
			}
		} catch (err: any) {
			setError(err.message || 'Failed to load flight details');
		} finally {
			setLoading(false);
		}
	};

	const handleRefresh = async () => {
		setRefreshing(true);
		await loadFlightDetails();
		setRefreshing(false);
	};

	const formatTime = (isoString: string) => {
		try {
			return format(new Date(isoString), 'HH:mm');
		} catch {
			return isoString.substring(11, 16);
		}
	};

	const formatDate = (isoString: string) => {
		try {
			return format(new Date(isoString), 'MMM dd, yyyy');
		} catch {
			return isoString.substring(0, 10);
		}
	};

	const formatDuration = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}h ${mins.toString().padStart(2, '0')}m`;
	};

	const getLowestPrice = () => {
		if (!flightDetails?.itinerary.pricingOptions?.length) return null;
		return Math.min(...flightDetails.itinerary.pricingOptions.map(option => option.totalPrice));
	};

	const getSortedBookingAgents = (): BookingAgent[] => {
		if (!flightDetails?.itinerary.pricingOptions?.length) return [];

		const allAgents = flightDetails.itinerary.pricingOptions
			.flatMap(option => option.agents)
			.sort((a, b) => a.price - b.price);

		return allAgents;
	};

	const renderFlightRoute = () => {
		if (!flightDetails?.itinerary.legs?.length) return null;

		return flightDetails.itinerary.legs.map((leg, legIndex) => (
			<Card key={leg.id} style={styles.routeCard} mode="outlined">
				<Card.Content>
					{/* Leg Header */}
					<View style={styles.legHeader}>
						<CustomText variant="titleMedium" weight="bold">
							{legIndex === 0 ? 'Outbound' : 'Return'} Flight
						</CustomText>
						<CustomText variant="bodyMedium" color="secondary">
							{formatDate(leg.departure)}
						</CustomText>
					</View>

					{/* Route Info */}
					<View style={styles.routeSection}>
						{/* Departure */}
						<View style={styles.routeEndpoint}>
							<CustomText variant="headlineSmall" weight="bold">
								{formatTime(leg.departure)}
							</CustomText>
							<CustomText variant="titleMedium" weight="bold">
								{leg.origin.displayCode}
							</CustomText>
							<CustomText variant="bodySmall" color="secondary" numberOfLines={2}>
								{leg.origin.name}
							</CustomText>
						</View>

						{/* Flight Path */}
						<View style={styles.flightPath}>
							<View style={styles.flightLine}>
								<View style={styles.departurePoint} />
								<View style={styles.pathLine} />
								<View style={styles.arrivalPoint} />
							</View>
							<CustomText variant="bodySmall" color="secondary" style={styles.durationText}>
								{formatDuration(leg.duration)}
							</CustomText>
							{leg.stopCount > 0 && (
								<CustomText variant="bodySmall" color="secondary">
									{leg.stopCount} stop{leg.stopCount > 1 ? 's' : ''}
								</CustomText>
							)}
						</View>

						{/* Arrival */}
						<View style={styles.routeEndpoint}>
							<CustomText variant="headlineSmall" weight="bold">
								{formatTime(leg.arrival)}
							</CustomText>
							<CustomText variant="titleMedium" weight="bold">
								{leg.destination.displayCode}
							</CustomText>
							<CustomText variant="bodySmall" color="secondary" numberOfLines={2}>
								{leg.destination.name}
							</CustomText>
							{leg.dayChange > 0 && (
								<CustomText variant="bodySmall" color="error">
									+{leg.dayChange} day{leg.dayChange > 1 ? 's' : ''}
								</CustomText>
							)}
						</View>
					</View>

					{/* Segments */}
					{leg.segments.map((segment, segmentIndex) => (
						<View key={segment.id} style={styles.segmentSection}>
							<Divider style={styles.segmentDivider} />
							<View style={styles.segmentHeader}>
								<View style={styles.carrierInfo}>
									{segment.marketingCarrier.logo && (
										<Image
											source={{uri: segment.marketingCarrier.logo}}
											style={styles.carrierLogo}
											resizeMode="contain"
										/>
									)}
									<View style={styles.carrierText}>
										<CustomText variant="bodyMedium" weight="bold">
											{segment.marketingCarrier.name}
										</CustomText>
										<CustomText variant="bodySmall" color="secondary">
											Flight {segment.flightNumber}
										</CustomText>
									</View>
								</View>

								<View style={styles.segmentMeta}>
									<CustomText variant="bodySmall" color="secondary">
										{formatDuration(segment.duration)}
									</CustomText>
								</View>
							</View>
						</View>
					))}
				</Card.Content>
			</Card>
		));
	};

	const renderPricingOptions = () => {
		const sortedAgents = getSortedBookingAgents();
		const lowestPrice = getLowestPrice();

		if (!sortedAgents.length) return null;

		return (
			<View style={styles.pricingSection}>
				<View style={styles.pricingSectionHeader}>
					<CustomText variant="titleLarge" weight="bold">
						Booking Options
					</CustomText>
					<CustomText variant="bodyMedium" color="secondary">
						{sortedAgents.length} options available
					</CustomText>
				</View>

				{sortedAgents.map((agent, index) => (
					<BookingAgentCard
						key={`${agent.id}-${index}`}
						agent={agent}
						isRecommended={agent.price === lowestPrice}
						style={styles.agentCard}
					/>
				))}
			</View>
		);
	};

	const renderDestinationImage = () => {
		if (!flightDetails?.itinerary.destinationImage) return null;

		return (
			<View style={styles.destinationImageContainer}>
				<Image
					source={{uri: flightDetails.itinerary.destinationImage}}
					style={styles.destinationImage}
					resizeMode="cover"
				/>
				<View style={styles.destinationOverlay}>
					<CustomText variant="headlineMedium" weight="bold" style={styles.destinationText}>
						{legs[0]?.destination || 'Destination'}
					</CustomText>
				</View>
			</View>
		);
	};

	const renderContent = () => {
		if (loading) {
			return (
				<View style={styles.centerContainer}>
					<LoadingSpinner size="large" message="Loading flight details..." />
				</View>
			);
		}

		if (error || !flightDetails) {
			return (
				<View style={styles.centerContainer}>
					<EmptyState
						title="Failed to load flight details"
						description={error || "Unable to retrieve flight information"}
						actionLabel="Retry"
						onAction={loadFlightDetails}
					/>
				</View>
			);
		}

		return (
			<ScrollView
				style={styles.scrollView}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
				}
			>
				{renderDestinationImage()}

				<View style={styles.contentContainer}>
					{/* Price Summary */}
					<Card style={styles.summaryCard} mode="outlined">
						<Card.Content>
							<View style={styles.summaryHeader}>
								<CustomText variant="titleMedium" weight="bold">
									Best Price
								</CustomText>
								<CustomText variant="headlineLarge" weight="bold" color="primary">
									${getLowestPrice()?.toFixed(0)}
								</CustomText>
							</View>
							<CustomText variant="bodyMedium" color="secondary">
								Per person • {adults} adult{adults > 1 ? 's' : ''}
							</CustomText>
						</Card.Content>
					</Card>

					{/* Flight Routes */}
					<View style={styles.routeSection}>
						<CustomText variant="titleLarge" weight="bold" style={styles.sectionTitle}>
							Flight Details
						</CustomText>
						{renderFlightRoute()}
					</View>

					{/* Pricing Options */}
					{renderPricingOptions()}

					{/* Safety Information */}
					{flightDetails.itinerary.operatingCarrierSafetyAttributes?.length > 0 && (
						<Card style={styles.safetyCard} mode="outlined">
							<Card.Content>
								<CustomText variant="titleMedium" weight="bold" style={styles.sectionTitle}>
									Safety Information
								</CustomText>
								{flightDetails.itinerary.operatingCarrierSafetyAttributes.map((safety, index) => (
									<View key={safety.carrierID} style={styles.safetyItem}>
										<CustomText variant="bodyMedium" weight="bold">
											{safety.carrierName}
										</CustomText>
										<CustomText variant="bodySmall" color="secondary">
											Safety protocols in place
										</CustomText>
									</View>
								))}
							</Card.Content>
						</Card>
					)}
				</View>
			</ScrollView>
		);
	};

	return (
		<View style={styles.container}>
			<Appbar.Header>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title="Flight Details" />
			</Appbar.Header>

			{renderContent()}

			{/* Book Now FAB */}
			{!loading && !error && flightDetails && (
				<FAB
					icon="airplane"
					label={`Book from $${getLowestPrice()?.toFixed(0)}`}
					style={styles.fab}
					onPress={() => {
						const bestAgent = getSortedBookingAgents()[0];
						if (bestAgent) {
							// Open the best booking option
							// This would normally trigger the BookingAgentCard's booking flow
						}
					}}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	centerContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	scrollView: {
		flex: 1,
	},
	destinationImageContainer: {
		position: 'relative',
		height: 200,
	},
	destinationImage: {
		width: screenWidth,
		height: 200,
	},
	destinationOverlay: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'rgba(0,0,0,0.4)',
		padding: 16,
	},
	destinationText: {
		color: '#ffffff',
	},
	contentContainer: {
		padding: 16,
	},
	summaryCard: {
		marginBottom: 16,
	},
	summaryHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 4,
	},
	sectionTitle: {
		marginBottom: 12,
	},
	routeSection: {
		marginBottom: 24,
	},
	routeCard: {
		marginBottom: 12,
	},
	legHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
	},
	routeEndpoint: {
		flex: 1,
		alignItems: 'center',
	},
	flightPath: {
		flex: 2,
		alignItems: 'center',
		paddingHorizontal: 16,
	},
	flightLine: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		height: 2,
		marginBottom: 4,
	},
	departurePoint: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#4caf50',
	},
	pathLine: {
		flex: 1,
		height: 2,
		backgroundColor: '#e0e0e0',
		marginHorizontal: 4,
	},
	arrivalPoint: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#f44336',
	},
	durationText: {
		marginTop: 2,
		textAlign: 'center',
	},
	segmentSection: {
		marginTop: 8,
	},
	segmentDivider: {
		marginBottom: 12,
	},
	segmentHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	carrierInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	carrierLogo: {
		width: 32,
		height: 32,
		marginRight: 12,
		borderRadius: 4,
	},
	carrierText: {
		flex: 1,
	},
	segmentMeta: {
		alignItems: 'flex-end',
	},
	pricingSection: {
		marginBottom: 24,
	},
	pricingSectionHeader: {
		marginBottom: 16,
	},
	agentCard: {
		marginBottom: 8,
	},
	safetyCard: {
		marginBottom: 24,
	},
	safetyItem: {
		marginBottom: 8,
	},
	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
	},
});

export default FlightDetailsScreen; 