
export const FORUM_POSTS_TABLE = "forum_posts";
export const FORUM_COMMENTS_TABLE = "forum_comments";

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
