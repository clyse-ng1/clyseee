# Clyse Website

Marketing + auth + logged-in frontend for **Clyse** — share premium subscriptions with friends and family. Built pixel-faithful to the Figma file `CLYSE WEBSITE PROJECT`.

## Stack

- React 19 + Vite
- Tailwind CSS v4
- react-router-dom

## Run it

```bash
npm install
npm run dev     # → http://localhost:5173
npm run build   # production build in dist/
npm run lint
```

## Routes

| Page            | Route                        |
| --------------- | ---------------------------- |
| Landing         | `/`                          |
| Marketplace     | `/marketplace`               |
| Create group 1  | `/create-group`              |
| Create group 2  | `/create-group/details`      |
| Create group 3  | `/create-group/verify`       |
| Create group 4  | `/create-group/review`       |
| Group activated | `/create-group/activated`    |
| Group failed    | `/create-group/failed`       |
| Dashboard       | `/dashboard`                 |
| My Wallet       | `/wallet`                    |
| Wallet empty    | `/wallet/empty`              |
| Wallet error    | `/wallet/error`              |
| Sign Up         | `/signup`                    |
| Sign In         | `/signin`                    |
| Verify email    | `/verify-email`              |
| Verify success  | `/verify-email/success`      |
| Reset password  | `/reset-password`            |
| Check your mail | `/reset-password/check-mail` |
| New password    | `/reset-password/new`        |
| How It Works    | `/how-it-works`              |
| Why Clyse       | `/why-clyse`                 |
| About           | `/about`                     |
| Contact         | `/contact`                   |
| Join Group      | `/join-group`                |
| No Subscription | `/no-subscription`           |
| Sub. Group      | `/subscription-group`        |

## Notes

- `/` is the landing page (hero + footer — the Figma frames contain no below-fold
  sections, so the landing page is complete). The marketplace (search, categories,
  subscription cards, latest slots, owner CTA) lives at `/marketplace` (desktop
  1440px with 100px side margins, mobile reflowed for 430px).
- The logged-in area (`/dashboard`, `/wallet`, `/wallet/empty`, `/wallet/error`)
  reuses the measured sidebar, wallet hero, quick actions and transaction history
  from the Figma browse variants, desktop and mobile.
- Desktop layouts kick in at the `xl` breakpoint (1280px); below that you get the mobile layouts.
- Form states (empty / filled / error) are fully interactive and match the Figma variants.
- Demo shortcuts: on the OTP screen, `000000` triggers the error state — any other 6 digits verify;
  category pills on the homepage are clickable.
- The email you sign up with carries through to the verification screen.
- Copy typos from the original Figma file (“Intruction”, “defferent”, “gmial”, “Primium”,
  “Transfar”, “ormake”, “Social Medial”, “Massage”, …) have been corrected.
- Photo collages, logo, and icons were exported from Figma and converted to optimized WebP.
- All photos (offer avatars, group member avatars, CTA owner photo, footer logo) plus the
  badge/sort/pencil/chevron glyphs are exact exports from the Figma file; `marquee-*.webp`
  are reserved for the brand marquee strip.
- The Figma file shows 12 member cards on the group page but 5 are same-photo Dupes, so the
  site builds the 7 unique ones; likewise only the 3 visible side-panel rows are built (2 are
  fully covered by cards in Figma) and the search-bar chevron is off-canvas in Figma.
- Figma overlap slop is resolved per page and documented in code comments (kept button per
  card, omitted stray/occluded/duplicated layers such as the duplicated desktop
  subscription row, the second "Status" header and the hidden "Sort" row).
- A handful of tiny glyphs (mobile header chevrons, transaction category glyphs,
  button-cluster icons, row arrows) are redrawn SVGs — Figma component internals with
  no token-free path source; everything else is measured geometry.

## Deploy (Netlify)

`netlify.toml` is included — push this folder to a repo and import it in Netlify, or deploy manually:

```bash
npm install
npm run build   # uploads dist/
```

The config includes the SPA redirect (`/* → /index.html`) so all routes work when deployed.

## Structure

```
src/
  assets/       # logo, collages, icons
  components/   # Navbar, AuthLayout, Forms, Decor, Sidebar, BrandTile, Footer
  pages/        # Landing, Marketplace, Group, Signup, Signin, Verify, Reset,
                # Create*, Dashboard, Wallet, WalletEmpty, WalletError, …
  App.jsx       # routes
  index.css     # Tailwind v4 theme + brand tokens
```
