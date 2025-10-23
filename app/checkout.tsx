import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Header } from "../components/Header";
import { BorderRadius, Fonts, FontSizes, Spacing } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";
import { useInAppPurchase } from "../hooks/useInAppPurchase";

export default function CheckoutScreen() {
  const { planName, price } = useLocalSearchParams<{
    planName: string;
    price: string;
  }>();
  const { colors } = useTheme();
  const { loading, handleSubscription } = useInAppPurchase();

  const onPurchase = () => {
    if (planName) {
      handleSubscription(planName);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Confirm Subscription" showBackButton />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.summaryContainer}>
          <Text style={[styles.planName, { color: colors.text }]}>
            {planName}
          </Text>
          <Text style={[styles.price, { color: colors.text }]}>
            {price}
            <Text style={styles.priceUnit}>/month</Text>
          </Text>
        </View>

        <View style={styles.termsContainer}>
          <View style={styles.termItem}>
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color={colors.accent[500]}
              style={styles.termIcon}
            />
            <Text style={[styles.termText, { color: colors.neutral[600] }]}>
              Your payment will be charged to your App Store account upon
              confirmation.
            </Text>
          </View>
          <View style={styles.termItem}>
            <Ionicons
              name="refresh-circle-outline"
              size={24}
              color={colors.accent[500]}
              style={styles.termIcon}
            />
            <Text style={[styles.termText, { color: colors.neutral[600] }]}>
              The subscription automatically renews unless canceled at least 24
              hours before the end of the current period.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer with Pay Button */}
      <View
        style={[
          styles.footer,
          { borderTopColor: colors.border, backgroundColor: colors.background },
        ]}
      >
        <Pressable
          style={[styles.payButton, { backgroundColor: colors.primary[500] }]}
          onPress={onPurchase}
          disabled={loading}
        >
          <Text style={[styles.payButtonText, { color: colors.white }]}>
            {loading ? "Processing..." : `Pay and Subscribe`}
          </Text>
        </Pressable>
      </View>
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
    flexGrow: 1,
    padding: Spacing[6],
    paddingBottom: 120, // To avoid being hidden by the footer
  },
  summaryContainer: {
    alignItems: "center",
    marginBottom: Spacing[8],
    paddingVertical: Spacing[6],
  },
  planName: {
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.xl,
    marginBottom: Spacing[2],
  },
  price: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes["5xl"],
  },
  priceUnit: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.lg,
  },
  termsContainer: {
    gap: Spacing[4],
  },
  termItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing[3],
  },
  termIcon: {
    marginTop: 2,
  },
  termText: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.base,
    lineHeight: 22,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing[6],
    paddingBottom: Spacing[8],
    borderTopWidth: 1,
  },
  payButton: {
    paddingVertical: Spacing[4],
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  payButtonText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semibold,
  },
});
