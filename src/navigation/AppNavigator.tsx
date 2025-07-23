import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MaterialCommunityIcons} from '@expo/vector-icons';

// Screens
import FlightSearchScreen from '../screens/main/FlightSearchScreen';
import FlightResultsScreen from '../screens/main/FlightResultsScreen';
import FlightDetailsScreen from '../screens/main/FlightDetailsScreen';
import HotelSearchScreen from '../screens/main/HotelSearchScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import {NearbyAirportsScreen} from '../screens/main/NearbyAirportsScreen';
import {LanguageSelector} from '../components/LanguageSelector';

// Types
import {RootStackParamList, MainTabParamList} from '../types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
	return (
		<Tab.Navigator
			screenOptions={({route}) => ({
				tabBarIcon: ({focused, color, size}) => {
					let iconName: keyof typeof MaterialCommunityIcons.glyphMap;

					if (route.name === 'Search') {
						iconName = focused ? 'magnify' : 'magnify';
					} else if (route.name === 'Results') {
						iconName = focused ? 'airplane' : 'airplane';
					} else if (route.name === 'Hotels') {
						iconName = focused ? 'bed' : 'bed-outline';
					} else if (route.name === 'Profile') {
						iconName = focused ? 'account' : 'account-outline';
					} else {
						iconName = 'circle';
					}

					return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
				},
				tabBarActiveTintColor: '#2196F3',
				tabBarInactiveTintColor: 'gray',
				headerShown: false,
			})}
		>
			<Tab.Screen name="Search" component={FlightSearchScreen} />
			<Tab.Screen name="Results" component={FlightResultsScreen} />
			<Tab.Screen name="Hotels" component={HotelSearchScreen} />
			<Tab.Screen name="Profile" component={ProfileScreen} />
		</Tab.Navigator>
	);
};

const AppNavigator = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName="Main"
				screenOptions={{
					headerStyle: {
						backgroundColor: '#2196F3',
					},
					headerTintColor: '#fff',
					headerTitleStyle: {
						fontWeight: 'bold',
					},
				}}
			>
				<Stack.Screen
					name="Main"
					component={MainTabNavigator}
					options={{headerShown: false}}
				/>
				<Stack.Screen
					name="NearbyAirports"
					component={NearbyAirportsScreen}
					options={{
						title: 'Nearby Airports',
						presentation: 'modal',
					}}
				/>
				<Stack.Screen
					name="LanguageSelector"
					component={LanguageSelector}
					options={{
						title: 'Select Language',
						presentation: 'modal',
					}}
				/>
				<Stack.Screen
					name="FlightDetails"
					component={FlightDetailsScreen}
					options={{
						title: 'Flight Details',
						presentation: 'card',
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default AppNavigator; 