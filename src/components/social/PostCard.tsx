"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, MessageCircle, MapPin, Send, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { timeAgo } from "@/lib/format";
import type { Comment, FeedPost } from "@/lib/social-types";
import { Avatar } from "./Avatar";

export function PostCard({
  post,
  currentUserId,
  onDeleted,
}: {
  post: FeedPost;
  currentUserId: string | null;
  onDeleted?: (id: string) => void;
}) {
  const [liked, setLiked] = useState(post.liked_by_me);
  const [likes, setLikes] = useState(post.like_count);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [commentCount, setCommentCount] = useState(post.comment_count);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);

  const mine = currentUserId === post.author.id;

  async function toggleLike() {
    if (!currentUserId) return;
    const supabase = createClient();
    if (!supabase) return;
    const next = !liked;
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));
    if (next) {
      await supabase.from("likes").insert({ post_id: post.id, user_id: currentUserId });
    } else {
      await supabase
        .from("likes")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", currentUserId);
    }
  }

  async function loadComments() {
    const next = !showComments;
    setShowComments(next);
    if (next && comments === null) {
      const supabase = createClient();
      if (!supabase) return;
      const { data } = await supabase
        .from("comments")
        .select("id, body, created_at, author:profiles!comments_author_id_fkey(id, username, avatar_url)")
        .eq("post_id", post.id)
        .order("created_at", { ascending: true });
      setComments((data as unknown as Comment[]) ?? []);
    }
  }

  async function addComment(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUserId || !draft.trim()) return;
    const supabase = createClient();
    if (!supabase) return;
    setPosting(true);
    const { data } = await supabase
      .from("comments")
      .insert({ post_id: post.id, author_id: currentUserId, body: draft.trim() })
      .select("id, body, created_at, author:profiles!comments_author_id_fkey(id, username, avatar_url)")
      .single();
    if (data) {
      setComments((c) => [...(c ?? []), data as unknown as Comment]);
      setCommentCount((n) => n + 1);
      setDraft("");
    }
    setPosting(false);
  }

  async function remove() {
    if (!mine) return;
    const supabase = createClient();
    if (!supabase) return;
    if (!confirm("Delete this post?")) return;
    await supabase.from("posts").delete().eq("id", post.id);
    onDeleted?.(post.id);
  }

  const name = post.author.display_name || post.author.username;

  return (
    <article className="overflow-hidden rounded-2xl border border-shoal/60 bg-abyss/30">
      <header className="flex items-center gap-3 px-4 py-3">
        <Avatar
          username={post.author.username}
          displayName={post.author.display_name}
          url={post.author.avatar_url}
        />
        <div className="min-w-0 flex-1">
          <Link href={`/u/${post.author.username}`} className="font-semibold text-spray hover:text-cable">
            {name}
          </Link>
          <p className="coords normal-case tracking-normal text-steel">
            @{post.author.username} · {timeAgo(post.created_at)}
          </p>
        </div>
        {mine && (
          <button
            onClick={remove}
            className="text-steel transition-colors hover:text-coral"
            aria-label="Delete post"
          >
            <Trash2 size={16} />
          </button>
        )}
      </header>

      <div className="relative bg-deepwater">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.image_url} alt={post.caption ?? "session"} className="w-full object-cover" />
        {post.park && (
          <span className="coords absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-deepwater/80 px-2.5 py-1 text-spray backdrop-blur-sm">
            <MapPin size={11} className="text-cable" />
            {post.park}
          </span>
        )}
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center gap-5">
          <button
            onClick={toggleLike}
            disabled={!currentUserId}
            className="flex items-center gap-1.5 text-sm text-mist transition-colors hover:text-coral disabled:opacity-60"
          >
            <Heart
              size={19}
              className={liked ? "fill-coral text-coral" : ""}
            />
            {likes}
          </button>
          <button
            onClick={loadComments}
            className="flex items-center gap-1.5 text-sm text-mist transition-colors hover:text-cable"
          >
            <MessageCircle size={19} />
            {commentCount}
          </button>
        </div>

        {post.caption && (
          <p className="mt-2.5 text-sm leading-relaxed text-spray">
            <span className="font-semibold">{post.author.username}</span>{" "}
            <span className="text-mist">{post.caption}</span>
          </p>
        )}

        {showComments && (
          <div className="mt-3 space-y-3 border-t border-shoal/50 pt-3">
            {comments?.map((c) => (
              <div key={c.id} className="flex items-start gap-2">
                <Avatar username={c.author.username} url={c.author.avatar_url} size="sm" />
                <p className="text-sm leading-snug text-mist">
                  <Link href={`/u/${c.author.username}`} className="font-semibold text-spray hover:text-cable">
                    {c.author.username}
                  </Link>{" "}
                  {c.body}
                </p>
              </div>
            ))}
            {comments?.length === 0 && (
              <p className="text-sm text-steel">No comments yet. Be the first.</p>
            )}

            {currentUserId && (
              <form onSubmit={addComment} className="flex items-center gap-2 pt-1">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Add a comment…"
                  className="flex-1 rounded-full border border-shoal/70 bg-deepwater/60 px-4 py-2 text-sm text-spray placeholder:text-steel focus:border-cable focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={posting || !draft.trim()}
                  className="text-cable disabled:opacity-40"
                  aria-label="Post comment"
                >
                  <Send size={18} />
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
