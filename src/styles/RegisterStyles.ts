import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F9FF",
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 30,
  },

  header: {
    alignItems: "center",
    marginBottom: 28,
  },

  logoIcon: {
    fontSize: 40,
    marginBottom: 5,
  },

  logo: {
    fontSize: 34,
    fontWeight: "800",
    color: "#3B82F6",
    letterSpacing: 1,
  },

  subtitle: {
    fontSize: 14,
    color: "#1F2937",
    marginTop: 5,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 5,
  },

  description: {
    fontSize: 15,
    color: "#64748B",
    marginBottom: 24,
  },

  inputContainer: {
    marginBottom: 16,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    height: 54,
    paddingHorizontal: 15,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
  },

  eyeButton: {
    padding: 5,
  },

  button: {
    backgroundColor: "#3B82F6",
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },

  loginQuestion: {
    color: "#64748B",
    fontSize: 14,
  },

  loginLink: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 5,
  },

  bottomDecorationLight: {
    position: "absolute",
    bottom: -85,
    left: -80,
    right: -80,
    height: 130,
    backgroundColor: "#BFDBFE",
    borderRadius: 100,
    opacity: 0.7,
  },

  bottomDecoration: {
    position: "absolute",
    bottom: -60,
    left: -50,
    right: -50,
    height: 120,
    backgroundColor: "#60A5FA",
    borderRadius: 100,
    opacity: 0.45,
  },
});