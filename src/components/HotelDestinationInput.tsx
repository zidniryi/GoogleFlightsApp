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
		setTimeout(() => setShowDropdown(false), 200);
	}, []);

	const clearInput = useCallback(() => {
		setInputValue('');
		setShowDropdown(false);
		clearResults();
	}, [clearResults]);

	const getDestinationIcon = (entityType: string, entityClass: string) => {
		switch (entityType) {
			case 'city':
				return '🏙️';
			case 'region':
				return '🗺️';
			case 'airport':
				return '✈️';
			case 'hotel':
				return '🏨';
			case 'poi':
				return '📍';
			default:
				return '📍';
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
			style={({pressed}) => [
				styles.destinationItem,
				pressed && styles.destinationItemPressed
			]}
			android_ripple={{color: '#e3f2fd'}}
		>
			<View style={styles.destinationIcon}>
				<CustomText variant="titleMedium">
					{getDestinationIcon(item.entityType, item.class)}
				</CustomText>
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
				{/* <Chip
					mode="outlined"
					compact
					style={styles.typeChip}
					textStyle={styles.typeChipText}
				>
					{getDestinationTypeLabel(item.entityType, item.class)}
				</Chip> */}
			</View>
		</Pressable>
	);

	const renderDropdownContent = () => {
		if (loading) {
			return (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="small" />
					<CustomText variant="bodyMedium" color="secondary" style={styles.loadingText}>
						Searching destinations...
					</CustomText>
				</View>
			);
		}

		if (destinations.length === 0 && inputValue.length >= 2) {
			return (
				<View style={styles.emptyContainer}>
					<CustomText variant="bodyMedium" color="secondary">
						No destinations found for "{inputValue}"
					</CustomText>
				</View>
			);
		}

		return (
			<FlatList
				data={destinations.slice(0, 8)} // Limit to 8 results
				renderItem={renderDestinationItem}
				keyExtractor={(item) => item.entityId}
				style={styles.destinationList}
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

			{/* Use Portal to render dropdown above everything else */}
			<Portal>
				<Modal
					visible={showDropdown && destinations.length > 0}
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
	destinationList: {
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
	destinationItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		gap: 12,
	},
	destinationItemPressed: {
		backgroundColor: '#f5f5f5',
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