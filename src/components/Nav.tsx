"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Wordmark } from "./Wordmark";

const links = [
  { href: "/map", label: "Map" },
  { href: "/contests", label: "Contests" },
  { href: "/feed", label: "Feed" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-deepwater/85 backdrop-blur-md border-b border-shoal/60"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
        <Link href="/" aria-label="CABLELINE home" className="shrink-0">
          <Wordmark />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative rounded-full px-4 py-2 text-sm font-medium tracking-wide transition-colors ${
                  active ? "text-cable" : "text-mist hover:text-spray"
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute inset-x-4 -bottom-px h-px bg-cable shadow-[0_0_8px_var(--cable)]" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:block">
          <Link
            href={signedIn ? "/feed" : "/login"}
            className="rounded-full bg-cable px-5 py-2 text-sm font-semibold text-deepwater transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {signedIn ? "My feed" : "Sign in"}
          </Link>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-md p-1.5 text-spray md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-shoal/60 bg-deepwater/95 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-1 px-5 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-3 text-base text-mist hover:bg-shoal/50 hover:text-spray"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={signedIn ? "/feed" : "/login"}
              className="mt-2 rounded-lg bg-cable px-3 py-3 text-center text-base font-semibold text-deepwater"
            >
              {signedIn ? "My feed" : "Sign in"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
