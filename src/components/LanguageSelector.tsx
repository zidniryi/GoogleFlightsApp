import React, {useState} from 'react';
import {StyleSheet, View, ScrollView, Pressable} from 'react-native';
import {Modal, Portal, IconButton, Divider, Searchbar} from 'react-native-paper';
import {useLocale} from '../context/LocaleContext';
import {Locale} from '../types';
import {CustomButton} from './CustomButton';
import {CustomText} from './CustomText';
import {CustomCard} from './CustomCard';
import {LoadingSpinner} from './LoadingSpinner';
import {EmptyState} from './EmptyState';
import {SafeAreaContainer} from './SafeAreaContainer';

interface LanguageSelectorProps {
	variant?: 'button' | 'card' | 'inline';
	showLabel?: boolean;
	onLanguageChange?: (locale: Locale) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
	variant = 'button',
	showLabel = true,
	onLanguageChange,
}) => {
	const {currentLocale, availableLocales, setLocale, loading, error, refreshLocales} = useLocale();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	const handleLocaleSelect = async (locale: Locale) => {
		await setLocale(locale);
		onLanguageChange?.(locale);
		setIsModalVisible(false);
		setSearchQuery('');
	};

	const filteredLocales = availableLocales.filter(locale =>
		locale.text.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const popularLocales = [
		'en-US', 'es-ES', 'fr-FR', 'de-DE', 'zh-CN', 'ja-JP', 'ar-AE', 'hi-IN'
	];

	const popularLanguages = availableLocales.filter(locale =>
		popularLocales.includes(locale.id)
	).slice(0, 4);

	const shouldShowPopular = searchQuery.length === 0 && popularLanguages.length > 0;

	const renderTrigger = () => {
		switch (variant) {
			case 'card':
				return (
					<CustomCard
						variant="outlined"
						padding="medium"
						onPress={() => setIsModalVisible(true)}
						style={styles.cardTrigger}
					>
						<View style={styles.cardContent}>
							<View style={styles.cardLeft}>
								<View style={styles.triggerFlagContainer}>
									<CustomText variant="titleMedium" style={styles.triggerFlag}>
										{getLanguageFlag(currentLocale?.id || 'en-US')}
									</CustomText>
								</View>
								<View>
									{showLabel && (
										<CustomText variant="labelMedium" color="secondary" style={styles.cardLabel}>
											Language
										</CustomText>
									)}
									<CustomText variant="bodyLarge" weight="medium" color="primary">
										{currentLocale?.text || 'Select Language'}
									</CustomText>
									<CustomText variant="bodySmall" color="secondary" style={styles.cardLocaleCode}>
										{currentLocale?.id || 'Not selected'}
									</CustomText>
								</View>
							</View>
							<IconButton icon="chevron-right" size={24} iconColor="#1976d2" />
						</View>
					</CustomCard>
				);

			case 'inline':
				return (
					<Pressable
						style={styles.inlineContainer}
						onPress={() => setIsModalVisible(true)}
						android_ripple={{color: '#e3f2fd'}}
					>
						<View style={styles.inlineLeft}>
							<CustomText variant="titleSmall" style={styles.inlineFlag}>
								{getLanguageFlag(currentLocale?.id || 'en-US')}
							</CustomText>
							{showLabel && (
								<CustomText variant="labelMedium" color="secondary" style={styles.inlineLabel}>
									Language:
								</CustomText>
							)}
							<CustomText variant="bodyMedium" color="primary" weight="medium">
								{currentLocale?.text || 'Select Language'}
							</CustomText>
						</View>
						<IconButton icon="chevron-down" size={20} iconColor="#1976d2" style={styles.inlineIcon} />
					</Pressable>
				);

			default:
				return (
					<CustomButton
						variant="outline"
						onPress={() => setIsModalVisible(true)}
						style={styles.button}
					>
						{getLanguageFlag(currentLocale?.id || 'en-US')} {currentLocale?.text || 'Select Language'}
					</CustomButton>
				);
		}
	};

	const getLanguageFlag = (localeId: string) => {
		const flagMap: Record<string, string> = {
			'en-US': '🇺🇸', 'en-GB': '🇬🇧', 'es-ES': '🇪🇸', 'fr-FR': '🇫🇷', 'de-DE': '🇩🇪',
			'it-IT': '🇮🇹', 'pt-BR': '🇧🇷', 'ru-RU': '🇷🇺', 'ja-JP': '🇯🇵', 'ko-KR': '🇰🇷',
			'zh-CN': '🇨🇳', 'zh-TW': '🇹🇼', 'hi-IN': '🇮🇳', 'ar-AE': '🇦🇪', 'th-TH': '🇹🇭',
			'vi-VN': '🇻🇳', 'tr-TR': '🇹🇷', 'nl-NL': '🇳🇱', 'sv-SE': '🇸🇪', 'da-DK': '🇩🇰',
			'nb-NO': '🇳🇴', 'pl-PL': '🇵🇱', 'fi-FI': '🇫🇮', 'id-ID': '🇮🇩', 'he-IL': '🇮🇱',
			'el-GR': '🇬🇷', 'ro-RO': '🇷🇴', 'hu-HU': '🇭🇺', 'cs-CZ': '🇨🇿', 'sk-SK': '🇸🇰',
			'uk-UA': '🇺🇦', 'hr-HR': '🇭🇷', 'ms-MY': '🇲🇾', 'ca-ES': '🏴‍☠️'
		};
		return flagMap[localeId] || '🌐';
	};

	const renderLanguageItem = (locale: Locale, index: number) => {
		const isSelected = currentLocale?.id === locale.id;

		return (
			<Pressable
				key={locale.id}
				style={[
					styles.languageItem,
					isSelected && styles.selectedLanguageItem,
					index === 0 && styles.firstLanguageItem,
					index === filteredLocales.length - 1 && styles.lastLanguageItem
				]}
				onPress={() => handleLocaleSelect(locale)}
				android_ripple={{color: '#e3f2fd'}}
			>
				<View style={styles.languageItemLeft}>
					<View style={styles.flagContainer}>
						<CustomText variant="titleLarge" style={styles.flag}>
							{getLanguageFlag(locale.id)}
						</CustomText>
					</View>
					<View style={styles.languageContent}>
						<CustomText
							variant="bodyLarge"
							weight={isSelected ? "bold" : "medium"}
							color={isSelected ? "primary" : "onSurface"}
						>
							{locale.text}
						</CustomText>
						<CustomText
							variant="bodySmall"
							color={isSelected ? "primary" : "secondary"}
							style={styles.localeCode}
						>
							{locale.id}
						</CustomText>
					</View>
				</View>
				{isSelected && (
					<View style={styles.checkContainer}>
						<IconButton
							icon="check-circle"
							size={24}
							iconColor="#1976d2"
							style={styles.checkIcon}
						/>
					</View>
				)}
			</Pressable>
		);
	};

	return (
		<>
			{renderTrigger()}

			<Portal>
				<Modal
					visible={isModalVisible}
					onDismiss={() => setIsModalVisible(false)}
					contentContainerStyle={styles.modalContainer}
				>
					<SafeAreaContainer padding="none" backgroundColor="transparent">
						<View style={styles.modalContent}>
							{/* Header */}
							<View style={styles.modalHeader}>
								<CustomText variant="headlineSmall" weight="bold">
									Select Language
								</CustomText>
								<IconButton
									icon="close"
									size={24}
									onPress={() => setIsModalVisible(false)}
								/>
							</View>

							<Divider />

							{/* Search */}
							<View style={styles.searchContainer}>
								<Searchbar
									placeholder="Search languages..."
									value={searchQuery}
									onChangeText={setSearchQuery}
									style={styles.searchBar}
									iconColor="#1976d2"
									placeholderTextColor="#999"
									inputStyle={styles.searchInput}
								/>
								{searchQuery.length > 0 && (
									<CustomText variant="bodySmall" color="secondary" style={styles.searchResults}>
										{filteredLocales.length} language{filteredLocales.length !== 1 ? 's' : ''} found
									</CustomText>
								)}
							</View>

							{/* Content */}
							<View style={styles.languageList}>
								{loading ? (
									<View style={styles.loadingContainer}>
										<LoadingSpinner
											size="large"
											message="Loading languages..."
											style={styles.loader}
										/>
										<View style={styles.loadingShimmer}>
											{[...Array(6)].map((_, index) => (
												<View key={index} style={styles.shimmerItem}>
													<View style={styles.shimmerFlag} />
													<View style={styles.shimmerContent}>
														<View style={styles.shimmerTitle} />
														<View style={styles.shimmerSubtitle} />
													</View>
												</View>
											))}
										</View>
									</View>
								) : error ? (
									<EmptyState
										title="Failed to Load Languages"
										description={error}
										actionLabel="Retry"
										onAction={refreshLocales}
									/>
								) : filteredLocales.length === 0 ? (
									<View style={styles.emptyStateContainer}>
										<EmptyState
											title="No Languages Found"
											description={`No languages match "${searchQuery}". Try a different search term.`}
											actionLabel="Clear Search"
											onAction={() => setSearchQuery('')}
										/>
									</View>
								) : (
									<ScrollView
										showsVerticalScrollIndicator={false}
										style={styles.scrollView}
										contentContainerStyle={styles.scrollContent}
									>
										{shouldShowPopular && (
											<View style={styles.popularSection}>
												<CustomText variant="labelLarge" weight="medium" style={styles.popularTitle}>
													Popular Languages
												</CustomText>
												<View style={styles.popularGrid}>
													{popularLanguages.map((locale) => (
														<Pressable
															key={`popular-${locale.id}`}
															style={[
																styles.popularItem,
																currentLocale?.id === locale.id && styles.popularItemSelected
															]}
															onPress={() => handleLocaleSelect(locale)}
															android_ripple={{color: '#e3f2fd'}}
														>
															<CustomText variant="titleMedium" style={styles.popularFlag}>
																{getLanguageFlag(locale.id)}
															</CustomText>
															<CustomText
																variant="bodySmall"
																weight="medium"
																numberOfLines={1}
																style={styles.popularText}
															>
																{locale.text.replace(/\s*\([^)]*\)/g, '')}
															</CustomText>
														</Pressable>
													))}
												</View>
												<View style={styles.divider} />
												<CustomText variant="labelLarge" weight="medium" style={styles.allLanguagesTitle}>
													All Languages
												</CustomText>
											</View>
										)}

										<View style={styles.languageListContainer}>
											{filteredLocales.map((locale, index) => renderLanguageItem(locale, index))}
										</View>
									</ScrollView>
								)}
							</View>

							{/* Footer */}
							<View style={styles.modalFooter}>
								<CustomButton
									variant="text"
									onPress={() => setIsModalVisible(false)}
									fullWidth
								>
									Cancel
								</CustomButton>
							</View>
						</View>
					</SafeAreaContainer>
				</Modal>
			</Portal>
		</>
	);
};

