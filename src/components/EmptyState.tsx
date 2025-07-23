import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {CustomText} from './CustomText';
import {CustomButton} from './CustomButton';

interface EmptyStateProps {
	icon?: React.ReactNode;
	title: string;
	description?: string;
	actionLabel?: string;
	onAction?: () => void;
	style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
	icon,
	title,
	description,
	actionLabel,
	onAction,
	style,
}) => {
	return (
		<View style={[styles.container, style]}>
			{icon && (
				<View style={styles.iconContainer}>
					{icon}
				</View>
			)}

			<CustomText
				variant="headlineSmall"
				weight="medium"
				align="center"
				style={styles.title}
			>
				{title}
			</CustomText>

			{description && (
				<CustomText
					variant="bodyMedium"
					color="secondary"
					align="center"
					style={styles.description}
				>
					{description}
				</CustomText>
			)}

			{actionLabel && onAction && (
				<CustomButton
					variant="primary"
					onPress={onAction}
					style={styles.action}
				>
					{actionLabel}
				</CustomButton>
			)}
		</View>
	);
};

// Convenience components for common scenarios
export const NoFlightsFound: React.FC<{onRetry?: () => void}> = ({onRetry}) => (
	<EmptyState
		title="No flights found"
		description="Try adjusting your search criteria or dates to find available flights."
		actionLabel={onRetry ? "Search Again" : undefined}
		onAction={onRetry}
	/>
);

export const NoSearchResults: React.FC<{onClear?: () => void}> = ({onClear}) => (
	<EmptyState
		title="No results found"
		description="We couldn't find any flights matching your search. Please try different criteria."
		actionLabel={onClear ? "Clear Search" : undefined}
		onAction={onClear}
	/>
);

export const NetworkError: React.FC<{onRetry?: () => void}> = ({onRetry}) => (
	<EmptyState
		title="Connection Error"
		description="Please check your internet connection and try again."
		actionLabel={onRetry ? "Retry" : undefined}
		onAction={onRetry}
	/>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 32,
	},
	iconContainer: {
		marginBottom: 16,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		marginBottom: 8,
	},
	description: {
		marginBottom: 24,
		lineHeight: 20,
	},
	action: {
		minWidth: 120,
	},
});

export default EmptyState; 