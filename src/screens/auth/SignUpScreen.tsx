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
import {SignUpFormValues} from '../../types';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../../types';

type SignUpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;

interface Props {
	navigation: SignUpScreenNavigationProp;
}

// Validation Schema
const signUpValidationSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, 'Name must be at least 2 characters')
		.required('Name is required'),
	email: Yup.string()
		.email('Please enter a valid email')
		.required('Email is required'),
	password: Yup.string()
		.min(6, 'Password must be at least 6 characters')
		.required('Password is required'),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('password')], 'Passwords must match')
		.required('Please confirm your password'),
});

const SignUpScreen: React.FC<Props> = ({navigation}) => {
	const {signup, loading} = useAuth();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleSignUp = async (values: SignUpFormValues) => {
		try {
			await signup(values.email, values.password, values.name);
		} catch (error: any) {
			Alert.alert('Sign Up Failed', error.message);
		}
	};

	const initialValues: SignUpFormValues = {
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
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
							<Title style={styles.title}>Create Account</Title>
							<Paragraph style={styles.subtitle}>
								Join us to start searching for the best flights
							</Paragraph>
						</View>

						<Formik
							initialValues={initialValues}
							validationSchema={signUpValidationSchema}
							onSubmit={handleSignUp}
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
										label="Full Name"
										value={values.name}
										onChangeText={handleChange('name')}
										onBlur={handleBlur('name')}
										mode="outlined"
										autoCapitalize="words"
										autoComplete="name"
										error={touched.name && !!errors.name}
										style={styles.input}
									/>
									<HelperText type="error" visible={touched.name && !!errors.name}>
										{errors.name}
									</HelperText>

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
										autoComplete="new-password"
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

									<TextInput
										label="Confirm Password"
										value={values.confirmPassword}
										onChangeText={handleChange('confirmPassword')}
										onBlur={handleBlur('confirmPassword')}
										mode="outlined"
										secureTextEntry={!showConfirmPassword}
										autoComplete="new-password"
										error={touched.confirmPassword && !!errors.confirmPassword}
										style={styles.input}
										right={
											<TextInput.Icon
												icon={showConfirmPassword ? 'eye-off' : 'eye'}
												onPress={() => setShowConfirmPassword(!showConfirmPassword)}
											/>
										}
									/>
									<HelperText type="error" visible={touched.confirmPassword && !!errors.confirmPassword}>
										{errors.confirmPassword}
									</HelperText>

									<Button
										mode="contained"
										onPress={handleSubmit as any}
										loading={loading}
										disabled={!isValid || loading}
										style={styles.signUpButton}
										contentStyle={styles.buttonContent}
									>
										Create Account
									</Button>

									<View style={styles.footer}>
										<Text style={styles.footerText}>Already have an account? </Text>
										<Button
											mode="text"
											onPress={() => navigation.navigate('SignIn')}
											compact
										>
											Sign In
										</Button>
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
		backgroundColor: '#f5f5f5',
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
		color: '#666',
		textAlign: 'center',
	},
	form: {
		width: '100%',
	},
	input: {
		marginBottom: 4,
	},
	signUpButton: {
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
		color: '#666',
	},
});

export default SignUpScreen; 