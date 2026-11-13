
export const FORUM_POSTS_TABLE = "forum_posts";
export const FORUM_COMMENTS_TABLE = "forum_comments";

export interface ForumPostRecord {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: string;
}

export interface ForumPost extends ForumPostRecord {
  author: ForumAuthor;
}

export interface ForumCommentRecord {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
}

export interface ForumComment extends ForumCommentRecord {
  author: ForumAuthor;
}

export interface ForumAuthor {
  id: number;
  name: string;
  identifier: string;
}
