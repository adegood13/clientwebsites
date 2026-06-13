/**
 * CABLELINE wordmark. The signature: a taut cable line strung between two
 * tower ticks with a carrier dot — the defining mechanic of a cable park,
 * literally running through the name.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-display text-xl leading-none tracking-tight text-spray ${className}`}
    >
      <svg
        width="26"
        height="20"
        viewBox="0 0 26 20"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* towers */}
        <line x1="3" y1="4" x2="3" y2="16" stroke="currentColor" strokeWidth="1.5" className="text-steel" />
        <line x1="23" y1="4" x2="23" y2="16" stroke="currentColor" strokeWidth="1.5" className="text-steel" />
        {/* the cable */}
        <line x1="3" y1="6" x2="23" y2="6" stroke="var(--cable)" strokeWidth="1.5" />
        {/* carrier */}
        <circle cx="14" cy="6" r="2.4" fill="var(--cable)" />
        <line x1="14" y1="6" x2="11" y2="15" stroke="var(--cable)" strokeWidth="1.2" />
      </svg>
      <span>
        CABLE<span className="text-cable">LINE</span>
      </span>
    </span>
  );
}
