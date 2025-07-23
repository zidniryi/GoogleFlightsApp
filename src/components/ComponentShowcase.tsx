import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {CustomButton} from './CustomButton';
import {CustomText, Heading1, Heading2, BodyText, Caption} from './CustomText';
import {CustomCard} from './CustomCard';
import {CustomInput} from './CustomInput';
import {LoadingSpinner} from './LoadingSpinner';
import {EmptyState} from './EmptyState';
import {SafeAreaContainer} from './SafeAreaContainer';

// Example component to showcase all reusable components
export const ComponentShowcase: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const [showEmpty, setShowEmpty] = useState(false);

	const handleLoadingDemo = () => {
		setLoading(true);
		setTimeout(() => setLoading(false), 2000);
	};

	return (
		<SafeAreaContainer backgroundColor="#f5f5f5">
			<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

				{/* Typography Section */}
				<CustomCard variant="elevated" padding="large" margin="medium">
					<Heading1 color="primary">Component Showcase</Heading1>
					<BodyText style={styles.sectionDescription}>
						This demonstrates all the reusable components in your app.
					</BodyText>
				</CustomCard>

				{/* Text Components */}
				<CustomCard variant="outlined" padding="medium" margin="small">
					<Heading2>Text Components</Heading2>
					<View style={styles.section}>
						<CustomText variant="headlineLarge" weight="bold">Headline Large Bold</CustomText>
						<CustomText variant="titleMedium" color="primary">Title Medium Primary</CustomText>
						<BodyText>This is regular body text for reading content.</BodyText>
						<Caption>This is caption text for secondary information</Caption>
					</View>
				</CustomCard>

				{/* Button Components */}
				<CustomCard variant="filled" padding="medium" margin="small">
					<Heading2>Button Components</Heading2>
					<View style={styles.section}>
						<CustomButton variant="primary" size="large" fullWidth>
							Primary Large Button
						</CustomButton>
						<CustomButton variant="secondary" size="medium">
							Secondary Medium
						</CustomButton>
						<CustomButton variant="outline" size="small">
							Outline Small
						</CustomButton>
						<CustomButton variant="danger" onPress={handleLoadingDemo}>
							Danger Button
						</CustomButton>
						<CustomButton variant="text" disabled>
							Disabled Text Button
						</CustomButton>
					</View>
				</CustomCard>

				{/* Input Components */}
				<CustomCard variant="elevated" padding="medium" margin="small">
					<Heading2>Input Components</Heading2>
					<View style={styles.section}>
						<CustomInput
							label="Email Address"
							variant="outlined"
							value={inputValue}
							onChangeText={setInputValue}
							placeholder="Enter your email"
							required
							helperText="We'll never share your email"
						/>
						<CustomInput
							label="Password"
							variant="flat"
							secureTextEntry
							state="error"
							helperText="Password must be at least 8 characters"
						/>
						<CustomInput
							label="Confirmed"
							variant="outlined"
							state="success"
							helperText="Looks good!"
							showHelperText={false}
						/>
					</View>
				</CustomCard>

				{/* Loading Components */}
				<CustomCard variant="outlined" padding="medium" margin="small">
					<Heading2>Loading Components</Heading2>
					<View style={styles.section}>
						{loading && (
							<LoadingSpinner
								size="large"
								message="Loading your data..."
							/>
						)}
						<CustomButton
							variant="primary"
							onPress={handleLoadingDemo}
							loading={loading}
						>
							{loading ? 'Loading...' : 'Start Loading Demo'}
						</CustomButton>
					</View>
				</CustomCard>

				{/* Empty State Components */}
				<CustomCard variant="filled" padding="medium" margin="small">
					<Heading2>Empty State Components</Heading2>
					<View style={styles.section}>
						<CustomButton
							variant="outline"
							onPress={() => setShowEmpty(!showEmpty)}
						>
							{showEmpty ? 'Hide' : 'Show'} Empty State
						</CustomButton>
						{showEmpty && (
							<View style={styles.emptyStateContainer}>
								<EmptyState
									title="No Data Found"
									description="There's nothing to show here yet. Try adding some content."
									actionLabel="Add Content"
									onAction={() => setShowEmpty(false)}
								/>
							</View>
						)}
					</View>
				</CustomCard>

				{/* Card Variants */}
				<CustomCard variant="elevated" padding="medium" margin="small">
					<Heading2>Card Variants</Heading2>
					<View style={styles.section}>
						<CustomCard variant="elevated" padding="small" margin="none">
							<BodyText>Elevated Card with Shadow</BodyText>
						</CustomCard>
						<CustomCard variant="filled" padding="small" margin="none">
							<BodyText>Filled Card with Background</BodyText>
						</CustomCard>
						<CustomCard variant="outlined" padding="small" margin="none">
							<BodyText>Outlined Card with Border</BodyText>
						</CustomCard>
					</View>
				</CustomCard>

				<View style={styles.spacer} />
			</ScrollView>
		</SafeAreaContainer>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	sectionDescription: {
		marginTop: 8,
		lineHeight: 20,
	},
	section: {
		marginTop: 16,
		gap: 12,
	},
	emptyStateContainer: {
		height: 200,
		marginTop: 12,
	},
	spacer: {
		height: 20,
	},
});

export default ComponentShowcase; 