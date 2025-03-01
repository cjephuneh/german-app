import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';
import Colors from '@/constants/Colors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  ...rest
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      case 'text':
        return styles.textButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'text':
        return styles.textButtonText;
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'medium':
        return styles.mediumButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'medium':
        return styles.mediumText;
      case 'large':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        getButtonStyle(),
        getSizeStyle(),
        disabled && styles.disabledButton,
        style,
      ]}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' || variant === 'text' ? Colors.primary : Colors.card} 
          size="small" 
        />
      ) : (
        <>
          {leftIcon}
          <Text 
            style={[
              styles.text, 
              getTextStyle(), 
              getTextSizeStyle(), 
              disabled && styles.disabledText,
              textStyle,
              (leftIcon || rightIcon) && { marginHorizontal: 8 }
            ]}
          >
            {title}
          </Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    button: {
      borderRadius: 8,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    primaryButton: {
      backgroundColor: Colors.primary,
    },
    secondaryButton: {
      backgroundColor: Colors.secondary,
    },
    outlineButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: Colors.primary,
    },
    textButton: {
      backgroundColor: 'transparent',
    },
    smallButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
    },
    mediumButton: {
      paddingVertical: 10,
      paddingHorizontal: 16,
    },
    largeButton: {
      paddingVertical: 14,
      paddingHorizontal: 20,
    },
    text: {
        fontWeight: '600',
        textAlign: 'center',
      },
      primaryText: {
        color: Colors.card,
      },
      secondaryText: {
        color: Colors.text,
      },
      outlineText: {
        color: Colors.primary,
      },
      textButtonText: {
        color: Colors.primary,
      },
      smallText: {
        fontSize: 12,
      },
      mediumText: {
        fontSize: 14,
      },
      largeText: {
        fontSize: 16,
      },
      disabledButton: {
        opacity: 0.6,
      },
      disabledText: {
        opacity: 0.6,
      },
    });