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

import { styles } from "../styles/LoginStyles";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.header}>
            <Text style={styles.logoIcon}>🎓</Text>

            <Text style={styles.logo}>STUDAYS</Text>

            <Text style={styles.subtitle}>
              Organiza. Planifica. Aprende.
            </Text>
          </View>

          {/* Bienvenida */}
          <Text style={styles.welcome}>
            ¡Bienvenido! 👋
          </Text>

          <Text style={styles.description}>
            Inicia sesión para continuar
          </Text>

          {/* Correo */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Correo electrónico
            </Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.icon}>✉</Text>

              <TextInput
                style={styles.input}
                placeholder="Correo@correo.com"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Contraseña */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Contraseña
            </Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.icon}>🔒</Text>

              <TextInput
                style={styles.input}
                placeholder="Tu contraseña"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Ionicons
                  name={passwordVisible ? "eye" : "eye-off"}
                  size={22}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botón */}
          <TouchableOpacity
            style={styles.button}
              onPress={() => navigation.navigate("Home")}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              Iniciar sesión
            </Text>
          </TouchableOpacity>

          {/* Recuperar contraseña */}
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => {}}
          >
            <Text style={styles.forgotPasswordText}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>

          {/* Registro */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerQuestion}>
              ¿No tienes una cuenta?
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.registerLink}>
                Regístrate
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Decoración inferior */}
        <View style={styles.bottomDecorationLight} />
        <View style={styles.bottomDecoration} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}