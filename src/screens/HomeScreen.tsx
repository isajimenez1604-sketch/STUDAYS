import React from "react";

import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { styles } from "../styles/HomeStyles";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* Encabezado */}
        <View style={styles.header}>

          <View>

            <Text style={styles.greeting}>
              ¡Hola!
            </Text>

            <Text style={styles.userName}>
              Bienvenido a STUDAYS
            </Text>

          </View>


          <TouchableOpacity
            style={styles.notificationButton}
          >

            <Ionicons
              name="notifications-outline"
              size={24}
              color="#1F2937"
            />

          </TouchableOpacity>

        </View>


        {/* Resumen */}
        <View style={styles.summaryCard}>

          <Text style={styles.summaryTitle}>
            Tus actividades pendientes
          </Text>

          <Text style={styles.summaryNumber}>
            4
          </Text>

          <Text style={styles.summaryText}>
            actividades por completar
          </Text>

        </View>


        {/* Próxima entrega */}
        <Text style={styles.sectionTitle}>
          Próxima entrega
        </Text>


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

              <Text style={styles.deliveryTitle}>
                Proyecto de Programación
              </Text>

              <Text style={styles.deliverySubtitle}>
                Entrega del proyecto final
              </Text>

              <Text style={styles.deliveryDate}>
                Mañana
              </Text>

            </View>

          </View>

        </View>


        {/* Para hoy */}
        <Text style={styles.sectionTitle}>
          Para hoy
        </Text>


        {/* Tarea 1 */}
        <View style={styles.taskCard}>

          <View style={styles.taskRow}>

            <Ionicons
              name="ellipse-outline"
              size={23}
              color="#3B82F6"
              style={styles.taskIcon}
            />

            <Text style={styles.taskText}>
              Estudiar para el examen
            </Text>

          </View>

        </View>


        {/* Tarea 2 */}
        <View style={styles.taskCard}>

          <View style={styles.taskRow}>

            <Ionicons
              name="ellipse-outline"
              size={23}
              color="#3B82F6"
              style={styles.taskIcon}
            />

            <Text style={styles.taskText}>
              Entregar proyecto
            </Text>

          </View>

        </View>


        {/* Tarea 3 */}
        <View style={styles.taskCard}>

          <View style={styles.taskRow}>

            <Ionicons
              name="ellipse-outline"
              size={23}
              color="#3B82F6"
              style={styles.taskIcon}
            />

            <Text style={styles.taskText}>
              Revisar calendario
            </Text>

          </View>

        </View>

      </ScrollView>


      {/* Navegación inferior */}
      <View style={styles.bottomNav}>

        {/* Inicio */}
        <TouchableOpacity style={styles.navItem}>

          <Ionicons
            name="home"
            size={23}
            color="#3B82F6"
          />

          <Text
            style={[
              styles.navText,
              styles.navTextActive,
            ]}
          >
            Inicio
          </Text>

        </TouchableOpacity>


        {/* Tareas */}
        <TouchableOpacity style={styles.navItem}>

          <Ionicons
            name="checkmark-circle-outline"
            size={23}
            color="#64748B"
          />

          <Text style={styles.navText}>
            Tareas
          </Text>

        </TouchableOpacity>


        {/* Calendario */}
        <TouchableOpacity style={styles.navItem}>

          <Ionicons
            name="calendar-outline"
            size={23}
            color="#64748B"
          />

          <Text style={styles.navText}>
            Calendario
          </Text>

        </TouchableOpacity>


        {/* Planificador */}
        <TouchableOpacity style={styles.navItem}>

          <Ionicons
            name="time-outline"
            size={23}
            color="#64748B"
          />

          <Text style={styles.navText}>
            Planificador
          </Text>

        </TouchableOpacity>


        {/* Foro */}
        <TouchableOpacity style={styles.navItem}>

          <Ionicons
            name="chatbubbles-outline"
            size={23}
            color="#64748B"
          />

          <Text style={styles.navText}>
            Foro
          </Text>

        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}