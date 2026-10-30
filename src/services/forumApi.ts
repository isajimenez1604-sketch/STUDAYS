
import { API_URL } from "../config/api";

export interface ForumPost {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: string;
}

export interface ForumComment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
}

interface ForumPostsResponse {
  message: string;
  posts: ForumPost[];
}

interface ForumCommentsResponse {
  message: string;
  comments: ForumComment[];
}

interface CreatePostResponse {
  message: string;
  post: ForumPost;
}

interface CreateCommentResponse {
  message: string;
  comment: ForumComment;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "No se pudo conectar con el servidor. Verifica que el backend esté encendido."
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ?? "Ocurrió un error al consultar el foro."
    );
  }

  return data as T;
}

// Consultar todas las publicaciones
export async function getForumPosts(): Promise<ForumPost[]> {
  const response = await request<ForumPostsResponse>(
    "/forum/posts"
  );

  return response.posts;
}

// Consultar los comentarios de una publicación
export async function getForumComments(
  postId: number
): Promise<ForumComment[]> {
  const response = await request<ForumCommentsResponse>(
    `/forum/posts/${postId}/comments`
  );

  return response.comments;
}

// Crear una publicación
export async function createForumPost(
  userId: number,
  title: string,
  content: string
): Promise<ForumPost> {
  const response = await request<CreatePostResponse>(
    "/forum/posts",
    {
      method: "POST",
      body: JSON.stringify({
        userId,
        title,
        content,
      }),
    }
  );

  return response.post;
}

// Crear un comentario
export async function createForumComment(
  postId: number,
  userId: number,
  content: string
): Promise<ForumComment> {
  const response = await request<CreateCommentResponse>(
    `/forum/posts/${postId}/comments`,
    {
      method: "POST",
      body: JSON.stringify({
        userId,
        content,
      }),
    }
  );

  return response.comment;
}
