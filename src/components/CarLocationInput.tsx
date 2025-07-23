import React, {useState, useCallback, useRef} from 'react';
import {
	View,
	StyleSheet,
	FlatList,
	Pressable,
	Platform,
	Modal,
} from 'react-native';
import {
	TextInput,
	Card,
	Divider,
	ActivityIndicator,
	Chip,
	Portal,
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
		setTimeout(() => setShowDropdown(false), 200);
	}, []);

	const clearInput = useCallback(() => {
		setInputValue('');
		setShowDropdown(false);
		clearResults();
	}, [clearResults]);

	const getLocationIcon = (locationClass: string) => {
		switch (locationClass) {
			case 'City':
				return '🏙️';
			case 'Airport':
				return '✈️';
			case 'Region':
				return '🗺️';
			default:
				return '📍';
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
			style={({pressed}) => [
				styles.locationItem,
				pressed && styles.locationItemPressed
			]}
			android_ripple={{color: '#e3f2fd'}}
		>
			<View style={styles.locationIcon}>
				<CustomText variant="titleMedium">
					{getLocationIcon(item.class)}
				</CustomText>
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
		</Pressable>
	);

	const renderDropdownContent = () => {
		if (loading) {
			return (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="small" />
					<CustomText variant="bodyMedium" color="secondary" style={styles.loadingText}>
						Searching locations...
					</CustomText>
				</View>
			);
		}

		if (locations.length === 0 && inputValue.length >= 2) {
			return (
				<View style={styles.emptyContainer}>
					<CustomText variant="bodyMedium" color="secondary">
						No locations found for "{inputValue}"
					</CustomText>
				</View>
			);
		}

		return (
			<FlatList
				data={locations.slice(0, 8)} // Limit to 8 results
				renderItem={renderLocationItem}
				keyExtractor={(item) => item.entityId}
				style={styles.locationList}
				keyboardShouldPersistTaps="handled"
				ItemSeparatorComponent={() => <Divider />}
			/>
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

			{/* Use Portal to render dropdown above everything else */}
			<Portal>
				<Modal
					visible={showDropdown && locations.length > 0}
					transparent
					animationType="fade"
					onRequestClose={() => setShowDropdown(false)}
				>
					<Pressable
						style={styles.modalOverlay}
						onPress={() => setShowDropdown(false)}
					>
						<View style={styles.modalContent}>
							<Card style={styles.dropdownCard} mode="elevated">
								<Card.Content style={styles.dropdownContent}>
									{renderDropdownContent()}
								</Card.Content>
							</Card>
						</View>
					</Pressable>
				</Modal>
			</Portal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 16,
	},
	input: {
		backgroundColor: '#fff',
	},
	errorText: {
		marginTop: 4,
		marginLeft: 12,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	modalContent: {
		width: '100%',
		maxWidth: 400,
		maxHeight: '70%',
	},
	dropdownCard: {
		elevation: 12,
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: {width: 0, height: 6},
				shadowOpacity: 0.4,
				shadowRadius: 12,
			},
		}),
	},
	dropdownContent: {
		padding: 0,
		maxHeight: 400,
	},
	locationList: {
		maxHeight: 380,
	},
	loadingContainer: {
		padding: 32,
		alignItems: 'center',
	},
	loadingText: {
		marginTop: 12,
	},
	emptyContainer: {
		padding: 32,
		alignItems: 'center',
	},
	locationItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		gap: 12,
	},
	locationItemPressed: {
		backgroundColor: '#f5f5f5',
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