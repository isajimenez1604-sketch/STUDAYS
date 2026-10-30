import React, { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import BottomNavigation from "../components/BottomNavigation";
import { useTasks } from "../hooks/useTasks";
import { RootStackParamList } from "../navigation/AppNavigator";
import {
  ApiError,
  createTask,
} from "../services/authApi";
import { styles } from "../styles/HomeStyles";
import { taskStyles } from "../styles/TasksStyles";
import { formatDateString, parseDateString } from "../utils/taskDates";

type Props = NativeStackScreenProps<RootStackParamList, "Tasks">;

export default function TasksScreen({ navigation, route }: Props) {
  const { user } = route.params;
  const { tasks, loading, error, addTask } = useTasks(user.id);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");

  const handleCreateTask = async () => {
    if (saving) return;

    const errors: Record<string, string> = {};
    if (!title.trim()) errors.title = "El título es obligatorio";
    if (title.trim().length > 120) {
      errors.title = "El título debe tener máximo 120 caracteres";
    }
    if (description.trim().length > 1000) {
      errors.description = "La descripción debe tener máximo 1000 caracteres";
    }
    if (dueDate && !parseDateString(dueDate)) {
      errors.dueDate = "Usa una fecha válida con formato AAAA-MM-DD";
    }

    setFieldErrors(errors);
    setFormError("");
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      const task = await createTask({
        userId: user.id,
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || null,
      });
      addTask(task);
      setTitle("");
      setDescription("");
      setDueDate("");
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Organiza tu estudio</Text>
            <Text style={styles.userName}>Mis tareas</Text>
          </View>
          <Ionicons name="checkmark-circle-outline" size={27} color="#3B82F6" />
        </View>

        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>Nueva tarea</Text>
          <TextInput
            style={[styles.input, fieldErrors.title ? styles.inputError : null]}
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

          <Text style={styles.inputLabel}>Descripción (opcional)</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Agrega detalles de la tarea"
            placeholderTextColor="#94A3B8"
            value={description}
            onChangeText={setDescription}
            maxLength={1000}
            multiline
            textAlignVertical="top"
            accessibilityLabel="Descripción de la tarea"
          />
          {fieldErrors.description ? (
            <Text style={styles.errorText}>{fieldErrors.description}</Text>
          ) : null}

          <Text style={styles.inputLabel}>Fecha de entrega (opcional)</Text>
          <TextInput
            style={[styles.input, fieldErrors.dueDate ? styles.inputError : null]}
            placeholder="AAAA-MM-DD"
            placeholderTextColor="#94A3B8"
            value={dueDate}
            onChangeText={(value) => {
              setDueDate(value);
              setFieldErrors((current) => ({ ...current, dueDate: "" }));
            }}
            maxLength={10}
            keyboardType="numbers-and-punctuation"
            accessibilityLabel="Fecha de entrega"
          />
          <Text style={taskStyles.dateHint}>
            La fecha aparecerá en tu calendario.
          </Text>
          {fieldErrors.dueDate ? (
            <Text style={styles.errorText}>{fieldErrors.dueDate}</Text>
          ) : null}

          {formError ? <Text style={styles.errorText}>{formError}</Text> : null}
          <TouchableOpacity
            style={[styles.createButton, saving && styles.buttonDisabled]}
            onPress={handleCreateTask}
            disabled={saving}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.createButtonText}>Guardar tarea</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={taskStyles.listHeading}>
          <Text style={styles.sectionTitle}>Todas tus tareas</Text>
          {!loading ? (
            <Text style={taskStyles.taskCount}>{tasks.length}</Text>
          ) : null}
        </View>

        {loading ? (
          <ActivityIndicator color="#3B82F6" style={taskStyles.loading} />
        ) : error ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>{error}</Text>
          </View>
        ) : tasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              Aún no tienes tareas. Crea una y aparecerá aquí.
            </Text>
          </View>
        ) : (
          tasks.map((task) => (
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
                  {task.due_date ? (
                    <View style={taskStyles.dueDateRow}>
                      <Ionicons
                        name="calendar-outline"
                        size={15}
                        color="#3B82F6"
                      />
                      <Text style={taskStyles.dueDateText}>
                        {formatDateString(task.due_date)}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <BottomNavigation active="Tasks" navigation={navigation} user={user} />
    </SafeAreaView>
  );
}
