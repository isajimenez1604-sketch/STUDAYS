import { StyleSheet } from "react-native";

export const taskStyles = StyleSheet.create({
  dateHint: {
    color: "#64748B",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 15,
  },

  listHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  taskCount: {
    color: "#64748B",
    fontSize: 14,
    marginBottom: 12,
  },

  loading: {
    marginTop: 16,
  },

  dueDateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  dueDateText: {
    color: "#3B82F6",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 5,
  },
});
