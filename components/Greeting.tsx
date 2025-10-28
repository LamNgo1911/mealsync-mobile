import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Fonts, FontSizes, FontWeights, Spacing } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";

interface GreetingProps {
  userName?: string;
}

export function Greeting({ userName = "there" }: GreetingProps) {
  const { colors } = useTheme();

  const question = useMemo(() => {
    const questions = [
      "What's in your fridge today?",
      "What are you craving?",
      "What's cooking today?",
      "Ready to discover something delicious?",
      "What sounds good to eat?",
      "Let's find your next meal!",
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.greetingContainer}>
        <Text style={[styles.greeting, { color: colors.neutral[900] }]}>
          Hi {userName}!
        </Text>
      </View>
      <Text style={[styles.subGreeting, { color: colors.neutral[600] }]}>
        {question}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[4],
    alignItems: "center",
  },
  greetingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing[2],
  },
  greeting: {
    fontSize: FontSizes["3xl"],
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.bold,
    textAlign: "center",
  },
  subGreeting: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.regular,
    textAlign: "center",
  },
});
