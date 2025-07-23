import React, {useState, useCallback} from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	Alert,
} from 'react-native';
import {
	Appbar,
	Card,
	Button,
	Divider,
	IconButton,
	Chip,
	FAB,
	Switch,
} from 'react-native-paper';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {RouteProp} from '@react-navigation/native';
import {format, addDays, isSameDay, isAfter, isBefore} from 'date-fns';
import {Formik} from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';

import {
	CustomText,
	CustomInput,
	CustomButton,
	SafeAreaContainer,
	CarLocationInput,
} from '../../components';
import {MainTabParamList, CarSearchFormData, CarLocation} from '../../types';

type CarSearchScreenNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Cars'>;
type CarSearchScreenRouteProp = RouteProp<MainTabParamList, 'Cars'>;

interface Props {
	navigation: CarSearchScreenNavigationProp;
	route: CarSearchScreenRouteProp;
}

// Validation schema
const CarSearchSchema = Yup.object().shape({
	pickupLocation: Yup.object().nullable().required('Please select a pickup location'),
	dropoffLocation: Yup.object().when('sameLocation', {
		is: false,
		then: (schema) => schema.nullable().required('Please select a dropoff location'),
		otherwise: (schema) => schema.nullable(),
	}),
	pickupDate: Yup.date().required('Please select pickup date'),
	dropoffDate: Yup.date().required('Please select dropoff date').min(
		Yup.ref('pickupDate'),
		'Dropoff date must be after pickup date'
	),
	pickupTime: Yup.string().required('Please select pickup time'),
	dropoffTime: Yup.string().required('Please select dropoff time'),
	driverAge: Yup.number().min(18, 'Driver must be at least 18 years old').max(99, 'Please enter a valid age').required('Please enter driver age'),
});

// Common pickup/dropoff times
const TIME_OPTIONS = [
	'06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
	'10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
	'14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
	'18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
];

