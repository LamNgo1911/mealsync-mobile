import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Header } from "../components/Header";
import { BorderRadius, Fonts, FontSizes, Spacing } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";

const plans = [
  {
    name: "Free",
    price: "€0",
    unit: "",
    isCurrent: true,
    features: ["1 daily photo scan", "3 recipes per scan"],
  },
  {
    name: "Starter",
    price: "€5",
    unit: "/month",
    features: ["10 daily photo scans", "5 recipes per scan"],
  },
  {
    name: "Premium",
    price: "€12",
    unit: "/month",
    features: ["Unlimited daily photo scans", "5 recipes per scan"],
  },
  {
    name: "Annual Premium",
    price: "€120",
    unit: "/year",
    bestValue: true,
    features: ["Unlimited daily photo scans", "5 recipes per scan"],
  },
];

export default function SubscriptionScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <Header title="Subscription" showBackButton />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <Text style={[styles.title, { color: colors.neutral[900] }]}>
          Unlock the full potential of MealSync
        </Text>
        <Text style={[styles.subtitle, { color: colors.neutral[600] }]}>
          Choose a plan that fits your needs and enjoy unlimited access to all
          features.
        </Text>

        <View style={styles.plansContainer}>
          {plans.map((plan, index) => (
            <View
              key={index}
              style={[styles.planCard, { borderColor: colors.neutral[200] }]}
            >
              {plan.bestValue && (
                <View
                  style={[
                    styles.bestValueTag,
                    { backgroundColor: colors.info[500] },
                  ]}
                >
                  <Text style={[styles.bestValueText, { color: colors.white }]}>
                    Best Value
                  </Text>
                </View>
              )}
              <Text style={[styles.planName, { color: colors.neutral[800] }]}>
                {plan.name}
              </Text>
              <Text style={[styles.planPrice, { color: colors.neutral[900] }]}>
                {plan.price}
                <Text style={styles.priceUnit}>{plan.unit}</Text>
              </Text>

              <Pressable
                style={[
                  styles.ctaButton,
                  plan.isCurrent
                    ? { backgroundColor: colors.neutral[100] }
                    : { backgroundColor: colors.neutral[800] },
                ]}
                onPress={() => {
                  if (!plan.isCurrent) {
                    router.push({
                      pathname: "/checkout" as any,
                      params: { planName: plan.name, price: plan.price },
                    });
                  }
                }}
                disabled={plan.isCurrent}
              >
                <Text
                  style={[
                    styles.ctaButtonText,
                    plan.isCurrent
                      ? { color: colors.neutral[700] }
                      : { color: colors.white },
                  ]}
                >
                  {plan.isCurrent ? "Current Plan" : "Upgrade"}
                </Text>
              </Pressable>

              <View style={styles.featuresList}>
                {plan.features.map((feature, fIndex) => (
                  <View key={fIndex} style={styles.featureItem}>
                    <Text
                      style={[styles.checkmark, { color: colors.success[500] }]}
                    >
                      ✓
                    </Text>
                    <Text
                      style={[
                        styles.featureText,
                        { color: colors.neutral[600] },
                      ]}
                    >
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {
    paddingHorizontal: Spacing[6],
    paddingBottom: Spacing[10],
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes["3xl"],
    textAlign: "center",
    marginBottom: Spacing[3],
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.lg,
    textAlign: "center",
    marginBottom: Spacing[8],
    lineHeight: 24,
  },
  plansContainer: {
    gap: Spacing[6],
  },
  planCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing[6],
    position: "relative",
  },
  bestValueTag: {
    position: "absolute",
    top: Spacing[4],
    right: Spacing[4],
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
  },
  bestValueText: {
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.xs,
  },
  planName: {
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.xl,
    marginBottom: Spacing[2],
  },
  planPrice: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes["5xl"],
    marginBottom: Spacing[4],
  },
  priceUnit: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.regular,
  },
  ctaButton: {
    width: "100%",
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    marginBottom: Spacing[6],
  },
  ctaButtonText: {
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.lg,
  },
  featuresList: {
    gap: Spacing[3],
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkmark: {
    marginRight: Spacing[3],
    fontSize: FontSizes.lg,
  },
  featureText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.base,
    flex: 1,
  },
});
