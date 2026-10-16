
import React, { useCallback, useState } from "react";

import {
  View,
  Text,
  TextInput,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/AppNavigator";

import {
  ForumPost,
  ForumComment,
  getForumPosts,
  createForumPost,
  getForumComments,
  createForumComment,
} from "../services/forumApi";

import { getCurrentUser } from "../services/currentUser";
import { styles } from "../styles/ForumStyles";

type Props = NativeStackScreenProps<RootStackParamList, "Forum">;

export default function ForumScreen({ navigation }: Props) {
  const [currentUser] = useState(() => getCurrentUser());

  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  const [commentsByPost, setCommentsByPost] = useState<
    Record<number, ForumComment[]>
  >({});

  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [commentsLoadingId, setCommentsLoadingId] = useState<number | null>(
    null
  );

  const [commentDrafts, setCommentDrafts] = useState<
    Record<number, string>
  >({});

  const [postingCommentId, setPostingCommentId] = useState<number | null>(
    null
  );

  const loadPosts = useCallback(async () => {
    try {
      const data = await getForumPosts();
      setPosts(data);
    } catch (error) {
      Alert.alert(
        "Error al cargar el foro",
        error instanceof Error
          ? error.message
          : "No se pudieron cargar las publicaciones."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadPosts);
    return unsubscribe;
  }, [navigation, loadPosts]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  const handleCreatePost = async () => {
    if (!currentUser) {
      Alert.alert(
        "Sesión no encontrada",
        "Inicia sesión nuevamente para publicar."
      );
      return;
    }

    if (!title.trim() || !content.trim()) {
      Alert.alert(
        "Campos obligatorios",
        "Escribe un título y el contenido de tu publicación."
      );
      return;
    }

    try {
      setPosting(true);

      await createForumPost(
        currentUser.id,
        title.trim(),
        content.trim()
      );

      setTitle("");
      setContent("");

      await loadPosts();

      Alert.alert("¡Éxito!", "Tu publicación se creó correctamente.");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo crear la publicación."
      );
    } finally {
      setPosting(false);
    }
  };

  const handleToggleComments = async (postId: number) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      return;
    }

    setExpandedPostId(postId);
    setCommentsLoadingId(postId);

    try {
      const data = await getForumComments(postId);

      setCommentsByPost((previous) => ({
        ...previous,
        [postId]: data,
      }));
    } catch (error) {
      Alert.alert(
        "Error al cargar comentarios",
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los comentarios."
      );
    } finally {
      setCommentsLoadingId(null);
    }
  };

  const handleCreateComment = async (postId: number) => {
    if (!currentUser) {
      Alert.alert(
        "Sesión no encontrada",
        "Inicia sesión nuevamente para responder."
      );
      return;
    }

    const commentText = (commentDrafts[postId] ?? "").trim();

    if (!commentText) {
      Alert.alert(
        "Comentario vacío",
        "Escribe una respuesta antes de enviarla."
      );
      return;
    }

    try {
      setPostingCommentId(postId);

      await createForumComment(
        postId,
        currentUser.id,
        commentText
      );

      setCommentDrafts((previous) => ({
        ...previous,
        [postId]: "",
      }));

      const updatedComments = await getForumComments(postId);

      setCommentsByPost((previous) => ({
        ...previous,
        [postId]: updatedComments,
      }));
    } catch (error) {
      Alert.alert(
        "Error al responder",
        error instanceof Error
          ? error.message
          : "No se pudo publicar tu comentario."
      );
    } finally {
      setPostingCommentId(null);
    }
  };

  const renderPost = ({ item }: { item: ForumPost }) => {
    const comments = commentsByPost[item.id] ?? [];
    const isExpanded = expandedPostId === item.id;
    const isLoadingComments = commentsLoadingId === item.id;
    const isPostingComment = postingCommentId === item.id;

    const postAuthor =
      currentUser?.id === item.user_id
        ? currentUser.name
        : `Usuario ${item.user_id}`;

    return (
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={styles.avatar}>
            <Ionicons
              name="person-outline"
              size={22}
              color="#3B82F6"
            />
          </View>

          <View style={styles.postAuthorInfo}>
            <Text style={styles.postAuthor}>{postAuthor}</Text>

            <Text style={styles.postDate}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postContent}>{item.content}</Text>

        <View style={styles.postFooter}>
          <Ionicons
            name="chatbubble-outline"
            size={18}
            color="#64748B"
          />

          <Text style={styles.commentLabel}>
            Publicación #{item.id}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.commentToggle}
          onPress={() => handleToggleComments(item.id)}
          accessibilityLabel={
            isExpanded ? "Ocultar comentarios" : "Ver y responder comentarios"
          }
        >
          <Ionicons
            name="chatbubbles-outline"
            size={19}
            color="#3B82F6"
          />

          <Text style={styles.commentToggleText}>
            {isExpanded ? "Ocultar comentarios" : "Ver y responder"}
          </Text>

          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={18}
            color="#3B82F6"
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>
              Respuestas ({comments.length})
            </Text>

            {isLoadingComments ? (
              <ActivityIndicator
                size="small"
                color="#3B82F6"
                style={styles.commentsLoader}
              />
            ) : comments.length === 0 ? (
              <Text style={styles.commentEmptyText}>
                Todavía no hay respuestas. ¡Sé la primera persona en comentar!
              </Text>
            ) : (
              comments.map((comment) => {
                const commentAuthor =
                  currentUser?.id === comment.user_id
                    ? currentUser.name
                    : `Usuario ${comment.user_id}`;

                return (
                  <View key={comment.id} style={styles.commentCard}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>
                        {commentAuthor}
                      </Text>

                      <Text style={styles.commentDate}>
                        {new Date(comment.created_at).toLocaleDateString()}
                      </Text>
                    </View>

                    <Text style={styles.commentContent}>
                      {comment.content}
                    </Text>
                  </View>
                );
              })
            )}

            <TextInput
              style={styles.commentInput}
              placeholder="Escribe tu respuesta..."
              placeholderTextColor="#94A3B8"
              value={commentDrafts[item.id] ?? ""}
              onChangeText={(text) =>
                setCommentDrafts((previous) => ({
                  ...previous,
                  [item.id]: text,
                }))
              }
              multiline
              textAlignVertical="top"
              maxLength={1000}
              editable={!isPostingComment}
            />

            <TouchableOpacity
              style={[
                styles.sendCommentButton,
                isPostingComment && styles.sendCommentButtonDisabled,
              ]}
              onPress={() => handleCreateComment(item.id)}
              disabled={isPostingComment}
            >
              {isPostingComment ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons
                    name="send-outline"
                    size={17}
                    color="#FFFFFF"
                  />

                  <Text style={styles.sendCommentButtonText}>
                    Responder
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Foro STUDAYS</Text>

          <Text style={styles.headerSubtitle}>
            Comparte y aprende con otros estudiantes
          </Text>
        </View>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          accessibilityLabel="Actualizar publicaciones"
        >
          <Ionicons
            name="refresh-outline"
            size={23}
            color="#3B82F6"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.createPostCard}>
        <Text style={styles.formTitle}>Crear publicación</Text>

        <TextInput
          style={styles.titleInput}
          placeholder="Escribe el título..."
          placeholderTextColor="#94A3B8"
          value={title}
          onChangeText={setTitle}
          maxLength={120}
        />

        <TextInput
          style={styles.contentInput}
          placeholder="¿Qué quieres compartir con otros estudiantes?"
          placeholderTextColor="#94A3B8"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          maxLength={2000}
        />

        <TouchableOpacity
          style={[
            styles.publishButton,
            posting && styles.publishButtonDisabled,
          ]}
          onPress={handleCreatePost}
          disabled={posting}
        >
          {posting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.publishButtonText}>Publicar</Text>
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />

          <Text style={styles.statusText}>
            Cargando publicaciones...
          </Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPost}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#3B82F6"
            />
          }
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Ionicons
                name="chatbubbles-outline"
                size={48}
                color="#94A3B8"
              />

              <Text style={styles.emptyTitle}>
                Aún no hay publicaciones
              </Text>

              <Text style={styles.statusText}>
                Cuando haya publicaciones, aparecerán aquí.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
