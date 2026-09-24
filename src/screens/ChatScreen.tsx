import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/AppNavigator";

import { styles } from "../styles/ChatStyles";

type Props = NativeStackScreenProps<RootStackParamList, "Chat">;

export default function ChatScreen({ navigation, route }: Props) {
  const { name } = route.params;

  const [message, setMessage] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >

        {/* Encabezado */}
        <View style={styles.header}>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >

            <Ionicons
              name="chevron-back"
              size={26}
              color="#1F2937"
            />

          </TouchableOpacity>


          <View style={styles.headerAvatar}>

            <Text style={styles.headerAvatarText}>
              {name.charAt(0)}
            </Text>

          </View>


          <View style={styles.headerInfo}>

            <Text style={styles.headerName}>
              {name}
            </Text>

            <Text style={styles.headerStatus}>
              en línea
            </Text>

          </View>

        </View>


        {/* Mensajes */}
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >

          {/* Mensaje recibido */}
          <View style={styles.bubbleReceived}>

            <Text style={styles.bubbleTextReceived}>
              ¿Ya viste el horario de exámenes?
            </Text>

          </View>


          {/* Mensaje enviado */}
          <View style={styles.bubbleSent}>

            <Text style={styles.bubbleTextSent}>
              Sí, Cálculo II quedó el jueves
            </Text>

          </View>


          {/* Mensaje recibido */}
          <View style={styles.bubbleReceived}>

            <Text style={styles.bubbleTextReceived}>
              ¿Estudiamos mañana en la biblioteca?
            </Text>

          </View>


          {/* Mensaje enviado */}
          <View style={styles.bubbleSent}>

            <Text style={styles.bubbleTextSent}>
              Dale, a las 3pm
            </Text>

          </View>

        </ScrollView>


        {/* Barra de entrada */}
        <View style={styles.inputBar}>

          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje"
            placeholderTextColor="#94A3B8"
            value={message}
            onChangeText={setMessage}
          />

          <TouchableOpacity style={styles.sendButton}>

            <Ionicons
              name="send"
              size={18}
              color="#FFFFFF"
            />

          </TouchableOpacity>

        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
