import * as Google from "expo-auth-session/providers/google";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
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
import googleIcon from "../../assets/images/google.png";
// @ts-expect-error: Metro provides asset module typing
import appIcon from "../../assets/images/logo.png";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { colors, theme } = useTheme();

  // Google Auth setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
    iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
    webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      console.log("Google Access Token:", authentication?.accessToken);
      // Example: call your AuthContext method
      // signInWithGoogle(authentication?.accessToken);
    }
  }, [response]);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    console.log("Logging in with:", { email, password });
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

      <View style={styles.dividerContainer}>
        <View
          style={[styles.divider, { backgroundColor: colors.neutral[200] }]}
        />
        <Text style={[styles.dividerText, { color: colors.neutral[500] }]}>
          OR
        </Text>
        <View
          style={[styles.divider, { backgroundColor: colors.neutral[200] }]}
        />
      </View>

      {/* Custom Google Sign-In button */}
      <Pressable
        disabled={!request}
        onPress={() => promptAsync()}
        style={[
          styles.googleButton,
          {
            backgroundColor:
              theme === "dark" ? colors.neutral[800] : colors.white,
            borderColor:
              theme === "dark" ? colors.neutral[700] : colors.neutral[300],
          },
        ]}
      >
        <Image source={googleIcon} style={styles.googleIcon} />
        <Text
          style={[
            styles.googleButtonText,
            { color: theme === "dark" ? colors.white : colors.neutral[800] },
          ]}
        >
          Sign in with Google
        </Text>
      </Pressable>

      <Link href="/(auth)/register" asChild>
        <Pressable>
          <Text style={[styles.registerText, { color: colors.neutral[600] }]}>
            Don&apos;t have an account?{" "}
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
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing[6],
  },
  dividerText: {
    marginHorizontal: Spacing[4],
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[4],
    height: 48,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    width: "100%",
  },
  googleIcon: {
    width: 18,
    height: 18,
  },
  googleButtonText: {
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
