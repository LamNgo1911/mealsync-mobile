import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
// @ts-expect-error: Metro provides asset module typing
import appIcon from "../assets/images/logo.png";
import { Fonts, FontSizes, FontWeights, Spacing } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showSettingsButton?: boolean;
}

export function Header({
  title,
  showBackButton = false,
  showSettingsButton = true,
}: HeaderProps) {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <View style={styles.innerContainer}>
        <View style={styles.iconContainer}>
          {showBackButton ? (
            <View style={styles.backButtonContainer}>
              <Pressable onPress={() => router.back()}>
                <Text
                  style={[styles.backButton, { color: colors.neutral[800] }]}
                >
                  ‹
                </Text>
              </Pressable>
            </View>
          ) : (
            <Image
              source={appIcon}
              style={styles.logo}
              accessibilityLabel="App logo"
            />
          )}
        </View>

        {title && (
          <Text
            style={[styles.title, { color: colors.neutral[900] }]}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}

        {showSettingsButton && (
          <View style={styles.settingsContainer}>
            <Pressable
              onPress={() => router.push("/settings")}
              style={styles.settingsButton}
            >
              <Ionicons
                name="settings-outline"
                size={28}
                color={colors.neutral[700]}
              />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80, // pt-14
    paddingBottom: Spacing[8],
    paddingHorizontal: Spacing[6],
  },
  innerContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  iconContainer: {
    position: "absolute",
    left: -10,
    height: "100%",
    justifyContent: "center",
  },
  title: {
    fontSize: FontSizes["2xl"],
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.art,
    textAlign: "center",
  },
  logo: {
    width: 128,
    height: 128,
  },
  backButtonContainer: {
    position: "absolute",
    left: -14,
    justifyContent: "center",
    width: 48,
    height: 48,
    alignItems: "center",
  },
  backButton: {
    fontSize: FontSizes["3xl"],
  },
  settingsContainer: {
    position: "absolute",
    right: -14,
    height: "100%",
    justifyContent: "center",
  },
  settingsButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
});
