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

import { styles } from "../styles/RegisterStyles";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);

  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    useState(false);

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

            <Text style={styles.logoIcon}>
              🎓
            </Text>

            <Text style={styles.logo}>
              STUDAYS
            </Text>

            <Text style={styles.subtitle}>
              Organiza. Planifica. Aprende.
            </Text>

          </View>


          {/* Título */}
          <Text style={styles.title}>
            ¡Crea tu cuenta!
          </Text>

          <Text style={styles.description}>
            Regístrate para comenzar a organizar tus estudios
          </Text>


          {/* Nombre */}
          <View style={styles.inputContainer}>

            <Text style={styles.label}>
              Nombre completo
            </Text>

            <View style={styles.inputWrapper}>

              <Ionicons
                name="person-outline"
                size={20}
                color="#64748B"
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="Tu nombre"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />

            </View>

          </View>


          {/* Correo */}
          <View style={styles.inputContainer}>

            <Text style={styles.label}>
              Correo electrónico
            </Text>

            <View style={styles.inputWrapper}>

              <Ionicons
                name="mail-outline"
                size={20}
                color="#64748B"
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="ejemplo@correo.com"
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

              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#64748B"
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="Crea una contraseña"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() =>
                  setPasswordVisible(!passwordVisible)
                }
              >

                <Ionicons
                  name={
                    passwordVisible
                      ? "eye-outline"
                      : "eye-off-outline"
                  }
                  size={22}
                  color="#64748B"
                />

              </TouchableOpacity>

            </View>

          </View>


          {/* Confirmar contraseña */}
          <View style={styles.inputContainer}>

            <Text style={styles.label}>
              Confirmar contraseña
            </Text>

            <View style={styles.inputWrapper}>

              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#64748B"
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="Repite tu contraseña"
                placeholderTextColor="#94A3B8"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!confirmPasswordVisible}
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() =>
                  setConfirmPasswordVisible(
                    !confirmPasswordVisible
                  )
                }
              >

                <Ionicons
                  name={
                    confirmPasswordVisible
                      ? "eye-outline"
                      : "eye-off-outline"
                  }
                  size={22}
                  color="#64748B"
                />

              </TouchableOpacity>

            </View>

          </View>


          {/* Botón crear cuenta */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Home")}
            activeOpacity={0.8}
          >

            <Text style={styles.buttonText}>
              Crear cuenta
            </Text>

          </TouchableOpacity>


          {/* Ir al Login */}
          <View style={styles.loginContainer}>

            <Text style={styles.loginQuestion}>
              ¿Ya tienes una cuenta?
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
            >

              <Text style={styles.loginLink}>
                Inicia sesión
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