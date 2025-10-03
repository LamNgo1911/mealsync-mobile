import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Header } from "../../components/Header";
import { RecipeSection } from "../../components/RecipeSection";
import {
  BorderRadius,
  Fonts,
  FontSizes,
  FontWeights,
  Spacing,
} from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { getSavedRecipes } from "../../data/recipes";

const SAVED_RECIPES = getSavedRecipes();

export default function ProfileScreen() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <Header />

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          {/* Profile Image */}
          <View
            style={[
              styles.avatarOuter,
              { backgroundColor: colors.accent[300] },
            ]}
          >
            <View
              style={[
                styles.avatarInner,
                { backgroundColor: colors.accent[400] },
              ]}
            >
              <Text style={[styles.avatarEmoji, { color: colors.accent[900] }]}>
                👤
              </Text>
            </View>
          </View>

          {/* User Info */}
          <Text style={[styles.userName, { color: colors.neutral[900] }]}>
            Ethan Carter
          </Text>
        </View>

        <RecipeSection title="Saved Recipes" recipes={SAVED_RECIPES} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: Spacing[10],
  },
  profileSection: {
    alignItems: "center",
    paddingHorizontal: Spacing[6],
    marginBottom: Spacing[8],
  },
  avatarOuter: {
    width: 128,
    height: 128,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing[5],
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: {
    fontSize: 48, // Approximation of text-4xl
  },
  userName: {
    fontSize: FontSizes["2xl"],
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.bold,
    marginBottom: Spacing[2],
  },
  upgradeButton: {
    marginTop: Spacing[4],
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[6],
    borderRadius: BorderRadius.full,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  upgradeButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.semibold,
    textAlign: "center",
  },
  userBio: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.regular,
    marginBottom: Spacing[6],
  },
});
