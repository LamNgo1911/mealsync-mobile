import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
// @ts-expect-error: Metro provides asset module typing
import appIcon from "../assets/images/logo.png";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "../constants/theme";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Left Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={appIcon}
            style={styles.logo}
            contentFit="cover"
            accessibilityLabel="App logo"
          />
        </View>

        {/* Centered Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Right Settings */}
        <View style={styles.settingsContainer}>
          <View style={styles.settingsIconWrapper}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </View>
        </View>
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
    color: Colors.neutral[900],
    textAlign: "center",
  },
  logoContainer: {
    position: "absolute",
    left: 0,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
  },
});
