import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import {AuthStackParamList} from '../types';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
	return (
		<Stack.Navigator
			initialRouteName="SignIn"
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
				name="SignIn"
				component={SignInScreen}
				options={{
					title: 'Sign In',
					headerShown: false, // Usually auth screens don't show header
				}}
			/>
			<Stack.Screen
				name="SignUp"
				component={SignUpScreen}
				options={{
					title: 'Sign Up',
					headerShown: false,
				}}
			/>
		</Stack.Navigator>
	);
};

export default AuthNavigator; 