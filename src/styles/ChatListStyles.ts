import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F9FF",
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 100,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  title: {
    fontSize: 25,
    fontWeight: "700",
    color: "#1F2937",
  },

  newChatButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },

  searchInput: {
    marginLeft: 8,
    fontSize: 15,
    color: "#1F2937",
    flex: 1,
  },

  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  chatInfo: {
    flex: 1,
  },

  chatTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  chatName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },

  chatTime: {
    fontSize: 12,
    color: "#64748B",
  },

  chatMessage: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },

  unreadBadge: {
    backgroundColor: "#3B82F6",
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginLeft: 8,
  },

  unreadBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  bottomNav: {
    position: "absolute",
    left: 15,
    right: 15,
    bottom: 15,
    height: 70,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },

  navText: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 4,
  },

  navTextActive: {
    color: "#3B82F6",
    fontWeight: "700",
  },
});
