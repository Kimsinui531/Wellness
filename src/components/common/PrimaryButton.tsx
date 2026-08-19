import type { ReactNode } from 'react';
import { Pressable, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { buttonStyles } from './buttonStyles';

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  rightIcon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  rightIcon,
  style,
  labelStyle,
}: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        buttonStyles.base,
        disabled ? buttonStyles.primaryDisabled : buttonStyles.primary,
        pressed && !disabled && buttonStyles.pressed,
        style,
      ]}
    >
      <View style={buttonStyles.content}>
        <Text
          style={[
            buttonStyles.label,
            disabled ? buttonStyles.primaryDisabledLabel : buttonStyles.primaryLabel,
            labelStyle,
          ]}
        >
          {label}
        </Text>
        {rightIcon}
      </View>
    </Pressable>
  );
}
