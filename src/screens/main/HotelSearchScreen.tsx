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
} from 'react-native-paper';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {RouteProp} from '@react-navigation/native';
import {format, addDays, isSameDay, isAfter, isBefore} from 'date-fns';
import {Formik} from 'formik';
import * as Yup from 'yup';

import {
	CustomText,
	CustomInput,
	CustomButton,
	SafeAreaContainer,
	HotelDestinationInput,
} from '../../components';
import {MainTabParamList, HotelSearchFormData, HotelDestination} from '../../types';

type HotelSearchScreenNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Hotels'>;
type HotelSearchScreenRouteProp = RouteProp<MainTabParamList, 'Hotels'>;

interface Props {
	navigation: HotelSearchScreenNavigationProp;
	route: HotelSearchScreenRouteProp;
}

// Validation schema
const HotelSearchSchema = Yup.object().shape({
	destination: Yup.object().nullable().required('Please select a destination'),
	checkIn: Yup.date().nullable().required('Please select check-in date'),
	checkOut: Yup.date().nullable().required('Please select check-out date'),
	guests: Yup.object().shape({
		adults: Yup.number().min(1, 'At least 1 adult required').required(),
		children: Yup.number().min(0).required(),
		rooms: Yup.number().min(1, 'At least 1 room required').required(),
	}),
});

