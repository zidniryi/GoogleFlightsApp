import React from 'react';
import {StyleSheet, TextStyle} from 'react-native';
import {Text as PaperText, TextProps as PaperTextProps} from 'react-native-paper';

interface CustomTextProps {
	variant?:
	| 'displayLarge'
	| 'displayMedium'
	| 'displaySmall'
	| 'headlineLarge'
	| 'headlineMedium'
	| 'headlineSmall'
	| 'titleLarge'
	| 'titleMedium'
	| 'titleSmall'
	| 'bodyLarge'
	| 'bodyMedium'
	| 'bodySmall'
	| 'labelLarge'
	| 'labelMedium'
	| 'labelSmall';
	color?: 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'disabled' | 'onSurface';
	weight?: 'normal' | 'bold' | 'light' | 'medium';
	align?: 'left' | 'center' | 'right' | 'justify';
	numberOfLines?: number;
	children: React.ReactNode;
	style?: TextStyle;
}

export const CustomText: React.FC<CustomTextProps> = ({
	variant = 'bodyMedium',
	color = 'onSurface',
	weight = 'normal',
	align = 'left',
	numberOfLines,
	children,
	style,
}) => {
	const getTextStyle = (): TextStyle => {
		const baseStyle: TextStyle = {
			textAlign: align,
		};

		// Font weight
		switch (weight) {
			case 'light':
				baseStyle.fontWeight = '300';
				break;
			case 'normal':
				baseStyle.fontWeight = '400';
				break;
			case 'medium':
				baseStyle.fontWeight = '500';
				break;
			case 'bold':
				baseStyle.fontWeight = '700';
				break;
		}

		// Color mapping
		switch (color) {
			case 'primary':
				baseStyle.color = '#1976d2';
				break;
			case 'secondary':
				baseStyle.color = '#03dac4';
				break;
			case 'error':
				baseStyle.color = '#d32f2f';
				break;
			case 'warning':
				baseStyle.color = '#ff9800';
				break;
			case 'success':
				baseStyle.color = '#4caf50';
				break;
			case 'disabled':
				baseStyle.color = '#9e9e9e';
				break;
			case 'onSurface':
				baseStyle.color = '#000000';
				break;
		}

		return baseStyle;
	};

	return (
		<PaperText
			variant={variant}
			numberOfLines={numberOfLines}
			style={[getTextStyle(), style]}
		>
			{children}
		</PaperText>
	);
};

// Convenience components for common use cases
export const Heading1: React.FC<Omit<CustomTextProps, 'variant'>> = (props) => (
	<CustomText variant="headlineLarge" weight="bold" {...props} />
);

export const Heading2: React.FC<Omit<CustomTextProps, 'variant'>> = (props) => (
	<CustomText variant="headlineMedium" weight="bold" {...props} />
);

export const Heading3: React.FC<Omit<CustomTextProps, 'variant'>> = (props) => (
	<CustomText variant="headlineSmall" weight="medium" {...props} />
);

export const BodyText: React.FC<Omit<CustomTextProps, 'variant'>> = (props) => (
	<CustomText variant="bodyMedium" {...props} />
);

export const Caption: React.FC<Omit<CustomTextProps, 'variant'>> = (props) => (
	<CustomText variant="bodySmall" color="secondary" {...props} />
);

const styles = StyleSheet.create({
	// Additional styles if needed
});

export default CustomText; 