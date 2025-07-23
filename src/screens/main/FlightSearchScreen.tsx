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
import {FlightSearchFormValues, FlightSearchParams} from '../../types';
import {searchFlights, getMockFlights} from '../../services/api';
import {format} from 'date-fns';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainTabParamList, RootStackParamList} from '../../types';
import {QuickAirportSelector} from '../../components';

type FlightSearchScreenNavigationProp = CompositeNavigationProp<
	BottomTabNavigationProp<MainTabParamList, 'Search'>,
	StackNavigationProp<RootStackParamList>
>;

type FlightSearchScreenRouteProp = RouteProp<MainTabParamList, 'Search'>;

interface Props {
	navigation: FlightSearchScreenNavigationProp;
	route: FlightSearchScreenRouteProp;
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
		setLoading(true);
		try {
			const searchParams: FlightSearchParams = {
				origin: values.origin,
				destination: values.destination,
				departDate: values.departDate,
				returnDate: values.tripType === 'roundTrip' ? values.returnDate : undefined,
				adults: values.adults,
				tripType: values.tripType,
			};

			// For demo purposes, use mock data
			// In production, use: const response = await searchFlights(searchParams);
			const response = getMockFlights();

			if (response.success) {
				navigation.navigate('Results', {
					searchParams,
					flights: response.data.flights,
				});
			} else {
				Alert.alert('Search Failed', 'Unable to search flights. Please try again.');
			}
		} catch (error: any) {
			Alert.alert('Search Error', error.message);
		} finally {
			setLoading(false);
		}
	};

	const swapAirports = (values: FlightSearchFormValues, setFieldValue: any) => {
		const temp = values.origin;
		setFieldValue('origin', values.destination);
		setFieldValue('destination', temp);
	};

	// Handle airport selection from nearby airports
	const handleAirportSelect = (airport: any, field: 'origin' | 'destination', setFieldValue: any) => {
		const airportCode = airport.navigation.relevantFlightParams.skyId;
		setFieldValue(field, airportCode);
		Alert.alert(
			'Airport Selected',
			`${field === 'origin' ? 'Departure' : 'Arrival'} airport set to: ${airport.presentation.title} (${airportCode})`
		);
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

						{/* Airport Selection */}
						<Card style={styles.card}>
							<Card.Content>
								<Text style={styles.sectionTitle}>Airports</Text>
								<View style={styles.airportContainer}>
									<View style={styles.airportInputContainer}>
										<TextInput
											label="From"
											value={values.origin}
											onChangeText={handleChange('origin')}
											onBlur={handleBlur('origin')}
											mode="outlined"
											style={styles.airportInput}
											error={touched.origin && !!errors.origin}
											placeholder="JFK, LAX, etc."
											right={
												<TextInput.Icon
													icon="map-marker"
													onPress={() =>
														navigation.navigate('NearbyAirports', {
															selectionMode: 'departure'
														})
													}
												/>
											}
										/>
										<HelperText type="error" visible={touched.origin && !!errors.origin}>
											{errors.origin}
										</HelperText>
									</View>

									<FAB
										icon="swap-horizontal"
										size="small"
										style={styles.swapButton}
										onPress={() => swapAirports(values, setFieldValue)}
									/>

									<View style={styles.airportInputContainer}>
										<TextInput
											label="To"
											value={values.destination}
											onChangeText={handleChange('destination')}
											onBlur={handleBlur('destination')}
											mode="outlined"
											style={styles.airportInput}
											error={touched.destination && !!errors.destination}
											placeholder="JFK, LAX, etc."
											right={
												<TextInput.Icon
													icon="map-marker"
													onPress={() =>
														navigation.navigate('NearbyAirports', {
															selectionMode: 'arrival'
														})
													}
												/>
											}
										/>
										<HelperText type="error" visible={touched.destination && !!errors.destination}>
											{errors.destination}
										</HelperText>
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
							disabled={!isValid || loading}
							style={styles.searchButton}
							contentStyle={styles.searchButtonContent}
							icon="airplane"
						>
							Search Flights
						</Button>
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
		flexDirection: 'row',
		alignItems: 'center',
	},
	airportInputContainer: {
		flex: 1,
	},
	airportInput: {
		marginHorizontal: 8,
	},
	swapButton: {
		alignSelf: 'center',
		marginHorizontal: 8,
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
		marginBottom: 32,
	},
	searchButtonContent: {
		paddingVertical: 12,
	},
});

export default FlightSearchScreen; 