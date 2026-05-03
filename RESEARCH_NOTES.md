# Purrfect Cleaning Co — research notes

## Verified from public sources

- **Owner:** Ms. Natalie Poe (per LeadSmart business listing)
- **Address:** 2232 Westwood Northern Blvd, Apt 8A, Cincinnati OH 45225
- **Phone:** (513) 253-2556
- **Email:** purrfectcleanings@gmail.com (newly verified — confirmed across LeadSmart and other business listings; matches the Cincinnati phone and Natalie Poe ownership)
- **Google rating:** 4.8 / 35+ reviews (CSV)
- **BBB:** Listed (BBB profile linked)
- **Services confirmed:** commercial and residential cleaning, move-in/move-out, post-construction
- **Type:** House/janitor service, owner-operated
- **Currently on free Google Sites page** — no real owned website (CSV note)
- **Facebook:** `poenat16` (corresponds to "Poe Nat" — Natalie Poe)

## Assumed / placeholder — owner to confirm

- **Pricing tiers** ($149 standard, $289 deep, $349 move-in/out, $495 post-construction) — Cincinnati market-typical for owner-operated cleaning. Verify and adjust.
- **Bedroom/bathroom/sqft modifiers** in the quote calculator — illustrative formula. The owner should review the math and adjust scaling factors so quotes match what she'd actually charge.
- **Frequency discounts** (one-time 0%, monthly 8%, biweekly 15%, weekly 25%) — typical industry. Verify.
- **"$2M general liability"** — typical commercial-cleaning insurance level; verify actual coverage.
- **Add-on pricing** ($40 fridge, $35 oven, $25 laundry, $20 bed-make, $60 windows) — market-typical; verify.
- **Same-cleaner-most-weeks claim** — illustrative; verify staffing model.
- **24-hour rebook guarantee** — typical for cleaning services; verify policy.
- **Service area neighborhoods** (Westwood, Price Hill, Northside, Walnut Hills, Mt. Lookout, etc.) — Cincinnati standard list; verify actual service area.

## Photo placeholders to replace

- Hero photo (clean home interior or exterior)
- Photo of Natalie for the About section

## Booking flow

- 6-step (Service → Home details → Frequency → Date → About you → Confirm)
- **Built-in instant quote calculator** — bedrooms × bathrooms × sqft × condition + add-ons, scaled by selected service. Updates in real time as the user fills in step 2.
- Frequency discounts auto-apply on summary
- Date picker skips Sundays (assumed closed); 6 arrival-window options (8am–4pm)
- Card-on-file model (not deposit) — the salon doesn't charge until the day after each visit. Reflects standard cleaning industry practice.
- Pet-friendly questions, key/entry options
- Calendar `.ics` generated client-side
- All payment + booking is **simulated**.

## Voice / brand notes

- "Purrfect" is in the name, but I avoided pet-cat imagery and focused on the actual brand (cleaning). Pet-safe products are mentioned as a feature.
- Sage green + warm cream + soft gold — clean, professional, calming, distinct from typical "cleaning service blue/white"
- DM Serif Display + Inter — feels more "premium home services" than "Yelp fluorescent yellow logo"
- Owner-operated tone in About section, written first-person from Natalie
- Specific Cincinnati neighborhoods called out
- Quirky honest copy: "Come home to a house that smells like nothing" (anti-scented-bombs), "Disaster zone — please come quickly" condition option, "leave a key tip in notes"

## To swap before launch

- Verify pricing structure and the formula in the quote calculator
- Real photos throughout
- Have Natalie review/edit the About copy
- Verify insurance coverage levels
- Verify service area / neighborhoods
- Verify cancellation policy
- Connect Stripe (saved card · pay-after-visit model)
- Connect a real booking backend (Housecall Pro, Jobber, ZenMaid common for cleaning services)
- SMS / email confirmations hooked to a real provider
