import React from 'react';
import {StyleSheet, View, Pressable, Linking, Alert} from 'react-native';
import {Card, Chip, Divider} from 'react-native-paper';
import {CustomText} from './CustomText';
import {BookingAgent} from '../types';

interface BookingAgentCardProps {
	agent: BookingAgent;
	isRecommended?: boolean;
	style?: any;
}

export const BookingAgentCard: React.FC<BookingAgentCardProps> = ({
	agent,
	isRecommended = false,
	style,
}) => {
	const handleBooking = async () => {
		try {
			const supported = await Linking.canOpenURL(agent.url);
			if (supported) {
				await Linking.openURL(agent.url);
			} else {
				Alert.alert('Error', 'Unable to open booking link');
			}
		} catch (error) {
			Alert.alert('Error', 'Unable to open booking link');
		}
	};

	const getRatingColor = (rating: number) => {
		if (rating >= 4.0) return '#4caf50'; // Green
		if (rating >= 3.0) return '#ff9800'; // Orange
		return '#f44336'; // Red
	};

	const getRatingStars = (rating: number) => {
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 >= 0.5;
		let stars = '';

		for (let i = 0; i < fullStars; i++) {
			stars += '★';
		}
		if (hasHalfStar) {
			stars += '☆';
		}
		while (stars.length < 5) {
			stars += '☆';
		}

		return stars;
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(price);
	};

	const getQuoteAgeText = (quoteAge: number) => {
		if (quoteAge === 0) return 'Just updated';
		if (quoteAge === 1) return 'Updated 1 min ago';
		return `Updated ${quoteAge} mins ago`;
	};

	const getAgentTypeColor = (isCarrier: boolean) => {
		return isCarrier ? '#2196f3' : '#757575';
	};

	return (
		<Card
			style={[
				styles.card,
				isRecommended && styles.recommendedCard,
				style
			]}
			mode="outlined"
		>
			<Pressable onPress={handleBooking} android_ripple={{color: '#e3f2fd'}}>
				<Card.Content style={styles.content}>
					{/* Header with Agent Name and Type */}
					<View style={styles.header}>
						<View style={styles.agentInfo}>
							<CustomText variant="bodyLarge" weight="bold" numberOfLines={1}>
								{agent.name}
							</CustomText>

							<View style={styles.agentMeta}>
								<Chip
									mode="outlined"
									compact
									style={[
										styles.agentTypeChip,
										{borderColor: getAgentTypeColor(agent.isCarrier)}
									]}
									textStyle={[
										styles.agentTypeText,
										{color: getAgentTypeColor(agent.isCarrier)}
									]}
								>
									{agent.isCarrier ? 'Direct' : 'Travel Agent'}
								</Chip>

								{isRecommended && (
									<Chip
										mode="flat"
										compact
										style={styles.recommendedChip}
										textStyle={styles.recommendedText}
									>
										Recommended
									</Chip>
								)}
							</View>
						</View>

						{/* Price */}
						<View style={styles.priceSection}>
							<CustomText variant="headlineSmall" weight="bold" color="primary">
								{formatPrice(agent.price)}
							</CustomText>
						</View>
					</View>

					<Divider style={styles.divider} />

					{/* Rating and Details */}
					<View style={styles.details}>
						<View style={styles.ratingSection}>
							<View style={styles.ratingRow}>
								<CustomText
									variant="titleMedium"
									style={{
										...styles.stars,
										color: getRatingColor(agent.rating.value)
									}}
								>
									{getRatingStars(agent.rating.value)}
								</CustomText>
								<CustomText variant="bodyMedium" weight="medium">
									{agent.rating.value.toFixed(1)}
								</CustomText>
							</View>

							<CustomText variant="bodySmall" color="secondary">
								{agent.rating.count.toLocaleString()} reviews
							</CustomText>
						</View>

						<View style={styles.metaSection}>
							<View style={styles.metaRow}>
								<CustomText variant="bodySmall" color="secondary">
									{getQuoteAgeText(agent.quoteAge)}
								</CustomText>
							</View>

							<View style={styles.metaRow}>
								<CustomText variant="bodySmall" color="secondary">
									{agent.isDirectDBookUrl ? 'Direct booking' : 'Via partner'}
								</CustomText>
							</View>
						</View>
					</View>

					{/* Footer */}
					<View style={styles.footer}>
						<CustomText variant="bodySmall" color="primary" weight="medium">
							Tap to book with {agent.name} →
						</CustomText>
					</View>
				</Card.Content>
			</Pressable>
		</Card>
	);
};

const styles = StyleSheet.create({
	card: {
		marginVertical: 4,
		elevation: 2,
	},
	recommendedCard: {
		borderColor: '#4caf50',
		borderWidth: 2,
	},
	content: {
		padding: 16,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 12,
	},
	agentInfo: {
		flex: 1,
		marginRight: 16,
	},
	agentMeta: {
		flexDirection: 'row',
		gap: 8,
		marginTop: 4,
	},
	agentTypeChip: {
		height: 24,
	},
	agentTypeText: {
		fontSize: 10,
		fontWeight: 'bold',
	},
	recommendedChip: {
		height: 24,
		backgroundColor: '#4caf50',
	},
	recommendedText: {
		fontSize: 10,
		color: '#ffffff',
		fontWeight: 'bold',
	},
	priceSection: {
		alignItems: 'flex-end',
	},
	divider: {
		marginBottom: 12,
	},
	details: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 12,
	},
	ratingSection: {
		flex: 1,
	},
	ratingRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		marginBottom: 2,
	},
	stars: {
		fontSize: 16,
		letterSpacing: 1,
	},
	metaSection: {
		alignItems: 'flex-end',
	},
	metaRow: {
		marginBottom: 2,
	},
	footer: {
		alignItems: 'center',
		paddingTop: 8,
		borderTopWidth: 1,
		borderTopColor: '#f0f0f0',
	},
});

export default BookingAgentCard; 