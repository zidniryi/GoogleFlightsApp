import React from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	Alert,
} from 'react-native';
import {
	Text,
	Card,
	Title,
	Button,
	Avatar,
	List,
	Divider,
} from 'react-native-paper';
import {useAuth} from '../../context/AuthContext';
import {useLocale} from '../../context/LocaleContext';
import {LanguageCard} from '../../components';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {MainTabParamList, Locale} from '../../types';

type ProfileScreenNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Profile'>;

interface Props {
	navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<Props> = ({navigation}) => {
	const {user, logout, loading} = useAuth();
	const {currentLocale} = useLocale();

	const handleLogout = () => {
		Alert.alert(
			'Logout',
			'Are you sure you want to logout?',
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'Logout',
					style: 'destructive',
					onPress: async () => {
						try {
							await logout();
						} catch (error) {
							console.error('Logout error:', error);
						}
					},
				},
			]
		);
	};

	if (!user) {
		return (
			<View style={styles.emptyContainer}>
				<Title>No user data available</Title>
			</View>
		);
	}

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map(word => word.charAt(0))
			.join('')
			.toUpperCase()
			.substring(0, 2);
	};

	const handleLanguageChange = (locale: Locale) => {
		Alert.alert(
			'Language Changed',
			`Language changed to ${locale.text}. Some features may require an app restart.`,
			[{text: 'OK'}]
		);
	};

	return (
		<ScrollView style={styles.container}>
			{/* User Info Card */}
			<Card style={styles.userCard}>
				<Card.Content>
					<View style={styles.userHeader}>
						<Avatar.Text
							size={64}
							label={getInitials(user.name)}
							style={styles.avatar}
						/>
						<View style={styles.userInfo}>
							<Title style={styles.userName}>{user.name}</Title>
							<Text style={styles.userEmail}>{user.email}</Text>
						</View>
					</View>
				</Card.Content>
			</Card>

			{/* Language Settings */}
			<Card style={styles.menuCard}>
				<Card.Content>
					<Title style={styles.menuTitle}>Settings</Title>

					<View style={styles.languageSection}>
						<Text style={styles.sectionLabel}>Language</Text>
						<LanguageCard
							showLabel={false}
							onLanguageChange={handleLanguageChange}
						/>
					</View>
				</Card.Content>
			</Card>

			{/* Menu Options */}
			<Card style={styles.menuCard}>
				<Card.Content>
					<Title style={styles.menuTitle}>Account</Title>

					<List.Item
						title="Trip History"
						description="View your past bookings"
						left={props => <List.Icon {...props} icon="airplane" />}
						right={props => <List.Icon {...props} icon="chevron-right" />}
						onPress={() => {
							Alert.alert('Coming Soon', 'Trip history feature will be available soon!');
						}}
					/>

					<Divider />

					<List.Item
						title="Saved Flights"
						description="Your bookmarked flights"
						left={props => <List.Icon {...props} icon="heart" />}
						right={props => <List.Icon {...props} icon="chevron-right" />}
						onPress={() => {
							Alert.alert('Coming Soon', 'Saved flights feature will be available soon!');
						}}
					/>

					<Divider />

					<List.Item
						title="Payment Methods"
						description="Manage your payment options"
						left={props => <List.Icon {...props} icon="credit-card" />}
						right={props => <List.Icon {...props} icon="chevron-right" />}
						onPress={() => {
							Alert.alert('Coming Soon', 'Payment management feature will be available soon!');
						}}
					/>

					<Divider />

					<List.Item
						title="Notifications"
						description="Manage notification preferences"
						left={props => <List.Icon {...props} icon="bell" />}
						right={props => <List.Icon {...props} icon="chevron-right" />}
						onPress={() => {
							Alert.alert('Coming Soon', 'Notification settings will be available soon!');
						}}
					/>
				</Card.Content>
			</Card>

			{/* Support & Info */}
			<Card style={styles.menuCard}>
				<Card.Content>
					<Title style={styles.menuTitle}>Support & Information</Title>

					<List.Item
						title="Help & Support"
						description="Get help with your account"
						left={props => <List.Icon {...props} icon="help-circle" />}
						right={props => <List.Icon {...props} icon="chevron-right" />}
						onPress={() => {
							Alert.alert('Help & Support', 'Contact our support team at support@googleflights.com');
						}}
					/>

					<Divider />

					<List.Item
						title="About"
						description="App version and information"
						left={props => <List.Icon {...props} icon="information" />}
						right={props => <List.Icon {...props} icon="chevron-right" />}
						onPress={() => {
							Alert.alert('About', 'Google Flights Mobile App\nVersion 1.0.0\n\nBuilt with React Native & Expo');
						}}
					/>

					<Divider />

					<List.Item
						title="Privacy Policy"
						description="Read our privacy policy"
						left={props => <List.Icon {...props} icon="shield-check" />}
						right={props => <List.Icon {...props} icon="chevron-right" />}
						onPress={() => {
							Alert.alert('Privacy Policy', 'Privacy policy would be displayed here in a real app.');
						}}
					/>
				</Card.Content>
			</Card>

			{/* Logout Button */}
			<View style={styles.logoutContainer}>
				<Button
					mode="contained"
					onPress={handleLogout}
					loading={loading}
					style={styles.logoutButton}
					buttonColor="#d32f2f"
					icon="logout"
				>
					Logout
				</Button>
			</View>

			{/* App Info */}
			<View style={styles.appInfo}>
				<Text style={styles.appInfoText}>
					This is a demo app built with React Native and Expo
				</Text>
				<Text style={styles.appInfoText}>
					Uses Sky-Scrapper API for flight data
				</Text>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	userCard: {
		margin: 16,
		elevation: 2,
	},
	userHeader: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	avatar: {
		marginRight: 16,
	},
	userInfo: {
		flex: 1,
	},
	userName: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 4,
	},
	userEmail: {
		fontSize: 16,
		color: '#666',
	},
	menuCard: {
		marginHorizontal: 16,
		marginBottom: 16,
		elevation: 2,
	},
	menuTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	logoutContainer: {
		padding: 16,
	},
	logoutButton: {
		paddingVertical: 8,
	},
	appInfo: {
		padding: 16,
		alignItems: 'center',
	},
	appInfoText: {
		fontSize: 12,
		color: '#999',
		textAlign: 'center',
		marginBottom: 4,
	},
	languageSection: {
		marginBottom: 16,
	},
	sectionLabel: {
		fontSize: 16,
		fontWeight: '500',
		marginBottom: 8,
		color: '#333',
	},
});

export default ProfileScreen; 