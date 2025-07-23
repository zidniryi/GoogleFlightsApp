import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import * as SecureStore from 'expo-secure-store';
import {User, AuthContextType} from '../types';

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
	children: ReactNode;
}

// Secure Storage Keys
const USER_TOKEN_KEY = 'user_token';
const USER_DATA_KEY = 'user_data';

// Mock user data for development
const mockUsers = [
	{id: '1', email: 'john@example.com', password: 'password123', name: 'John Doe'},
	{id: '2', email: 'jane@example.com', password: 'password123', name: 'Jane Smith'},
];

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	// Check for existing token on app start
	useEffect(() => {
		checkAuthState();
	}, []);

	const checkAuthState = async () => {
		try {
			const token = await SecureStore.getItemAsync(USER_TOKEN_KEY);
			const userData = await SecureStore.getItemAsync(USER_DATA_KEY);

			if (token && userData) {
				const parsedUser = JSON.parse(userData);
				setUser({...parsedUser, token});
			}
		} catch (error) {
			console.error('Error checking auth state:', error);
		} finally {
			setLoading(false);
		}
	};

	const login = async (email: string, password: string): Promise<void> => {
		setLoading(true);
		try {
			// Mock authentication - in real app, this would call your API
			const mockUser = mockUsers.find(
				u => u.email === email && u.password === password
			);

			if (!mockUser) {
				throw new Error('Invalid email or password');
			}

			// Generate mock token
			const token = `mock_token_${Date.now()}_${mockUser.id}`;
			const userData: User = {
				id: mockUser.id,
				email: mockUser.email,
				name: mockUser.name,
				token,
			};

			// Store in secure storage
			await SecureStore.setItemAsync(USER_TOKEN_KEY, token);
			await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));

			setUser(userData);
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const signup = async (email: string, password: string, name: string): Promise<void> => {
		setLoading(true);
		try {
			// Mock signup - check if user already exists
			const existingUser = mockUsers.find(u => u.email === email);
			if (existingUser) {
				throw new Error('User with this email already exists');
			}

			// Create new mock user
			const newUser = {
				id: `${Date.now()}`,
				email,
				password,
				name,
			};

			// Add to mock users array (in real app, this would be sent to API)
			mockUsers.push(newUser);

			// Generate token and user data
			const token = `mock_token_${Date.now()}_${newUser.id}`;
			const userData: User = {
				id: newUser.id,
				email: newUser.email,
				name: newUser.name,
				token,
			};

			// Store in secure storage
			await SecureStore.setItemAsync(USER_TOKEN_KEY, token);
			await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));

			setUser(userData);
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const logout = async (): Promise<void> => {
		setLoading(true);
		try {
			// Clear secure storage
			await SecureStore.deleteItemAsync(USER_TOKEN_KEY);
			await SecureStore.deleteItemAsync(USER_DATA_KEY);

			setUser(null);
		} catch (error) {
			console.error('Error logging out:', error);
		} finally {
			setLoading(false);
		}
	};

	const value: AuthContextType = {
		user,
		login,
		signup,
		logout,
		loading,
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export default AuthContext; 