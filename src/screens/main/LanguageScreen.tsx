import React from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {
	SafeAreaContainer,
	CustomText,
	Heading1,
	Heading2,
	BodyText,
	CustomCard,
	LanguageSelector,
	LanguageButton,
	LanguageCard,
	LanguageInline,
	LocaleApiDemo,
} from '../../components';
import {useLocale} from '../../context/LocaleContext';
import {Locale} from '../../types';

export const LanguageScreen: React.FC = () => {
	const {currentLocale} = useLocale();

	const handleLanguageChange = (locale: Locale) => {
		console.log('Language changed to:', locale);
		// You can add additional logic here, like:
		// - Showing a success toast
		// - Triggering app refresh
		// - Updating API calls with new locale
	};

	return (
		<SafeAreaContainer backgroundColor="#f5f5f5">
			<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

				{/* Header */}
				<CustomCard variant="elevated" padding="large" margin="medium">
					<View style={styles.headerContent}>
						<View style={styles.headerIcon}>
							<CustomText variant="displayMedium">🌐</CustomText>
						</View>
						<View style={styles.headerText}>
							<Heading1 color="primary">Language & Region</Heading1>
							<BodyText style={styles.description}>
								Choose your preferred language for the app interface and personalized flight search results.
							</BodyText>
						</View>
					</View>
				</CustomCard>

				{/* Current Language Info */}
				<CustomCard variant="filled" padding="medium" margin="small">
					<Heading2>Current Selection</Heading2>
					<View style={styles.currentLanguageCard}>
						<View style={styles.currentLanguageFlag}>
							<CustomText variant="headlineMedium">
								{currentLocale?.id === 'en-US' ? '🇺🇸' :
									currentLocale?.id === 'es-ES' ? '🇪🇸' :
										currentLocale?.id === 'fr-FR' ? '🇫🇷' :
											currentLocale?.id === 'de-DE' ? '🇩🇪' :
												currentLocale?.id === 'zh-CN' ? '🇨🇳' :
													currentLocale?.id === 'ja-JP' ? '🇯🇵' :
														currentLocale?.id === 'hi-IN' ? '🇮🇳' :
															currentLocale?.id === 'ar-AE' ? '🇦🇪' : '🌐'}
							</CustomText>
						</View>
						<View style={styles.currentLanguageDetails}>
							<CustomText variant="titleLarge" weight="bold" color="primary">
								{currentLocale?.text || 'No language selected'}
							</CustomText>
							<CustomText variant="bodyMedium" color="secondary" style={styles.currentLocaleCode}>
								Locale: {currentLocale?.id || 'N/A'}
							</CustomText>
							<CustomText variant="bodySmall" color="secondary" style={styles.currentStatus}>
								✓ Active for all app features
							</CustomText>
						</View>
					</View>
				</CustomCard>

				{/* Language Selector Variants */}
				<CustomCard variant="outlined" padding="medium" margin="small">
					<Heading2>Language Selector Variants</Heading2>
					<View style={styles.section}>

						{/* Button Variant */}
						<View style={styles.variant}>
							<CustomText variant="titleSmall" weight="medium" style={styles.variantTitle}>
								Button Variant
							</CustomText>
							<LanguageButton
								onLanguageChange={handleLanguageChange}
							/>
						</View>

						{/* Card Variant */}
						<View style={styles.variant}>
							<CustomText variant="titleSmall" weight="medium" style={styles.variantTitle}>
								Card Variant
							</CustomText>
							<LanguageCard
								onLanguageChange={handleLanguageChange}
							/>
						</View>

						{/* Inline Variant */}
						<View style={styles.variant}>
							<CustomText variant="titleSmall" weight="medium" style={styles.variantTitle}>
								Inline Variant
							</CustomText>
							<LanguageInline
								onLanguageChange={handleLanguageChange}
							/>
						</View>

						{/* Inline without label */}
						<View style={styles.variant}>
							<CustomText variant="titleSmall" weight="medium" style={styles.variantTitle}>
								Inline Without Label
							</CustomText>
							<LanguageInline
								showLabel={false}
								onLanguageChange={handleLanguageChange}
							/>
						</View>

					</View>
				</CustomCard>

				{/* Enhanced Features */}
				<CustomCard variant="elevated" padding="medium" margin="small">
					<Heading2>✨ Enhanced Features</Heading2>
					<View style={styles.featuresGrid}>
						<View style={styles.featureCard}>
							<View style={styles.featureIcon}>
								<CustomText variant="headlineSmall">🔍</CustomText>
							</View>
							<CustomText variant="titleSmall" weight="medium" style={styles.featureTitle}>
								Smart Search
							</CustomText>
							<BodyText style={styles.featureText}>
								Instant search through 45+ languages with real-time filtering
							</BodyText>
						</View>

						<View style={styles.featureCard}>
							<View style={styles.featureIcon}>
								<CustomText variant="headlineSmall">⚡</CustomText>
							</View>
							<CustomText variant="titleSmall" weight="medium" style={styles.featureTitle}>
								Quick Access
							</CustomText>
							<BodyText style={styles.featureText}>
								Popular languages grid for faster selection
							</BodyText>
						</View>

						<View style={styles.featureCard}>
							<View style={styles.featureIcon}>
								<CustomText variant="headlineSmall">💾</CustomText>
							</View>
							<CustomText variant="titleSmall" weight="medium" style={styles.featureTitle}>
								Auto-Save
							</CustomText>
							<BodyText style={styles.featureText}>
								Persistent storage with instant restoration
							</BodyText>
						</View>

						<View style={styles.featureCard}>
							<View style={styles.featureIcon}>
								<CustomText variant="headlineSmall">🌐</CustomText>
							</View>
							<CustomText variant="titleSmall" weight="medium" style={styles.featureTitle}>
								Live API
							</CustomText>
							<BodyText style={styles.featureText}>
								Real-time data from Sky Scrapper API
							</BodyText>
						</View>
					</View>
				</CustomCard>

				{/* API Integration Demo */}
				<LocaleApiDemo />

				{/* Usage Instructions */}
				<CustomCard variant="filled" padding="medium" margin="small">
					<Heading2>How to Use</Heading2>
					<View style={styles.section}>
						<BodyText style={styles.instruction}>
							1. Tap any language selector above to open the language picker
						</BodyText>
						<BodyText style={styles.instruction}>
							2. Use the search bar to quickly find a specific language
						</BodyText>
						<BodyText style={styles.instruction}>
							3. Tap on a language to select it - your choice will be saved automatically
						</BodyText>
						<BodyText style={styles.instruction}>
							4. The selected language will be used for future API calls and app localization
						</BodyText>
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
	headerContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	headerIcon: {
		marginRight: 16,
	},
	headerText: {
		flex: 1,
	},
	description: {
		marginTop: 8,
		lineHeight: 22,
	},
	currentLanguageCard: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 16,
		padding: 16,
		backgroundColor: '#f0f7ff',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e3f2fd',
	},
	currentLanguageFlag: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: '#ffffff',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 16,
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 1},
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	currentLanguageDetails: {
		flex: 1,
	},
	currentLocaleCode: {
		marginTop: 4,
		fontFamily: 'monospace',
	},
	currentStatus: {
		marginTop: 6,
	},
	section: {
		marginTop: 16,
		gap: 16,
	},
	variant: {
		gap: 8,
	},
	variantTitle: {
		marginBottom: 4,
	},
	featuresGrid: {
		marginTop: 16,
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 12,
	},
	featureCard: {
		flex: 1,
		minWidth: '45%',
		backgroundColor: '#ffffff',
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e9ecef',
		alignItems: 'center',
	},
	featureIcon: {
		marginBottom: 8,
	},
	featureTitle: {
		marginBottom: 6,
		textAlign: 'center',
	},
	featureText: {
		textAlign: 'center',
		fontSize: 13,
		lineHeight: 18,
	},
	instruction: {
		lineHeight: 20,
	},
	spacer: {
		height: 20,
	},
});

export default LanguageScreen; 