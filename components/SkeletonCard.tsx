import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";
import { BorderRadius, Spacing } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";

export type SkeletonCardProps = {
  containerStyle?: ViewStyle;
};

export function SkeletonCard({ containerStyle }: SkeletonCardProps) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View style={containerStyle}>
      <Animated.View
        style={[
          styles.image,
          { opacity, backgroundColor: colors.neutral[200] },
        ]}
      />
      <Animated.View
        style={[
          styles.title,
          { opacity, backgroundColor: colors.neutral[200] },
        ]}
      />
      <Animated.View
        style={[
          styles.subtitle,
          { opacity, backgroundColor: colors.neutral[200] },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 192,
    borderRadius: BorderRadius["2xl"],
  },
  title: {
    marginTop: Spacing[3],
    height: 22,
    borderRadius: BorderRadius.md,
  },
  subtitle: {
    marginTop: Spacing[2],
    height: 18,
    width: "60%",
    borderRadius: BorderRadius.md,
  },
});
