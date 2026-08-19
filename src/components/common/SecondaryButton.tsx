import { Pressable, Text, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { buttonStyles } from './buttonStyles';

type SecondaryButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

export function SecondaryButton({
  label,
  onPress,
  disabled = false,
  style,
  labelStyle,
}: SecondaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        buttonStyles.base,
        buttonStyles.secondary,
        pressed && !disabled && buttonStyles.pressed,
        disabled && { opacity: 0.45 },
        style,
      ]}
    >
      <Text style={[buttonStyles.label, buttonStyles.secondaryLabel, labelStyle]}>
        {label}
      </Text>
    </Pressable>
  );
}
