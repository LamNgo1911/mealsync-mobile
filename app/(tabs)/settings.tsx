import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Header } from "../../components/Header";
import {
  BorderRadius,
  Fonts,
  FontSizes,
  FontWeights,
  Spacing,
} from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { logout } from "../../store/features/auth/authSlice";
import { RootState } from "../../store/store";
import { UserPreference } from "../../types/user";

export default function SettingsScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { colors, theme, toggleTheme } = useTheme();
  const [preferences, setPreferences] = useState<UserPreference | null>(null);

  useEffect(() => {
    if (user) {
      // Create a complete preference object, merging API data with defaults
      const completePreferences: UserPreference = {
        id: user.userPreference?.id || user.id,
        dietaryRestrictions: user.userPreference?.dietaryRestrictions || [],
        allergies: user.userPreference?.allergies || [],
        preferredCuisines: user.userPreference?.preferredCuisines || [],
        notifications: {
          push: user.userPreference?.notifications?.push ?? true,
          email: user.userPreference?.notifications?.email ?? false,
        },
      };
      setPreferences(completePreferences);
    }
  }, [user]);

  const togglePushNotifications = () => {
    if (!preferences) return;
    setPreferences((prev) => ({
      ...prev!,
      notifications: {
        ...prev!.notifications,
        push: !prev!.notifications.push,
      },
    }));
  };

  const toggleEmailNotifications = () => {
    if (!preferences) return;
    setPreferences((prev) => ({
      ...prev!,
      notifications: {
        ...prev!.notifications,
        email: !prev!.notifications.email,
      },
    }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!user || !preferences) {
    // Optionally return a loading spinner or a placeholder
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.neutral[50] }]}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.neutral[600] }]}>
            Account
          </Text>
          <View style={[styles.card, { backgroundColor: colors.white }]}>
            <View style={styles.row}>
              <Text style={[styles.label, { color: colors.neutral[800] }]}>
                Name
              </Text>
              <Text style={[styles.value, { color: colors.neutral[500] }]}>
                {user.name}
              </Text>
            </View>
            <View
              style={[
                styles.separator,
                { backgroundColor: colors.neutral[100] },
              ]}
            />
            <View style={styles.row}>
              <Text style={[styles.label, { color: colors.neutral[800] }]}>
                Email
              </Text>
              <Text style={[styles.value, { color: colors.neutral[500] }]}>
                {user.email}
              </Text>
            </View>
            <View
              style={[
                styles.separator,
                { backgroundColor: colors.neutral[100] },
              ]}
            />
            <Link href="/subscription" asChild>
              <Pressable style={styles.row}>
                <Text style={[styles.label, { color: colors.neutral[800] }]}>
                  Subscription
                </Text>
                <Text style={[styles.value, { color: colors.neutral[500] }]}>
                  Free Tier ›
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.neutral[600] }]}>
            Preferences
          </Text>
          <View style={[styles.card, { backgroundColor: colors.white }]}>
            <Link href="/preferences" asChild>
              <Pressable style={styles.row}>
                <Text style={[styles.label, { color: colors.neutral[800] }]}>
                  Food Preferences
                </Text>
                <Text style={[styles.value, { color: colors.neutral[500] }]}>
                  ›
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.neutral[600] }]}>
            Appearance
          </Text>
          <View style={[styles.card, { backgroundColor: colors.white }]}>
            <View style={styles.row}>
              <Text style={[styles.label, { color: colors.neutral[800] }]}>
                Dark Mode
              </Text>
              <Switch
                value={theme === "dark"}
                onValueChange={toggleTheme}
                trackColor={{
                  false: colors.neutral[200],
                  true: colors.primary[500],
                }}
                thumbColor={colors.white}
              />
            </View>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.neutral[600] }]}>
            Notifications
          </Text>
          <View style={[styles.card, { backgroundColor: colors.white }]}>
            <View style={styles.row}>
              <Text style={[styles.label, { color: colors.neutral[800] }]}>
                Push Notifications
              </Text>
              <Switch
                value={preferences.notifications.push}
                onValueChange={togglePushNotifications}
                trackColor={{
                  false: colors.neutral[200],
                  true: colors.primary[500],
                }}
                thumbColor={colors.white}
              />
            </View>
            <View
              style={[
                styles.separator,
                { backgroundColor: colors.neutral[100] },
              ]}
            />
            <View style={styles.row}>
              <Text style={[styles.label, { color: colors.neutral[800] }]}>
                Email Notifications
              </Text>
              <Switch
                value={preferences.notifications.email}
                onValueChange={toggleEmailNotifications}
                trackColor={{
                  false: colors.neutral[200],
                  true: colors.primary[500],
                }}
                thumbColor={colors.white}
              />
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.neutral[600] }]}>
            Danger Zone
          </Text>
          <View style={[styles.card, { backgroundColor: colors.white }]}>
            <Pressable style={styles.logoutButton} onPress={handleLogout}>
              <Text style={[styles.logoutButtonText, { color: colors.error }]}>
                Log Out
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing[6],
  },
  section: {
    marginBottom: Spacing[8],
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.semibold,
    marginBottom: Spacing[3],
  },
  card: {
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing[5],
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing[4],
  },
  label: {
    fontSize: FontSizes.base,
    fontFamily: Fonts.regular,
  },
  value: {
    fontSize: FontSizes.base,
    fontFamily: Fonts.regular,
  },
  separator: {
    height: 1,
  },
  logoutButton: {
    paddingVertical: Spacing[4],
  },
  logoutButtonText: {
    fontSize: FontSizes.base,
    textAlign: "center",
    fontWeight: FontWeights.medium,
    fontFamily: Fonts.medium,
  },
});
