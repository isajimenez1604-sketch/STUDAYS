import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/AppNavigator";
import { AppUser } from "../services/authApi";
import { styles } from "../styles/HomeStyles";

type AppSection = "Home" | "Tasks" | "Calendar" | "Planner" | "ChatList";

type Props = {
  active: AppSection;
  navigation: NativeStackNavigationProp<RootStackParamList>;
  user: AppUser;
};

const sections: {
  name: AppSection;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
}[] = [
  { name: "Home", label: "Inicio", icon: "home" },
  { name: "Tasks", label: "Tareas", icon: "checkmark-circle-outline" },
  { name: "Calendar", label: "Calendario", icon: "calendar-outline" },
  { name: "Planner", label: "Planificador", icon: "time-outline" },
  { name: "ChatList", label: "Foro", icon: "chatbubbles" },
];

export default function BottomNavigation({
  active,
  navigation,
  user,
}: Props) {
  return (
    <View style={styles.bottomNav}>
      {sections.map((section) => {
        const selected = section.name === active;

        return (
          <TouchableOpacity
            key={section.name}
            style={styles.navItem}
            onPress={() => {
              if (section.name !== "Planner") {
                navigation.replace(section.name, { user });
              }
            }}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={section.label}
          >
            <Ionicons
              name={section.icon}
              size={23}
              color={selected ? "#3B82F6" : "#64748B"}
            />
            <Text
              style={[
                styles.navText,
                selected ? styles.navTextActive : null,
              ]}
            >
              {section.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
