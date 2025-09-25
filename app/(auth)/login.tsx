import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { BorderRadius, Fonts, FontSizes, Spacing } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
// @ts-expect-error: Metro provides asset module typing
import appIcon from "../../assets/images/logo.png";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { colors } = useTheme();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    // TODO: Add actual login logic here
    console.log("Logging in with:", { email, password });

    // Use the signIn function from the AuthContext
    signIn();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <Image source={appIcon} style={styles.logo} />
      <Text style={[styles.title, { color: colors.neutral[900] }]}>
        Welcome Back!
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.neutral[100],
              color: colors.neutral[800],
            },
          ]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={colors.neutral[400]}
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.neutral[100],
              color: colors.neutral[800],
            },
          ]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={colors.neutral[400]}
        />
      </View>

      <Pressable
        style={[styles.button, { backgroundColor: colors.primary[500] }]}
        onPress={handleLogin}
      >
        <Text style={[styles.buttonText, { color: colors.white }]}>Login</Text>
      </Pressable>

      <Link href="/(auth)/register" asChild>
        <Pressable>
          <Text style={[styles.registerText, { color: colors.neutral[600] }]}>
            Don't have an account?{" "}
            <Text style={[styles.registerLink, { color: colors.primary[600] }]}>
              Sign up
            </Text>
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: Spacing[6],
  },
  logo: {
    width: 128,
    height: 40,
    borderRadius: BorderRadius.xl,
    alignSelf: "center",
    marginBottom: Spacing[8],
  },
  title: {
    fontSize: FontSizes["3xl"],
    fontFamily: Fonts.bold,
    textAlign: "center",
    marginBottom: Spacing[10],
  },
  inputContainer: {
    marginBottom: Spacing[6],
  },
  input: {
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
    fontSize: FontSizes.base,
    fontFamily: Fonts.regular,
    marginBottom: Spacing[4],
  },
  button: {
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  buttonText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semibold,
  },
  registerText: {
    marginTop: Spacing[8],
    textAlign: "center",
    fontFamily: Fonts.regular,
  },
  registerLink: {
    fontFamily: Fonts.semibold,
  },
});
