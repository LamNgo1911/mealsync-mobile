import { useEffect, useRef } from "react";
import { Animated, View, ViewStyle } from "react-native";

export type SkeletonCardProps = {
  containerStyle?: ViewStyle;
};

export function SkeletonCard({ containerStyle }: SkeletonCardProps) {
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
        style={{
          width: "100%",
          height: 192,
          borderRadius: 16,
          backgroundColor: "#E5E7EB",
          opacity,
        }}
      />
      <Animated.View
        style={{
          marginTop: 12,
          height: 22,
          borderRadius: 6,
          backgroundColor: "#E5E7EB",
          opacity,
        }}
      />
      <Animated.View
        style={{
          marginTop: 8,
          height: 18,
          width: "60%",
          borderRadius: 6,
          backgroundColor: "#E5E7EB",
          opacity,
        }}
      />
    </View>
  );
}
