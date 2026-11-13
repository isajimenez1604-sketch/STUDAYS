import { StyleSheet } from "react-native";

export const taskStyles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },

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

  dateActions: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  dateButton: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 13,
    flex: 1,
  },

  dateButtonText: {
    fontSize: 14,
    marginLeft: 9,
  },

  clearDate: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 12,
  },

  datePicker: {
    marginBottom: 12,
  },

  dateDoneButton: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 14,
  },

  dateDoneText: {
    color: "#3B82F6",
    fontWeight: "700",
  },

  statusOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },

  statusOption: {
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  statusOptionText: {
    fontSize: 12,
    fontWeight: "600",
  },

  formActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },

  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 4,
  },

  cancelText: {
    fontSize: 13,
    fontWeight: "600",
  },

  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },

  deleteText: {
    color: "#DC2626",
    fontWeight: "600",
    fontSize: 13,
    marginLeft: 5,
  },

  statusLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
  },

  completeAction: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingVertical: 5,
  },

  completeActionText: {
    color: "#16A34A",
    fontSize: 12,
    fontWeight: "700",
  },
});
