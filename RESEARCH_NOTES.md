# Amor Nails & Spa — research notes

## Verified from public sources

- **Address:** 5510 S I-35 Frontage Rd, Suite 130, Austin TX 78745
- **Phone:** (512) 326-8383
- **Email:** amornailsspallc@gmail.com
- **Hours:** Mon–Sat 9:30am–7:30pm; Sunday 11:00am–5:00pm
- **Google rating:** 4.9 across 4,150+ reviews (CSV)
- **Yelp:** ~4.5 with 120+ reviews
- **Walk-ins welcome** (no appointment required)
- **Free drinks** offered to clients during visits
- **Named technicians referenced in reviews:** Sunny, Nathan, Steven
- **Services offered (confirmed):** manicure, pedicure, foot massage, acrylic, nail art, facial, wax, eyelash extensions, eyebrow tinting; dip powder and gel manicures referenced in social/listing pages
- **Social:** Facebook (`amornailsspa`), Instagram (`amor_nails_spa`), TikTok (`amornailsspa`)

## Assumed / placeholder — owner to confirm

- **Specific menu prices** — Yelp / Belliata / Wheree blocked WebFetch (403). The price list shown on the site reflects competitive Austin market rates for a 4.9★ South Austin salon and should be reviewed by the owner before launch.
- **Founding year (2014)** — used as a believable round number; please confirm.
- **Technician roles/specialties** — Sunny/Nathan/Steven are real names from public reviews, but the role splits (lead nail artist / senior / pedicure specialist) and personal blurbs are illustrative. Replace with the owner's preferred descriptions and head-shots.
- **"Six more" team count** — placeholder. Please update with actual full team.
- **Deluxe Amor Pedicure** — branded as a signature service in the mockup. If the salon already has a signature service name, swap it in.

## Photo placeholders to replace

Every `.ph` element on the site is a clearly-labeled stand-in. Recommended swap order:

1. Hero (4×5 portrait shot of the salon interior)
2. Three portrait photos of Sunny, Nathan, Steven
3. Eight gallery shots — mix of nail-art close-ups, salon interior wide, finished sets
4. Group team photo for the "and six more" card

## Booking flow

- Multi-step (Service → Tech → Date/Time → Info → Confirm)
- Optional $15 deposit toggle on confirm step routes to `/checkout.html`
- Without deposit, goes straight to `/confirmation.html`
- All payment + booking is **fully simulated** — no data leaves the browser. `sessionStorage` carries booking state between pages.
- `.ics` calendar file generated client-side on confirmation

## Voice / brand notes

- "Amor" is Spanish for "love" — leaned into warm/welcoming framing without being saccharine
- Specific local references: "South Austin," "S I-35 frontage, just south of Stassney"
- Avoided clichés: no "pamper yourself," no "experience the difference," no "elevate"
- Short, declarative sentences. The owner's voice should sound like a friendly text from a neighbor.

## To swap before launch

- Confirm or correct all menu prices
- Replace placeholder photos
- Verify founding year
- Verify the "since 2014" claim in the footer tagline
- Add real technician headshots and bios
- Update deposit amount if different
- Connect Stripe (or Square) for real payments
- Connect a real booking backend (Booksy, Square, GlossGenius, custom) — current flow is for demo only
- Hook the email/SMS confirmation to a real provider
