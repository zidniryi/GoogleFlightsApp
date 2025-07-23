import React from 'react';
import {StyleSheet, View, Pressable, Image} from 'react-native';
import {Card, Chip, Divider} from 'react-native-paper';
import {CustomText} from './CustomText';
import {FlightItinerary, FlightLeg} from '../types';
import {format} from 'date-fns';

interface FlightCardProps {
	itinerary: FlightItinerary;
	onPress?: () => void;
	style?: any;
}

export const FlightCard: React.FC<FlightCardProps> = ({
	itinerary,
	onPress,
	style,
}) => {
	const formatTime = (isoString: string) => {
		try {
			return format(new Date(isoString), 'HH:mm');
		} catch {
			return isoString.substring(11, 16); // fallback
		}
	};

	const formatDuration = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}h ${mins.toString().padStart(2, '0')}m`;
	};

	const getStopText = (stopCount: number) => {
		if (stopCount === 0) return 'Direct';
		if (stopCount === 1) return '1 stop';
		return `${stopCount} stops`;
	};

	const getTagColor = (tag: string) => {
		switch (tag) {
			case 'cheapest':
				return '#4caf50';
			case 'fastest':
			case 'shortest':
				return '#2196f3';
			case 'best':
				return '#ff9800';
			default:
				return '#757575';
		}
	};

	const renderLeg = (leg: FlightLeg, index: number) => {
		const isReturn = index === 1;
		const mainCarrier = leg.carriers.marketing[0];

		return (
			<View key={leg.id} style={styles.legContainer}>
				{isReturn && (
					<>
						<Divider style={styles.legDivider} />
						<View style={styles.returnHeader}>
							<CustomText variant="labelMedium" color="primary" weight="bold">
								Return Flight
							</CustomText>
						</View>
					</>
				)}

				<View style={styles.legContent}>
					{/* Airline Logo and Info */}
					<View style={styles.airlineSection}>
						<View style={styles.airlineInfo}>
							{mainCarrier.logoUrl && (
								<Image
									source={{uri: mainCarrier.logoUrl}}
									style={styles.airlineLogo}
									resizeMode="contain"
								/>
							)}
							<View style={styles.airlineText}>
								<CustomText variant="bodySmall" weight="medium" numberOfLines={1}>
									{mainCarrier.name}
								</CustomText>
								<CustomText variant="bodySmall" color="secondary">
									{leg.segments.map(s => s.flightNumber).join(', ')}
								</CustomText>
							</View>
						</View>

						<View style={styles.stopInfo}>
							<CustomText variant="labelSmall" color={leg.stopCount === 0 ? 'primary' : 'secondary'}>
								{getStopText(leg.stopCount)}
							</CustomText>
						</View>
					</View>

					{/* Flight Route */}
					<View style={styles.routeSection}>
						{/* Departure */}
						<View style={styles.routeEndpoint}>
							<CustomText variant="titleLarge" weight="bold">
								{formatTime(leg.departure)}
							</CustomText>
							<CustomText variant="bodyMedium" weight="medium">
								{leg.origin.displayCode}
							</CustomText>
							<CustomText variant="bodySmall" color="secondary" numberOfLines={1}>
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
								{formatDuration(leg.durationInMinutes)}
							</CustomText>
							{leg.stopCount > 0 && (
								<View style={styles.stopIndicator}>
									<CustomText variant="bodySmall" color="secondary">
										{leg.stopCount} stop{leg.stopCount > 1 ? 's' : ''}
									</CustomText>
								</View>
							)}
						</View>

						{/* Arrival */}
						<View style={styles.routeEndpoint}>
							<CustomText variant="titleLarge" weight="bold">
								{formatTime(leg.arrival)}
							</CustomText>
							<CustomText variant="bodyMedium" weight="medium">
								{leg.destination.displayCode}
							</CustomText>
							<CustomText variant="bodySmall" color="secondary" numberOfLines={1}>
								{leg.destination.name}
							</CustomText>
							{leg.timeDeltaInDays > 0 && (
								<CustomText variant="bodySmall" color="error">
									+{leg.timeDeltaInDays} day{leg.timeDeltaInDays > 1 ? 's' : ''}
								</CustomText>
							)}
						</View>
					</View>
				</View>
			</View>
		);
	};

	return (
		<Card style={[styles.card, style]} mode="outlined">
			<Pressable onPress={onPress} android_ripple={{color: '#e3f2fd'}}>
				<Card.Content style={styles.content}>
					{/* Header with Price and Tags */}
					<View style={styles.header}>
						<View style={styles.priceSection}>
							<CustomText variant="headlineMedium" weight="bold" color="primary">
								{itinerary.price.formatted}
							</CustomText>
							<CustomText variant="bodySmall" color="secondary">
								per person
							</CustomText>
						</View>

						<View style={styles.tagsSection}>
							{itinerary.tags.slice(0, 2).map((tag) => (
								<Chip
									key={tag}
									mode="flat"
									compact
									style={[styles.tag, {backgroundColor: getTagColor(tag) + '20'}]}
									textStyle={[styles.tagText, {color: getTagColor(tag)}]}
								>
									{tag.replace('_', ' ')}
								</Chip>
							))}
						</View>
					</View>

					{/* Flight Legs */}
					<View style={styles.legsContainer}>
						{itinerary.legs.map((leg, index) => renderLeg(leg, index))}
					</View>

					{/* Footer with Additional Info */}
					<View style={styles.footer}>
						<View style={styles.footerInfo}>
							<CustomText variant="bodySmall" color="secondary">
								{itinerary.farePolicy.isCancellationAllowed ? 'Cancellable' : 'Non-cancellable'}
							</CustomText>
							<CustomText variant="bodySmall" color="secondary">
								{itinerary.farePolicy.isChangeAllowed ? 'Changeable' : 'Non-changeable'}
							</CustomText>
						</View>

						<View style={styles.actionSection}>
							<CustomText variant="bodySmall" color="primary" weight="medium">
								Tap for details & booking →
							</CustomText>
						</View>
					</View>
				</Card.Content>
			</Pressable>
		</Card>
	);
};

const styles = StyleSheet.create({
	card: {
		marginVertical: 8,
		elevation: 2,
	},
	content: {
		padding: 16,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 16,
	},
	priceSection: {
		alignItems: 'flex-start',
	},
	tagsSection: {
		flexDirection: 'row',
		gap: 4,
	},
	tag: {
		height: 24,
	},
	tagText: {
		fontSize: 10,
		fontWeight: 'bold',
	},
	legsContainer: {
		marginBottom: 12,
	},
	legContainer: {
		marginVertical: 4,
	},
	legDivider: {
		marginVertical: 12,
	},
	returnHeader: {
		marginBottom: 8,
	},
	legContent: {
		gap: 12,
	},
	airlineSection: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	airlineInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	airlineLogo: {
		width: 32,
		height: 32,
		marginRight: 12,
		borderRadius: 4,
	},
	airlineText: {
		flex: 1,
	},
	stopInfo: {
		alignItems: 'flex-end',
	},
	routeSection: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 16,
	},
	routeEndpoint: {
		flex: 1,
		alignItems: 'center',
	},
	flightPath: {
		flex: 2,
		alignItems: 'center',
		position: 'relative',
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
	},
	stopIndicator: {
		position: 'absolute',
		top: -4,
		backgroundColor: '#fff',
		paddingHorizontal: 4,
		borderWidth: 1,
		borderColor: '#e0e0e0',
		borderRadius: 8,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 8,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: '#f0f0f0',
	},
	footerInfo: {
		flexDirection: 'row',
		gap: 12,
	},
	actionSection: {
		alignItems: 'flex-end',
	},
});

export default FlightCard; 