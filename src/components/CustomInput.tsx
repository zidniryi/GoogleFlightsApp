import React, {useState} from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import {TextInput as PaperTextInput, TextInputProps as PaperTextInputProps, HelperText} from 'react-native-paper';

interface CustomInputProps extends Omit<PaperTextInputProps, 'mode'> {
	variant?: 'outlined' | 'flat';
	size?: 'small' | 'medium' | 'large';
	state?: 'default' | 'error' | 'success';
	helperText?: string;
	showHelperText?: boolean;
	required?: boolean;
	fullWidth?: boolean;
	style?: ViewStyle;
}

export const CustomInput: React.FC<CustomInputProps> = ({
	variant = 'outlined',
	size = 'medium',
	state = 'default',
	helperText,
	showHelperText = true,
	required = false,
	fullWidth = true,
	label,
	style,
	onFocus,
	onBlur,
	...props
}) => {
	const [isFocused, setIsFocused] = useState(false);

	const handleFocus = (e: any) => {
		setIsFocused(true);
		onFocus?.(e);
	};

	const handleBlur = (e: any) => {
		setIsFocused(false);
		onBlur?.(e);
	};

	const getInputStyle = (): ViewStyle => {
		const baseStyle: ViewStyle = {};

		if (fullWidth) {
			baseStyle.width = '100%';
		}

		// Size-specific styles
		switch (size) {
			case 'small':
				baseStyle.height = 40;
				break;
			case 'medium':
				baseStyle.height = 48;
				break;
			case 'large':
				baseStyle.height = 56;
				break;
		}

		return baseStyle;
	};

	const getOutlineColor = () => {
		if (state === 'error') return '#d32f2f';
		if (state === 'success') return '#4caf50';
		if (isFocused) return '#1976d2';
		return undefined;
	};

	const getLabel = () => {
		if (required && label) {
			return `${label} *`;
		}
		return label;
	};

	const shouldShowHelperText = showHelperText && (helperText || state === 'error');

	return (
		<>
			<PaperTextInput
				mode={variant}
				label={getLabel()}
				style={[getInputStyle(), style]}
				outlineColor={getOutlineColor()}
				activeOutlineColor={getOutlineColor()}
				error={state === 'error'}
				onFocus={handleFocus}
				onBlur={handleBlur}
				{...props}
			/>
			{shouldShowHelperText && (
				<HelperText
					type={state === 'error' ? 'error' : 'info'}
					visible={!!shouldShowHelperText}
				>
					{helperText}
				</HelperText>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	// Additional styles if needed
});

export default CustomInput; 