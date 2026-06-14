"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { NotConfigured } from "@/components/social/NotConfigured";
import { Wordmark } from "@/components/Wordmark";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isSupabaseConfigured) return <NotConfigured />;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    const supabase = createClient();
    if (!supabase) return;
    setBusy(true);

    if (mode === "signup") {
      const handle = username.trim().toLowerCase().replace(/[^a-z0-9_.]/g, "");
      if (handle.length < 3) {
        setError("Pick a username of at least 3 letters/numbers.");
        setBusy(false);
        return;
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username: handle, display_name: handle } },
      });
      if (error) {
        setError(error.message);
        setBusy(false);
        return;
      }
      // If email confirmation is on, there's no session yet.
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push("/feed");
      } else {
        setNotice("Check your inbox to confirm your email, then sign in.");
        setMode("signin");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        setBusy(false);
        return;
      }
      router.push("/feed");
    }
    setBusy(false);
  }

  return (
    <div className="mx-auto flex min-h-[calc(100svh-60px)] max-w-md flex-col justify-center px-5 py-16">
      <div className="mb-8 text-center">
        <div className="mb-6 flex justify-center">
          <Wordmark className="text-2xl" />
        </div>
        <h1 className="font-display text-4xl uppercase text-spray">
          {mode === "signin" ? "Welcome back" : "Join the lineup"}
        </h1>
        <p className="mt-2 text-mist">
          {mode === "signin"
            ? "Sign in to post sessions and follow riders."
            : "Create a profile and start sharing your laps."}
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {mode === "signup" && (
          <Field
            label="Username"
            value={username}
            onChange={setUsername}
            placeholder="finn.rides"
            autoComplete="username"
          />
        )}
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@email.com"
          autoComplete="email"
          required
        />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          required
        />

        {error && <p className="text-sm text-coral">{error}</p>}
        {notice && <p className="text-sm text-cable">{notice}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-cable py-3 font-semibold text-deepwater transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-mist">
        {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
        <button
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setNotice(null);
          }}
          className="font-semibold text-cable hover:underline"
        >
          {mode === "signin" ? "Create an account" : "Sign in"}
        </button>
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="coords mb-1.5 block text-steel">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-shoal/70 bg-abyss/60 px-4 py-3 text-spray placeholder:text-steel focus:border-cable focus:outline-none"
        {...rest}
      />
    </label>
  );
}
