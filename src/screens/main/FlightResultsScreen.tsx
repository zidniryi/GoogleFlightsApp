import React, {useState, useMemo} from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	RefreshControl,
} from 'react-native';
import {
	Text,
	Appbar,
	FAB,
	Chip,
	Divider,
	Button,
	Menu,
	Card,
} from 'react-native-paper';
import {StackNavigationProp} from '@react-navigation/stack';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {FlightCard, CustomText, LoadingSpinner, EmptyState} from '../../components';
import {MainTabParamList, RootStackParamList, FlightItinerary, FlightSearchParams, FlightSearchResponse} from '../../types';
import {format} from 'date-fns';
import {searchFlights} from '../../services/api';

type FlightResultsScreenNavigationProp = CompositeNavigationProp<
	BottomTabNavigationProp<MainTabParamList, 'Results'>,
	StackNavigationProp<RootStackParamList>
>;
type FlightResultsScreenRouteProp = RouteProp<MainTabParamList, 'Results'>;

interface Props {
	navigation: FlightResultsScreenNavigationProp;
	route: FlightResultsScreenRouteProp;
}

type SortOption = 'best' | 'cheapest' | 'fastest' | 'departure';
type FilterOption = 'all' | 'direct' | 'oneStop' | 'twoOrMore';

const FlightResultsScreen: React.FC<Props> = ({navigation, route}) => {
	const {searchParams, response: initialResponse} = route.params || {};

	const [response, setResponse] = useState<FlightSearchResponse | null>(initialResponse || null);
	const [loading, setLoading] = useState(!initialResponse);
	const [refreshing, setRefreshing] = useState(false);
	const [sortBy, setSortBy] = useState<SortOption>('best');
	const [filterBy, setFilterBy] = useState<FilterOption>('all');
	const [showSortMenu, setShowSortMenu] = useState(false);

	// Load initial data if not provided
	React.useEffect(() => {
		if (!initialResponse && searchParams) {
			loadFlights();
		}
	}, []);

	const loadFlights = async () => {
		if (!searchParams) {
			console.warn('No search parameters available');
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			const result = await searchFlights(searchParams);

			if (result.success) {
				setResponse(result.data);
			} else {
				console.error('Flight search failed:', result.error);
			}
		} catch (error) {
			console.error('Flight search error:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleRefresh = async () => {
		if (!searchParams) {
			return;
		}
		setRefreshing(true);
		await loadFlights();
		setRefreshing(false);
	};

	// Filtered and sorted itineraries
	const processedItineraries = useMemo(() => {
		if (!response?.data.itineraries) return [];

		let filtered = response.data.itineraries;

		// Apply filters
		switch (filterBy) {
			case 'direct':
				filtered = filtered.filter(it => it.legs.every(leg => leg.stopCount === 0));
				break;
			case 'oneStop':
				filtered = filtered.filter(it => it.legs.some(leg => leg.stopCount === 1));
				break;
			case 'twoOrMore':
				filtered = filtered.filter(it => it.legs.some(leg => leg.stopCount >= 2));
				break;
		}

		// Apply sorting
		const sorted = [...filtered].sort((a, b) => {
			switch (sortBy) {
				case 'cheapest':
					return a.price.raw - b.price.raw;
				case 'fastest':
					const aDuration = a.legs.reduce((sum, leg) => sum + leg.durationInMinutes, 0);
					const bDuration = b.legs.reduce((sum, leg) => sum + leg.durationInMinutes, 0);
					return aDuration - bDuration;
				case 'departure':
					return new Date(a.legs[0].departure).getTime() - new Date(b.legs[0].departure).getTime();
				case 'best':
				default:
					return b.score - a.score;
			}
		});

		return sorted;
	}, [response, sortBy, filterBy]);

	const formatSearchSummary = () => {
		if (!searchParams) return '';

		const departDate = format(new Date(searchParams.date), 'MMM dd');
		const returnText = searchParams.returnDate ? ` - ${format(new Date(searchParams.returnDate), 'MMM dd')}` : '';

		return `${searchParams.originSkyId} → ${searchParams.destinationSkyId} • ${departDate}${returnText} • ${searchParams.adults} adult${searchParams.adults > 1 ? 's' : ''}`;
	};

	const getSortMenuItems = () => [
		{label: 'Best', value: 'best'},
		{label: 'Cheapest', value: 'cheapest'},
		{label: 'Fastest', value: 'fastest'},
		{label: 'Departure Time', value: 'departure'},
	];

	const getFilterChips = () => [
		{label: 'All Flights', value: 'all'},
		{label: 'Direct Only', value: 'direct'},
		{label: '1 Stop', value: 'oneStop'},
		{label: '2+ Stops', value: 'twoOrMore'},
	];

	const renderHeader = () => (
		<Card style={styles.headerCard}>
			<Card.Content>
				<CustomText variant="titleMedium" weight="bold" style={styles.searchSummary}>
					{formatSearchSummary()}
				</CustomText>

				{response && (
					<CustomText variant="bodyMedium" color="secondary" style={styles.resultsCount}>
						{response.data.context.totalResults} flights found
						{response.data.context.status === 'incomplete' && ' (loading more...)'}
					</CustomText>
				)}
			</Card.Content>
		</Card>
	);

	const renderFilters = () => (
		<View style={styles.filtersContainer}>
			{/* Sort Menu */}
			<Menu
				visible={showSortMenu}
				onDismiss={() => setShowSortMenu(false)}
				anchor={
					<Button
						mode="outlined"
						onPress={() => setShowSortMenu(true)}
						icon="sort"
						style={styles.sortButton}
					>
						Sort: {getSortMenuItems().find(item => item.value === sortBy)?.label}
					</Button>
				}
			>
				{getSortMenuItems().map((item) => (
					<Menu.Item
						key={item.value}
						onPress={() => {
							setSortBy(item.value as SortOption);
							setShowSortMenu(false);
						}}
						title={item.label}
					/>
				))}
			</Menu>

			{/* Filter Chips */}
			<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChips}>
				{getFilterChips().map((chip) => (
					<Chip
						key={chip.value}
						mode={filterBy === chip.value ? 'flat' : 'outlined'}
						selected={filterBy === chip.value}
						onPress={() => setFilterBy(chip.value as FilterOption)}
						style={styles.filterChip}
					>
						{chip.label}
					</Chip>
				))}
			</ScrollView>
		</View>
	);

	const renderContent = () => {
		// Handle case when no search parameters are available
		if (!searchParams) {
			return (
				<View style={styles.centerContainer}>
					<EmptyState
						title="No flight search"
						description="Start a new flight search to see results here"
						actionLabel="Search Flights"
						onAction={() => navigation.navigate('Search', {})}
					/>
				</View>
			);
		}

		if (loading) {
			return (
				<View style={styles.centerContainer}>
					<LoadingSpinner size="large" message="Searching flights..." />
				</View>
			);
		}

		if (!response || !response.data.itineraries.length) {
			return (
				<View style={styles.centerContainer}>
					<EmptyState
						title="No flights found"
						description="Try adjusting your search criteria or dates"
						actionLabel="New Search"
						onAction={() => navigation.navigate('Search', {})}
					/>
				</View>
			);
		}

		if (!processedItineraries.length) {
			return (
				<View style={styles.centerContainer}>
					<EmptyState
						title="No flights match your filters"
						description="Try adjusting your filter settings"
						actionLabel="Clear Filters"
						onAction={() => {
							setSortBy('best');
							setFilterBy('all');
						}}
					/>
				</View>
			);
		}

		return (
			<ScrollView
				style={styles.scrollView}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
				}
			>
				{renderHeader()}
				{renderFilters()}

				<View style={styles.resultsContainer}>
					{processedItineraries.map((itinerary) => (
						<FlightCard
							key={itinerary.id}
							itinerary={itinerary}
							onPress={() => {
								// Navigate to flight details
								const legs = itinerary.legs.map(leg => ({
									origin: leg.origin.displayCode,
									destination: leg.destination.displayCode,
									date: leg.departure.substring(0, 10), // YYYY-MM-DD format
								}));

								navigation.navigate('FlightDetails', {
									flightId: itinerary.id,
									legs,
									adults: searchParams.adults,
									itinerary, // Pass for quick preview
								});
							}}
						/>
					))}
				</View>

				{/* Loading more indicator */}
				{response.data.context.status === 'incomplete' && (
					<View style={styles.loadingMore}>
						<LoadingSpinner size="small" message="Loading more results..." />
					</View>
				)}
			</ScrollView>
		);
	};

	return (
		<View style={styles.container}>
			<Appbar.Header>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title="Flight Results" />
			</Appbar.Header>

			{renderContent()}

			{/* New Search FAB */}
			<FAB
				icon="magnify"
				label="New Search"
				style={styles.fab}
				onPress={() => navigation.goBack()}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	centerContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	scrollView: {
		flex: 1,
	},
	headerCard: {
		margin: 16,
		marginBottom: 8,
	},
	searchSummary: {
		marginBottom: 4,
	},
	resultsCount: {
		marginBottom: 0,
	},
	filtersContainer: {
		padding: 16,
		paddingTop: 8,
		paddingBottom: 8,
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
	},
	sortButton: {
		marginBottom: 12,
		alignSelf: 'flex-start',
	},
	filterChips: {
		flexDirection: 'row',
	},
	filterChip: {
		marginRight: 8,
	},
	resultsContainer: {
		padding: 16,
		paddingTop: 8,
	},
	loadingMore: {
		padding: 20,
		alignItems: 'center',
	},
	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
	},
});

export default FlightResultsScreen; 