const HotelSearchScreen: React.FC<Props> = ({navigation, route}) => {
	const {preselectedDestination} = route.params || {};

	const [showCheckInPicker, setShowCheckInPicker] = useState(false);
	const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

	// Initial form values
	const initialValues: HotelSearchFormData = {
		destination: preselectedDestination || null,
		checkIn: null,
		checkOut: null,
		guests: {
			adults: 2,
			children: 0,
			rooms: 1,
		},
	};

	const handleDestinationSelect = useCallback((
		destination: HotelDestination,
		setFieldValue: (field: string, value: any) => void
	) => {
		setFieldValue('destination', destination);
	}, []);

	const handleDateSelect = useCallback((
		date: Date,
		field: 'checkIn' | 'checkOut',
		setFieldValue: (field: string, value: any) => void,
		values: HotelSearchFormData
	) => {
		setFieldValue(field, date);

		// Auto-adjust check-out date if needed
		if (field === 'checkIn' && values.checkOut) {
			if (isSameDay(date, values.checkOut) || isAfter(date, values.checkOut)) {
				// Set check-out to next day
				setFieldValue('checkOut', addDays(date, 1));
			}
		}

		// Hide date pickers
		setShowCheckInPicker(false);
		setShowCheckOutPicker(false);
	}, []);

	const adjustGuestCount = useCallback((
		field: 'adults' | 'children' | 'rooms',
		delta: number,
		currentValue: number,
		setFieldValue: (field: string, value: any) => void
	) => {
		const newValue = Math.max(field === 'adults' || field === 'rooms' ? 1 : 0, currentValue + delta);
		setFieldValue(`guests.${field}`, newValue);
	}, []);

	const formatDateDisplay = (date: Date | null) => {
		if (!date) return 'Select date';
		return format(date, 'MMM dd, yyyy');
	};

	const getMinCheckOutDate = (checkInDate: Date | null) => {
		return checkInDate ? addDays(checkInDate, 1) : addDays(new Date(), 1);
	};

	const handleSearch = useCallback((values: HotelSearchFormData) => {
		// TODO: Implement hotel search results navigation
		Alert.alert(
			'Hotel Search',
			`Searching hotels in ${values.destination?.entityName}\n` +
			`Check-in: ${values.checkIn ? formatDateDisplay(values.checkIn) : 'Not selected'}\n` +
			`Check-out: ${values.checkOut ? formatDateDisplay(values.checkOut) : 'Not selected'}\n` +
			`Guests: ${values.guests.adults} adults, ${values.guests.children} children\n` +
			`Rooms: ${values.guests.rooms}`,
			[{text: 'OK'}]
		);
	}, []);

	const renderGuestSelector = (
		title: string,
		subtitle: string,
		field: 'adults' | 'children' | 'rooms',
		value: number,
		setFieldValue: (field: string, value: any) => void
	) => (
		<View style={styles.guestRow}>
			<View style={styles.guestInfo}>
				<CustomText variant="bodyLarge" weight="medium">
					{title}
				</CustomText>
				<CustomText variant="bodySmall" color="secondary">
					{subtitle}
				</CustomText>
			</View>

			<View style={styles.guestControls}>
				<IconButton
					icon="minus"
					size={20}
					mode="outlined"
					onPress={() => adjustGuestCount(field, -1, value, setFieldValue)}
					disabled={field === 'adults' || field === 'rooms' ? value <= 1 : value <= 0}
				/>
				<CustomText variant="titleMedium" weight="bold" style={styles.guestCount}>
					{value}
				</CustomText>
				<IconButton
					icon="plus"
					size={20}
					mode="outlined"
					onPress={() => adjustGuestCount(field, 1, value, setFieldValue)}
					disabled={value >= 10}
				/>
			</View>
		</View>
	);

	return (
		<SafeAreaContainer style={styles.container}>
			<Appbar.Header>
				<Appbar.Content title="Hotel Search" />
			</Appbar.Header>

			<Formik
				initialValues={initialValues}
				validationSchema={HotelSearchSchema}
				onSubmit={handleSearch}
			>
				{({values, errors, touched, setFieldValue, handleSubmit, isValid}) => (
					<>
						<ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
							{/* Destination Selection */}
							<Card style={styles.card} mode="outlined">
								<Card.Content>
									<CustomText variant="titleMedium" weight="bold" style={styles.sectionTitle}>
										Where are you going?
									</CustomText>

									<HotelDestinationInput
										value={values.destination}
										onDestinationSelect={(destination) =>
											handleDestinationSelect(destination, setFieldValue)
										}
										placeholder="Search destinations, cities, hotels..."
										error={touched.destination && errors.destination ? String(errors.destination) : undefined}
										style={styles.destinationInput}
									/>
								</Card.Content>
							</Card>

							{/* Dates Selection */}
							<Card style={styles.card} mode="outlined">
								<Card.Content>
									<CustomText variant="titleMedium" weight="bold" style={styles.sectionTitle}>
										When is your stay?
									</CustomText>

									<View style={styles.datesContainer}>
										{/* Check-in Date */}
										<View style={styles.dateField}>
											<CustomText variant="bodyMedium" weight="medium" style={styles.dateLabel}>
												Check-in
											</CustomText>
											<Button
												mode="outlined"
												onPress={() => setShowCheckInPicker(true)}
												style={styles.dateButton}
												contentStyle={styles.dateButtonContent}
												icon="calendar"
											>
												{formatDateDisplay(values.checkIn)}
											</Button>
											{touched.checkIn && errors.checkIn && (
												<CustomText variant="bodySmall" color="error" style={styles.dateError}>
													{String(errors.checkIn)}
												</CustomText>
											)}
										</View>

										{/* Check-out Date */}
										<View style={styles.dateField}>
											<CustomText variant="bodyMedium" weight="medium" style={styles.dateLabel}>
												Check-out
											</CustomText>
											<Button
												mode="outlined"
												onPress={() => setShowCheckOutPicker(true)}
												style={styles.dateButton}
												contentStyle={styles.dateButtonContent}
												icon="calendar"
											>
												{formatDateDisplay(values.checkOut)}
											</Button>
											{touched.checkOut && errors.checkOut && (
												<CustomText variant="bodySmall" color="error" style={styles.dateError}>
													{String(errors.checkOut)}
												</CustomText>
											)}
										</View>
									</View>

									{/* Stay Duration Info */}
									{values.checkIn && values.checkOut && (
										<View style={styles.durationInfo}>
											<Chip
												mode="outlined"
												icon="clock-outline"
												style={styles.durationChip}
											>
												{Math.ceil((values.checkOut.getTime() - values.checkIn.getTime()) / (1000 * 60 * 60 * 24))} nights
											</Chip>
										</View>
									)}
								</Card.Content>
							</Card>

							{/* Guests and Rooms */}
							<Card style={styles.card} mode="outlined">
								<Card.Content>
									<CustomText variant="titleMedium" weight="bold" style={styles.sectionTitle}>
										Guests and rooms
									</CustomText>

									{renderGuestSelector(
										'Adults',
										'Age 18+',
										'adults',
										values.guests.adults,
										setFieldValue
									)}

									<Divider style={styles.guestDivider} />

									{renderGuestSelector(
										'Children',
										'Age 0-17',
										'children',
										values.guests.children,
										setFieldValue
									)}

									<Divider style={styles.guestDivider} />

									{renderGuestSelector(
										'Rooms',
										'Number of rooms',
										'rooms',
										values.guests.rooms,
										setFieldValue
									)}

									{/* Guest Summary */}
									<View style={styles.guestSummary}>
										<CustomText variant="bodyMedium" color="secondary">
											{values.guests.adults + values.guests.children} guest{values.guests.adults + values.guests.children !== 1 ? 's' : ''} • {values.guests.rooms} room{values.guests.rooms !== 1 ? 's' : ''}
										</CustomText>
									</View>
								</Card.Content>
							</Card>

							{/* Search Summary */}
							{values.destination && (
								<Card style={styles.summaryCard} mode="outlined">
									<Card.Content>
										<CustomText variant="titleMedium" weight="bold" style={styles.sectionTitle}>
											Search Summary
										</CustomText>

										<View style={styles.summaryItem}>
											<CustomText variant="bodyMedium" weight="medium">
												Destination:
											</CustomText>
											<CustomText variant="bodyMedium" color="secondary">
												{values.destination.entityName}
											</CustomText>
										</View>

										{values.checkIn && values.checkOut && (
											<View style={styles.summaryItem}>
												<CustomText variant="bodyMedium" weight="medium">
													Dates:
												</CustomText>
												<CustomText variant="bodyMedium" color="secondary">
													{formatDateDisplay(values.checkIn)} - {formatDateDisplay(values.checkOut)}
												</CustomText>
											</View>
										)}

										<View style={styles.summaryItem}>
											<CustomText variant="bodyMedium" weight="medium">
												Guests:
											</CustomText>
											<CustomText variant="bodyMedium" color="secondary">
												{values.guests.adults + values.guests.children} guest{values.guests.adults + values.guests.children !== 1 ? 's' : ''} • {values.guests.rooms} room{values.guests.rooms !== 1 ? 's' : ''}
											</CustomText>
										</View>
									</Card.Content>
								</Card>
							)}
						</ScrollView>

						{/* Search Button */}
						<View style={styles.searchContainer}>
							<FAB
								icon="magnify"
								label="Search Hotels"
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

			{/* Date Pickers - would implement with a date picker library like react-native-date-picker */}
			{/* For now, showing the structure - would need actual date picker implementation */}
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
		backgroundColor: '#e3f2fd',
		borderColor: '#2196f3',
	},
	sectionTitle: {
		marginBottom: 16,
	},
	destinationInput: {
		marginBottom: 8,
	},
	datesContainer: {
		flexDirection: 'row',
		gap: 12,
	},
	dateField: {
		flex: 1,
	},
	dateLabel: {
		marginBottom: 8,
	},
	dateButton: {
		justifyContent: 'flex-start',
	},
	dateButtonContent: {
		justifyContent: 'flex-start',
		paddingVertical: 8,
	},
	dateError: {
		marginTop: 4,
	},
	durationInfo: {
		marginTop: 12,
		alignItems: 'center',
	},
	durationChip: {
		backgroundColor: '#e8f5e8',
	},
	guestRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 8,
	},
	guestInfo: {
		flex: 1,
	},
	guestControls: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	guestCount: {
		minWidth: 40,
		textAlign: 'center',
	},
	guestDivider: {
		marginVertical: 8,
	},
	guestSummary: {
		marginTop: 12,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: '#e0e0e0',
		alignItems: 'center',
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

export default HotelSearchScreen; 