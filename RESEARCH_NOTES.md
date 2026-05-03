# Amanda Rachael Photography — research notes

## Verified from public sources

- **Owner:** Amanda Logiodice (per LinkedIn — Amanda Rachael Photography, LLC)
- **Established:** 2001 — over 20 years in business
- **Studio:** 1913 Huguenot Rd, Suite 100, North Chesterfield VA 23235
- **Phone:** (757) 942-5367
- **Email:** amanda@amandarachael.com
- **Specialties:** Maternity, newborn, baby, birthday cake smash (per Yelp listing)
- **Google rating:** 4.9 / 38 reviews (CSV)
- **Yelp rating:** 5.0 / 32 reviews
- **Owner story angle:** "Started in photography before anyone owned a cell phone or digital camera" — this phrasing appeared in public listings and was incorporated into the About section as the first-person Amanda voice
- **Reviewer praise themes:** gentleness with newborns, quality of work
- **Social:** Facebook (`AmandaRachaelPhotography`), Instagram (`amandarachael` and possibly `amandarachalphotography`)

## Assumed / placeholder — owner to confirm

- **Pricing** ($525 maternity / $795 newborn / $1,495 first-year plan / $395 family / $495 cake smash / $395 sitter) — these reflect typical Richmond market rates for an established 20+ year boutique with 4.9/5.0 reviews. Owner should confirm or replace.
- **Retainer amounts** ($200 / $300 / $400 / $150 / $200 / $150) — illustrative; usually 30–40% of session fee.
- **"Hours: Tue – Sat by appointment, closed Sun & Mon"** — assumed from the by-appointment nature of session photography. Owner to confirm.
- **Owner's specific personal voice** — the about-page paragraphs are written *as if* by Amanda, drawing on the publicly-disclosed "started before cell phones / digital cameras" line and the niche specialties. The wording itself should be reviewed/edited by Amanda before launch.
- **Studio amenity claims** ("Heat at 80°", "two refrigerators", "changing table", "tea on the counter") — written as plausible newborn-studio amenities. Verify and adjust.
- **Image counts in deliverables** (30 maternity / 50 newborn / 90 first-year) — typical for the price points; verify.
- **"Most loved" badge on Newborn** — illustrative best-seller indicator; verify with the owner.

## Photo placeholders to replace

This site is heavily portfolio-driven. The placeholders to swap (all clearly labeled):
- Hero (one strong portrait + one detail shot)
- 30+ portfolio gallery images across 5 tabs (maternity, newborn, baby, cake smash, family)
- 3 session-card hero photos
- 1 self-portrait of Amanda for the About section

## Booking flow

- Multi-step (Session → Date → About you → Confirm)
- Pre-fills package from URL: `booking.html?pkg=Newborn&price=795&dep=300` (session cards link this way)
- Date picker skips Sundays and Mondays (closed)
- Retainer is **required** — toggle is checked + disabled. Different from a salon/detailer where deposit is optional.
- Routes to `checkout.html` for payment, then `confirmation.html`
- Calendar `.ics` generated client-side
- All payment + booking is **fully simulated**.

## Voice / brand notes

- Editorial / quiet / Cormorant Garamond serif
- Cream + sage + warm terracotta + warm charcoal palette — reads as warm, not clinical, not twee
- The Cormorant italic for the brand mark and emphasis ("amanda *rachael*", "*tender* seasons", "*tiny humans*") gives it boutique-photographer voice
- Quote callout: "You don't need to do anything. Sit. Breathe. I'll guide you." — direct paraphrase of how the photographer is described in reviews ("gentle, calming")
- About page is written in first person from Amanda — leaning on the publicly-known timeline (2001, pre-digital) — but should be reviewed and personalized further

## To swap before launch

- Verify all session prices and retainer amounts
- Replace 30+ placeholder images with real portfolio work, organized by category
- Add real self-portrait of Amanda
- Have Amanda review/edit the About copy to make sure it sounds like her
- Verify hours
- Connect Stripe for retainer collection
- Connect a real booking system (HoneyBook, Dubsado, or 17hats are common for photographers — current flow is for demo only)
- Hook gallery delivery to a real gallery host (Pixieset, ShootProof) and add login link in nav once active
