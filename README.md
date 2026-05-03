# Amor Nails & Spa — mockup site

A client-review mockup for **Amor Nails & Spa** (5510 S I-35 Frontage Rd, Suite 130, Austin TX 78745).

This is a **static HTML/CSS/JS** site — no build step, no dependencies. Open `index.html` in any browser to preview locally.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Main marketing page |
| `booking.html` | 5-step simulated booking flow |
| `checkout.html` | Simulated $15 deposit checkout |
| `confirmation.html` | Booking confirmation with `.ics` download |

## Files

```
index.html         # main page
booking.html       # multi-step booking
checkout.html      # simulated card form
confirmation.html  # success page + add-to-calendar
styles.css         # all styling
script.js          # main page interactions
booking.js         # booking flow logic
netlify.toml       # Netlify config (publish = root)
RESEARCH_NOTES.md  # what was verified vs. assumed
assets/            # placeholder image directory
```

## Demo / mockup notice

Bookings and payments are **fully simulated** — no data is transmitted, no card is charged. Every page footer carries a "DEMO MOCK-UP" badge so a reviewer can't miss it.

## Deploy

- Push this branch to GitHub
- Connect the branch in Netlify with publish-dir set to `.` (root)
- No build command needed

## Replace before launch

See `RESEARCH_NOTES.md` for the full list. In short: real photos, verified prices, real booking + payment integration.
