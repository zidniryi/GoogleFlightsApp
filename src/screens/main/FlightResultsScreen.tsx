import React from 'react';
import {
	View,
	StyleSheet,
	FlatList,
	TouchableOpacity,
} from 'react-native';
import {
	Text,
	Card,
	Title,
	Subtitle,
	Button,
	Chip,
	Divider,
} from 'react-native-paper';
import {Flight, FlightSearchParams} from '../../types';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from '../../types';
import {format} from 'date-fns';

type FlightResultsScreenNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Results'>;

interface Props {
	navigation: FlightResultsScreenNavigationProp;
	route: {
		params?: {
			searchParams: FlightSearchParams;
			flights: Flight[];
		};
	};
}

const FlightResultsScreen: React.FC<Props> = ({navigation, route}) => {
	const {searchParams, flights} = route.params || {searchParams: null, flights: []};

	if (!searchParams || flights.length === 0) {
		return (
			<View style={styles.emptyContainer}>
				<Title>No flights found</Title>
				<Text style={styles.emptyText}>
					Please go back and search for flights.
				</Text>
				<Button
					mode="contained"
					onPress={() => navigation.navigate('Search')}
					style={styles.backButton}
				>
					Search Flights
				</Button>
			</View>
		);
	}

	const formatTime = (dateString: string) => {
		return format(new Date(dateString), 'HH:mm');
	};

	const formatDate = (dateString: string) => {
		return format(new Date(dateString), 'MMM dd');
	};

	const renderFlightCard = ({item: flight}: {item: Flight}) => (
		<TouchableOpacity
			onPress={() => {
				// Navigate to flight details - for now we'll show an alert
				// In full implementation, this would navigate to a details screen
				navigation.navigate('Search'); // Placeholder navigation
			}}
		>
			<Card style={styles.flightCard}>
				<Card.Content>
					{/* Airline and Flight Number */}
					<View style={styles.flightHeader}>
						<Text style={styles.airline}>{flight.airline}</Text>
						<Text style={styles.flightNumber}>{flight.flightNumber}</Text>
					</View>

					{/* Route and Times */}
					<View style={styles.routeContainer}>
						<View style={styles.timeContainer}>
							<Text style={styles.time}>{formatTime(flight.departureTime)}</Text>
							<Text style={styles.airport}>{flight.departureAirport}</Text>
						</View>

						<View style={styles.durationContainer}>
							<Text style={styles.duration}>{flight.duration}</Text>
							<View style={styles.line} />
							<Chip
								mode="outlined"
								compact
								style={styles.stopsChip}
							>
								{flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
							</Chip>
						</View>

						<View style={styles.timeContainer}>
							<Text style={styles.time}>{formatTime(flight.arrivalTime)}</Text>
							<Text style={styles.airport}>{flight.arrivalAirport}</Text>
						</View>
					</View>

					<Divider style={styles.divider} />

					{/* Price and Book Button */}
					<View style={styles.priceContainer}>
						<View style={styles.priceInfo}>
							<Text style={styles.priceLabel}>Total Price</Text>
							<Text style={styles.price}>
								{flight.currency} {flight.price}
							</Text>
						</View>
						<Button
							mode="contained"
							compact
							onPress={() => {
								// Handle booking - placeholder for now
								alert('Booking functionality would be implemented here');
							}}
						>
							Select Flight
						</Button>
					</View>
				</Card.Content>
			</Card>
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			{/* Search Summary */}
			<Card style={styles.summaryCard}>
				<Card.Content>
					<View style={styles.summaryHeader}>
						<Title style={styles.summaryTitle}>
							{searchParams.origin} → {searchParams.destination}
						</Title>
						<Button
							mode="outlined"
							compact
							onPress={() => navigation.navigate('Search')}
							icon="pencil"
						>
							Edit
						</Button>
					</View>
					<View style={styles.summaryDetails}>
						<Text style={styles.summaryText}>
							{formatDate(searchParams.departDate)}
							{searchParams.returnDate && ` - ${formatDate(searchParams.returnDate)}`}
						</Text>
						<Text style={styles.summaryText}>
							{searchParams.adults} Adult{searchParams.adults > 1 ? 's' : ''}
						</Text>
						<Text style={styles.summaryText}>
							{searchParams.tripType === 'roundTrip' ? 'Round Trip' : 'One Way'}
						</Text>
					</View>
				</Card.Content>
			</Card>

			{/* Results Header */}
			<View style={styles.resultsHeader}>
				<Title style={styles.resultsTitle}>
					{flights.length} Flight{flights.length > 1 ? 's' : ''} Found
				</Title>
				<Text style={styles.resultsSubtitle}>
					Sorted by best value
				</Text>
			</View>

			{/* Flight List */}
			<FlatList
				data={flights}
				renderItem={renderFlightCard}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.listContainer}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	emptyText: {
		textAlign: 'center',
		fontSize: 16,
		color: '#666',
		marginBottom: 20,
	},
	backButton: {
		marginTop: 10,
	},
	summaryCard: {
		margin: 16,
		marginBottom: 8,
		elevation: 2,
	},
	summaryHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	summaryTitle: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	summaryDetails: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 16,
	},
	summaryText: {
		fontSize: 14,
		color: '#666',
	},
	resultsHeader: {
		paddingHorizontal: 16,
		paddingBottom: 8,
	},
	resultsTitle: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	resultsSubtitle: {
		fontSize: 14,
		color: '#666',
	},
	listContainer: {
		paddingHorizontal: 16,
		paddingBottom: 20,
	},
	flightCard: {
		marginBottom: 12,
		elevation: 2,
	},
	flightHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
	},
	airline: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	flightNumber: {
		fontSize: 14,
		color: '#666',
	},
	routeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
	},
	timeContainer: {
		flex: 1,
		alignItems: 'center',
	},
	time: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	airport: {
		fontSize: 12,
		color: '#666',
		marginTop: 2,
	},
	durationContainer: {
		flex: 2,
		alignItems: 'center',
		paddingHorizontal: 16,
	},
	duration: {
		fontSize: 12,
		color: '#666',
		marginBottom: 4,
	},
	line: {
		height: 1,
		backgroundColor: '#ddd',
		width: '100%',
		marginBottom: 4,
	},
	stopsChip: {
		backgroundColor: '#fff',
	},
	divider: {
		marginBottom: 16,
	},
	priceContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	priceInfo: {
		flex: 1,
	},
	priceLabel: {
		fontSize: 12,
		color: '#666',
	},
	price: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#1976d2',
	},
});

export default FlightResultsScreen; 