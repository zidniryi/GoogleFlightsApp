import React from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

interface SafeAreaContainerProps {
	children: React.ReactNode;
	backgroundColor?: string;
	padding?: 'none' | 'small' | 'medium' | 'large';
	edges?: ('top' | 'bottom' | 'left' | 'right')[];
	style?: ViewStyle;
}

export const SafeAreaContainer: React.FC<SafeAreaContainerProps> = ({
	children,
	backgroundColor = '#ffffff',
	padding = 'medium',
	edges = ['top', 'bottom'],
	style,
}) => {
	const getContainerStyle = (): ViewStyle => {
		const baseStyle: ViewStyle = {
			flex: 1,
			backgroundColor,
		};

		// Padding
		switch (padding) {
			case 'none':
				break;
			case 'small':
				baseStyle.paddingHorizontal = 8;
				break;
			case 'medium':
				baseStyle.paddingHorizontal = 16;
				break;
			case 'large':
				baseStyle.paddingHorizontal = 24;
				break;
		}

		return baseStyle;
	};

	return (
		<SafeAreaView
			style={[getContainerStyle(), style]}
			edges={edges}
		>
			{children}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	// Additional styles if needed
});

export default SafeAreaContainer; 