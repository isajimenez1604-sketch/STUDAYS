import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/AppNavigator";
import { chatStyles } from "../styles/ChatStyles";

type Props = NativeStackScreenProps<RootStackParamList, "Chat">;
type Message = { text: string; sent: boolean };

export default function ChatScreen({ navigation, route }: Props) {
  const { name } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { text: "¿Ya viste el horario de exámenes?", sent: false },
    { text: "Sí, Cálculo II quedó el jueves", sent: true },
    { text: "¿Estudiamos mañana en la biblioteca?", sent: false },
    { text: "Dale, a las 3pm", sent: true },
  ]);

  const sendMessage = () => {
    const text = message.trim();
    if (!text) return;
    setMessages((currentMessages) => [
      ...currentMessages,
      { text, sent: true },
    ]);
    setMessage("");
  };

  return (
    <SafeAreaView style={chatStyles.container}>
      <KeyboardAvoidingView
        style={chatStyles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={chatStyles.header}>
          <TouchableOpacity
            style={chatStyles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Volver a chats"
          >
            <Ionicons name="chevron-back" size={26} color="#1F2937" />
          </TouchableOpacity>
          <View style={chatStyles.headerAvatar}>
            <Text style={chatStyles.headerAvatarText}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={chatStyles.headerInfo}>
            <Text style={chatStyles.headerName}>{name}</Text>
            <Text style={chatStyles.headerStatus}>en línea</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={chatStyles.content}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((item, index) => (
            <View
              key={`${index}-${item.text}`}
              style={
                item.sent ? chatStyles.bubbleSent : chatStyles.bubbleReceived
              }
            >
              <Text
                style={
                  item.sent
                    ? chatStyles.bubbleTextSent
                    : chatStyles.bubbleTextReceived
                }
              >
                {item.text}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={chatStyles.inputBar}>
          <TextInput
            style={chatStyles.input}
            placeholder="Escribe un mensaje"
            placeholderTextColor="#94A3B8"
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            accessibilityLabel="Escribe un mensaje"
          />
          <TouchableOpacity
            style={chatStyles.sendButton}
            onPress={sendMessage}
            accessibilityLabel="Enviar mensaje"
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
