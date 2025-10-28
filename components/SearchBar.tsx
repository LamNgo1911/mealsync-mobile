import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { BorderRadius, Fonts, FontSizes, Spacing } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onChangeText?: (text: string) => void;
  value?: string;
}

export function SearchBar({
  placeholder = "Search recipes...",
  onSearch,
  onChangeText,
  value: controlledValue,
}: SearchBarProps) {
  const { colors } = useTheme();
  const [internalValue, setInternalValue] = useState("");

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChangeText = (text: string) => {
    if (controlledValue === undefined) {
      setInternalValue(text);
    }
    onChangeText?.(text);
  };

  const handleSearch = () => {
    onSearch?.(value);
  };

  const handleClear = () => {
    if (controlledValue === undefined) {
      setInternalValue("");
    }
    onChangeText?.("");
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.neutral[100],
          borderColor: colors.neutral[200],
        },
      ]}
    >
      <Ionicons
        name="search-outline"
        size={20}
        color={colors.primary[500]}
        style={styles.searchIcon}
      />

      <TextInput
        style={[
          styles.input,
          {
            color: colors.neutral[900],
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.neutral[400]}
        value={value}
        onChangeText={handleChangeText}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />

      {value.length > 0 && (
        <Pressable onPress={handleClear} style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color={colors.neutral[400]} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: Spacing[2],
  },
  input: {
    flex: 1,
    fontSize: FontSizes.base,
    fontFamily: Fonts.regular,
    paddingVertical: 0,
  },
  clearButton: {
    padding: Spacing[1],
  },
});
