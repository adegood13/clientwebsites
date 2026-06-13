"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { parks } from "@/data/parks";
import type { Profile } from "@/lib/social-types";
import { Avatar } from "./Avatar";

export function EditProfile({
  profile,
  onClose,
  onSaved,
}: {
  profile: Profile;
  onClose: () => void;
  onSaved: (p: Profile) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [homePark, setHomePark] = useState(profile.home_park ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadAvatar(file: File) {
    const supabase = createClient();
    if (!supabase) return;
    if (!file.type.startsWith("image/")) return;
    setBusy(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${profile.id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });
    if (upErr) {
      setError(upErr.message);
      setBusy(false);
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(data.publicUrl);
    setBusy(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    if (!supabase) return;
    setBusy(true);
    setError(null);
    const { data, error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim() || profile.username,
        bio: bio.trim() || null,
        home_park: homePark || null,
        avatar_url: avatarUrl,
      })
      .eq("id", profile.id)
      .select("*")
      .single();
    if (error || !data) {
      setError(error?.message ?? "Could not save.");
      setBusy(false);
      return;
    }
    onSaved(data as Profile);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-deepwater/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <form
        onSubmit={save}
        className="relative w-full max-w-md rounded-2xl border border-shoal/60 bg-abyss p-6 glow-cable"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl uppercase text-spray">Edit profile</h2>
          <button type="button" onClick={onClose} className="text-steel hover:text-spray" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <Avatar
            username={profile.username}
            displayName={displayName}
            url={avatarUrl}
            size="lg"
            link={false}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-full border border-steel/40 px-4 py-2 text-sm font-medium text-spray transition-colors hover:border-cable hover:text-cable"
          >
            Change photo
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadAvatar(f);
            }}
          />
        </div>

        <label className="mt-5 block">
          <span className="coords mb-1.5 block text-steel">Display name</span>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-xl border border-shoal/70 bg-deepwater/60 px-4 py-2.5 text-spray focus:border-cable focus:outline-none"
          />
        </label>

        <label className="mt-4 block">
          <span className="coords mb-1.5 block text-steel">Bio</span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border border-shoal/70 bg-deepwater/60 px-4 py-2.5 text-spray focus:border-cable focus:outline-none"
          />
        </label>

        <label className="mt-4 block">
          <span className="coords mb-1.5 block text-steel">Home park</span>
          <select
            value={homePark}
            onChange={(e) => setHomePark(e.target.value)}
            className="w-full rounded-xl border border-shoal/70 bg-deepwater/60 px-4 py-2.5 text-mist focus:border-cable focus:outline-none"
          >
            <option value="">None</option>
            {parks
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
          </select>
        </label>

        {error && <p className="mt-3 text-sm text-coral">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-full bg-cable py-3 font-semibold text-deepwater transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save profile"}
        </button>
      </form>
    </div>
  );
}
