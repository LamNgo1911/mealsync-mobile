import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { BorderRadius, Fonts, FontSizes, Spacing } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";

interface AutocompleteInputProps {
  options: string[];
  selectedOptions: string[];
  onSelectionChange: (selection: string[]) => void;
  placeholder: string;
}

export function AutocompleteInput({
  options,
  selectedOptions,
  onSelectionChange,
  placeholder,
}: AutocompleteInputProps) {
  const { colors } = useTheme();
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredOptions =
    search.length > 1
      ? options.filter(
          (option) =>
            option.toLowerCase().includes(search.toLowerCase()) &&
            !selectedOptions.includes(option)
        )
      : [];

  const addOption = (option: string) => {
    if (!selectedOptions.includes(option)) {
      onSelectionChange([...selectedOptions, option]);
    }
    setSearch("");
    setShowSuggestions(false);
  };

  const removeOption = (option: string) => {
    onSelectionChange(selectedOptions.filter((item) => item !== option));
  };

  return (
    <View style={styles.container}>
      {/* Selected Tags */}
      <View style={styles.tagContainer}>
        {selectedOptions.map((option) => (
          <View
            key={option}
            style={[styles.tag, { backgroundColor: colors.primary[100] }]}
          >
            <Text style={[styles.tagText, { color: colors.primary[800] }]}>
              {option}
            </Text>
            <Pressable onPress={() => removeOption(option)}>
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.primary[800]}
              />
            </Pressable>
          </View>
        ))}
      </View>

      {/* Input */}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.neutral[100],
            color: colors.neutral[800],
            borderColor: colors.neutral[300],
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.neutral[400]}
        value={search}
        onChangeText={setSearch}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />

      {/* Suggestions */}
      {showSuggestions && filteredOptions.length > 0 && (
        <View
          style={[
            styles.suggestionsContainer,
            {
              borderColor: colors.neutral[200],
              backgroundColor: colors.white,
            },
          ]}
        >
          <ScrollView>
            {filteredOptions.slice(0, 5).map((item) => (
              <Pressable
                key={item}
                style={[
                  styles.suggestionItem,
                  { borderBottomColor: colors.neutral[100] },
                ]}
                onPress={() => addOption(item)}
              >
                <Text
                  style={[
                    styles.suggestionText,
                    { color: colors.neutral[700] },
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing[2],
    marginBottom: Spacing[3],
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.md,
    gap: Spacing[2],
  },
  tagText: {
    fontSize: FontSizes.base,
    fontFamily: Fonts.medium,
  },
  input: {
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
    fontSize: FontSizes.lg,
    borderWidth: 1,
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    width: "100%",
    zIndex: 10,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing[2],
    maxHeight: 200,
  },
  suggestionItem: {
    padding: Spacing[3],
    borderBottomWidth: 1,
  },
  suggestionText: {
    fontSize: FontSizes.base,
  },
});
