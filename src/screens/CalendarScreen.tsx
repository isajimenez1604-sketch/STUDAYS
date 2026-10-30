import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import BottomNavigation from "../components/BottomNavigation";
import { useTasks } from "../hooks/useTasks";
import { RootStackParamList } from "../navigation/AppNavigator";
import { styles } from "../styles/HomeStyles";
import { calendarStyles } from "../styles/CalendarStyles";
import { formatDateString, getLocalDateString } from "../utils/taskDates";

type Props = NativeStackScreenProps<RootStackParamList, "Calendar">;

type CalendarDay = {
  date: Date;
  dateKey: string;
  inMonth: boolean;
};

const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"];

function getCalendarDays(month: Date): CalendarDay[] {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const start = new Date(
    firstDay.getFullYear(),
    firstDay.getMonth(),
    firstDay.getDate() - offset
  );

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + index
    );
    return {
      date,
      dateKey: getLocalDateString(date),
      inMonth: date.getMonth() === month.getMonth(),
    };
  });
}

export default function CalendarScreen({ navigation, route }: Props) {
  const { user } = route.params;
  const { tasks, loading, error } = useTasks(user.id);
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(() =>
    getLocalDateString(new Date())
  );

  const calendarDays = useMemo(() => getCalendarDays(month), [month]);
  const tasksByDate = useMemo(() => {
    const grouped = new Map<string, typeof tasks>();
    for (const task of tasks) {
      if (!task.due_date) continue;
      const dateKey = task.due_date.slice(0, 10);
      grouped.set(dateKey, [...(grouped.get(dateKey) ?? []), task]);
    }
    return grouped;
  }, [tasks]);
  const selectedTasks = tasksByDate.get(selectedDate) ?? [];
  const monthLabel = month.toLocaleDateString("es-MX", {
    month: "long",
    year: "numeric",
  });

  const changeMonth = (amount: number) => {
    setMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + amount, 1)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Tus fechas de entrega</Text>
            <Text style={styles.userName}>Calendario</Text>
          </View>
          <Ionicons name="calendar-outline" size={27} color="#3B82F6" />
        </View>

        <View style={calendarStyles.calendarCard}>
          <View style={calendarStyles.monthHeader}>
            <TouchableOpacity
              onPress={() => changeMonth(-1)}
              style={calendarStyles.monthButton}
              accessibilityLabel="Mes anterior"
            >
              <Ionicons name="chevron-back" size={21} color="#1F2937" />
            </TouchableOpacity>
            <Text style={calendarStyles.monthLabel}>
              {monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
            </Text>
            <TouchableOpacity
              onPress={() => changeMonth(1)}
              style={calendarStyles.monthButton}
              accessibilityLabel="Mes siguiente"
            >
              <Ionicons name="chevron-forward" size={21} color="#1F2937" />
            </TouchableOpacity>
          </View>

          <View style={calendarStyles.grid}>
            {WEEKDAYS.map((day, index) => (
              <Text key={`${day}-${index}`} style={calendarStyles.weekday}>
                {day}
              </Text>
            ))}
            {calendarDays.map(({ date, dateKey, inMonth }) => {
              const isSelected = dateKey === selectedDate;
              const hasTasks = (tasksByDate.get(dateKey)?.length ?? 0) > 0;
              return (
                <TouchableOpacity
                  key={dateKey}
                  style={[
                    calendarStyles.dayCell,
                    isSelected ? calendarStyles.selectedDay : null,
                  ]}
                  onPress={() => setSelectedDate(dateKey)}
                  accessibilityRole="button"
                  accessibilityLabel={`${date.getDate()} ${date.toLocaleDateString(
                    "es-MX",
                    { month: "long" }
                  )}${hasTasks ? ", tiene tareas" : ""}`}
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text
                    style={[
                      calendarStyles.dayText,
                      !inMonth ? calendarStyles.outsideMonthDay : null,
                      isSelected ? calendarStyles.selectedDayText : null,
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                  <View
                    style={[
                      calendarStyles.dayMarker,
                      hasTasks ? calendarStyles.dayWithTask : null,
                      isSelected ? calendarStyles.selectedMarker : null,
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          {loading ? (
            <ActivityIndicator color="#3B82F6" style={calendarStyles.loading} />
          ) : error ? (
            <Text style={calendarStyles.errorText}>{error}</Text>
          ) : null}
        </View>

        <Text style={styles.sectionTitle}>
          {formatDateString(selectedDate)}
        </Text>
        {loading ? null : selectedTasks.length > 0 ? (
          selectedTasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskRow}>
                <Ionicons
                  name="ellipse-outline"
                  size={23}
                  color="#3B82F6"
                  style={styles.taskIcon}
                />
                <View style={styles.taskInfo}>
                  <Text style={styles.taskText}>{task.title}</Text>
                  {task.description ? (
                    <Text style={styles.taskDescription}>
                      {task.description}
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No hay tareas programadas para este día.
            </Text>
          </View>
        )}
      </ScrollView>

      <BottomNavigation active="Calendar" navigation={navigation} user={user} />
    </SafeAreaView>
  );
}