// Convenience components
export const LanguageButton: React.FC<Omit<LanguageSelectorProps, 'variant'>> = (props) => (
	<LanguageSelector variant="button" {...props} />
);

export const LanguageCard: React.FC<Omit<LanguageSelectorProps, 'variant'>> = (props) => (
	<LanguageSelector variant="card" {...props} />
);

export const LanguageInline: React.FC<Omit<LanguageSelectorProps, 'variant'>> = (props) => (
	<LanguageSelector variant="inline" {...props} />
);

const styles = StyleSheet.create({
	button: {
		alignSelf: 'flex-start',
		borderRadius: 12,
		borderColor: '#e3f2fd',
	},
	cardTrigger: {
		borderColor: '#e3f2fd',
		borderWidth: 1.5,
	},
	cardContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	cardLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	cardLabel: {
		marginBottom: 2,
	},
	cardLocaleCode: {
		marginTop: 2,
		fontFamily: 'monospace',
	},
	triggerFlagContainer: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: '#f0f7ff',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},
	triggerFlag: {
		fontSize: 18,
	},
	inlineContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 12,
		paddingHorizontal: 16,
		backgroundColor: '#f8f9fa',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e9ecef',
	},
	inlineLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	inlineFlag: {
		fontSize: 16,
		marginRight: 8,
	},
	inlineLabel: {
		marginRight: 8,
	},
	inlineIcon: {
		margin: 0,
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'rgba(0,0,0,0.6)',
		paddingHorizontal: 16,
	},
	modalContent: {
		backgroundColor: 'white',
		borderRadius: 20,
		maxHeight: '85%',
		overflow: 'hidden',
		elevation: 8,
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 4},
		shadowOpacity: 0.3,
		shadowRadius: 8,
		height: "80%"
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingTop: 20,
		paddingBottom: 12,
		backgroundColor: '#fafafa',
	},
	searchContainer: {
		padding: 20,
		paddingBottom: 12,
	},
	searchBar: {
		elevation: 0,
		backgroundColor: '#f8f9fa',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e9ecef',
	},
	searchInput: {
		fontSize: 16,
		paddingHorizontal: 8,
	},
	searchResults: {
		marginTop: 8,
		textAlign: 'center',
	},
	languageList: {
		flex: 1,
		minHeight: 200,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: 8,
	},
	languageListContainer: {
		marginHorizontal: 12,
	},
	languageItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 14,
		marginVertical: 1,
		borderRadius: 12,
		backgroundColor: '#ffffff',
		borderWidth: 1,
		borderColor: 'transparent',
	},
	selectedLanguageItem: {
		backgroundColor: '#e3f2fd',
		borderColor: '#1976d2',
		borderWidth: 1,
	},
	firstLanguageItem: {
		marginTop: 4,
	},
	lastLanguageItem: {
		marginBottom: 8,
	},
	languageItemLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	flagContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#f8f9fa',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},
	flag: {
		fontSize: 20,
	},
	languageContent: {
		flex: 1,
	},
	localeCode: {
		marginTop: 2,
		fontFamily: 'monospace',
	},
	checkContainer: {
		marginLeft: 8,
	},
	checkIcon: {
		margin: 0,
	},
	modalFooter: {
		padding: 20,
		borderTopWidth: 1,
		borderTopColor: '#e9ecef',
		backgroundColor: '#fafafa',
	},
	loader: {
		paddingVertical: 40,
	},
	loadingContainer: {
		flex: 1,
	},
	loadingShimmer: {
		paddingHorizontal: 12,
		gap: 8,
	},
	shimmerItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 14,
		backgroundColor: '#f8f9fa',
		borderRadius: 12,
		marginVertical: 1,
	},
	shimmerFlag: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#e9ecef',
		marginRight: 12,
	},
	shimmerContent: {
		flex: 1,
	},
	shimmerTitle: {
		height: 16,
		backgroundColor: '#e9ecef',
		borderRadius: 4,
		marginBottom: 6,
		width: '70%',
	},
	shimmerSubtitle: {
		height: 12,
		backgroundColor: '#f1f3f4',
		borderRadius: 4,
		width: '40%',
	},
	emptyStateContainer: {
		flex: 1,
		paddingHorizontal: 20,
	},
	popularSection: {
		paddingHorizontal: 12,
		paddingTop: 8,
		paddingBottom: 16,
	},
	popularTitle: {
		marginBottom: 12,
		paddingHorizontal: 4,
		color: '#666',
	},
	popularGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
	},
	popularItem: {
		flex: 1,
		minWidth: '47%',
		maxWidth: '48%',
		backgroundColor: '#f8f9fa',
		borderRadius: 12,
		padding: 12,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: 'transparent',
	},
	popularItemSelected: {
		backgroundColor: '#e3f2fd',
		borderColor: '#1976d2',
	},
	popularFlag: {
		fontSize: 24,
		marginBottom: 4,
	},
	popularText: {
		textAlign: 'center',
		color: '#333',
	},
	divider: {
		height: 1,
		backgroundColor: '#e9ecef',
		marginVertical: 16,
		marginHorizontal: 4,
	},
	allLanguagesTitle: {
		paddingHorizontal: 4,
		color: '#666',
		marginBottom: 8,
	},
});

export default LanguageSelector; 