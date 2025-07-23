import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ActivityIndicator, View} from 'react-native';
import {Icon} from 'react-native-paper';

import {useAuth} from '../context/AuthContext';
import {RootStackParamList, AuthStackParamList, MainTabParamList} from '../types';

// Auth Screens
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';

// Main Screens
import FlightSearchScreen from '../screens/main/FlightSearchScreen';
import FlightResultsScreen from '../screens/main/FlightResultsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const RootStack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

// Auth Navigator
const AuthNavigator = () => {
	return (
		<AuthStack.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			<AuthStack.Screen name="SignIn" component={SignInScreen} />
			<AuthStack.Screen name="SignUp" component={SignUpScreen} />
		</AuthStack.Navigator>
	);
};

// Main Tab Navigator
const MainTabNavigator = () => {
	return (
		<MainTab.Navigator
			screenOptions={({route}) => ({
				tabBarIcon: ({focused, color, size}) => {
					let iconName: string;

					if (route.name === 'Search') {
						iconName = 'airplane-search';
					} else if (route.name === 'Results') {
						iconName = 'format-list-bulleted';
					} else if (route.name === 'Profile') {
						iconName = 'account';
					} else {
						iconName = 'help';
					}

					return <Icon source={iconName} size={size} color={color} />;
				},
				tabBarActiveTintColor: '#1976d2',
				tabBarInactiveTintColor: '#666',
				headerStyle: {
					backgroundColor: '#1976d2',
				},
				headerTintColor: '#fff',
				headerTitleStyle: {
					fontWeight: 'bold',
				},
			})}
		>
			<MainTab.Screen
				name="Search"
				component={FlightSearchScreen}
				options={{
					title: 'Search Flights',
					tabBarLabel: 'Search',
				}}
			/>
			<MainTab.Screen
				name="Results"
				component={FlightResultsScreen}
				options={{
					title: 'Flight Results',
					tabBarLabel: 'Results',
				}}
			/>
			<MainTab.Screen
				name="Profile"
				component={ProfileScreen}
				options={{
					title: 'Profile',
					tabBarLabel: 'Profile',
				}}
			/>
		</MainTab.Navigator>
	);
};

// Loading Screen
const LoadingScreen = () => {
	return (
		<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
			<ActivityIndicator size="large" color="#1976d2" />
		</View>
	);
};

// Root Navigator
const AppNavigator = () => {
	const {user, loading} = useAuth();

	if (loading) {
		return <LoadingScreen />;
	}

	return (
		<NavigationContainer>
			<RootStack.Navigator screenOptions={{headerShown: false}}>
				{user ? (
					<RootStack.Screen name="Main" component={MainTabNavigator} />
				) : (
					<RootStack.Screen name="Auth" component={AuthNavigator} />
				)}
			</RootStack.Navigator>
		</NavigationContainer>
	);
};

export default AppNavigator; 