import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Header } from "../../components/Header";
import { RecipeSection } from "../../components/RecipeSection";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "../../constants/theme";
import { getSavedRecipes } from "../../data/recipes";

const SAVED_RECIPES = getSavedRecipes();

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Header title="Profile" />

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          {/* Profile Image */}
          <View style={styles.avatarOuter}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarEmoji}>👤</Text>
            </View>
          </View>

          {/* User Info */}
          <Text style={styles.userName}>Ethan Carter</Text>
          <Text style={styles.userBio}>Foodie & Recipe Explorer</Text>
        </View>

        <RecipeSection
          title="Saved Recipes"
          recipes={SAVED_RECIPES}
          showCategory={false}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
    backgroundColor: Colors.accent[300], // Approximation of yellow-400
    marginBottom: Spacing[5],
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.accent[400], // Approximation of yellow-500
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: {
    fontSize: 48, // Approximation of text-4xl
    color: Colors.accent[900], // Approximation of orange-900
  },
  userName: {
    fontSize: FontSizes["2xl"],
    fontWeight: FontWeights.bold,
    color: Colors.neutral[900], // Approximation of slate-900
    marginBottom: Spacing[2],
  },
  userBio: {
    fontSize: FontSizes.lg,
    color: Colors.info, // Approximation of blue-600
    marginBottom: Spacing[6],
  },
});
