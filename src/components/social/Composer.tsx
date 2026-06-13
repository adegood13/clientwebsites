"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { parks } from "@/data/parks";
import type { FeedPost } from "@/lib/social-types";

export function Composer({
  userId,
  authorPreview,
  onPosted,
}: {
  userId: string;
  authorPreview: FeedPost["author"];
  onPosted: (post: FeedPost) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [park, setPark] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function pick(f: File | null) {
    setError(null);
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("That's not an image file.");
      return;
    }
    if (f.size > 8 * 1024 * 1024) {
      setError("Keep images under 8 MB.");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setCaption("");
    setPark("");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Add a photo to post.");
      return;
    }
    const supabase = createClient();
    if (!supabase) return;
    setBusy(true);
    setError(null);

    const ext = file.name.split(".").pop() || "jpg";
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("posts")
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (upErr) {
      setError(upErr.message);
      setBusy(false);
      return;
    }
    const { data: pub } = supabase.storage.from("posts").getPublicUrl(path);

    const { data, error: insErr } = await supabase
      .from("posts")
      .insert({
        author_id: userId,
        image_url: pub.publicUrl,
        caption: caption.trim() || null,
        park: park || null,
      })
      .select("id, image_url, caption, park, created_at")
      .single();

    if (insErr || !data) {
      setError(insErr?.message ?? "Could not post.");
      setBusy(false);
      return;
    }

    onPosted({
      ...(data as Omit<FeedPost, "author" | "like_count" | "comment_count" | "liked_by_me">),
      author: authorPreview,
      like_count: 0,
      comment_count: 0,
      liked_by_me: false,
    });
    reset();
    setBusy(false);
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-shoal/60 bg-abyss/40 p-4"
    >
      {preview ? (
        <div className="relative overflow-hidden rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="preview" className="max-h-96 w-full object-cover" />
          <button
            type="button"
            onClick={reset}
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-deepwater/80 text-spray backdrop-blur-sm"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-shoal/70 py-10 text-steel transition-colors hover:border-cable hover:text-cable"
        >
          <ImagePlus size={26} />
          <span className="text-sm font-medium">Add a photo from your session</span>
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0] ?? null)}
      />

      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Say something about the lap…"
        rows={2}
        className="mt-3 w-full resize-none rounded-xl border border-shoal/70 bg-deepwater/60 px-4 py-3 text-sm text-spray placeholder:text-steel focus:border-cable focus:outline-none"
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <select
          value={park}
          onChange={(e) => setPark(e.target.value)}
          className="rounded-full border border-shoal/70 bg-deepwater/60 px-4 py-2 text-sm text-mist focus:border-cable focus:outline-none"
        >
          <option value="">Tag a park…</option>
          {parks
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
        </select>

        {error && <span className="text-sm text-coral">{error}</span>}

        <button
          type="submit"
          disabled={busy}
          className="ml-auto rounded-full bg-cable px-6 py-2 text-sm font-semibold text-deepwater transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {busy ? "Posting…" : "Post"}
        </button>
      </div>
    </form>
  );
}
