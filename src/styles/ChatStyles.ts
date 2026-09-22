import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F9FF",
  },

  keyboardView: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  backButton: {
    marginRight: 10,
  },

  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  headerAvatarText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  headerInfo: {
    flex: 1,
  },

  headerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },

  headerStatus: {
    fontSize: 12,
    color: "#64748B",
  },

  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  bubbleReceived: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 15,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
    maxWidth: "78%",
  },

  bubbleSent: {
    alignSelf: "flex-end",
    backgroundColor: "#3B82F6",
    borderRadius: 15,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
    maxWidth: "78%",
  },

  bubbleTextReceived: {
    fontSize: 15,
    color: "#1F2937",
  },

  bubbleTextSent: {
    fontSize: 15,
    color: "#FFFFFF",
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },

  input: {
    flex: 1,
    backgroundColor: "#F0F9FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    height: 44,
    paddingHorizontal: 14,
    marginRight: 8,
    color: "#1F2937",
  },

  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },
});
