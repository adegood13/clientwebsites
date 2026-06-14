export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  home_park: string | null;
  created_at: string;
};

export type FeedPost = {
  id: string;
  image_url: string;
  caption: string | null;
  park: string | null;
  created_at: string;
  author: Pick<Profile, "id" | "username" | "display_name" | "avatar_url">;
  like_count: number;
  comment_count: number;
  liked_by_me: boolean;
};

export type Comment = {
  id: string;
  body: string;
  created_at: string;
  author: Pick<Profile, "id" | "username" | "avatar_url">;
};
