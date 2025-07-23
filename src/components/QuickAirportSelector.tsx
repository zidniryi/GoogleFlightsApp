import React from 'react';
import {StyleSheet, View, ScrollView, Pressable} from 'react-native';
import {IconButton} from 'react-native-paper';
import {CustomButton} from './CustomButton';
import {CustomText} from './CustomText';
import {LoadingSpinner} from './LoadingSpinner';
import {useNearbyAirports} from '../hooks/useNearbyAirports';
import {NearbyAirport, CurrentAirport} from '../types';

interface QuickAirportSelectorProps {
	onAirportSelect?: (airport: NearbyAirport | CurrentAirport) => void;
	compact?: boolean;
	maxAirports?: number;
}

export const QuickAirportSelector: React.FC<QuickAirportSelectorProps> = ({
	onAirportSelect,
	compact = false,
	maxAirports = 5,
}) => {
	const {
		coordinates,
		locationLoading,
		locationError,
		getCurrentLocation,
		airportsLoading,
		airportsError,
		fetchNearbyAirports,
		currentAirport,
		nearbyAirports,
		refreshAll,
	} = useNearbyAirports();

	const getAirportIcon = (airportCode: string) => {
		const iconMap: Record<string, string> = {
			'BOM': '🛫', 'DEL': '✈️', 'BLR': '🛬', 'MAA': '🛫', 'HYD': '✈️',
			'PNQ': '🛬', 'AMD': '🛫', 'DXB': '✈️', 'SIN': '🛬', 'LHR': '🛫',
		};
		return iconMap[airportCode] || '🏢';
	};

	const handleAirportPress = (airport: NearbyAirport | CurrentAirport) => {
		onAirportSelect?.(airport);
	};

	const renderAirportItem = (airport: NearbyAirport | CurrentAirport, isCurrentAirport = false) => {
		const skyId = airport.navigation.relevantFlightParams.skyId;

		return (
			<Pressable
				key={`${isCurrentAirport ? 'current' : 'nearby'}-${airport.navigation.entityId}`}
				style={[styles.airportItem, isCurrentAirport && styles.currentAirportItem]}
				onPress={() => handleAirportPress(airport)}
				android_ripple={{color: '#e3f2fd'}}
			>
				<View style={styles.airportIcon}>
					<CustomText variant="titleMedium">
						{getAirportIcon(skyId)}
					</CustomText>
				</View>
				<View style={styles.airportInfo}>
					<CustomText
						variant="bodyMedium"
						weight="medium"
						numberOfLines={1}
						color={isCurrentAirport ? "primary" : "onSurface"}
					>
						{airport.presentation.title}
					</CustomText>
					<CustomText variant="bodySmall" color="secondary" numberOfLines={1}>
						{skyId} • {airport.presentation.subtitle}
					</CustomText>
				</View>
				{isCurrentAirport && (
					<View style={styles.currentBadge}>
						<CustomText variant="labelSmall" style={styles.currentBadgeText}>
							📍
						</CustomText>
					</View>
				)}
			</Pressable>
		);
	};

	if (locationError) {
		return (
			<View style={[styles.container, compact && styles.compactContainer]}>
				<View style={styles.errorContent}>
					<CustomText variant="bodyMedium" color="error" align="center">
						{locationError}
					</CustomText>
					<CustomButton
						variant="outline"
						size="small"
						onPress={getCurrentLocation}
						style={styles.retryButton}
					>
						Enable Location
					</CustomButton>
				</View>
			</View>
		);
	}

	if (!coordinates) {
		return (
			<View style={[styles.container, compact && styles.compactContainer]}>
				<View style={styles.promptContent}>
					<CustomText variant="bodyMedium" align="center" style={styles.promptText}>
						Find airports near you
					</CustomText>
					<CustomButton
						variant="primary"
						size="small"
						onPress={getCurrentLocation}
						loading={locationLoading}
						style={styles.locationButton}
					>
						📍 Get Location
					</CustomButton>
				</View>
			</View>
		);
	}

	if (airportsLoading) {
		return (
			<View style={[styles.container, compact && styles.compactContainer]}>
				<LoadingSpinner size="medium" message="Finding airports..." />
			</View>
		);
	}

	if (airportsError) {
		return (
			<View style={[styles.container, compact && styles.compactContainer]}>
				<View style={styles.errorContent}>
					<CustomText variant="bodyMedium" color="error" align="center">
						{airportsError}
					</CustomText>
					<CustomButton
						variant="outline"
						size="small"
						onPress={fetchNearbyAirports}
						style={styles.retryButton}
					>
						Try Again
					</CustomButton>
				</View>
			</View>
		);
	}

	if (!currentAirport && nearbyAirports.length === 0) {
		return (
			<View style={[styles.container, compact && styles.compactContainer]}>
				<View style={styles.promptContent}>
					<CustomText variant="bodyMedium" align="center" style={styles.promptText}>
						Ready to find airports
					</CustomText>
					<CustomButton
						variant="primary"
						size="small"
						onPress={fetchNearbyAirports}
						style={styles.locationButton}
					>
						🔍 Find Airports
					</CustomButton>
				</View>
			</View>
		);
	}

	const displayAirports = nearbyAirports.slice(0, maxAirports);

	return (
		<View style={[styles.container, compact && styles.compactContainer]}>
			<View style={styles.header}>
				<CustomText variant="titleMedium" weight="bold">
					✈️ Nearby Airports
				</CustomText>
				<IconButton
					icon="refresh"
					size={20}
					onPress={refreshAll}
					disabled={locationLoading || airportsLoading}
				/>
			</View>

			<ScrollView
				horizontal={compact}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				style={compact ? styles.horizontalScroll : styles.verticalScroll}
				contentContainerStyle={compact ? styles.horizontalContent : styles.verticalContent}
			>
				{currentAirport && renderAirportItem(currentAirport, true)}
				{displayAirports.map((airport) => renderAirportItem(airport))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#ffffff',
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: '#e9ecef',
	},
	compactContainer: {
		padding: 12,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	promptContent: {
		alignItems: 'center',
		paddingVertical: 16,
	},
	promptText: {
		marginBottom: 12,
	},
	locationButton: {
		minWidth: 120,
	},
	errorContent: {
		alignItems: 'center',
		paddingVertical: 16,
	},
	retryButton: {
		marginTop: 12,
		minWidth: 100,
	},
	horizontalScroll: {
		flexGrow: 0,
	},
	verticalScroll: {
		maxHeight: 300,
	},
	horizontalContent: {
		flexDirection: 'row',
		gap: 8,
	},
	verticalContent: {
		gap: 6,
	},
	airportItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		backgroundColor: '#f8f9fa',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: 'transparent',
		minWidth: 200, // For horizontal scroll
	},
	currentAirportItem: {
		backgroundColor: '#e3f2fd',
		borderColor: '#1976d2',
	},
	airportIcon: {
		marginRight: 12,
	},
	airportInfo: {
		flex: 1,
	},
	currentBadge: {
		marginLeft: 8,
	},
	currentBadgeText: {
		fontSize: 12,
	},
});

export default QuickAirportSelector; 