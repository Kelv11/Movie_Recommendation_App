import { icons } from "@/constants/icons";
import React from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  onPress?: () => void;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSearch?: () => void;
}

const SearchBar = ({
  onPress,
  value,
  onChangeText,
  onSearch,
  placeholder = "Search",
}: SearchBarProps) => {
  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
      <TouchableOpacity onPress={handleSearch} activeOpacity={0.7}>
        <Image
          source={icons.search}
          className="size-5 mr-3"
          resizeMode="contain"
          tintColor="#ab8ff"
        />
      </TouchableOpacity>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={handleSearch}
        placeholderTextColor="#a8b5db"
        className="flex-1 text-white"
        style={{ fontSize: 16 }}
        editable={true}
        returnKeyType="search"
      />
    </View>
  );
};

export default SearchBar;
