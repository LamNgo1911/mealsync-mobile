import { useRouter } from "expo-router";
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
import {
  BorderRadius,
  Colors,
  Fonts,
  FontSizes,
  Spacing,
} from "../../constants/theme";
// @ts-expect-error: Metro provides asset module typing
import appIcon from "../../assets/images/logo.png";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    // TODO: Add actual registration logic here
    console.log("Registering with:", { name, email, password });

    // Navigate to the preferences screen after registration
    router.push("/(auth)/preferences");
  };

  return (
    <View style={styles.container}>
      <Image source={appIcon} style={styles.logo} />
      <Text style={styles.title}>Create Account</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={Colors.neutral[400]}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={Colors.neutral[400]}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={Colors.neutral[400]}
        />
      </View>

      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>

      <Pressable onPress={() => router.back()}>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginLink}>Login</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: "center",
    padding: Spacing[6],
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xl,
    alignSelf: "center",
    marginBottom: Spacing[8],
  },
  title: {
    fontSize: FontSizes["3xl"],
    fontFamily: Fonts.bold,
    color: Colors.neutral[900],
    textAlign: "center",
    marginBottom: Spacing[10],
  },
  inputContainer: {
    marginBottom: Spacing[6],
  },
  input: {
    backgroundColor: Colors.neutral[100],
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
    fontSize: FontSizes.base,
    fontFamily: Fonts.regular,
    color: Colors.neutral[800],
    marginBottom: Spacing[4],
  },
  button: {
    backgroundColor: Colors.primary[500],
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semibold,
  },
  loginText: {
    marginTop: Spacing[8],
    textAlign: "center",
    fontFamily: Fonts.regular,
    color: Colors.neutral[600],
  },
  loginLink: {
    color: Colors.primary[600],
    fontFamily: Fonts.semibold,
  },
});
