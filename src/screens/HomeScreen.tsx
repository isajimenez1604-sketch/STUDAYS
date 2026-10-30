import React from "react";
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
import { RootStackParamList } from "../navigation/AppNavigator";
import { useTasks } from "../hooks/useTasks";
import { styles } from "../styles/HomeStyles";
import { formatDateString } from "../utils/taskDates";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation, route }: Props) {
  const { user } = route.params;
  const { tasks, loading, error } = useTasks(user.id);
  const nextTask = tasks.find((task) => task.due_date);

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Seguro que quieres cerrar tu sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>¡Hola!</Text>
            <Text style={styles.userName}>Bienvenido a STUDAYS</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.notificationButton}
              accessibilityLabel="Notificaciones"
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#1F2937"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={handleLogout}
              accessibilityLabel="Cerrar sesión"
            >
              <Ionicons name="log-out-outline" size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Resumen */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Tus actividades pendientes</Text>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.summaryNumber}>{tasks.length}</Text>
          )}
          <Text style={styles.summaryText}>
            {error ? "No se pudo actualizar el resumen" : "actividades por completar"}
          </Text>
        </View>

        {/* Próxima entrega */}
        <Text style={styles.sectionTitle}>Próxima entrega</Text>
        {nextTask ? (
          <TouchableOpacity
            style={styles.deliveryCard}
            onPress={() => navigation.replace("Tasks", { user })}
          >
            <View style={styles.deliveryRow}>
              <View style={styles.deliveryIcon}>
                <Ionicons
                  name="document-text-outline"
                  size={24}
                  color="#3B82F6"
                />
              </View>
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryTitle}>{nextTask.title}</Text>
                <Text style={styles.deliverySubtitle}>
                  {nextTask.description || "Actividad pendiente"}
                </Text>
                <Text style={styles.deliveryDate}>
                  {nextTask.due_date
                    ? formatDateString(nextTask.due_date)
                    : "Sin fecha asignada"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryRow}>
              <View style={styles.deliveryIcon}>
                <Ionicons
                  name="document-text-outline"
                  size={24}
                  color="#3B82F6"
                />
              </View>
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryTitle}>Sin entregas próximas</Text>
                <Text style={styles.deliverySubtitle}>
                  Tus tareas con fecha aparecerán aquí
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <BottomNavigation active="Home" navigation={navigation} user={user} />
    </SafeAreaView>
  );
}
