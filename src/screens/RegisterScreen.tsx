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
import { useAppTheme } from "../context/ThemeContext";
import ThemeToggleButton from "../components/ThemeToggleButton";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

type FieldErrors = Partial<
  Record<"name" | "email" | "password" | "confirmPassword", string>
>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
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
      const user = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      });

      Alert.alert(
        "¡Cuenta creada!",
        `Tu cuenta se registró correctamente, ${user.name}.`,
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
        if (error.code === "EMAIL_ALREADY_EXISTS") {
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
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

            <Text style={[styles.subtitle, { color: colors.text }]}>
              Organiza. Planifica. Aprende.
            </Text>
            <ThemeToggleButton />

          </View>


          {/* Título */}
          <Text style={[styles.title, { color: colors.text }]}>
            ¡Crea tu cuenta!
          </Text>

          <Text style={[styles.description, { color: colors.secondaryText }]}>
            Regístrate para comenzar a organizar tus estudios
          </Text>


          {/* Nombre */}
          <View style={styles.inputContainer}>

            <Text style={[styles.label, { color: colors.text }]}>
              Nombre completo
            </Text>

            <View
              style={[
                styles.inputWrapper,
                fieldErrors.name && styles.inputWrapperError,
                { backgroundColor: colors.surface, borderColor: fieldErrors.name ? "#EF4444" : colors.border },
              ]}
            >

              <Ionicons
                name="person-outline"
                size={20}
                color={colors.secondaryText}
                style={styles.inputIcon}
              />

              <TextInput
                style={[styles.input, { color: colors.text }]}
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

            <Text style={[styles.label, { color: colors.text }]}>
              Correo electrónico
            </Text>

            <View
              style={[
                styles.inputWrapper,
                fieldErrors.email && styles.inputWrapperError,
                { backgroundColor: colors.surface, borderColor: fieldErrors.email ? "#EF4444" : colors.border },
              ]}
            >

              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.secondaryText}
                style={styles.inputIcon}
              />

              <TextInput
                style={[styles.input, { color: colors.text }]}
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

            <Text style={[styles.label, { color: colors.text }]}>
              Contraseña
            </Text>

            <View
              style={[
                styles.inputWrapper,
                fieldErrors.password && styles.inputWrapperError,
                { backgroundColor: colors.surface, borderColor: fieldErrors.password ? "#EF4444" : colors.border },
              ]}
            >

              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={colors.secondaryText}
                style={styles.inputIcon}
              />

              <TextInput
                style={[styles.input, { color: colors.text }]}
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
                  color={colors.secondaryText}
                />

              </TouchableOpacity>

            </View>

            {fieldErrors.password && (
              <Text style={styles.errorText}>{fieldErrors.password}</Text>
            )}

          </View>


          {/* Confirmar contraseña */}
          <View style={styles.inputContainer}>

            <Text style={[styles.label, { color: colors.text }]}>
              Confirmar contraseña
            </Text>

            <View
              style={[
                styles.inputWrapper,
                fieldErrors.confirmPassword && styles.inputWrapperError,
                { backgroundColor: colors.surface, borderColor: fieldErrors.confirmPassword ? "#EF4444" : colors.border },
              ]}
            >

              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={colors.secondaryText}
                style={styles.inputIcon}
              />

              <TextInput
                style={[styles.input, { color: colors.text }]}
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
                  color={colors.secondaryText}
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

            <Text style={[styles.loginQuestion, { color: colors.secondaryText }]}>
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


      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
