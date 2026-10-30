import { StyleSheet } from "react-native";

export const calendarStyles = StyleSheet.create({
  calendarCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  monthButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  monthLabel: {
    color: "#1F2937",
    fontSize: 17,
    fontWeight: "700",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  weekday: {
    width: "14.2857%",
    textAlign: "center",
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    paddingVertical: 9,
  },

  dayCell: {
    width: "14.2857%",
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },

  selectedDay: {
    backgroundColor: "#3B82F6",
  },

  dayText: {
    color: "#1F2937",
    fontSize: 14,
  },

  outsideMonthDay: {
    color: "#CBD5E1",
  },

  selectedDayText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  dayMarker: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
    backgroundColor: "transparent",
  },

  dayWithTask: {
    backgroundColor: "#3B82F6",
  },

  selectedMarker: {
    backgroundColor: "#FFFFFF",
  },

  loading: {
    marginTop: 12,
  },

  errorText: {
    color: "#DC2626",
    fontSize: 13,
    textAlign: "center",
    marginTop: 12,
  },
});
