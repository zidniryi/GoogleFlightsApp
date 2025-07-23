import React from 'react';
import {StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {Button as PaperButton, ButtonProps as PaperButtonProps} from 'react-native-paper';

interface CustomButtonProps extends Omit<PaperButtonProps, 'mode'> {
	variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
	size?: 'small' | 'medium' | 'large';
	fullWidth?: boolean;
	loading?: boolean;
	disabled?: boolean;
	onPress?: () => void;
	children: React.ReactNode;
	style?: ViewStyle;
	textStyle?: TextStyle;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
	variant = 'primary',
	size = 'medium',
	fullWidth = false,
	loading = false,
	disabled = false,
	onPress,
	children,
	style,
	textStyle,
	...props
}) => {
	const getButtonMode = () => {
		switch (variant) {
			case 'primary':
				return 'contained';
			case 'secondary':
				return 'contained-tonal';
			case 'outline':
				return 'outlined';
			case 'text':
				return 'text';
			case 'danger':
				return 'contained';
			default:
				return 'contained';
		}
	};

	const getButtonStyle = (): ViewStyle => {
		const baseStyle: ViewStyle = {
			borderRadius: 8,
		};

		if (fullWidth) {
			baseStyle.width = '100%';
		}

		if (variant === 'danger') {
			baseStyle.backgroundColor = '#d32f2f';
		}

		return baseStyle;
	};

	const getContentStyle = (): ViewStyle => {
		switch (size) {
			case 'small':
				return {height: 36, paddingHorizontal: 12};
			case 'medium':
				return {height: 44, paddingHorizontal: 16};
			case 'large':
				return {height: 52, paddingHorizontal: 20};
			default:
				return {height: 44, paddingHorizontal: 16};
		}
	};

	const getLabelStyle = (): TextStyle => {
		const baseStyle: TextStyle = {};

		switch (size) {
			case 'small':
				baseStyle.fontSize = 14;
				break;
			case 'medium':
				baseStyle.fontSize = 16;
				break;
			case 'large':
				baseStyle.fontSize = 18;
				break;
		}

		if (variant === 'danger') {
			baseStyle.color = '#ffffff';
		}

		return baseStyle;
	};

	return (
		<PaperButton
			mode={getButtonMode()}
			onPress={onPress}
			disabled={disabled || loading}
			loading={loading}
			style={[getButtonStyle(), style]}
			contentStyle={getContentStyle()}
			labelStyle={[getLabelStyle(), textStyle]}
			{...props}
		>
			{children}
		</PaperButton>
	);
};

const styles = StyleSheet.create({
	// Additional styles if needed
});

export default CustomButton; 