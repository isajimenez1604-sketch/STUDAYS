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
    paddingTop: 35,
    paddingBottom: 30,
  },

  header: {
    alignItems: "center",
    marginBottom: 35,
  },

  logoIcon: {
    fontSize: 45,
    marginBottom: 5,
  },

  logo: {
    fontSize: 38,
    fontWeight: "800",
    color: "#3B82F6",
    letterSpacing: 1,
  },

  subtitle: {
    fontSize: 15,
    color: "#1F2937",
    marginTop: 5,
  },

  welcome: {
    fontSize: 27,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 5,
  },

  description: {
    fontSize: 16,
    color: "#64748B",
    marginBottom: 28,
  },

  inputContainer: {
    marginBottom: 18,
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

  icon: {
    fontSize: 20,
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
  },

  eyeButton: {
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
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

  forgotPassword: {
    alignItems: "center",
    marginTop: 18,
  },

  forgotPasswordText: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "600",
  },

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 45,
  },

  registerQuestion: {
    color: "#64748B",
    fontSize: 14,
  },

  registerLink: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 5,
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
});