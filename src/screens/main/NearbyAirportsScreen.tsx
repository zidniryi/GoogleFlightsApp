import React from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {
	SafeAreaContainer,
	CustomText,
	Heading1,
	Heading2,
	BodyText,
	CustomCard,
	NearbyAirports,
	QuickAirportSelector,
} from '../../components';
import {NearbyAirport, CurrentAirport, RootStackParamList} from '../../types';

type NearbyAirportsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NearbyAirports'>;
type NearbyAirportsScreenRouteProp = RouteProp<RootStackParamList, 'NearbyAirports'>;

interface Props {
	navigation: NearbyAirportsScreenNavigationProp;
	route: NearbyAirportsScreenRouteProp;
}

export const NearbyAirportsScreen: React.FC<Props> = ({navigation, route}) => {
	const {selectionMode, onAirportSelect} = route.params || {};

	const handleAirportSelect = (airport: NearbyAirport | CurrentAirport) => {
		console.log('Airport selected:', airport);

		// If there's a custom callback from the calling screen, use it
		if (onAirportSelect) {
			onAirportSelect(airport);
			navigation.goBack();
			return;
		}

		// Default behavior: navigate to flight search with selected airport
		const airportCode = airport.navigation.relevantFlightParams.skyId;
		const airportName = airport.presentation.title;

		if (selectionMode === 'departure') {
			navigation.navigate('Main', {
				screen: 'Search',
				params: {
					preselectedDeparture: {
						code: airportCode,
						name: airportName,
					}
				}
			} as any);
		} else if (selectionMode === 'arrival') {
			navigation.navigate('Main', {
				screen: 'Search',
				params: {
					preselectedArrival: {
						code: airportCode,
						name: airportName,
					}
				}
			} as any);
		} else {
			// General selection - go to search with departure airport
			navigation.navigate('Main', {
				screen: 'Search',
				params: {
					preselectedDeparture: {
						code: airportCode,
						name: airportName,
					}
				}
			} as any);
		}
	};

	return (
		<SafeAreaContainer backgroundColor="#f5f5f5">
			<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

				{/* Header */}
				<CustomCard variant="elevated" padding="large" margin="medium">
					<View style={styles.headerContent}>
						<View style={styles.headerIcon}>
							<CustomText variant="displayMedium">📍</CustomText>
						</View>
						<View style={styles.headerText}>
							<Heading1 color="primary">
								{selectionMode === 'departure' ? 'Select Departure Airport' :
									selectionMode === 'arrival' ? 'Select Arrival Airport' :
										'Nearby Airports'}
							</Heading1>
							<BodyText style={styles.description}>
								{selectionMode ?
									`Choose ${selectionMode} airport from nearby locations` :
									'Discover airports near your current location for convenient flight booking and travel planning.'
								}
							</BodyText>
						</View>
					</View>
				</CustomCard>

				{/* Quick Airport Selector (Compact) */}
				<CustomCard variant="outlined" padding="medium" margin="small">
					<Heading2>Quick Selector</Heading2>
					<BodyText style={styles.componentDescription}>
						Compact horizontal scroll version for easy integration into other screens.
					</BodyText>
					<View style={styles.compactDemo}>
						<QuickAirportSelector
							onAirportSelect={handleAirportSelect}
							compact={true}
							maxAirports={5}
						/>
					</View>
				</CustomCard>

				{/* Nearby Airports Component (Full) */}
				<NearbyAirports
					onAirportSelect={handleAirportSelect}
					showCurrentLocation={true}
					maxAirports={8}
				/>

				{/* Features */}
				<CustomCard variant="outlined" padding="medium" margin="small">
					<Heading2>✨ Smart Features</Heading2>
					<View style={styles.featuresGrid}>
						<View style={styles.featureCard}>
							<View style={styles.featureIcon}>
								<CustomText variant="headlineSmall">🎯</CustomText>
							</View>
							<CustomText variant="titleSmall" weight="medium" style={styles.featureTitle}>
								Precise Location
							</CustomText>
							<BodyText style={styles.featureText}>
								Uses GPS for accurate airport detection
							</BodyText>
						</View>

						<View style={styles.featureCard}>
							<View style={styles.featureIcon}>
								<CustomText variant="headlineSmall">⚡</CustomText>
							</View>
							<CustomText variant="titleSmall" weight="medium" style={styles.featureTitle}>
								Instant Results
							</CustomText>
							<BodyText style={styles.featureText}>
								Real-time data from Sky Scrapper API
							</BodyText>
						</View>

						<View style={styles.featureCard}>
							<View style={styles.featureIcon}>
								<CustomText variant="headlineSmall">🗺️</CustomText>
							</View>
							<CustomText variant="titleSmall" weight="medium" style={styles.featureTitle}>
								Regional Coverage
							</CustomText>
							<BodyText style={styles.featureText}>
								Finds airports within reasonable distance
							</BodyText>
						</View>

						<View style={styles.featureCard}>
							<View style={styles.featureIcon}>
								<CustomText variant="headlineSmall">🔄</CustomText>
							</View>
							<CustomText variant="titleSmall" weight="medium" style={styles.featureTitle}>
								Auto-Refresh
							</CustomText>
							<BodyText style={styles.featureText}>
								Updates when location changes
							</BodyText>
						</View>
					</View>
				</CustomCard>

				{/* How It Works */}
				<CustomCard variant="filled" padding="medium" margin="small">
					<Heading2>How It Works</Heading2>
					<View style={styles.stepsContainer}>
						<View style={styles.step}>
							<View style={styles.stepNumber}>
								<CustomText variant="titleMedium" weight="bold" color="primary">1</CustomText>
							</View>
							<View style={styles.stepContent}>
								<CustomText variant="titleSmall" weight="medium">Enable Location</CustomText>
								<BodyText style={styles.stepText}>
									Grant location permission to detect your current position
								</BodyText>
							</View>
						</View>

						<View style={styles.step}>
							<View style={styles.stepNumber}>
								<CustomText variant="titleMedium" weight="bold" color="primary">2</CustomText>
							</View>
							<View style={styles.stepContent}>
								<CustomText variant="titleSmall" weight="medium">Find Airports</CustomText>
								<BodyText style={styles.stepText}>
									Tap "Find Nearby Airports" to search for airports in your area
								</BodyText>
							</View>
						</View>

						<View style={styles.step}>
							<View style={styles.stepNumber}>
								<CustomText variant="titleMedium" weight="bold" color="primary">3</CustomText>
							</View>
							<View style={styles.stepContent}>
								<CustomText variant="titleSmall" weight="medium">Select & Book</CustomText>
								<BodyText style={styles.stepText}>
									Choose an airport and start searching for flights instantly
								</BodyText>
							</View>
						</View>
					</View>
				</CustomCard>

				{/* Privacy Note */}
				<CustomCard variant="outlined" padding="medium" margin="small">
					<View style={styles.privacyHeader}>
						<CustomText variant="titleMedium" weight="bold">🔒 Privacy & Security</CustomText>
					</View>
					<BodyText style={styles.privacyText}>
						Your location data is only used to find nearby airports and is not stored or shared with third parties.
						Location access can be revoked at any time through your device settings.
					</BodyText>
				</CustomCard>

				<View style={styles.spacer} />
			</ScrollView>
		</SafeAreaContainer>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	headerContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	headerIcon: {
		marginRight: 16,
	},
	headerText: {
		flex: 1,
	},
	description: {
		marginTop: 8,
		lineHeight: 22,
	},
	featuresGrid: {
		marginTop: 16,
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 12,
	},
	featureCard: {
		flex: 1,
		minWidth: '45%',
		backgroundColor: '#ffffff',
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e9ecef',
		alignItems: 'center',
	},
	featureIcon: {
		marginBottom: 8,
	},
	featureTitle: {
		marginBottom: 6,
		textAlign: 'center',
	},
	featureText: {
		textAlign: 'center',
		fontSize: 13,
		lineHeight: 18,
	},
	stepsContainer: {
		marginTop: 16,
		gap: 16,
	},
	step: {
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	stepNumber: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: '#e3f2fd',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 16,
	},
	stepContent: {
		flex: 1,
	},
	stepText: {
		marginTop: 4,
		lineHeight: 18,
	},
	privacyHeader: {
		marginBottom: 12,
	},
	privacyText: {
		lineHeight: 20,
		fontSize: 14,
	},
	componentDescription: {
		marginTop: 8,
		marginBottom: 16,
		lineHeight: 20,
	},
	compactDemo: {
		marginTop: 12,
	},
	spacer: {
		height: 20,
	},
});

export default NearbyAirportsScreen; 