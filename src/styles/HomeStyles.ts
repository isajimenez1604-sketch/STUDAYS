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

  greeting: {
    fontSize: 15,
    color: "#64748B",
    marginBottom: 3,
  },

  userName: {
    fontSize: 25,
    fontWeight: "700",
    color: "#1F2937",
  },

  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  summaryCard: {
    backgroundColor: "#3B82F6",
    borderRadius: 18,
    padding: 22,
    marginBottom: 25,
  },

  summaryTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  summaryNumber: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "800",
  },

  summaryText: {
    color: "#DBEAFE",
    fontSize: 14,
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },

  deliveryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 18,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  deliveryRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  deliveryIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  deliveryInfo: {
    flex: 1,
  },

  deliveryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },

  deliverySubtitle: {
    fontSize: 13,
    color: "#64748B",
  },

  deliveryDate: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3B82F6",
    marginTop: 5,
  },

  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },

  taskIcon: {
    marginRight: 12,
  },

  taskText: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
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