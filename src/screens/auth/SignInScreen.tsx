import React, {useState} from 'react';
import {
	View,
	StyleSheet,
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from 'react-native';
import {
	TextInput,
	Button,
	Text,
	Card,
	Title,
	Paragraph,
	HelperText,
} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useAuth} from '../../context/AuthContext';
import {SignInFormValues} from '../../types';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../../types';
import {Colors} from '../../themes/Colors';

type SignInScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignIn'>;

interface Props {
	navigation: SignInScreenNavigationProp;
}

// Validation Schema
const signInValidationSchema = Yup.object().shape({
	email: Yup.string()
		.email('Please enter a valid email')
		.required('Email is required'),
	password: Yup.string()
		.min(6, 'Password must be at least 6 characters')
		.required('Password is required'),
});

const SignInScreen: React.FC<Props> = ({navigation}) => {
	const {login, loading} = useAuth();
	const [showPassword, setShowPassword] = useState(false);

	const handleSignIn = async (values: SignInFormValues) => {
		try {
			await login(values.email, values.password);
		} catch (error: any) {
			Alert.alert('Sign In Failed', error.message);
		}
	};

	const initialValues: SignInFormValues = {
		email: '',
		password: '',
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<Card style={styles.card}>
					<Card.Content>
						<View style={styles.header}>
							<Title style={styles.title}>Welcome Back</Title>
							<Paragraph style={styles.subtitle}>
								Sign in to search and book flights
							</Paragraph>
						</View>

						<Formik
							initialValues={initialValues}
							validationSchema={signInValidationSchema}
							onSubmit={handleSignIn}
						>
							{({
								handleChange,
								handleBlur,
								handleSubmit,
								values,
								errors,
								touched,
								isValid,
							}) => (
								<View style={styles.form}>
									<TextInput
										label="Email"
										value={values.email}
										onChangeText={handleChange('email')}
										onBlur={handleBlur('email')}
										mode="outlined"
										keyboardType="email-address"
										autoCapitalize="none"
										autoComplete="email"
										error={touched.email && !!errors.email}
										style={styles.input}
									/>
									<HelperText type="error" visible={touched.email && !!errors.email}>
										{errors.email}
									</HelperText>

									<TextInput
										label="Password"
										value={values.password}
										onChangeText={handleChange('password')}
										onBlur={handleBlur('password')}
										mode="outlined"
										secureTextEntry={!showPassword}
										autoComplete="password"
										error={touched.password && !!errors.password}
										style={styles.input}
										right={
											<TextInput.Icon
												icon={showPassword ? 'eye-off' : 'eye'}
												onPress={() => setShowPassword(!showPassword)}
											/>
										}
									/>
									<HelperText type="error" visible={touched.password && !!errors.password}>
										{errors.password}
									</HelperText>

									<Button
										mode="contained"
										onPress={handleSubmit as any}
										loading={loading}
										disabled={!isValid || loading}
										style={styles.signInButton}
										contentStyle={styles.buttonContent}
									>
										Sign In
									</Button>

									<View style={styles.footer}>
										<Text style={styles.footerText}>Don't have an account? </Text>
										<Button
											mode="text"
											onPress={() => navigation.navigate('SignUp')}
											compact
										>
											Sign Up
										</Button>
									</View>

									<View style={styles.demoInfo}>
										<Text style={styles.demoTitle}>Demo Credentials:</Text>
										<Text style={styles.demoText}>Email: john@example.com</Text>
										<Text style={styles.demoText}>Password: password123</Text>
									</View>
								</View>
							)}
						</Formik>
					</Card.Content>
				</Card>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background.default,
	},
	scrollContainer: {
		flexGrow: 1,
		justifyContent: 'center',
		padding: 16,
	},
	card: {
		elevation: 4,
		borderRadius: 12,
	},
	header: {
		alignItems: 'center',
		marginBottom: 24,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: Colors.text.secondary,
		textAlign: 'center',
	},
	form: {
		width: '100%',
	},
	input: {
		marginBottom: 4,
	},
	signInButton: {
		marginTop: 16,
		marginBottom: 16,
	},
	buttonContent: {
		paddingVertical: 8,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 16,
	},
	footerText: {
		fontSize: 14,
		color: Colors.text.secondary,
	},
	demoInfo: {
		marginTop: 24,
		padding: 16,
		backgroundColor: Colors.semantic.info.background,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: Colors.primary.light,
	},
	demoTitle: {
		fontSize: 14,
		fontWeight: 'bold',
		marginBottom: 8,
		color: Colors.primary.main,
	},
	demoText: {
		fontSize: 12,
		color: Colors.primary.main,
		marginBottom: 2,
	},
});

export default SignInScreen; 