import React, {useState, useRef} from 'react';
import {StyleSheet, View, ScrollView, Pressable, Platform, Modal} from 'react-native';
import {TextInput, Card, Chip, Portal} from 'react-native-paper';
import {CustomText} from './CustomText';
import {LoadingSpinner} from './LoadingSpinner';
import {useAirportSearch} from '../hooks/useAirportSearch';
import {SearchAirportResult} from '../types';

interface AirportSearchInputProps {
	value: string;
	onValueChange: (value: string) => void;
	onAirportSelect: (airport: SearchAirportResult) => void;
	label: string;
	placeholder?: string;
	error?: boolean;
	disabled?: boolean;
	style?: any;
	selectedAirport?: SearchAirportResult | null;
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
	selectedAirport = null,
}) => {
	const [showDropdown, setShowDropdown] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const inputRef = useRef<any>(null);

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
		// Format the display value like: "Balikpapan - Sepinggan International Airport (BPN)"
		const displayValue = `${airport.presentation.title} (${airport.skyId})`;
		onValueChange(displayValue);
		onAirportSelect(airport);
		setShowDropdown(false);
		inputRef.current?.blur();
	};

	const handleFocus = () => {
		setIsFocused(true);
		if (value.length >= 2 && results.length > 0) {
			setShowDropdown(true);
		}
	};

	const handleBlur = () => {
		setIsFocused(false);
		// Delay hiding dropdown to allow for item selection
		setTimeout(() => setShowDropdown(false), 200);
	};

	const clearInput = () => {
		onValueChange('');
		clearResults();
		setShowDropdown(false);
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
		const isAirport = item.navigation.entityType === 'AIRPORT';
		const icon = getEntityIcon(item.navigation.entityType);

		return (
			<Pressable
				key={`${item.entityId}-${item.skyId}`}
				style={({pressed}) => [
					styles.resultItem,
					pressed && styles.resultItemPressed
				]}
				onPress={() => handleAirportSelect(item)}
				android_ripple={{color: '#e3f2fd'}}
			>
				<View style={styles.resultIcon}>
					<CustomText variant="titleMedium">{icon}</CustomText>
				</View>

				<View style={styles.resultContent}>
					<CustomText
						variant="bodyLarge"
						weight="medium"
						numberOfLines={1}
						style={styles.resultTitle}
					>
						{item.presentation.title}
					</CustomText>

					{item.presentation.subtitle && (
						<CustomText
							variant="bodyMedium"
							color="secondary"
							numberOfLines={1}
							style={styles.resultSubtitle}
						>
							{item.presentation.subtitle}
						</CustomText>
					)}
				</View>

				{isAirport && (
					<View style={styles.resultCode}>
						<CustomText variant="bodyMedium" weight="bold" style={styles.codeText}>
							{item.skyId}
						</CustomText>
					</View>
				)}
			</Pressable>
		);
	};

	const renderDropdownContent = () => {
		if (loading) {
			return (
				<View style={styles.loadingContainer}>
					<LoadingSpinner size="small" />
					<CustomText variant="bodyMedium" color="secondary" style={styles.loadingText}>
						Searching airports...
					</CustomText>
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

		// Prioritize airports
		const airports = results.filter(item => item.navigation.entityType === 'AIRPORT');
		const cities = results.filter(item => item.navigation.entityType === 'CITY');
		const others = results.filter(item => item.navigation.entityType !== 'AIRPORT' && item.navigation.entityType !== 'CITY');

		const sortedResults = [...airports.slice(0, 8), ...cities.slice(0, 4), ...others.slice(0, 2)];

		return (
			<ScrollView
				style={styles.resultsScroll}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
			>
				{sortedResults.map(renderSearchResult)}
			</ScrollView>
		);
	};

	return (
		<View style={[styles.container, style]}>
			<TextInput
				ref={inputRef}
				label={label}
				value={value}
				onChangeText={handleTextChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
				mode="outlined"
				placeholder={placeholder}
				error={error}
				disabled={disabled}
				style={style}
				left={
					<TextInput.Icon
						icon={selectedAirport ? "airplane" : "magnify"}
					/>
				}
				right={
					selectedAirport ? (
						<TextInput.Icon
							icon="check-circle"
							color="#10b981"
						/>
					) : loading ? (
						<TextInput.Icon icon="loading" />
					) : value.length > 0 ? (
						<TextInput.Icon
							icon="close"
							onPress={clearInput}
						/>
					) : undefined
				}
			/>

			{/* Use Portal to render dropdown above everything else */}
			<Portal>
				<Modal
					visible={showDropdown && results.length > 0}
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
	textInput: {
		backgroundColor: '#ffffff',
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
	resultsScroll: {
		maxHeight: 380,
	},
	resultItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#f1f3f4',
		minHeight: 70,
	},
	resultItemPressed: {
		backgroundColor: '#f5f5f5',
	},
	resultIcon: {
		width: 40,
		alignItems: 'center',
		marginRight: 12,
	},
	resultContent: {
		flex: 1,
		marginRight: 8,
	},
	resultTitle: {
		marginBottom: 2,
	},
	resultSubtitle: {
		fontSize: 13,
	},
	resultCode: {
		backgroundColor: '#e3f2fd',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 8,
	},
	codeText: {
		color: '#1976d2',
		fontSize: 13,
	},
	loadingContainer: {
		padding: 32,
		alignItems: 'center',
	},
	loadingText: {
		marginTop: 12,
	},
	errorContainer: {
		padding: 32,
	},
	emptyContainer: {
		padding: 32,
		alignItems: 'center',
	},
});

export default AirportSearchInput; 