import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import BottomNavigation from "../components/BottomNavigation";
import ThemeToggleButton from "../components/ThemeToggleButton";
import { useAppTheme } from "../context/ThemeContext";
import { useTasks } from "../hooks/useTasks";
import { RootStackParamList } from "../navigation/AppNavigator";
import {
  ApiError,
  AppTask,
  createTask,
  EditableTaskStatus,
} from "../services/authApi";
import { styles } from "../styles/HomeStyles";
import { taskStyles } from "../styles/TasksStyles";
import {
  formatDateString,
  getTaskColor,
  getTaskDueDateKey,
  parseDateString,
  toDueDateIso,
} from "../utils/taskDates";

type Props = NativeStackScreenProps<RootStackParamList, "Tasks">;

const STATUS_OPTIONS: { value: EditableTaskStatus; label: string }[] = [
  { value: "pending", label: "Pendiente" },
  { value: "in_progress", label: "En progreso" },
  { value: "completed", label: "Completada" },
];

function getTaskStatusLabel(task: AppTask): string {
  if (task.status === "overdue") return "Vencida";
  return STATUS_OPTIONS.find((option) => option.value === task.status)?.label ??
    "Pendiente";
}

export default function TasksScreen({ navigation, route }: Props) {
  const { user } = route.params;
  const { colors } = useAppTheme();
  const { tasks, loading, error, addTask, updateTask, deleteTask } = useTasks(
    user.id
  );
  const [selectedTask, setSelectedTask] = useState<AppTask | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [status, setStatus] = useState<EditableTaskStatus>("pending");
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const clearForm = () => {
    setSelectedTask(null);
    setTitle("");
    setDescription("");
    setDueDate(null);
    setStatus("pending");
    setFieldErrors({});
    setFormError("");
    setDatePickerOpen(false);
  };

  const selectTask = (task: AppTask) => {
    setSelectedTask(task);
    setTitle(task.title);
    setDescription(task.description ?? "");
    setDueDate(
      task.due_date
        ? parseDateString(getTaskDueDateKey(task.due_date))
        : null
    );
    setStatus(task.status === "overdue" ? "pending" : task.status);
    setFieldErrors({});
    setFormError("");
  };

  const handleDateChange = (
    _event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (Platform.OS === "android") setDatePickerOpen(false);
    if (selectedDate) setDueDate(selectedDate);
  };

  const handleSaveTask = async () => {
    if (saving) return;

    const errors: Record<string, string> = {};
    if (!title.trim()) errors.title = "El título es obligatorio";
    if (title.trim().length > 120) {
      errors.title = "El título debe tener máximo 120 caracteres";
    }
    if (description.trim().length > 1000) {
      errors.description = "La descripción debe tener máximo 1000 caracteres";
    }
    setFieldErrors(errors);
    setFormError("");
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      if (selectedTask) {
        await updateTask(selectedTask.id, {
          title: title.trim(),
          description: description.trim() || null,
          dueDate: dueDate ? toDueDateIso(dueDate) : null,
          status,
        });
      } else {
        const created = await createTask({
          title: title.trim(),
          description: description.trim(),
          dueDate: dueDate ? toDueDateIso(dueDate) : null,
        });
        addTask(created);
      }
      clearForm();
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.details) {
        setFieldErrors(requestError.details);
      } else {
        setFormError(
          requestError instanceof Error
            ? requestError.message
            : "No se pudo guardar la tarea"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = () => {
    if (!selectedTask) return;
    Alert.alert("Eliminar tarea", `¿Eliminar "${selectedTask.title}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          setSaving(true);
          try {
            await deleteTask(selectedTask.id);
            clearForm();
          } catch (requestError) {
            setFormError(
              requestError instanceof Error
                ? requestError.message
                : "No se pudo eliminar la tarea"
            );
          } finally {
            setSaving(false);
          }
        },
      },
    ]);
  };

  const handleQuickStatus = async (
    task: AppTask,
    nextStatus: EditableTaskStatus
  ) => {
    try {
      await updateTask(task.id, { status: nextStatus });
    } catch (requestError) {
      Alert.alert(
        "No se pudo actualizar",
        requestError instanceof Error
          ? requestError.message
          : "Intenta de nuevo."
      );
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        style={taskStyles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.secondaryText }]}>
              Organiza tu estudio
            </Text>
            <Text style={[styles.userName, { color: colors.text }]}>
              Mis tareas
            </Text>
          </View>
          <ThemeToggleButton />
        </View>

        <View
          style={[
            styles.formCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.inputLabel, { color: colors.text }]}>
            {selectedTask ? "Editar tarea" : "Nueva tarea"}
          </Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.input, color: colors.text, borderColor: colors.border },
              fieldErrors.title ? styles.inputError : null,
            ]}
            placeholder="Ej. Estudiar para el examen"
            placeholderTextColor="#94A3B8"
            value={title}
            onChangeText={(value) => {
              setTitle(value);
              setFieldErrors((current) => ({ ...current, title: "" }));
            }}
            maxLength={120}
            accessibilityLabel="Título de la tarea"
          />
          {fieldErrors.title ? (
            <Text style={styles.errorText}>{fieldErrors.title}</Text>
          ) : null}

          <Text style={[styles.inputLabel, { color: colors.text }]}>
            Descripción (opcional)
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.descriptionInput,
              { backgroundColor: colors.input, color: colors.text, borderColor: colors.border },
            ]}
            placeholder="Agrega detalles de la tarea"
            placeholderTextColor="#94A3B8"
            value={description}
            onChangeText={setDescription}
            maxLength={1000}
            multiline
            textAlignVertical="top"
            accessibilityLabel="Descripción de la tarea"
          />

          <Text style={[styles.inputLabel, { color: colors.text }]}>
            Fecha de entrega (opcional)
          </Text>
          <View style={taskStyles.dateActions}>
            <TouchableOpacity
              style={[
                taskStyles.dateButton,
                { backgroundColor: colors.input, borderColor: colors.border },
              ]}
              onPress={() => setDatePickerOpen((open) => !open)}
              accessibilityLabel="Seleccionar fecha de entrega"
            >
              <Ionicons
                name="calendar-outline"
                size={18}
                color={colors.secondaryText}
              />
              <Text style={[taskStyles.dateButtonText, { color: colors.text }]}>
                {dueDate ? dueDate.toLocaleDateString("es-MX") : "Elegir fecha"}
              </Text>
            </TouchableOpacity>
            {dueDate ? (
              <TouchableOpacity
                onPress={() => setDueDate(null)}
                accessibilityLabel="Quitar fecha"
              >
                <Text style={taskStyles.clearDate}>Quitar</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          {datePickerOpen ? (
            <View
              style={[
                taskStyles.datePicker,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <DateTimePicker
                value={dueDate ?? new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                onChange={handleDateChange}
                minimumDate={new Date(new Date().setHours(0, 0, 0, 0))}
              />
              {Platform.OS === "ios" ? (
                <TouchableOpacity
                  style={taskStyles.dateDoneButton}
                  onPress={() => setDatePickerOpen(false)}
                >
                  <Text style={taskStyles.dateDoneText}>Listo</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
          <Text style={[taskStyles.dateHint, { color: colors.secondaryText }]}>
            La fecha aparecerá en tu calendario.
          </Text>

          {selectedTask ? (
            <>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Estado
              </Text>
              <View style={taskStyles.statusOptions}>
                {STATUS_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      taskStyles.statusOption,
                      { borderColor: colors.border },
                      status === option.value
                        ? { backgroundColor: getTaskColor(option.value, null) }
                        : { backgroundColor: colors.surface },
                    ]}
                    onPress={() => setStatus(option.value)}
                  >
                    <Text
                      style={[
                        taskStyles.statusOptionText,
                        { color: status === option.value ? "#FFFFFF" : colors.text },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : null}

          {formError ? <Text style={styles.errorText}>{formError}</Text> : null}
          <TouchableOpacity
            style={[styles.createButton, saving && styles.buttonDisabled]}
            onPress={handleSaveTask}
            disabled={saving}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.createButtonText}>
                {selectedTask ? "Guardar cambios" : "Guardar tarea"}
              </Text>
            )}
          </TouchableOpacity>
          {selectedTask ? (
            <View style={taskStyles.formActions}>
              <TouchableOpacity
                style={taskStyles.cancelButton}
                onPress={clearForm}
                disabled={saving}
              >
                <Text style={[taskStyles.cancelText, { color: colors.secondaryText }]}>
                  Cancelar edición
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={taskStyles.deleteButton}
                onPress={handleDeleteTask}
                disabled={saving}
              >
                <Ionicons name="trash-outline" size={17} color="#DC2626" />
                <Text style={taskStyles.deleteText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        <View style={taskStyles.listHeading}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Todas tus tareas
          </Text>
          {!loading ? (
            <Text style={[taskStyles.taskCount, { color: colors.secondaryText }]}>
              {tasks.length}
            </Text>
          ) : null}
        </View>

        {loading ? (
          <ActivityIndicator color="#3B82F6" style={taskStyles.loading} />
        ) : error ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
              {error}
            </Text>
          </View>
        ) : tasks.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
              Aún no tienes tareas. Crea una y aparecerá aquí.
            </Text>
          </View>
        ) : (
          tasks.map((task) => {
            const taskColor = getTaskColor(task.status, task.due_date);
            const selected = selectedTask?.id === task.id;
            return (
              <TouchableOpacity
                key={task.id}
                style={[
                  styles.taskCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: selected ? taskColor : colors.border,
                  },
                ]}
                onPress={() => selectTask(task)}
                accessibilityRole="button"
                accessibilityLabel={`${task.title}, ${getTaskStatusLabel(task)}. Toca para editar`}
              >
                <View style={styles.taskRow}>
                  <Ionicons
                    name={
                      task.status === "completed"
                        ? "checkmark-circle"
                        : task.status === "overdue"
                          ? "alert-circle"
                          : "ellipse-outline"
                    }
                    size={23}
                    color={taskColor}
                    style={styles.taskIcon}
                  />
                  <View style={styles.taskInfo}>
                    <Text style={[styles.taskText, { color: taskColor }]}>
                      {task.title}
                    </Text>
                    <Text style={[taskStyles.statusLabel, { color: taskColor }]}>
                      {getTaskStatusLabel(task)}
                    </Text>
                    {task.description ? (
                      <Text style={[styles.taskDescription, { color: colors.secondaryText }]}>
                        {task.description}
                      </Text>
                    ) : null}
                    {task.due_date ? (
                      <View style={taskStyles.dueDateRow}>
                        <Ionicons
                          name="calendar-outline"
                          size={15}
                          color={taskColor}
                        />
                        <Text style={[taskStyles.dueDateText, { color: taskColor }]}>
                          {formatDateString(task.due_date)}
                        </Text>
                      </View>
                    ) : null}
                    {task.status !== "completed" ? (
                      <TouchableOpacity
                        style={taskStyles.completeAction}
                        onPress={() => handleQuickStatus(task, "completed")}
                      >
                        <Text style={taskStyles.completeActionText}>
                          Marcar completada
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
        </ScrollView>

        {!keyboardVisible ? (
          <BottomNavigation
            active="Tasks"
            navigation={navigation}
            user={user}
            themeColors={colors}
          />
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
