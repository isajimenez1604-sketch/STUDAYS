import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

import ThemeToggleButton from "../components/ThemeToggleButton";
import { useAppTheme } from "../context/ThemeContext";
import { RootStackParamList } from "../navigation/AppNavigator";
import {
  ApiError,
  requestPasswordReset,
  resetPassword,
} from "../services/authApi";
import { styles } from "../styles/LoginStyles";

type Props = NativeStackScreenProps<RootStackParamList, "ForgotPassword">;

const EMAIL_REGEX = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRequestCode = async () => {
    setError("");
    setMessage("");
    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    setLoading(true);
    try {
      const response = await requestPasswordReset(email.trim());
      setMessage(response);
      setCodeSent(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo solicitar el código."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError("");
    if (!/^\d{6}$/.test(code.trim())) {
      setError("El código debe tener 6 dígitos.");
      return;
    }
    if (newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        email: email.trim(),
        code: code.trim(),
        newPassword,
      });
      Alert.alert(
        "Contraseña actualizada",
        "Ya puedes iniciar sesión con tu nueva contraseña.",
        [{ text: "Continuar", onPress: () => navigation.replace("Login") }]
      );
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.details) {
        setError(
          requestError.details.code ??
            requestError.details.newPassword ??
            "Revisa los datos ingresados."
        );
      } else {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "No se pudo cambiar la contraseña."
        );
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
        <View style={styles.header}>
          <Text style={styles.logoIcon}>🎓</Text>
          <Text style={styles.logo}>STUDAYS</Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            Recupera tu contraseña
          </Text>
          <ThemeToggleButton />
        </View>

        <Text style={[styles.welcome, { color: colors.text }]}>
          {codeSent ? "Ingresa tu código" : "¿Olvidaste tu contraseña?"}
        </Text>
        <Text style={[styles.description, { color: colors.secondaryText }]}>
          {codeSent
            ? "Revisa tu correo. El código vence en 10 minutos."
            : "Te enviaremos un código de recuperación a tu correo."}
        </Text>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>
            Correo electrónico
          </Text>
          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons name="mail-outline" size={20} color={colors.secondaryText} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="correo@ejemplo.com"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!codeSent}
            />
          </View>
        </View>

        {codeSent ? (
          <>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>
                Código de 6 dígitos
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="123456"
                  placeholderTextColor="#94A3B8"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>
                Nueva contraseña
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Mínimo 8 caracteres"
                  placeholderTextColor="#94A3B8"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>
          </>
        ) : null}

        {message ? (
          <Text style={[styles.registerQuestion, { color: colors.secondaryText }]}>
            {message}
          </Text>
        ) : null}
        {error ? <Text style={styles.generalError}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={codeSent ? handleResetPassword : handleRequestCode}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>
              {codeSent ? "Cambiar contraseña" : "Enviar código"}
            </Text>
          )}
        </TouchableOpacity>

        {codeSent ? (
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={handleRequestCode}
            disabled={loading}
          >
            <Text style={styles.forgotPasswordText}>Enviar otro código</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.forgotPasswordText}>Volver al inicio de sesión</Text>
        </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
