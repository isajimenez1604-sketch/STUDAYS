import React from "react";

import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/AppNavigator";

import { styles } from "../styles/ChatListStyles";

type Props = NativeStackScreenProps<RootStackParamList, "ChatList">;

export default function ChatListScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* Encabezado */}
        <View style={styles.header}>

          <Text style={styles.title}>
            Chats
          </Text>

          <TouchableOpacity style={styles.newChatButton}>

            <Ionicons
              name="create-outline"
              size={22}
              color="#3B82F6"
            />

          </TouchableOpacity>

        </View>


        {/* Buscador */}
        <View style={styles.searchBar}>

          <Ionicons
            name="search"
            size={18}
            color="#64748B"
          />

          <Text style={styles.searchInput}>
            Buscar conversación
          </Text>

        </View>


        {/* Chat 1 */}
        <TouchableOpacity
          style={styles.chatCard}
          onPress={() =>
            navigation.navigate("Chat", { name: "Grupo Cálculo II" })
          }
        >

          <View style={styles.avatar}>

            <Text style={styles.avatarText}>
              G
            </Text>

          </View>


          <View style={styles.chatInfo}>

            <View style={styles.chatTopRow}>

              <Text style={styles.chatName}>
                Grupo Cálculo II
              </Text>

              <Text style={styles.chatTime}>
                09:41
              </Text>

            </View>

            <Text style={styles.chatMessage} numberOfLines={1}>
              Juan: ¿Alguien tiene los apuntes?
            </Text>

          </View>


          <View style={styles.unreadBadge}>

            <Text style={styles.unreadBadgeText}>
              3
            </Text>

          </View>

        </TouchableOpacity>


        {/* Chat 2 */}
        <TouchableOpacity
          style={styles.chatCard}
          onPress={() =>
            navigation.navigate("Chat", { name: "Isabella Jiménez" })
          }
        >

          <View style={styles.avatar}>

            <Text style={styles.avatarText}>
              I
            </Text>

          </View>


          <View style={styles.chatInfo}>

            <View style={styles.chatTopRow}>

              <Text style={styles.chatName}>
                Isabella Jiménez
              </Text>

              <Text style={styles.chatTime}>
                08:15
              </Text>

            </View>

            <Text style={styles.chatMessage} numberOfLines={1}>
              Perfecto, nos vemos en la biblioteca
            </Text>

          </View>

        </TouchableOpacity>


        {/* Chat 3 */}
        <TouchableOpacity
          style={styles.chatCard}
          onPress={() =>
            navigation.navigate("Chat", { name: "Profesor Ramírez" })
          }
        >

          <View style={styles.avatar}>

            <Text style={styles.avatarText}>
              P
            </Text>

          </View>


          <View style={styles.chatInfo}>

            <View style={styles.chatTopRow}>

              <Text style={styles.chatName}>
                Profesor Ramírez
              </Text>

              <Text style={styles.chatTime}>
                ayer
              </Text>

            </View>

            <Text style={styles.chatMessage} numberOfLines={1}>
              Recuerden entregar el informe el viernes
            </Text>

          </View>


          <View style={styles.unreadBadge}>

            <Text style={styles.unreadBadgeText}>
              1
            </Text>

          </View>

        </TouchableOpacity>

      </ScrollView>


      {/* Navegación inferior */}
      <View style={styles.bottomNav}>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Home")}
        >

          <Ionicons
            name="home-outline"
            size={23}
            color="#64748B"
          />

          <Text style={styles.navText}>
            Inicio
          </Text>

        </TouchableOpacity>


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


        <TouchableOpacity style={styles.navItem}>

          <Ionicons
            name="chatbubbles"
            size={23}
            color="#3B82F6"
          />

          <Text
            style={[
              styles.navText,
              styles.navTextActive,
            ]}
          >
            Foro
          </Text>

        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}
