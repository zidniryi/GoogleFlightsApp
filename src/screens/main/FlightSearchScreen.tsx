import React, {useState, useEffect} from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	Alert,
} from 'react-native';
import {
	TextInput,
	Button,
	Text,
	Card,
	Title,
	RadioButton,
	Chip,
	HelperText,
	FAB,
} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import {FlightSearchFormValues, FlightSearchParams, SearchAirportResult} from '../../types';
import {searchFlights, getMockFlights} from '../../services/api';
import {format} from 'date-fns';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainTabParamList, RootStackParamList} from '../../types';
import {QuickAirportSelector, AirportSearchInput} from '../../components';

type FlightSearchScreenNavigationProp = CompositeNavigationProp<
	BottomTabNavigationProp<MainTabParamList, 'Search'>,
	StackNavigationProp<RootStackParamList>
>;

type FlightSearchScreenRouteProp = RouteProp<MainTabParamList, 'Search'>;

interface Props {
	navigation: FlightSearchScreenNavigationProp;
	route: FlightSearchScreenRouteProp;
}

interface SelectedAirport {
	skyId: string;
	entityId: string;
	name: string;
	displayCode: string;
}

// Validation Schema
const searchValidationSchema = Yup.object().shape({
	origin: Yup.string().required('Departure airport is required'),
	destination: Yup.string().required('Arrival airport is required'),
	departDate: Yup.string().required('Departure date is required'),
	adults: Yup.number().min(1, 'At least 1 adult required').required('Number of adults is required'),
});

