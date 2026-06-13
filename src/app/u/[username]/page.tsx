"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useUser } from "@/lib/supabase/useUser";
import type { Profile } from "@/lib/social-types";
import { NotConfigured } from "@/components/social/NotConfigured";
import { Avatar } from "@/components/social/Avatar";
import { EditProfile } from "@/components/social/EditProfile";

type Tile = { id: string; image_url: string; caption: string | null };

export default function ProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const { user } = useUser();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [counts, setCounts] = useState({ posts: 0, followers: 0, following: 0 });
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [editing, setEditing] = useState(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) return;
    setLoading(true);

    const { data: prof } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .single();

    if (!prof) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    const p = prof as Profile;
    setProfile(p);

    const [{ data: posts }, followers, followingCount] = await Promise.all([
      supabase
        .from("posts")
        .select("id, image_url, caption")
        .eq("author_id", p.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", p.id),
      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", p.id),
    ]);

    setTiles((posts as Tile[]) ?? []);
    setCounts({
      posts: posts?.length ?? 0,
      followers: followers.count ?? 0,
      following: followingCount.count ?? 0,
    });

    if (user && user.id !== p.id) {
      const { data: rel } = await supabase
        .from("follows")
        .select("follower_id")
        .eq("follower_id", user.id)
        .eq("following_id", p.id)
        .maybeSingle();
      setFollowing(!!rel);
    }
    setLoading(false);
  }, [username, user]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    load();
  }, [load]);

  async function toggleFollow() {
    if (!user || !profile) return;
    const supabase = createClient();
    if (!supabase) return;
    const next = !following;
    setFollowing(next);
    setCounts((c) => ({ ...c, followers: c.followers + (next ? 1 : -1) }));
    if (next) {
      await supabase
        .from("follows")
        .insert({ follower_id: user.id, following_id: profile.id });
    } else {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", profile.id);
    }
  }

  if (!isSupabaseConfigured) return <NotConfigured />;

  if (loading) {
    return <p className="coords py-24 text-center text-steel">loading profile…</p>;
  }

  if (notFound || !profile) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <h1 className="font-display text-3xl uppercase text-spray">Rider not found</h1>
        <p className="mt-2 text-mist">No profile for @{username}.</p>
        <Link href="/feed" className="mt-6 inline-block font-semibold text-cable hover:underline">
          Back to the feed
        </Link>
      </div>
    );
  }

  const isMe = user?.id === profile.id;
  const name = profile.display_name || profile.username;

  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-12">
      <header className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
        <Avatar
          username={profile.username}
          displayName={profile.display_name}
          url={profile.avatar_url}
          size="lg"
          link={false}
        />
        <div className="flex-1">
          <h1 className="font-display text-3xl uppercase text-spray">{name}</h1>
          <p className="text-mist">@{profile.username}</p>
          {profile.bio && <p className="mt-2 text-sm text-mist">{profile.bio}</p>}
          {profile.home_park && (
            <p className="mt-2 flex items-center justify-center gap-1 text-sm text-steel sm:justify-start">
              <MapPin size={13} className="text-cable" />
              {profile.home_park}
            </p>
          )}

          <div className="mt-4 flex justify-center gap-6 sm:justify-start">
            <Count n={counts.posts} label="posts" />
            <Count n={counts.followers} label="followers" />
            <Count n={counts.following} label="following" />
          </div>
        </div>

        <div className="shrink-0">
          {isMe ? (
            <button
              onClick={() => setEditing(true)}
              className="rounded-full border border-steel/40 px-5 py-2 text-sm font-semibold text-spray transition-colors hover:border-cable hover:text-cable"
            >
              Edit profile
            </button>
          ) : user ? (
            <button
              onClick={toggleFollow}
              className={`rounded-full px-6 py-2 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
                following
                  ? "border border-steel/40 text-spray"
                  : "bg-cable text-deepwater"
              }`}
            >
              {following ? "Following" : "Follow"}
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-cable px-6 py-2 text-sm font-semibold text-deepwater"
            >
              Follow
            </Link>
          )}
        </div>
      </header>

      <div className="cable-rule my-10" />

      {tiles.length === 0 ? (
        <p className="py-10 text-center text-steel">No sessions posted yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
          {tiles.map((t) => (
            <div key={t.id} className="aspect-square overflow-hidden rounded-lg bg-abyss">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.image_url}
                alt={t.caption ?? "session"}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      )}

      {editing && isMe && (
        <EditProfile
          profile={profile}
          onClose={() => setEditing(false)}
          onSaved={(p) => {
            setProfile(p);
            setEditing(false);
          }}
        />
      )}
    </div>
  );
}

function Count({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <span className="font-display text-xl text-spray">{n}</span>{" "}
      <span className="text-sm text-steel">{label}</span>
    </div>
  );
}
