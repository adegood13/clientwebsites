import Link from "next/link";

const SIZES = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-20 w-20 text-2xl" };

export function Avatar({
  username,
  displayName,
  url,
  size = "md",
  link = true,
}: {
  username: string;
  displayName?: string | null;
  url?: string | null;
  size?: keyof typeof SIZES;
  link?: boolean;
}) {
  const initial = (displayName || username || "?").charAt(0).toUpperCase();
  const inner = url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={username}
      className={`${SIZES[size]} rounded-full object-cover ring-1 ring-shoal/60`}
    />
  ) : (
    <span
      className={`${SIZES[size]} grid place-items-center rounded-full bg-gradient-to-br from-cable/40 to-cable-deep/50 font-display uppercase text-deepwater ring-1 ring-shoal/60`}
    >
      {initial}
    </span>
  );

  if (!link) return inner;
  return (
    <Link href={`/u/${username}`} className="shrink-0">
      {inner}
    </Link>
  );
}
