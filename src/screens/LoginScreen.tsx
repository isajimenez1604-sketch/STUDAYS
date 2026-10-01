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
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/AppNavigator";

import { styles } from "../styles/LoginStyles";

import { ApiError, loginUser } from "../services/authApi";
import { saveToken } from "../services/session";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

type FieldErrors = Partial<Record<"email" | "password", string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState("");

  const handleLogin = async () => {
    if (loading) return;

    setGeneralError("");

    // Validación básica antes de llamar a la API
    const errors: FieldErrors = {};
    if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = "El correo electrónico no es válido";
    }
    if (password.length === 0) {
      errors.password = "La contraseña es obligatoria";
    }
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    try {
      const { token } = await loginUser({
        email: email.trim(),
        password,
      });

      await saveToken(token);

      // replace: así el botón "atrás" no vuelve al login
      navigation.replace("Home");
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.details) {
          setFieldErrors(error.details as FieldErrors);
        } else {
          setGeneralError(error.message);
        }
      } else {
        setGeneralError("Ocurrió un error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

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

            <View
              style={[
                styles.inputWrapper,
                fieldErrors.email && styles.inputWrapperError,
              ]}
            >
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

            {fieldErrors.email && (
              <Text style={styles.errorText}>{fieldErrors.email}</Text>
            )}
          </View>

          {/* Contraseña */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Contraseña
            </Text>

            <View
              style={[
                styles.inputWrapper,
                fieldErrors.password && styles.inputWrapperError,
              ]}
            >
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

            {fieldErrors.password && (
              <Text style={styles.errorText}>{fieldErrors.password}</Text>
            )}
          </View>

          {/* Error general (credenciales, red, servidor) */}
          {generalError !== "" && (
            <Text style={styles.generalError}>{generalError}</Text>
          )}

          {/* Botón */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                Iniciar sesión
              </Text>
            )}
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
