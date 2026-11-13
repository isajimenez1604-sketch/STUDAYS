import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import BottomNavigation from "../components/BottomNavigation";
import ThemeToggleButton from "../components/ThemeToggleButton";
import { useAppTheme } from "../context/ThemeContext";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useTasks } from "../hooks/useTasks";
import { ForumPost, getForumPosts } from "../services/forumApi";
import { clearCurrentUser } from "../services/currentUser";
import { styles } from "../styles/HomeStyles";
import {
  formatDateString,
  getDeadlineMessage,
  getTaskColor,
  getTasksDueSoon,
} from "../utils/taskDates";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation, route }: Props) {
  const { user } = route.params;
  const { colors } = useAppTheme();
  const { tasks, loading, error } = useTasks(user.id);
  const dueSoonTasks = getTasksDueSoon(tasks);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [forumLoading, setForumLoading] = useState(true);
  const [forumError, setForumError] = useState("");

  useEffect(() => {
    let active = true;
    getForumPosts()
      .then((posts) => {
        if (active) {
          setForumPosts(
            posts
              .sort(
                (left, right) =>
                  new Date(right.created_at).getTime() -
                  new Date(left.created_at).getTime()
              )
              .slice(0, 3)
          );
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setForumError(
            requestError instanceof Error
              ? requestError.message
              : "No se pudieron cargar tus publicaciones."
          );
        }
      })
      .finally(() => {
        if (active) setForumLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user.id]);

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Seguro que quieres cerrar tu sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: () => {
          clearCurrentUser();
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.secondaryText }]}>
              ¡Hola!
            </Text>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user.name}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <ThemeToggleButton />
            <TouchableOpacity
              style={[
                styles.notificationButton,
                { backgroundColor: colors.surface },
              ]}
              onPress={handleLogout}
              accessibilityLabel="Cerrar sesión"
              accessibilityRole="button"
            >
              <Ionicons name="log-out-outline" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.notificationButton,
                { backgroundColor: colors.surface },
              ]}
              accessibilityLabel="Notificaciones"
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Resumen */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Tus actividades pendientes</Text>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.summaryNumber}>
              {tasks.filter((task) => task.status !== "completed").length}
            </Text>
          )}
          <Text style={styles.summaryText}>
            {error
              ? "No se pudo actualizar el resumen"
              : "actividades por completar"}
          </Text>
        </View>

        {/* Próximas entregas */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Próximas entregas
        </Text>
        {dueSoonTasks.length > 0 ? (
          dueSoonTasks.map((task) => {
            const taskColor = getTaskColor(task.status, task.due_date);
            return (
              <TouchableOpacity
                key={task.id}
                style={[
                  styles.deliveryCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderLeftColor: taskColor,
                    borderLeftWidth: 4,
                  },
                ]}
                onPress={() => navigation.replace("Tasks", { user })}
              >
                <View style={styles.deliveryRow}>
                  <View
                    style={[
                      styles.deliveryIcon,
                      { backgroundColor: colors.iconBackground },
                    ]}
                  >
                    <Ionicons
                      name={
                        task.status === "overdue"
                          ? "alert-circle"
                          : "time-outline"
                      }
                      size={24}
                      color={taskColor}
                    />
                  </View>
                  <View style={styles.deliveryInfo}>
                    <Text style={[styles.deliveryTitle, { color: taskColor }]}>
                      {task.title}
                    </Text>
                    <Text
                      style={[
                        styles.deliverySubtitle,
                        { color: taskColor },
                      ]}
                    >
                      {getDeadlineMessage(task)}
                    </Text>
                    <Text
                      style={[
                        styles.deliveryDate,
                        { color: colors.secondaryText },
                      ]}
                    >
                      {formatDateString(task.due_date!)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View
            style={[
              styles.deliveryCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={styles.deliveryRow}>
              <View style={styles.deliveryIcon}>
                <Ionicons
                  name="document-text-outline"
                  size={24}
                  color={colors.secondaryText}
                />
              </View>
              <View style={styles.deliveryInfo}>
                <Text style={[styles.deliveryTitle, { color: colors.text }]}>
                  Sin entregas próximas
                </Text>
                <Text style={[styles.deliverySubtitle, { color: colors.secondaryText }]}>
                  Tus tareas con fecha aparecerán aquí
                </Text>
              </View>
            </View>
          </View>
        )}

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Novedades del foro
        </Text>
        {forumLoading ? (
          <ActivityIndicator color="#3B82F6" />
        ) : forumError ? (
          <View style={[styles.deliveryCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.deliverySubtitle, { color: colors.secondaryText }]}>
              {forumError}
            </Text>
          </View>
        ) : forumPosts.length > 0 ? (
          forumPosts.map((post) => (
            <TouchableOpacity
              key={post.id}
              style={[
                styles.deliveryCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={() => navigation.navigate("Forum", { user })}
            >
              <Text style={[styles.deliveryTitle, { color: colors.text }]}>
                {post.title}
              </Text>
              <Text
                style={[styles.deliverySubtitle, { color: colors.secondaryText }]}
                numberOfLines={2}
              >
                {post.content}
              </Text>
              <Text style={[styles.deliveryDate, { color: colors.secondaryText }]}>
                {formatDateString(post.created_at)}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={[styles.deliveryCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.deliverySubtitle, { color: colors.secondaryText }]}>
              Aún no hay publicaciones en el foro.
            </Text>
          </View>
        )}
      </ScrollView>

      <BottomNavigation
        active="Home"
        navigation={navigation}
        user={user}
        themeColors={colors}
      />
    </SafeAreaView>
  );
}
