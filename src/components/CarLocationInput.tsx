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
import {CarLocation} from '../types';
import {useCarLocationSearch} from '../hooks/useCarLocationSearch';
import {MaterialCommunityIcons} from '@expo/vector-icons';

interface CarLocationInputProps {
	value: CarLocation | null;
	onLocationSelect: (location: CarLocation) => void;
	placeholder?: string;
	label?: string;
	style?: any;
	error?: string;
}

export const CarLocationInput: React.FC<CarLocationInputProps> = ({
	value,
	onLocationSelect,
	placeholder = 'Search cities, airports, locations...',
	label = 'Location',
	style,
	error,
}) => {
	const [showDropdown, setShowDropdown] = useState(false);
	const [inputValue, setInputValue] = useState(value?.entityName || '');
	const inputRef = useRef<any>(null);

	const {
		locations,
		loading,
		searchLocations,
		clearResults,
	} = useCarLocationSearch();

	const handleInputChange = useCallback((text: string) => {
		setInputValue(text);
		setShowDropdown(true);

		if (text.trim().length >= 2) {
			searchLocations(text.trim());
		} else {
			clearResults();
		}
	}, [searchLocations, clearResults]);

	const handleLocationSelect = useCallback((location: CarLocation) => {
		setInputValue(location.entityName);
		setShowDropdown(false);
		onLocationSelect(location);
		inputRef.current?.blur();
	}, [onLocationSelect]);

	const handleInputFocus = useCallback(() => {
		if (locations.length > 0) {
			setShowDropdown(true);
		}
	}, [locations.length]);

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

	const getLocationIcon = (locationClass: string) => {
		switch (locationClass) {
			case 'City':
				return 'city';
			case 'Airport':
				return 'airplane';
			case 'Region':
				return 'map';
			default:
				return 'map-marker-outline';
		}
	};

	const getLocationTypeLabel = (locationClass: string) => {
		switch (locationClass) {
			case 'City':
				return 'City';
			case 'Airport':
				return 'Airport';
			case 'Region':
				return 'Region';
			default:
				return 'Location';
		}
	};

	const renderLocationItem = ({item}: {item: CarLocation}) => (
		<Pressable
			onPress={() => handleLocationSelect(item)}
			android_ripple={{color: '#e3f2fd'}}
		>
			<View style={styles.locationItem}>
				<View style={styles.locationIcon}>
					<MaterialCommunityIcons
						name={getLocationIcon(item.class) as any}
						size={24}
						color="#666"
					/>
				</View>

				<View style={styles.locationInfo}>
					<CustomText variant="bodyLarge" weight="medium" numberOfLines={1}>
						{item.entityName}
					</CustomText>
					<CustomText variant="bodySmall" color="secondary" numberOfLines={1}>
						{item.hierarchy}
					</CustomText>
				</View>

				<View style={styles.locationMeta}>
					<Chip
						mode="outlined"
						compact
						style={styles.typeChip}
						textStyle={styles.typeChipText}
					>
						{getLocationTypeLabel(item.class)}
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
							Searching locations...
						</CustomText>
					</View>
				)}

				{!loading && locations.length === 0 && inputValue.length >= 2 && (
					<View style={styles.emptyContainer}>
						<CustomText variant="bodyMedium" color="secondary">
							No locations found for "{inputValue}"
						</CustomText>
					</View>
				)}

				{locations.length > 0 && (
					<FlatList
						data={locations.slice(0, 8)} // Limit to 8 results
						renderItem={renderLocationItem}
						keyExtractor={(item) => item.entityId}
						style={styles.locationList}
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
						icon="car"
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
	locationList: {
		maxHeight: 250,
	},
	locationItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		gap: 12,
	},
	locationIcon: {
		width: 40,
		alignItems: 'center',
	},
	locationInfo: {
		flex: 1,
		gap: 2,
	},
	locationMeta: {
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

export default CarLocationInput; 