const FlightSearchScreen: React.FC<Props> = ({navigation, route}) => {
	const [loading, setLoading] = useState(false);
	const [showDepartDatePicker, setShowDepartDatePicker] = useState(false);
	const [showReturnDatePicker, setShowReturnDatePicker] = useState(false);

	// Selected airports with full details
	const [selectedOrigin, setSelectedOrigin] = useState<SelectedAirport | null>(null);
	const [selectedDestination, setSelectedDestination] = useState<SelectedAirport | null>(null);

	// Get preselected airports from navigation params
	const preselectedDeparture = route.params?.preselectedDeparture;
	const preselectedArrival = route.params?.preselectedArrival;

	const initialValues: FlightSearchFormValues = {
		origin: preselectedDeparture?.code || '',
		destination: preselectedArrival?.code || '',
		departDate: format(new Date(), 'yyyy-MM-dd'),
		returnDate: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'), // Tomorrow
		adults: 1,
		tripType: 'roundTrip',
	};

	const handleSearch = async (values: FlightSearchFormValues) => {
		// Validate that we have complete airport information
		if (!selectedOrigin || !selectedDestination) {
			Alert.alert(
				'Airport Information Required',
				'Please select airports using the search to get complete flight information.'
			);
			return;
		}

		setLoading(true);
		try {
			const searchParams: FlightSearchParams = {
				originSkyId: selectedOrigin.skyId,
				destinationSkyId: selectedDestination.skyId,
				originEntityId: selectedOrigin.entityId,
				destinationEntityId: selectedDestination.entityId,
				date: values.departDate,
				...(values.tripType === 'roundTrip' && {returnDate: values.returnDate}),
				adults: values.adults,
				cabinClass: 'economy',
				sortBy: 'best',
				currency: 'USD',
				market: 'en-US',
				countryCode: 'US',
			};

			const response = await searchFlights(searchParams);

			if (response.success) {
				navigation.navigate('Results', {
					searchParams,
					response: response.data,
				});
			} else {
				Alert.alert('Search Failed', response.error || 'Unable to search flights. Please try again.');
			}
		} catch (error: any) {
			Alert.alert('Search Error', error.message);
		} finally {
			setLoading(false);
		}
	};

	const swapAirports = (values: FlightSearchFormValues, setFieldValue: any) => {
		// Swap form values
		const tempOrigin = values.origin;
		setFieldValue('origin', values.destination);
		setFieldValue('destination', tempOrigin);

		// Swap selected airports
		const tempSelected = selectedOrigin;
		setSelectedOrigin(selectedDestination);
		setSelectedDestination(tempSelected);
	};

	// Handle airport selection from nearby airports
	const handleAirportSelect = (airport: any, field: 'origin' | 'destination', setFieldValue: any) => {
		const airportInfo: SelectedAirport = {
			skyId: airport.navigation.relevantFlightParams.skyId,
			entityId: airport.navigation.relevantFlightParams.entityId,
			name: airport.presentation.title,
			displayCode: airport.navigation.relevantFlightParams.skyId,
		};

		if (field === 'origin') {
			setSelectedOrigin(airportInfo);
		} else {
			setSelectedDestination(airportInfo);
		}

		setFieldValue(field, airportInfo.displayCode);
		Alert.alert(
			'Airport Selected',
			`${field === 'origin' ? 'Departure' : 'Arrival'} airport set to: ${airportInfo.name} (${airportInfo.displayCode})`
		);
	};

	// Handle airport selection from search
	const handleSearchAirportSelect = (airport: SearchAirportResult, field: 'origin' | 'destination', setFieldValue: any) => {
		const airportInfo: SelectedAirport = {
			skyId: airport.skyId,
			entityId: airport.entityId,
			name: airport.presentation.title,
			displayCode: airport.skyId,
		};

		if (field === 'origin') {
			setSelectedOrigin(airportInfo);
		} else {
			setSelectedDestination(airportInfo);
		}

		setFieldValue(field, airportInfo.displayCode);
	};

	// Handle navigation reset when screen comes into focus
	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			// Reset navigation params to avoid stale data
			if (route.params) {
				navigation.setParams({} as any);
			}
		});

		return unsubscribe;
	}, [navigation, route.params]);



	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<Title style={styles.title}>Search Flights</Title>
				<Text style={styles.subtitle}>Find the best deals for your next trip</Text>
			</View>

			{/* Quick Airport Selector */}
			<Card style={styles.card}>
				<Card.Content>
					<Text style={styles.sectionTitle}>Quick Airport Selection</Text>
					<Text style={styles.sectionSubtitle}>Choose from nearby airports</Text>

					<Formik
						initialValues={initialValues}
						validationSchema={searchValidationSchema}
						onSubmit={handleSearch}
						enableReinitialize={true}
					>
						{({setFieldValue, values}) => (
							<QuickAirportSelector
								compact={true}
								maxAirports={4}
								onAirportSelect={(airport) => {
									// Smart selection: if origin is empty, fill it; otherwise fill destination
									if (!values.origin) {
										handleAirportSelect(airport, 'origin', setFieldValue);
									} else if (!values.destination) {
										handleAirportSelect(airport, 'destination', setFieldValue);
									} else {
										// Both filled, ask user which to replace
										Alert.alert(
											'Select Field',
											'Which field would you like to update?',
											[
												{text: 'Departure', onPress: () => handleAirportSelect(airport, 'origin', setFieldValue)},
												{text: 'Arrival', onPress: () => handleAirportSelect(airport, 'destination', setFieldValue)},
												{text: 'Cancel', style: 'cancel'},
											]
										);
									}
								}}
							/>
						)}
					</Formik>
				</Card.Content>
			</Card>

			<Formik
				initialValues={initialValues}
				validationSchema={searchValidationSchema}
				onSubmit={handleSearch}
				enableReinitialize={true}
			>
				{({
					handleChange,
					handleBlur,
					handleSubmit,
					setFieldValue,
					values,
					errors,
					touched,
					isValid,
				}) => (
					<View style={styles.form}>
						{/* Trip Type Selection */}
						<Card style={styles.card}>
							<Card.Content>
								<Text style={styles.sectionTitle}>Trip Type</Text>
								<RadioButton.Group
									onValueChange={(value) => setFieldValue('tripType', value)}
									value={values.tripType}
								>
									<View style={styles.radioContainer}>
										<View style={styles.radioItem}>
											<RadioButton value="roundTrip" />
											<Text>Round Trip</Text>
										</View>
										<View style={styles.radioItem}>
											<RadioButton value="oneWay" />
											<Text>One Way</Text>
										</View>
									</View>
								</RadioButton.Group>
							</Card.Content>
						</Card>

						{/* Airport Selection with Search */}
						<Card style={styles.card}>
							<Card.Content>
								<Text style={styles.sectionTitle}>Airports</Text>

								<View style={styles.airportContainer}>
									{/* From Input */}
									<View style={styles.airportInputContainer}>
										<AirportSearchInput
											label="From"
											value={values.origin}
											onValueChange={(value) => {
												setFieldValue('origin', value);
												// Clear selected origin if user is typing manually
												if (!value.includes('(') || !value.includes(')')) {
													setSelectedOrigin(null);
												}
											}}
											onAirportSelect={(airport) => handleSearchAirportSelect(airport, 'origin', setFieldValue)}
											placeholder="Search departure airport..."
											error={!selectedOrigin && touched.origin && !!errors.origin}
											selectedAirport={selectedOrigin ? {
												skyId: selectedOrigin.skyId,
												entityId: selectedOrigin.entityId,
												presentation: {
													title: selectedOrigin.name,
													suggestionTitle: selectedOrigin.displayCode,
													subtitle: ''
												},
												navigation: {
													entityType: 'AIRPORT' as const,
													entityId: selectedOrigin.entityId,
													localizedName: selectedOrigin.name,
													relevantFlightParams: {
														skyId: selectedOrigin.skyId,
														entityId: selectedOrigin.entityId,
														flightPlaceType: 'AIRPORT',
														localizedName: selectedOrigin.name
													},
													relevantHotelParams: {
														entityId: selectedOrigin.entityId,
														entityType: 'AIRPORT',
														localizedName: selectedOrigin.name
													}
												}
											} : null}
											style={styles.modernInput}
										/>
										<HelperText type="error" visible={!selectedOrigin && touched.origin && !!errors.origin}>
											{errors.origin}
										</HelperText>
									</View>

									{/* Swap Button - Between Inputs */}
									<View style={styles.modernSwapContainer}>
										<FAB
											icon="swap-vertical"
											size="small"
											style={styles.modernSwapButton}
											onPress={() => swapAirports(values, setFieldValue)}
											color="white"
										/>
									</View>

									{/* To Input */}
									<View style={styles.airportInputContainer}>
										<AirportSearchInput
											label="To"
											value={values.destination}
											onValueChange={(value) => {
												setFieldValue('destination', value);
												// Clear selected destination if user is typing manually
												if (!value.includes('(') || !value.includes(')')) {
													setSelectedDestination(null);
												}
											}}
											onAirportSelect={(airport) => handleSearchAirportSelect(airport, 'destination', setFieldValue)}
											placeholder="Search arrival airport..."
											error={!selectedDestination && touched.destination && !!errors.destination}
											selectedAirport={selectedDestination ? {
												skyId: selectedDestination.skyId,
												entityId: selectedDestination.entityId,
												presentation: {
													title: selectedDestination.name,
													suggestionTitle: selectedDestination.displayCode,
													subtitle: ''
												},
												navigation: {
													entityType: 'AIRPORT' as const,
													entityId: selectedDestination.entityId,
													localizedName: selectedDestination.name,
													relevantFlightParams: {
														skyId: selectedDestination.skyId,
														entityId: selectedDestination.entityId,
														flightPlaceType: 'AIRPORT',
														localizedName: selectedDestination.name
													},
													relevantHotelParams: {
														entityId: selectedDestination.entityId,
														entityType: 'AIRPORT',
														localizedName: selectedDestination.name
													}
												}
											} : null}
											style={styles.modernInput}
										/>
										<HelperText type="error" visible={!selectedDestination && touched.destination && !!errors.destination}>
											{errors.destination}
										</HelperText>
									</View>
								</View>

								{/* Alternative: Nearby Airports Buttons */}
								<View style={styles.alternativeOptions}>
									<Text style={styles.alternativeTitle}>Or choose from nearby:</Text>
									<View style={styles.nearbyButtons}>
										<Button
											mode="outlined"
											onPress={() =>
												navigation.navigate('NearbyAirports', {
													selectionMode: 'departure',
													onAirportSelect: (airport) => handleAirportSelect(airport, 'origin', setFieldValue),
												})
											}
											style={styles.nearbyButton}
											icon="map-marker"
										>
											Nearby Departure
										</Button>
										<Button
											mode="outlined"
											onPress={() =>
												navigation.navigate('NearbyAirports', {
													selectionMode: 'arrival',
													onAirportSelect: (airport) => handleAirportSelect(airport, 'destination', setFieldValue),
												})
											}
											style={styles.nearbyButton}
											icon="map-marker"
										>
											Nearby Arrival
										</Button>
									</View>
								</View>
							</Card.Content>
						</Card>

						{/* Date Selection */}
						<Card style={styles.card}>
							<Card.Content>
								<Text style={styles.sectionTitle}>Dates</Text>
								<View style={styles.dateContainer}>
									<View style={styles.dateInputContainer}>
										<TextInput
											label="Departure"
											value={values.departDate}
											mode="outlined"
											style={styles.dateInput}
											editable={false}
											right={
												<TextInput.Icon
													icon="calendar"
													onPress={() => setShowDepartDatePicker(true)}
												/>
											}
										/>
									</View>

									{values.tripType === 'roundTrip' && (
										<View style={styles.dateInputContainer}>
											<TextInput
												label="Return"
												value={values.returnDate}
												mode="outlined"
												style={styles.dateInput}
												editable={false}
												right={
													<TextInput.Icon
														icon="calendar"
														onPress={() => setShowReturnDatePicker(true)}
													/>
												}
											/>
										</View>
									)}
								</View>

								{showDepartDatePicker && (
									<DateTimePicker
										value={new Date(values.departDate)}
										mode="date"
										display="default"
										minimumDate={new Date()}
										onChange={(event, selectedDate) => {
											setShowDepartDatePicker(false);
											if (selectedDate) {
												setFieldValue('departDate', format(selectedDate, 'yyyy-MM-dd'));
											}
										}}
									/>
								)}

								{showReturnDatePicker && (
									<DateTimePicker
										value={new Date(values.returnDate)}
										mode="date"
										display="default"
										minimumDate={new Date(values.departDate)}
										onChange={(event, selectedDate) => {
											setShowReturnDatePicker(false);
											if (selectedDate) {
												setFieldValue('returnDate', format(selectedDate, 'yyyy-MM-dd'));
											}
										}}
									/>
								)}
							</Card.Content>
						</Card>

						{/* Passengers */}
						<Card style={styles.card}>
							<Card.Content>
								<Text style={styles.sectionTitle}>Passengers</Text>
								<View style={styles.passengerContainer}>
									<Text style={styles.passengerLabel}>Adults</Text>
									<View style={styles.passengerControls}>
										<Button
											mode="outlined"
											compact
											onPress={() => setFieldValue('adults', Math.max(1, values.adults - 1))}
											disabled={values.adults <= 1}
										>
											-
										</Button>
										<Text style={styles.passengerCount}>{values.adults}</Text>
										<Button
											mode="outlined"
											compact
											onPress={() => setFieldValue('adults', Math.min(9, values.adults + 1))}
											disabled={values.adults >= 9}
										>
											+
										</Button>
									</View>
								</View>
								<HelperText type="error" visible={touched.adults && !!errors.adults}>
									{errors.adults}
								</HelperText>
							</Card.Content>
						</Card>

						{/* Search Button */}
						<Button
							mode="contained"
							onPress={handleSubmit as any}
							loading={loading}
							disabled={loading || !selectedOrigin || !selectedDestination}
							style={[
								styles.searchButton,
								(!selectedOrigin || !selectedDestination) && styles.searchButtonDisabled
							]}
							contentStyle={styles.searchButtonContent}
							icon="airplane"
						>
							{loading ? 'Searching...' : 'Search Flights'}
						</Button>

						{(!selectedOrigin || !selectedDestination) && (
							<HelperText type="info" visible style={styles.searchHelp}>
								✈️ Please select both departure and arrival airports to search flights
							</HelperText>
						)}
					</View>
				)}
			</Formik>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	header: {
		padding: 20,
		alignItems: 'center',
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
	},
	form: {
		padding: 16,
	},
	card: {
		marginBottom: 16,
		elevation: 2,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 16,
	},
	sectionSubtitle: {
		fontSize: 14,
		color: '#666',
		marginBottom: 12,
	},
	radioContainer: {
		flexDirection: 'row',
	},
	radioItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 20,
	},
	airportContainer: {
		marginBottom: 8,
	},
	airportInputContainer: {
		marginBottom: 12,
	},
	modernInput: {
		marginBottom: 4,
	},
	modernSwapContainer: {
		alignItems: 'center',
		marginVertical: 16,
		zIndex: 10,
	},
	modernSwapButton: {
		backgroundColor: '#2563eb',
		elevation: 4,
	},
	alternativeOptions: {
		marginTop: 16,
		paddingTop: 16,
		borderTopWidth: 1,
		borderTopColor: '#e9ecef',
	},
	alternativeTitle: {
		fontSize: 14,
		color: '#666',
		marginBottom: 8,
	},
	nearbyButtons: {
		flexDirection: 'row',
		gap: 8,
	},
	nearbyButton: {
		flex: 1,
	},
	dateContainer: {
		flexDirection: 'row',
		gap: 16,
	},
	dateInputContainer: {
		flex: 1,
	},
	dateInput: {
		flex: 1,
	},
	passengerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	passengerLabel: {
		fontSize: 16,
		fontWeight: '500',
	},
	passengerControls: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 16,
	},
	passengerCount: {
		fontSize: 18,
		fontWeight: 'bold',
		minWidth: 30,
		textAlign: 'center',
	},
	searchButton: {
		marginTop: 24,
		marginBottom: 8,
	},
	searchButtonDisabled: {
		backgroundColor: '#cccccc',
	},
	searchButtonContent: {
		paddingVertical: 12,
	},
	searchHelp: {
		textAlign: 'center',
		marginBottom: 32,
	},
});

export default FlightSearchScreen; 