import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  BorderRadius,
  Fonts,
  FontSizes,
  FontWeights,
  Spacing,
} from "../constants/theme";
import { useTheme } from "../context/ThemeContext";

interface MultiSelectListProps {
  options: string[];
  selectedOptions: string[];
  onSelectionChange: (selection: string[]) => void;
  trigger: (onPress: () => void) => React.ReactNode;
  title: string;
}

export function MultiSelectList({
  options,
  selectedOptions,
  onSelectionChange,
  trigger,
  title,
}: MultiSelectListProps) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOption = (option: string) => {
    const newSelection = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];
    onSelectionChange(newSelection);
  };

  return (
    <>
      {trigger(() => setModalVisible(true))}
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView
          style={[styles.modalContainer, { backgroundColor: colors.white }]}
        >
          {/* Header */}
          <View
            style={[styles.header, { borderBottomColor: colors.neutral[200] }]}
          >
            <Pressable onPress={() => setModalVisible(false)}>
              <Ionicons
                name="close-outline"
                size={28}
                color={colors.neutral[800]}
              />
            </Pressable>
            <Text style={[styles.title, { color: colors.neutral[900] }]}>
              {title}
            </Text>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={[styles.doneButton, { color: colors.primary[600] }]}>
                Done
              </Text>
            </Pressable>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={[
                styles.searchInput,
                {
                  backgroundColor: colors.neutral[100],
                  color: colors.neutral[800],
                },
              ]}
              placeholder={`Search ${title.toLowerCase()}...`}
              placeholderTextColor={colors.neutral[400]}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Options List */}
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const isSelected = selectedOptions.includes(item);
              return (
                <Pressable
                  style={styles.optionItem}
                  onPress={() => toggleOption(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: isSelected
                          ? colors.primary[600]
                          : colors.neutral[700],
                      },
                    ]}
                  >
                    {item}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-outline"
                      size={24}
                      color={colors.primary[600]}
                    />
                  )}
                </Pressable>
              );
            }}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing[4],
    borderBottomWidth: 1,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.semibold,
  },
  doneButton: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.medium,
    fontFamily: Fonts.medium,
  },
  searchContainer: {
    padding: Spacing[4],
    marginTop: Spacing[4],
  },
  searchInput: {
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
    fontSize: FontSizes.lg,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[6],
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.regular,
  },
});
