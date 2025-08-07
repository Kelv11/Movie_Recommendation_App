import { icons } from "@/constants/icons";
import React from "react";
import { Image, TextInput, TouchableOpacity } from "react-native";

interface SearchBarProps {
  onPress?: () => void;
  placeholder?: string;
}

const SearchBar = ({ onPress, placeholder = "Search" }: SearchBarProps) => {
  return (
    <TouchableOpacity
      className="flex-row items-center bg-dark-200 rounded-full px-5 py-4"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={icons.search}
        className="size-5 mr-3"
        resizeMode="contain"
        tintColor="#ab8ff"
      />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#a8b5db"
        className="flex-1 text-white"
        style={{ fontSize: 16 }}
        editable={false}
      />
    </TouchableOpacity>
  );
};

export default SearchBar;
