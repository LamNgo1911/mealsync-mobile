import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { BorderRadius, Fonts, FontSizes, Spacing } from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { useRegisterMutation } from "../../store/api/authApiSlice";
// @ts-expect-error: Metro provides asset module typing
import appIcon from "../../assets/images/logo.png";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { colors } = useTheme();

  const [register, { isLoading }] = useRegisterMutation();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    try {
      await register({ name, email, password }).unwrap();
      Alert.alert(
        "Registration Successful",
        "You can now log in with your new account."
      );
      router.replace("/(auth)/login");
    } catch (err) {
      Alert.alert(
        "Registration Failed",
        "Could not create account. Please try again."
      );
      console.error(err);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <Image source={appIcon} style={styles.logo} />
      <Text style={[styles.title, { color: colors.neutral[900] }]}>
        Create Account
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
          placeholder="Name"
          value={name}
          onChangeText={setName}
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
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={[styles.buttonText, { color: colors.white }]}>
            Register
          </Text>
        )}
      </Pressable>

      <Pressable onPress={() => router.back()}>
        <Text style={[styles.loginText, { color: colors.neutral[600] }]}>
          Already have an account?{" "}
          <Text style={[styles.loginLink, { color: colors.primary[600] }]}>
            Login
          </Text>
        </Text>
      </Pressable>
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
  loginText: {
    marginTop: Spacing[8],
    textAlign: "center",
    fontFamily: Fonts.regular,
  },
  loginLink: {
    fontFamily: Fonts.semibold,
  },
});
