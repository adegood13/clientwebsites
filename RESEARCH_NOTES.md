# Albuquerque Ink Tattoo — research notes

## Verified from public sources

- **Two locations on Central Ave** (per multiple sources):
  - **SE shop** (CSV one): 2820 Central Ave SE, Suite F, Albuquerque NM 87106
  - **NE shop**: 4815 Central Ave NE, Albuquerque NM 87108
- **Phone:** (505) 306-8623
- **Email:** albuquerqueink@gmail.com
- **Hours:** Mon–Thu 10:00am–10:00pm, Fri 10:00am–midnight, Sat–Sun also open (typically 10am–10pm)
- **Walk-ins welcome · open every day**
- **Google rating:** 4.8 / 568+ reviews (CSV)
- **Yelp:** rated; 20+ reviews
- **Health/clean:** "98% recommendation rate"
- **Artists named in public sources:**
  - SE shop: PJ Frenchy, Jessie, Sia
  - NE shop: Simon, JD
- **Styles offered (confirmed):** Fine Line, Custom, Floral, 3D, Portrait, Nature, Skull, Animals, Traditional, Black & Grey, Color
- **Social:** Facebook (`albuquerqueInkTattoos`), Instagram (`albuquerqueink`)

## Assumed / placeholder — owner to confirm

- **Owner name** — not publicly disclosed; not used in copy.
- **Pricing** ($80 shop minimum, $150–$350 small custom, $150/hr typical, $50 deposit) — these are typical Southwest mid-range tattoo-shop rates. Owner should confirm.
- **Free 30-day touch-up policy** — common industry standard but not confirmed for this shop.
- **Deposit terms** ($50, refundable up to 48 hrs, one free reschedule) — common terms. Verify.
- **Piercing at SE shop only** — assumption; CSV note mentions deposits + waivers but doesn't confirm piercing scope.
- **Artist style splits** — based on public categorization but specific copy attribution may need owner edit.
- **Drawing fee** — implied as included with deposit; verify shop's policy.

## Photo placeholders to replace

- Hero (large image — flash wall, in-progress sleeve, or shop interior)
- 5 artist portraits (PJ Frenchy, Jessie, Sia, Simon, JD)
- 1 group/team shot
- 2 shop interior/exterior photos (one per location)

## Booking flow

- 6-step (Style → Artist → The piece → Date → You → Confirm + waiver)
- This is a **consult booking**, not the tattoo session itself — typical industry pattern. Tattoo session is scheduled at the consult.
- Pre-fills style from URL: `booking.html?style=Fine+line` (style cards link this way)
- Pre-fills artist from URL: `booking.html?artist=Jessie` (artist cards link this way)
- $50 deposit defaulted ON; goes toward final tattoo cost
- **Includes a digital waiver preview** with required acknowledgement before booking — addresses NM age requirement (18+ ID required)
- Hours-aware time slots: Friday opens through 11pm, other days through 9pm
- Calendar `.ics` generated client-side
- All payment + booking is **fully simulated**.

## Voice / brand notes

- Confident, owner-operator tone. Specific to ABQ ("two shops on Central," "Route 66")
- Bodoni Moda display + Inter body — gives tattoo flash poster feel without going clichéd
- Terracotta + warm-black palette nods to Southwest without being kitschy
- Marquee ticker bar for styles list adds movement and energy
- "Get tattooed" treated as transactional and direct, never precious

## To swap before launch

- Verify pricing structure
- Confirm artist roster, especially as it changes
- Replace all artist portraits and shop photos
- Confirm waiver text against shop's actual signed waiver (the preview is illustrative — owner's lawyer should review)
- Confirm hours per location (the SE may differ from NE)
- Confirm piercing services & policies
- Connect Stripe for real deposits
- Connect a real booking backend (currently this would integrate with Booksy, GlossGenius, or a custom CRM)
- SMS / email confirmation hooked to a real provider
