import React from 'react';
import {StyleSheet, ViewStyle, View} from 'react-native';
import {Card as PaperCard, CardProps as PaperCardProps} from 'react-native-paper';

interface CustomCardProps {
	variant?: 'elevated' | 'filled' | 'outlined';
	padding?: 'none' | 'small' | 'medium' | 'large';
	margin?: 'none' | 'small' | 'medium' | 'large';
	children: React.ReactNode;
	onPress?: () => void;
	style?: ViewStyle;
}

export const CustomCard: React.FC<CustomCardProps> = ({
	variant = 'elevated',
	padding = 'medium',
	margin = 'small',
	children,
	onPress,
	style,
	...props
}) => {
	const getCardStyle = (): ViewStyle => {
		const baseStyle: ViewStyle = {
			borderRadius: 12,
		};

		// Margin
		switch (margin) {
			case 'none':
				break;
			case 'small':
				baseStyle.margin = 8;
				break;
			case 'medium':
				baseStyle.margin = 16;
				break;
			case 'large':
				baseStyle.margin = 24;
				break;
		}

		// Variant-specific styles
		switch (variant) {
			case 'elevated':
				baseStyle.shadowColor = '#000';
				baseStyle.shadowOffset = {width: 0, height: 2};
				baseStyle.shadowOpacity = 0.25;
				baseStyle.shadowRadius = 4;
				break;
			case 'filled':
				baseStyle.backgroundColor = '#f5f5f5';
				break;
			case 'outlined':
				baseStyle.borderWidth = 1;
				baseStyle.borderColor = '#e0e0e0';
				break;
		}

		return baseStyle;
	};

	const getContentStyle = (): ViewStyle => {
		switch (padding) {
			case 'none':
				return {};
			case 'small':
				return {padding: 8};
			case 'medium':
				return {padding: 16};
			case 'large':
				return {padding: 24};
			default:
				return {padding: 16};
		}
	};

	if (onPress) {
		return (
			<PaperCard
				mode={variant === 'outlined' ? 'outlined' : 'contained'}
				onPress={onPress}
				style={[getCardStyle(), style]}
			>
				<View style={getContentStyle()}>
					{children}
				</View>
			</PaperCard>
		);
	}

	return (
		<PaperCard
			mode={variant === 'outlined' ? 'outlined' : 'contained'}
			style={[getCardStyle(), style]}
		>
			<View style={getContentStyle()}>
				{children}
			</View>
		</PaperCard>
	);
};

const styles = StyleSheet.create({
	// Additional styles if needed
});

export default CustomCard; 