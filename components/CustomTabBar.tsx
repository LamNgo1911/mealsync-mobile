import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Camera } from "expo-camera";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Spacing } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { colors } = useTheme();
  const router = useRouter();

  const takePhoto = async () => {
    const { status } = await Camera.getCameraPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } =
        await Camera.requestCameraPermissionsAsync();
      if (newStatus !== "granted") {
        alert("Camera permission is required to take photos");
        return;
      }
    }
    router.push("/camera");
  };

  return (
    <View
      style={[
        styles.tabBarContainer,
        { backgroundColor: colors.white, borderTopColor: colors.neutral[200] },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        // Render the center scan button instead of the scan tab
        if (route.name === "scan") {
          return (
            <Pressable
              key={route.key}
              style={styles.centerTab}
              onPress={takePhoto}
            >
              <View
                style={[
                  styles.centerButton,
                  {
                    backgroundColor: colors.primary[500],
                    shadowColor: colors.black,
                  },
                ]}
              >
                <Ionicons name="scan" size={28} color={colors.white} />
              </View>
            </Pressable>
          );
        }

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        // Get the icon component
        const IconComponent = options.tabBarIcon
          ? options.tabBarIcon({
              focused: isFocused,
              color: isFocused
                ? colors.primary[500]
                : colors.neutral[500],
              size: 20,
            })
          : null;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
          >
            {IconComponent}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    width: "100%",
    height: 104,
    borderTopWidth: 1,
    paddingBottom: Spacing[5],
    paddingTop: Spacing[5],
    paddingHorizontal: 0,
    alignItems: "center",
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  centerTab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
