import Link from "next/link";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="border-t border-shoal/60 bg-deepwater">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="max-w-xs">
            <Wordmark />
            <p className="mt-4 text-sm leading-relaxed text-steel">
              The home of cable park wakeboarding. Built by riders, for riders.
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <FooterCol
              title="Explore"
              links={[
                { href: "/map", label: "Park map" },
                { href: "/contests", label: "Contests" },
                { href: "/feed", label: "Feed" },
              ]}
            />
            <FooterCol
              title="Community"
              links={[
                { href: "/login", label: "Sign in" },
                { href: "/feed", label: "Post a session" },
              ]}
            />
            <FooterCol
              title="About"
              links={[
                { href: "/map", label: "Add a park" },
                { href: "/contests", label: "Submit a result" },
              ]}
            />
          </nav>
        </div>
        <div className="cable-rule my-8" />
        <div className="flex flex-col items-center justify-between gap-3 text-xs text-steel sm:flex-row">
          <p>© {new Date().getFullYear()} CABLELINE. Cable up.</p>
          <p className="coords">est. {new Date().getFullYear()} — built on water</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="coords mb-3 text-steel">{title}</h3>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-mist transition-colors hover:text-cable">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