const CarSearchScreen: React.FC<Props> = ({navigation, route}) => {
	const {preselectedPickupLocation, preselectedDropoffLocation} = route.params || {};

	const [showPickupTimePicker, setShowPickupTimePicker] = useState(false);
	const [showDropoffTimePicker, setShowDropoffTimePicker] = useState(false);
	const [showPickupDatePicker, setShowPickupDatePicker] = useState(false);
	const [showDropoffDatePicker, setShowDropoffDatePicker] = useState(false);

	// Initial form values
	const initialValues: CarSearchFormData = {
		pickupLocation: preselectedPickupLocation || null,
		dropoffLocation: preselectedDropoffLocation || null,
		pickupDate: new Date(),
		dropoffDate: addDays(new Date(), 1),
		pickupTime: '10:00',
		dropoffTime: '10:00',
		sameLocation: true,
		driverAge: 25,
	};

	const handlePickupLocationSelect = useCallback((
		location: CarLocation,
		setFieldValue: (field: string, value: any) => void,
		values: CarSearchFormData
	) => {
		setFieldValue('pickupLocation', location);
		// If same location is selected, also set dropoff location
		if (values.sameLocation) {
			setFieldValue('dropoffLocation', location);
		}
	}, []);

	const handleDropoffLocationSelect = useCallback((
		location: CarLocation,
		setFieldValue: (field: string, value: any) => void
	) => {
		setFieldValue('dropoffLocation', location);
	}, []);

	const handleDateSelect = useCallback((
		date: Date,
		field: 'pickupDate' | 'dropoffDate',
		setFieldValue: (field: string, value: any) => void,
		values: CarSearchFormData
	) => {
		setFieldValue(field, date);

		// Auto-adjust dropoff date if needed
		if (field === 'pickupDate' && values.dropoffDate) {
			if (isSameDay(date, values.dropoffDate) || isAfter(date, values.dropoffDate)) {
				// Set dropoff to next day
				setFieldValue('dropoffDate', addDays(date, 1));
			}
		}
	}, []);

	const toggleSameLocation = useCallback((
		value: boolean,
		setFieldValue: (field: string, value: any) => void,
		values: CarSearchFormData
	) => {
		setFieldValue('sameLocation', value);
		if (value && values.pickupLocation) {
			setFieldValue('dropoffLocation', values.pickupLocation);
		} else if (!value) {
			setFieldValue('dropoffLocation', null);
		}
	}, []);

	const adjustDriverAge = useCallback((
		delta: number,
		currentAge: number,
		setFieldValue: (field: string, value: any) => void
	) => {
		const newAge = Math.max(18, Math.min(99, currentAge + delta));
		setFieldValue('driverAge', newAge);
	}, []);

	const formatDateDisplay = (date: Date | null) => {
		if (!date) return 'Select date';
		return format(date, 'EEE, MMM dd, yyyy');
	};

	const getMinDropoffDate = (pickupDate: Date | null) => {
		return pickupDate ? pickupDate : new Date();
	};

	const getDurationInDays = (pickupDate: Date | null, dropoffDate: Date | null) => {
		if (!pickupDate || !dropoffDate) return 0;
		return Math.ceil((dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24));
	};

	const handleSearch = useCallback((values: CarSearchFormData) => {
		// TODO: Implement car search results navigation
		const duration = getDurationInDays(values.pickupDate, values.dropoffDate);
		Alert.alert(
			'Car Rental Search',
			`Searching cars at ${values.pickupLocation?.entityName}\n` +
			`Pickup: ${values.pickupDate ? formatDateDisplay(values.pickupDate) : 'Not selected'} at ${values.pickupTime}\n` +
			`Dropoff: ${values.dropoffDate ? formatDateDisplay(values.dropoffDate) : 'Not selected'} at ${values.dropoffTime}\n` +
			`${values.sameLocation ? 'Same location return' : `Dropoff at: ${values.dropoffLocation?.entityName}`}\n` +
			`Duration: ${duration} day${duration !== 1 ? 's' : ''}\n` +
			`Driver age: ${values.driverAge}`,
			[{text: 'OK'}]
		);
	}, []);

	const renderTimeSelector = (
		label: string,
		time: string,
		onTimeSelect: (time: string) => void,
		showPicker: boolean,
		setShowPicker: (show: boolean) => void
	) => (
		<View style={styles.timeField}>
			<CustomText variant="bodyMedium" weight="medium" style={styles.timeLabel}>
				{label}
			</CustomText>
			<Button
				mode="outlined"
				onPress={() => setShowPicker(!showPicker)}
				style={styles.timeButton}
				contentStyle={styles.timeButtonContent}
				icon="clock-outline"
			>
				{time}
			</Button>
			{showPicker && (
				<Card style={styles.timePickerCard} mode="outlined">
					<ScrollView style={styles.timePickerScroll} nestedScrollEnabled>
						{TIME_OPTIONS.map((timeOption) => (
							<Button
								key={timeOption}
								mode={time === timeOption ? 'contained' : 'text'}
								onPress={() => {
									onTimeSelect(timeOption);
									setShowPicker(false);
								}}
								style={styles.timeOption}
							>
								{timeOption}
							</Button>
						))}
					</ScrollView>
				</Card>
			)}
		</View>
	);

	return (
		<SafeAreaContainer style={styles.container}>
			<Appbar.Header>
				<Appbar.Content title="Car Rental Search" />
			</Appbar.Header>

			<Formik
				initialValues={initialValues}
				validationSchema={CarSearchSchema}
				onSubmit={handleSearch}
			>
				{({values, errors, touched, setFieldValue, handleSubmit, isValid}) => (
					<>
						<ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
							{/* Location Selection */}
							<Card style={styles.card} mode="outlined">
								<Card.Content>
									<CustomText variant="titleMedium" weight="bold" style={styles.sectionTitle}>
										Where do you want to rent a car?
									</CustomText>

									{/* Pickup Location */}
									<CarLocationInput
										value={values.pickupLocation}
										onLocationSelect={(location) =>
											handlePickupLocationSelect(location, setFieldValue, values)
										}
										placeholder="Search pickup location..."
										label="Pickup Location"
										error={touched.pickupLocation && errors.pickupLocation ? String(errors.pickupLocation) : undefined}
										style={styles.locationInput}
									/>

									{/* Same Location Switch */}
									<View style={styles.switchContainer}>
										<View style={styles.switchLabel}>
											<CustomText variant="bodyMedium" weight="medium">
												Return to same location
											</CustomText>
											<CustomText variant="bodySmall" color="secondary">
												Dropoff at the same place as pickup
											</CustomText>
										</View>
										<Switch
											value={values.sameLocation}
											onValueChange={(value) => toggleSameLocation(value, setFieldValue, values)}
										/>
									</View>

									{/* Dropoff Location (only if different location) */}
									{!values.sameLocation && (
										<CarLocationInput
											value={values.dropoffLocation}
											onLocationSelect={(location) =>
												handleDropoffLocationSelect(location, setFieldValue)
											}
											placeholder="Search dropoff location..."
											label="Dropoff Location"
											error={touched.dropoffLocation && errors.dropoffLocation ? String(errors.dropoffLocation) : undefined}
											style={styles.locationInput}
										/>
									)}
								</Card.Content>
							</Card>

							{/* Dates and Times Selection */}
							<Card style={styles.card} mode="outlined">
								<Card.Content>
									<CustomText variant="titleMedium" weight="bold" style={styles.sectionTitle}>
										When do you need the car?
									</CustomText>

									{/* Pickup Date & Time */}
									<View style={styles.dateTimeContainer}>
										<View style={styles.dateField}>
											<CustomText variant="bodyMedium" weight="medium" style={styles.dateLabel}>
												Pickup Date
											</CustomText>
											<Button
												mode="outlined"
												onPress={() => setShowPickupDatePicker(true)}
												style={styles.dateButton}
												contentStyle={styles.dateButtonContent}
												icon="calendar"
											>
												{formatDateDisplay(values.pickupDate)}
											</Button>
											{touched.pickupDate && errors.pickupDate && (
												<CustomText variant="bodySmall" color="error" style={styles.dateError}>
													{String(errors.pickupDate)}
												</CustomText>
											)}
										</View>

										{renderTimeSelector(
											'Pickup Time',
											values.pickupTime,
											(time) => setFieldValue('pickupTime', time),
											showPickupTimePicker,
											setShowPickupTimePicker
										)}
									</View>

									{/* Dropoff Date & Time */}
									<View style={styles.dateTimeContainer}>
										<View style={styles.dateField}>
											<CustomText variant="bodyMedium" weight="medium" style={styles.dateLabel}>
												Dropoff Date
											</CustomText>
											<Button
												mode="outlined"
												onPress={() => setShowDropoffDatePicker(true)}
												style={styles.dateButton}
												contentStyle={styles.dateButtonContent}
												icon="calendar"
											>
												{formatDateDisplay(values.dropoffDate)}
											</Button>
											{touched.dropoffDate && errors.dropoffDate && (
												<CustomText variant="bodySmall" color="error" style={styles.dateError}>
													{String(errors.dropoffDate)}
												</CustomText>
											)}
										</View>

										{renderTimeSelector(
											'Dropoff Time',
											values.dropoffTime,
											(time) => setFieldValue('dropoffTime', time),
											showDropoffTimePicker,
											setShowDropoffTimePicker
										)}
									</View>

									{/* Duration Info */}
									{values.pickupDate && values.dropoffDate && (
										<View style={styles.durationInfo}>
											<Chip
												mode="outlined"
												icon="clock-outline"
												style={styles.durationChip}
											>
												{getDurationInDays(values.pickupDate, values.dropoffDate)} day{getDurationInDays(values.pickupDate, values.dropoffDate) !== 1 ? 's' : ''}
											</Chip>
										</View>
									)}
								</Card.Content>
							</Card>

							{/* Driver Age */}
							<Card style={styles.card} mode="outlined">
								<Card.Content>
									<CustomText variant="titleMedium" weight="bold" style={styles.sectionTitle}>
										Driver Information
									</CustomText>

									<View style={styles.ageContainer}>
										<View style={styles.ageInfo}>
											<CustomText variant="bodyMedium" weight="medium">
												Driver Age
											</CustomText>
											<CustomText variant="bodySmall" color="secondary">
												Age affects car availability and pricing
											</CustomText>
										</View>

										<View style={styles.ageControls}>
											<IconButton
												icon="minus"
												size={20}
												mode="outlined"
												onPress={() => adjustDriverAge(-1, values.driverAge, setFieldValue)}
												disabled={values.driverAge <= 18}
											/>
											<CustomText variant="titleMedium" weight="bold" style={styles.ageCount}>
												{values.driverAge}
											</CustomText>
											<IconButton
												icon="plus"
												size={20}
												mode="outlined"
												onPress={() => adjustDriverAge(1, values.driverAge, setFieldValue)}
												disabled={values.driverAge >= 99}
											/>
										</View>
									</View>

									{touched.driverAge && errors.driverAge && (
										<CustomText variant="bodySmall" color="error" style={styles.ageError}>
											{String(errors.driverAge)}
										</CustomText>
									)}
								</Card.Content>
							</Card>

							{/* Date Pickers */}
							{showPickupDatePicker && (
								<DateTimePicker
									value={values.pickupDate || new Date()}
									mode="date"
									display="default"
									minimumDate={new Date()}
									onChange={(event, selectedDate) => {
										setShowPickupDatePicker(false);
										if (selectedDate) {
											setFieldValue('pickupDate', selectedDate);
											// Auto-adjust dropoff date if it's before or same as pickup date
											if (!values.dropoffDate || selectedDate >= values.dropoffDate) {
												setFieldValue('dropoffDate', addDays(selectedDate, 1));
											}
										}
									}}
								/>
							)}

							{showDropoffDatePicker && (
								<DateTimePicker
									value={values.dropoffDate || addDays(new Date(), 1)}
									mode="date"
									display="default"
									minimumDate={values.pickupDate || new Date()}
									onChange={(event, selectedDate) => {
										setShowDropoffDatePicker(false);
										if (selectedDate) {
											setFieldValue('dropoffDate', selectedDate);
										}
									}}
								/>
							)}

							{/* Search Summary */}
							{values.pickupLocation && (
								<Card style={styles.summaryCard} mode="outlined">
									<Card.Content>
										<CustomText variant="titleMedium" weight="bold" style={styles.sectionTitle}>
											Search Summary
										</CustomText>

										<View style={styles.summaryItem}>
											<CustomText variant="bodyMedium" weight="medium">
												Pickup:
											</CustomText>
											<CustomText variant="bodyMedium" color="secondary">
												{values.pickupLocation.entityName}
											</CustomText>
										</View>

										{!values.sameLocation && values.dropoffLocation && (
											<View style={styles.summaryItem}>
												<CustomText variant="bodyMedium" weight="medium">
													Dropoff:
												</CustomText>
												<CustomText variant="bodyMedium" color="secondary">
													{values.dropoffLocation.entityName}
												</CustomText>
											</View>
										)}

										{values.pickupDate && values.dropoffDate && (
											<View style={styles.summaryItem}>
												<CustomText variant="bodyMedium" weight="medium">
													Dates:
												</CustomText>
												<CustomText variant="bodyMedium" color="secondary">
													{formatDateDisplay(values.pickupDate)} - {formatDateDisplay(values.dropoffDate)}
												</CustomText>
											</View>
										)}

										<View style={styles.summaryItem}>
											<CustomText variant="bodyMedium" weight="medium">
												Driver Age:
											</CustomText>
											<CustomText variant="bodyMedium" color="secondary">
												{values.driverAge} years old
											</CustomText>
										</View>
									</Card.Content>
								</Card>
							)}
						</ScrollView>

						{/* Search Button */}
						<View style={styles.searchContainer}>
							<FAB
								icon="car-search"
								label="Search Cars"
								onPress={() => handleSubmit()}
								disabled={!isValid}
								style={[
									styles.searchFab,
									!isValid && styles.searchFabDisabled
								]}
							/>
						</View>
					</>
				)}
			</Formik>
		</SafeAreaContainer>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: 16,
		paddingBottom: 100, // Space for FAB
	},
	card: {
		marginBottom: 16,
	},
	summaryCard: {
		backgroundColor: '#e8f5e8',
		borderColor: '#4caf50',
	},
	sectionTitle: {
		marginBottom: 16,
	},
	locationInput: {
		marginBottom: 12,
		zIndex: 1000,
	},
	switchContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
		paddingVertical: 8,
	},
	switchLabel: {
		flex: 1,
		marginRight: 16,
	},
	dateTimeContainer: {
		flexDirection: 'row',
		gap: 12,
		marginBottom: 16,
	},
	dateField: {
		flex: 1,
	},
	timeField: {
		flex: 1,
		position: 'relative',
	},
	dateLabel: {
		marginBottom: 8,
	},
	timeLabel: {
		marginBottom: 8,
	},
	dateButton: {
		justifyContent: 'flex-start',
	},
	timeButton: {
		justifyContent: 'flex-start',
	},
	dateButtonContent: {
		justifyContent: 'flex-start',
		paddingVertical: 8,
	},
	timeButtonContent: {
		justifyContent: 'flex-start',
		paddingVertical: 8,
	},
	dateError: {
		marginTop: 4,
	},
	timePickerCard: {
		position: 'absolute',
		top: 70,
		left: 0,
		right: 0,
		maxHeight: 200,
		zIndex: 1000,
		elevation: 8,
	},
	timePickerScroll: {
		maxHeight: 180,
	},
	timeOption: {
		marginHorizontal: 8,
		marginVertical: 2,
	},
	durationInfo: {
		marginTop: 12,
		alignItems: 'center',
	},
	durationChip: {
		backgroundColor: '#e3f2fd',
	},
	ageContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 8,
	},
	ageInfo: {
		flex: 1,
	},
	ageControls: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	ageCount: {
		minWidth: 40,
		textAlign: 'center',
	},
	ageError: {
		marginTop: 8,
	},
	summaryItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	searchContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		padding: 16,
		backgroundColor: 'transparent',
	},
	searchFab: {
		alignSelf: 'center',
	},
	searchFabDisabled: {
		backgroundColor: '#ccc',
	},
});

export default CarSearchScreen; 