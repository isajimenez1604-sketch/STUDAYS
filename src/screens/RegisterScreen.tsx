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
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/AppNavigator";

import { styles } from "../styles/RegisterStyles";

import { ApiError, registerUser } from "../services/authApi";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

type FieldErrors = Partial<
  Record<"name" | "email" | "password" | "confirmPassword", string>
>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);

  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [generalError, setGeneralError] = useState("");

  // Validación básica antes de llamar a la API
  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};

    if (name.trim().length < 2) {
      errors.name = "El nombre debe tener al menos 2 caracteres";
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = "El correo electrónico no es válido";
    }
    if (password.length < 8) {
      errors.password = "La contraseña debe tener al menos 8 caracteres";
    }
    if (confirmPassword !== password) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }

    return errors;
  };

  const handleRegister = async () => {
    if (loading) return;

    setGeneralError("");

    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    try {
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      });

      Alert.alert(
        "¡Cuenta creada!",
        "Tu cuenta se registró correctamente.",
        [
          {
            text: "Continuar",
            onPress: () => navigation.navigate("Login"),
          },
        ]
      );
    } catch (error) {
      if (error instanceof ApiError) {
        // Errores de validación del servidor por campo
        if (error.details) {
          setFieldErrors(error.details as FieldErrors);
        }

        // Correo ya registrado
        if (error.code === "CONFLICT") {
          setFieldErrors({ email: error.message });
        } else if (!error.details) {
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

            <View
              style={[
                styles.inputWrapper,
                fieldErrors.name && styles.inputWrapperError,
              ]}
            >

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

            {fieldErrors.name && (
              <Text style={styles.errorText}>{fieldErrors.name}</Text>
            )}

          </View>


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

            {fieldErrors.password && (
              <Text style={styles.errorText}>{fieldErrors.password}</Text>
            )}

          </View>


          {/* Confirmar contraseña */}
          <View style={styles.inputContainer}>

            <Text style={styles.label}>
              Confirmar contraseña
            </Text>

            <View
              style={[
                styles.inputWrapper,
                fieldErrors.confirmPassword && styles.inputWrapperError,
              ]}
            >

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

            {fieldErrors.confirmPassword && (
              <Text style={styles.errorText}>
                {fieldErrors.confirmPassword}
              </Text>
            )}

          </View>


          {/* Error general (red, servidor, etc.) */}
          {generalError !== "" && (
            <Text style={styles.generalError}>{generalError}</Text>
          )}


          {/* Botón crear cuenta */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >

            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                Crear cuenta
              </Text>
            )}

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
