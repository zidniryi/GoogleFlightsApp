import React, {useState} from 'react';
import {StyleSheet, View, ScrollView, Pressable, Modal} from 'react-native';
import {TextInput, IconButton, Divider} from 'react-native-paper';
import {
	CustomText,
	LoadingSpinner,
	EmptyState,
} from './index';
import {useAirportSearch} from '../hooks/useAirportSearch';
import {SearchAirportResult, AirportSearchItem} from '../types';

interface AirportSearchInputProps {
	value: string;
	onValueChange: (value: string) => void;
	onAirportSelect: (airport: SearchAirportResult) => void;
	label: string;
	placeholder?: string;
	error?: boolean;
	disabled?: boolean;
	style?: any;
}

export const AirportSearchInput: React.FC<AirportSearchInputProps> = ({
	value,
	onValueChange,
	onAirportSelect,
	label,
	placeholder = "Search airports, cities...",
	error = false,
	disabled = false,
	style,
}) => {
	const [showDropdown, setShowDropdown] = useState(false);
	const {
		results,
		loading,
		error: searchError,
		searchAirports,
		clearResults,
	} = useAirportSearch();

	const handleTextChange = (text: string) => {
		onValueChange(text);
		if (text.length >= 2) {
			searchAirports(text);
			setShowDropdown(true);
		} else {
			clearResults();
			setShowDropdown(false);
		}
	};

	const handleAirportSelect = (airport: SearchAirportResult) => {
		onValueChange(airport.presentation.suggestionTitle);
		onAirportSelect(airport);
		setShowDropdown(false);
	};

	const handleFocus = () => {
		if (value.length >= 2 && results.length > 0) {
			setShowDropdown(true);
		}
	};

	const handleBlur = () => {
		// Delay hiding dropdown to allow for item selection
		setTimeout(() => setShowDropdown(false), 150);
	};

	const getEntityIcon = (entityType: string) => {
		switch (entityType) {
			case 'AIRPORT':
				return '✈️';
			case 'CITY':
				return '🏙️';
			case 'COUNTRY':
				return '🌍';
			default:
				return '📍';
		}
	};

	const renderSearchResult = (item: SearchAirportResult) => {
		const icon = getEntityIcon(item.navigation.entityType);
		const isAirport = item.navigation.entityType === 'AIRPORT';

		return (
			<Pressable
				key={`${item.entityId}-${item.skyId}`}
				style={styles.resultItem}
				onPress={() => handleAirportSelect(item)}
				android_ripple={{color: '#e3f2fd'}}
			>
				<View style={styles.resultIcon}>
					<CustomText variant="titleMedium">{icon}</CustomText>
				</View>

				<View style={styles.resultContent}>
					<View style={styles.resultHeader}>
						<CustomText
							variant="bodyMedium"
							weight="medium"
							numberOfLines={1}
						>
							{item.presentation.title}
						</CustomText>
						{isAirport && (
							<View style={styles.codeChip}>
								<CustomText variant="labelSmall" style={styles.codeText}>
									{item.skyId}
								</CustomText>
							</View>
						)}
					</View>

					{item.presentation.subtitle && (
						<CustomText variant="bodySmall" color="secondary" numberOfLines={1}>
							{item.presentation.subtitle}
						</CustomText>
					)}

					<CustomText variant="bodySmall" color="secondary" style={styles.entityType}>
						{item.navigation.entityType.toLowerCase()}
					</CustomText>
				</View>
			</Pressable>
		);
	};

	const renderDropdownContent = () => {
		if (loading) {
			return (
				<View style={styles.loadingContainer}>
					<LoadingSpinner size="small" message="Searching..." />
				</View>
			);
		}

		if (searchError) {
			return (
				<View style={styles.errorContainer}>
					<CustomText variant="bodyMedium" color="error" align="center">
						{searchError}
					</CustomText>
				</View>
			);
		}

		if (results.length === 0 && value.length >= 2) {
			return (
				<View style={styles.emptyContainer}>
					<CustomText variant="bodyMedium" color="secondary" align="center">
						No airports found for "{value}"
					</CustomText>
				</View>
			);
		}

		// Group results by type
		const airports = results.filter(item => item.navigation.entityType === 'AIRPORT');
		const cities = results.filter(item => item.navigation.entityType === 'CITY');
		const countries = results.filter(item => item.navigation.entityType === 'COUNTRY');

		return (
			<ScrollView style={styles.resultsScroll} showsVerticalScrollIndicator={false}>
				{airports.length > 0 && (
					<>
						<View style={styles.sectionHeader}>
							<CustomText variant="labelMedium" weight="bold" color="primary">
								✈️ Airports ({airports.length})
							</CustomText>
						</View>
						{airports.map(renderSearchResult)}
					</>
				)}

				{cities.length > 0 && (
					<>
						{airports.length > 0 && <Divider style={styles.sectionDivider} />}
						<View style={styles.sectionHeader}>
							<CustomText variant="labelMedium" weight="bold" color="primary">
								🏙️ Cities ({cities.length})
							</CustomText>
						</View>
						{cities.map(renderSearchResult)}
					</>
				)}

				{countries.length > 0 && (
					<>
						{(airports.length > 0 || cities.length > 0) && <Divider style={styles.sectionDivider} />}
						<View style={styles.sectionHeader}>
							<CustomText variant="labelMedium" weight="bold" color="primary">
								🌍 Countries ({countries.length})
							</CustomText>
						</View>
						{countries.map(renderSearchResult)}
					</>
				)}
			</ScrollView>
		);
	};

	return (
		<View style={[styles.container, style]}>
			<TextInput
				label={label}
				value={value}
				onChangeText={handleTextChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
				mode="outlined"
				placeholder={placeholder}
				error={error}
				disabled={disabled}
				right={
					loading ? (
						<TextInput.Icon icon="loading" />
					) : value.length > 0 ? (
						<TextInput.Icon
							icon="close"
							onPress={() => {
								onValueChange('');
								clearResults();
								setShowDropdown(false);
							}}
						/>
					) : (
						<TextInput.Icon icon="magnify" />
					)
				}
			/>

			{showDropdown && results.length > 0 && (
				<View style={styles.dropdown}>
					<View style={styles.dropdownContent}>
						{renderDropdownContent()}
					</View>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		zIndex: 1000,
	},
	dropdown: {
		position: 'absolute',
		top: '100%',
		left: 0,
		right: 0,
		zIndex: 1001,
		marginTop: 4,
	},
	dropdownContent: {
		backgroundColor: '#ffffff',
		borderRadius: 8,
		maxHeight: 300,
		borderWidth: 1,
		borderColor: '#e9ecef',
		elevation: 8,
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.15,
		shadowRadius: 8,
	},
	resultsScroll: {
		maxHeight: 280,
	},
	sectionHeader: {
		padding: 12,
		paddingBottom: 8,
		backgroundColor: '#f8f9fa',
	},
	sectionDivider: {
		marginVertical: 4,
	},
	resultItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#f1f3f4',
	},
	resultIcon: {
		marginRight: 12,
		minWidth: 32,
		alignItems: 'center',
	},
	resultContent: {
		flex: 1,
	},
	resultHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 2,
	},
	codeChip: {
		backgroundColor: '#e3f2fd',
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 4,
		marginLeft: 8,
	},
	codeText: {
		fontSize: 11,
		color: '#1976d2',
		fontWeight: 'bold',
	},
	entityType: {
		textTransform: 'capitalize',
		fontSize: 11,
		marginTop: 2,
	},
	loadingContainer: {
		padding: 20,
		alignItems: 'center',
	},
	errorContainer: {
		padding: 20,
	},
	emptyContainer: {
		padding: 20,
	},
});

export default AirportSearchInput; 