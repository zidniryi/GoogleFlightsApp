import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {ActivityIndicator, Portal, Modal} from 'react-native-paper';
import {CustomText} from './CustomText';

interface LoadingSpinnerProps {
	size?: 'small' | 'medium' | 'large';
	color?: string;
	overlay?: boolean;
	visible?: boolean;
	message?: string;
	style?: ViewStyle;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
	size = 'medium',
	color = '#1976d2',
	overlay = false,
	visible = true,
	message,
	style,
}) => {
	const getSize = () => {
		switch (size) {
			case 'small':
				return 20;
			case 'medium':
				return 32;
			case 'large':
				return 48;
			default:
				return 32;
		}
	};

	const LoadingContent = () => (
		<View style={[styles.container, style]}>
			<ActivityIndicator
				size={getSize()}
				color={color}
				animating={visible}
			/>
			{message && (
				<CustomText
					variant="bodyMedium"
					style={styles.message}
					color="secondary"
				>
					{message}
				</CustomText>
			)}
		</View>
	);

	if (overlay) {
		return (
			<Portal>
				<Modal
					visible={visible}
					dismissable={false}
					contentContainerStyle={styles.modalContent}
				>
					<LoadingContent />
				</Modal>
			</Portal>
		);
	}

	return visible ? <LoadingContent /> : null;
};

// Convenience components
export const InlineLoader: React.FC<Omit<LoadingSpinnerProps, 'overlay'>> = (props) => (
	<LoadingSpinner overlay={false} {...props} />
);

export const OverlayLoader: React.FC<Omit<LoadingSpinnerProps, 'overlay'>> = (props) => (
	<LoadingSpinner overlay={true} {...props} />
);

export const FullScreenLoader: React.FC<{visible?: boolean; message?: string}> = ({
	visible = true,
	message = 'Loading...'
}) => (
	<OverlayLoader
		visible={visible}
		message={message}
		size="large"
	/>
);

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 16,
	},
	modalContent: {
		backgroundColor: 'white',
		marginHorizontal: 40,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	message: {
		marginTop: 12,
		textAlign: 'center',
	},
});

export default LoadingSpinner; 