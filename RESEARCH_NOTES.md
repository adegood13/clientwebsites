# Golden Auto Detailing — research notes

## Verified from public sources

- **Address:** 122 S Antelope Valley Pkwy, Lincoln NE 68510
- **Phone:** (402) 875-1369
- **Email:** goldenautodetailing2@gmail.com
- **Hours:** Mon–Sun 9:00am – 7:00pm
- **Google rating:** 4.8 across 218 reviews (CSV)
- **Type:** Mobile detailer (CSV: "Mobile detailer - perfect online booking + deposit fit")
- **Social presence:** Facebook (@goldenautodetailingg) — 1,983 likes; Instagram (@golden.autodetailing) — 3,174 followers
- **Listed elsewhere:** Yelp, Roadtrippers, Wheree, BBB

## Assumed / placeholder — owner to confirm

- **Package names + pricing** ("Quick Shine," "Full Golden," "Deep Restore") are illustrative. They follow standard mobile-detailer market conventions but the owner should confirm or rename. Naming the mid tier "Full Golden" plays on the brand.
- **Service area list** — generic Lincoln neighborhoods + a 25-mile radius. The 25-mile radius and per-mile fee outside that are mockup numbers; please confirm.
- **"Five years of Lincoln driveways"** — placeholder founding-year tagline; please verify and adjust.
- **Owner photo / "the truck" placeholder** — no public photo of the owner found via WebFetch (Facebook/Instagram return 403). Owner to provide.
- **Add-on pricing (ceramic spray $60, pet hair $40, headlights $50, ozone $45)** — market-typical numbers; verify before launch.
- **"Most-booked" badge on Full Golden** — illustrative; verify with owner sales data.

## Photo placeholders to replace

- Hero — currently a CSS-only treatment (gold gradient + grid pattern on dark). If you have a strong wide shot of a freshly-detailed car / truck-with-equipment, drop it into the hero with a dark overlay.
- Why-us section — owner with the truck / equipment kit
- 4× before/after pairs in the work section. Captions are placeholders.

## Booking flow

- Multi-step (Package → Vehicle + Add-ons → Date/Time → Where + You → Confirm)
- Pre-fills package from URL: `booking.html?pkg=Full+Golden` (the package cards on the home page do this)
- Vehicle size auto-adjusts price (sedan $0, mid +$20, full-size truck/3-row +$50)
- Add-ons stack onto package total
- $25 deposit defaults ON; recommended for mobile bookings since slot blocks a multi-hour window. Toggle off goes straight to confirmation.
- All payment + booking is **fully simulated**. Booking state passes via `sessionStorage`.
- Client-generated `.ics` calendar file on confirmation

## Voice / brand notes

- Direct, owner-operator voice. "We pull up. You hand us the keys." No "experience" or "passion."
- Specific Lincoln references throughout (Beatrice mention, neighborhoods, "Saturday on the lake")
- Dark + gold treatment plays on the brand name. Anton display font for that automotive-poster feel.
- The grid-pattern hero background reads as a workshop floor; pure CSS so it scales.

## To swap before launch

- Verify package names, prices, add-on prices
- Real before/after photos in the work section
- Real owner-with-truck photo for the why section
- Confirm 25-mile radius and per-mile fee
- Confirm full hours (currently 9am–7pm seven days)
- Connect Stripe (or Square) for real deposits
- Connect a real booking backend (currently uses Square; consider Calendly or Booksy if branding matters)
- SMS / email confirmation hooked to a real provider
- Add real customer testimonials in carousel form (the badges link out for now)
