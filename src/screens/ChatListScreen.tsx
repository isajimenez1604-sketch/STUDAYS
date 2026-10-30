import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import BottomNavigation from "../components/BottomNavigation";
import { RootStackParamList } from "../navigation/AppNavigator";
import { chatListStyles } from "../styles/ChatListStyles";

type Props = NativeStackScreenProps<RootStackParamList, "ChatList">;

const conversations = [
  {
    name: "Grupo Cálculo II",
    time: "09:41",
    message: "Juan: ¿Alguien tiene los apuntes?",
    unread: 3,
  },
  {
    name: "Isabella Jiménez",
    time: "08:15",
    message: "Perfecto, nos vemos en la biblioteca",
    unread: 0,
  },
  {
    name: "Profesor Ramírez",
    time: "ayer",
    message: "Recuerden entregar el informe el viernes",
    unread: 1,
  },
];

export default function ChatListScreen({ navigation, route }: Props) {
  const { user } = route.params;
  const [query, setQuery] = useState("");
  const filteredConversations = useMemo(
    () =>
      conversations.filter((conversation) =>
        conversation.name.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [query]
  );

  return (
    <SafeAreaView style={chatListStyles.container}>
      <ScrollView
        contentContainerStyle={chatListStyles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={chatListStyles.header}>
          <Text style={chatListStyles.title}>Chats</Text>
          <TouchableOpacity
            style={chatListStyles.newChatButton}
            accessibilityLabel="Nuevo chat"
            onPress={() => setQuery("")}
          >
            <Ionicons name="create-outline" size={22} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        <View style={chatListStyles.searchBar}>
          <Ionicons name="search" size={18} color="#64748B" />
          <TextInput
            style={chatListStyles.searchInput}
            placeholder="Buscar conversación"
            placeholderTextColor="#94A3B8"
            value={query}
            onChangeText={setQuery}
            accessibilityLabel="Buscar conversación"
          />
        </View>

        {filteredConversations.map((conversation) => (
          <TouchableOpacity
            key={conversation.name}
            style={chatListStyles.chatCard}
            onPress={() =>
              navigation.navigate("Chat", {
                name: conversation.name,
                user,
              })
            }
            accessibilityRole="button"
          >
            <View style={chatListStyles.avatar}>
              <Text style={chatListStyles.avatarText}>
                {conversation.name.charAt(0)}
              </Text>
            </View>
            <View style={chatListStyles.chatInfo}>
              <View style={chatListStyles.chatTopRow}>
                <Text style={chatListStyles.chatName}>
                  {conversation.name}
                </Text>
                <Text style={chatListStyles.chatTime}>{conversation.time}</Text>
              </View>
              <Text style={chatListStyles.chatMessage} numberOfLines={1}>
                {conversation.message}
              </Text>
            </View>
            {conversation.unread > 0 ? (
              <View style={chatListStyles.unreadBadge}>
                <Text style={chatListStyles.unreadBadgeText}>
                  {conversation.unread}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        ))}
        {filteredConversations.length === 0 ? (
          <View style={chatListStyles.emptyCard}>
            <Text style={chatListStyles.emptyText}>
              No se encontraron conversaciones.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <BottomNavigation
        active="ChatList"
        navigation={navigation}
        user={user}
      />
    </SafeAreaView>
  );
}
