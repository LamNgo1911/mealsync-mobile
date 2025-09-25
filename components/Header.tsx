import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
// @ts-expect-error: Metro provides asset module typing
import appIcon from "../assets/images/logo.png";
import {
  BorderRadius,
  Colors,
  Fonts,
  FontSizes,
  FontWeights,
  Spacing,
} from "../constants/theme";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

export function Header({ title, showBackButton = false }: HeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Left Icon */}
        <View style={styles.iconContainer}>
          {showBackButton ? (
            <Pressable onPress={() => router.back()}>
              <Text style={styles.backButton}>‹</Text>
            </Pressable>
          ) : (
            <Image
              source={appIcon}
              style={styles.logo}
              accessibilityLabel="App logo"
            />
          )}
        </View>

        {/* Centered Title */}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 56, // pt-14
    paddingBottom: Spacing[6],
    paddingHorizontal: Spacing[6],
    backgroundColor: Colors.white,
  },
  innerContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: FontSizes["2xl"],
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.art,
    color: Colors.neutral[900],
    textAlign: "center",
  },
  iconContainer: {
    position: "absolute",
    left: 0,
    // Center the icon vertically in the header
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  backButton: {
    fontSize: FontSizes["3xl"],
    color: Colors.neutral[800],
  },
  settingsContainer: {
    position: "absolute",
    right: 0,
  },
  settingsIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutral[100],
    alignItems: "center",
    justifyContent: "center",
  },
  settingsIcon: {
    fontSize: FontSizes.base,
    fontFamily: Fonts.regular,
  },
});
