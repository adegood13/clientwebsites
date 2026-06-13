import { Database } from "lucide-react";

/** Shown on social pages when Supabase env vars aren't set yet. */
export function NotConfigured() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl border border-shoal/60 bg-abyss/60 text-cable">
        <Database size={24} />
      </span>
      <h1 className="mt-6 font-display text-3xl uppercase text-spray">
        Connect Supabase to go live
      </h1>
      <p className="mt-3 text-mist">
        The social feed, profiles and following run on Supabase. Add your project
        URL and anon key to <code className="text-cable">.env.local</code>, run{" "}
        <code className="text-cable">supabase/schema.sql</code>, and restart — the
        feed lights up instantly.
      </p>
      <pre className="mt-6 w-full overflow-x-auto rounded-xl border border-shoal/60 bg-deepwater/60 p-4 text-left text-xs text-mist">
        {`NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...`}
      </pre>
    </div>
  );
}
