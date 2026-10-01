import Constants from "expo-constants";
import { Platform } from "react-native";

const API_PORT = 3000;

// Detecta automáticamente la IP de tu PC (la misma que usa Expo para el bundler),
// así funciona en celular físico y en emulador sin tocar nada.
function getHost(): string {
  const hostUri = Constants.expoConfig?.hostUri; // ej: "192.168.1.10:8081"
  if (hostUri) {
    return hostUri.split(":")[0];
  }
  return Platform.OS === "android" ? "10.0.2.2" : "localhost";
}

export const API_URL = `http://${getHost()}:${API_PORT}/api/v1`;
