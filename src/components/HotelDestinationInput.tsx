import React, {useState, useCallback, useRef} from 'react';
import {
	View,
	StyleSheet,
	FlatList,
	Pressable,
	Platform,
} from 'react-native';
import {
	TextInput,
	Card,
	Divider,
	ActivityIndicator,
	Chip,
} from 'react-native-paper';
import {CustomText} from './CustomText';
import {HotelDestination} from '../types';
import {useHotelDestinationSearch} from '../hooks/useHotelDestinationSearch';
import {MaterialCommunityIcons} from '@expo/vector-icons';

interface HotelDestinationInputProps {
	value: HotelDestination | null;
	onDestinationSelect: (destination: HotelDestination) => void;
	placeholder?: string;
	label?: string;
	style?: any;
	error?: string;
}

export const HotelDestinationInput: React.FC<HotelDestinationInputProps> = ({
	value,
	onDestinationSelect,
	placeholder = 'Search destinations, cities, hotels...',
	label = 'Destination',
	style,
	error,
}) => {
	const [showDropdown, setShowDropdown] = useState(false);
	const [inputValue, setInputValue] = useState(value?.entityName || '');
	const inputRef = useRef<any>(null);

	const {
		destinations,
		loading,
		searchDestinations,
		clearResults,
	} = useHotelDestinationSearch();

	const handleInputChange = useCallback((text: string) => {
		setInputValue(text);
		setShowDropdown(true);

		if (text.trim().length >= 2) {
			searchDestinations(text.trim());
		} else {
			clearResults();
		}
	}, [searchDestinations, clearResults]);

	const handleDestinationSelect = useCallback((destination: HotelDestination) => {
		setInputValue(destination.entityName);
		setShowDropdown(false);
		onDestinationSelect(destination);
		inputRef.current?.blur();
	}, [onDestinationSelect]);

	const handleInputFocus = useCallback(() => {
		if (destinations.length > 0) {
			setShowDropdown(true);
		}
	}, [destinations.length]);

	const handleInputBlur = useCallback(() => {
		// Delay hiding to allow for item selection
		setTimeout(() => setShowDropdown(false), 150);
	}, []);

	const clearInput = useCallback(() => {
		setInputValue('');
		setShowDropdown(false);
		clearResults();
		// Don't clear the selected value - let parent handle that
	}, [clearResults]);

	const formatSuggestionText = (suggestItem: string) => {
		// Remove HTML tags and return clean text
		return suggestItem
			.replace(/{strong}/g, '')
			.replace(/{\/strong}/g, '');
	};

	const getDestinationIcon = (entityType: string, entityClass: string) => {
		switch (entityType) {
			case 'city':
				return 'city';
			case 'region':
				return 'map';
			case 'airport':
				return 'airplane';
			case 'hotel':
				return 'bed';
			case 'poi':
				return 'map-marker';
			default:
				return 'map-marker-outline';
		}
	};

	const getDestinationTypeLabel = (entityType: string, entityClass: string) => {
		switch (entityType) {
			case 'city':
				return 'City';
			case 'region':
				return 'Region';
			case 'airport':
				return 'Airport';
			case 'hotel':
				return 'Hotel';
			case 'poi':
				return 'Point of Interest';
			default:
				return entityClass || 'Location';
		}
	};

	const renderDestinationItem = ({item}: {item: HotelDestination}) => (
		<Pressable
			onPress={() => handleDestinationSelect(item)}
			android_ripple={{color: '#e3f2fd'}}
		>
			<View style={styles.destinationItem}>
				<View style={styles.destinationIcon}>
					<MaterialCommunityIcons
						name={getDestinationIcon(item.entityType, item.class) as any}
						size={24}
						color="#666"
					/>
				</View>

				<View style={styles.destinationInfo}>
					<CustomText variant="bodyLarge" weight="medium" numberOfLines={1}>
						{item.entityName}
					</CustomText>
					<CustomText variant="bodySmall" color="secondary" numberOfLines={1}>
						{item.hierarchy}
					</CustomText>
				</View>

				<View style={styles.destinationMeta}>
					<Chip
						mode="outlined"
						compact
						style={styles.typeChip}
						textStyle={styles.typeChipText}
					>
						{getDestinationTypeLabel(item.entityType, item.class)}
					</Chip>
				</View>
			</View>
		</Pressable>
	);

	const renderDropdown = () => {
		if (!showDropdown) return null;

		return (
			<Card style={styles.dropdown} mode="outlined">
				{loading && (
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="small" />
						<CustomText variant="bodyMedium" color="secondary" style={styles.loadingText}>
							Searching destinations...
						</CustomText>
					</View>
				)}

				{!loading && destinations.length === 0 && inputValue.length >= 2 && (
					<View style={styles.emptyContainer}>
						<CustomText variant="bodyMedium" color="secondary">
							No destinations found for "{inputValue}"
						</CustomText>
					</View>
				)}

				{destinations.length > 0 && (
					<FlatList
						data={destinations.slice(0, 8)} // Limit to 8 results
						renderItem={renderDestinationItem}
						keyExtractor={(item) => item.entityId}
						style={styles.destinationList}
						keyboardShouldPersistTaps="handled"
						ItemSeparatorComponent={() => <Divider />}
					/>
				)}
			</Card>
		);
	};

	return (
		<View style={[styles.container, style]}>
			<TextInput
				ref={inputRef}
				label={label}
				value={inputValue}
				onChangeText={handleInputChange}
				onFocus={handleInputFocus}
				onBlur={handleInputBlur}
				placeholder={placeholder}
				mode="outlined"
				style={styles.input}
				error={!!error}
				left={
					<TextInput.Icon
						icon="map-search"
						size={20}
					/>
				}
				right={
					inputValue.length > 0 ? (
						<TextInput.Icon
							icon="close"
							size={20}
							onPress={clearInput}
						/>
					) : undefined
				}
			/>

			{error && (
				<CustomText variant="bodySmall" color="error" style={styles.errorText}>
					{error}
				</CustomText>
			)}

			{renderDropdown()}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		zIndex: 1000,
	},
	input: {
		backgroundColor: '#fff',
	},
	errorText: {
		marginTop: 4,
		marginLeft: 12,
	},
	dropdown: {
		position: 'absolute',
		top: 64,
		left: 0,
		right: 0,
		maxHeight: 300,
		elevation: 8,
		zIndex: 1000,
		backgroundColor: '#fff',
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: {width: 0, height: 2},
				shadowOpacity: 0.25,
				shadowRadius: 8,
			},
		}),
	},
	loadingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		gap: 12,
	},
	loadingText: {
		flex: 1,
	},
	emptyContainer: {
		padding: 16,
		alignItems: 'center',
	},
	destinationList: {
		maxHeight: 250,
	},
	destinationItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		gap: 12,
	},
	destinationIcon: {
		width: 40,
		alignItems: 'center',
	},
	destinationInfo: {
		flex: 1,
		gap: 2,
	},
	destinationMeta: {
		alignItems: 'flex-end',
	},
	typeChip: {
		height: 24,
	},
	typeChipText: {
		fontSize: 10,
		fontWeight: 'bold',
	},
});

export default HotelDestinationInput; 