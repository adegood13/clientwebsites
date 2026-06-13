"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { LogOut, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useUser } from "@/lib/supabase/useUser";
import type { FeedPost, Profile } from "@/lib/social-types";
import { NotConfigured } from "@/components/social/NotConfigured";
import { Composer } from "@/components/social/Composer";
import { PostCard } from "@/components/social/PostCard";
import { Avatar } from "@/components/social/Avatar";

const POST_SELECT = `
  id, image_url, caption, park, created_at,
  author:profiles!posts_author_id_fkey ( id, username, display_name, avatar_url ),
  likes ( count ),
  comments ( count )
`;

const PAGE_SIZE = 12;

export default function FeedPage() {
  const { user, loading: userLoading } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  // Fetch one page of posts older than `before` (a created_at cursor).
  const fetchPage = useCallback(
    async (before?: string): Promise<FeedPost[]> => {
      const supabase = createClient();
      if (!supabase) return [];

      let q = supabase
        .from("posts")
        .select(POST_SELECT)
        .order("created_at", { ascending: false })
        .limit(PAGE_SIZE);
      if (before) q = q.lt("created_at", before);

      const { data: rows } = await q;
      const ids = (rows ?? []).map((r) => (r as { id: string }).id);

      // Scope the "liked by me" lookup to just this page, not the user's
      // entire like history.
      let likedSet = new Set<string>();
      if (user && ids.length) {
        const { data: myLikes } = await supabase
          .from("likes")
          .select("post_id")
          .eq("user_id", user.id)
          .in("post_id", ids);
        likedSet = new Set((myLikes ?? []).map((l) => l.post_id as string));
      }

      return (rows ?? []).map((r) => {
        const row = r as Record<string, unknown>;
        const likes = row.likes as { count: number }[] | undefined;
        const comments = row.comments as { count: number }[] | undefined;
        return {
          id: row.id as string,
          image_url: row.image_url as string,
          caption: (row.caption as string) ?? null,
          park: (row.park as string) ?? null,
          created_at: row.created_at as string,
          author: row.author as FeedPost["author"],
          like_count: likes?.[0]?.count ?? 0,
          comment_count: comments?.[0]?.count ?? 0,
          liked_by_me: likedSet.has(row.id as string),
        };
      });
    },
    [user],
  );

  const load = useCallback(async () => {
    setLoading(true);
    const page = await fetchPage();
    setPosts(page);
    setHasMore(page.length === PAGE_SIZE);
    setLoading(false);
  }, [fetchPage]);

  async function loadMore() {
    if (loadingMore || posts.length === 0) return;
    setLoadingMore(true);
    const page = await fetchPage(posts[posts.length - 1].created_at);
    setPosts((cur) => [...cur, ...page]);
    setHasMore(page.length === PAGE_SIZE);
    setLoadingMore(false);
  }

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    if (userLoading) return;
    load();
  }, [userLoading, load]);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    const supabase = createClient();
    if (!supabase) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data }) => setProfile(data as Profile | null));
  }, [user]);

  async function signOut() {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  if (!isSupabaseConfigured) return <NotConfigured />;

  return (
    <div className="mx-auto max-w-xl px-4 pb-24 pt-10">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="coords text-cable">the feed</p>
          <h1 className="font-display text-3xl uppercase text-spray">Sessions</h1>
        </div>
        {user && profile ? (
          <div className="flex items-center gap-3">
            <Link
              href={`/u/${profile.username}`}
              className="flex items-center gap-2 rounded-full border border-shoal/60 py-1 pl-1 pr-3 transition-colors hover:border-cable"
            >
              <Avatar
                username={profile.username}
                displayName={profile.display_name}
                url={profile.avatar_url}
                size="sm"
                link={false}
              />
              <span className="text-sm font-medium text-spray">
                @{profile.username}
              </span>
            </Link>
            <button
              onClick={signOut}
              className="text-steel transition-colors hover:text-coral"
              aria-label="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-full bg-cable px-4 py-2 text-sm font-semibold text-deepwater"
          >
            <UserRound size={16} />
            Sign in
          </Link>
        )}
      </header>

      {user && profile && (
        <div className="mb-8">
          <Composer
            userId={user.id}
            authorPreview={{
              id: profile.id,
              username: profile.username,
              display_name: profile.display_name,
              avatar_url: profile.avatar_url,
            }}
            onPosted={(p) => setPosts((cur) => [p, ...cur])}
          />
        </div>
      )}

      {!user && (
        <div className="mb-8 rounded-2xl border border-shoal/60 bg-abyss/40 p-6 text-center">
          <p className="text-mist">
            <Link href="/login" className="font-semibold text-cable hover:underline">
              Sign in
            </Link>{" "}
            to post your own sessions, like, comment and follow riders.
          </p>
        </div>
      )}

      {loading ? (
        <p className="coords py-16 text-center text-steel">loading sessions…</p>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-shoal/60 py-16 text-center">
          <p className="text-mist">No sessions yet.</p>
          <p className="mt-1 text-sm text-steel">
            {user ? "Be the first to post a lap." : "Sign in and break the ice."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              currentUserId={user?.id ?? null}
              onDeleted={(id) => setPosts((cur) => cur.filter((x) => x.id !== id))}
            />
          ))}
          {hasMore && (
            <div className="pt-2 text-center">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="rounded-full border border-steel/40 px-6 py-2.5 text-sm font-semibold text-spray transition-colors hover:border-cable hover:text-cable disabled:opacity-60"
              >
                {loadingMore ? "Loading…" : "Load more"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
