# PingSync — Declutter, Notifications, Settings split

Frontend-only. Files: `src/routes/index.tsx` (rewrite → status + ledger only), new `src/routes/settings.tsx`, new `src/routes/notifications.tsx` (preview of the three notification states), new components + SVG assets, token updates in `src/styles.css`. No backend changes.

## 1. Color system — richer green

Replace the current pale mint (`oklch(0.83 0.18 145)`) with a deeper, saturated emerald that stays legible on white and doesn't shout:

- `--primary: oklch(0.62 0.19 150)` — think `#16A34A` / emerald-600 territory. Rich, confident, not neon.
- `--primary-foreground: oklch(0.99 0.005 150)` — near-white for contrast on the button/switch.
- `--accent` (used for outgoing OTP tint): `oklch(0.94 0.06 150)` — very soft green wash.
- New token `--incoming: oklch(0.5 0.16 250)` — deeper indigo-blue, **more visual weight than outgoing** so incoming OTPs (the ones the user actually reads) pop harder.
- New token `--incoming-soft: oklch(0.95 0.04 250)` — pill background behind incoming OTP.

All existing usages (`bg-primary`, `text-primary`, switch, primary button) inherit the new value; no hex touches JSX.

## 2. Home page — status + ledger only

The home becomes a two-thing screen: is it on, and what has it synced. Everything configurable moves to `/settings`.

Structure (max-w ~560px):

1. **Header** — sharper logo (see §5), "PingSync" wordmark, tagline, small gear icon top-right → `/settings`.
2. **Primary card — SMS Auto-Forwarding**
   - Title + status line ("Active · listening" in emerald, or "Inactive" in muted) + large `Switch`.
   - Nothing else in the card.
3. **Diagnostics** — single collapsible line (amber dot + "Diagnostics · sent 48m ago · received 2h ago"), no card chrome.
4. **Recent Sync Ledger** (the app's whole reason to exist)
   - Section header: title left, `RefreshCw` + "Clear all" right.
   - Rows (see §3).
5. **Footer** — `PingSync • End-to-end encrypted` (single centered line, muted).

Removed from home: ntfy config, filter rules, loop-protection shield badge, matching-pipeline explainer, E2E pill. All live in `/settings` now.

## 3. Ledger row redesign

Row (collapsed, single line):

```
[↗]  VK-SBICRD-T · 2m ago                        6 3 0 7 7 5
```

- **Direction glyph** replaces the "forwarded/received" text:
  - **Incoming ↙** rendered in `--incoming` (deep blue), on `--incoming-soft` circular chip → higher visual weight.
  - **Outgoing ↗** rendered in `--primary` (emerald), on `--accent` circular chip → quieter.
  - Diagonal arrows mirror phone call-history convention. `aria-label="Incoming"` / `"Outgoing"`.
- Middle: sender ID medium weight + relative time in muted, one line, truncates.
- Right: **extracted OTP** in `font-semibold tabular-nums tracking-[0.2em]`, right-aligned, in a reserved slot wide enough for 10 digits. Auto-shrinks one step at 9–10 digits so it never wraps.
  - **Incoming** OTP: `text-lg`, `text-[--incoming]`, sits on a subtle `bg-[--incoming-soft]` pill → the number the user is scanning for.
  - **Outgoing** OTP: `text-base`, `text-muted-foreground`, no pill → confirmation, not focus.
- No dismiss button in the row. Swipe left or right dismisses; a `sonner` toast at the bottom shows "Removed · Undo" for ~5s. On desktop, click-and-drag horizontally on the row triggers the same. (Uses `framer-motion`'s `drag="x"` with `dragConstraints` + `onDragEnd` threshold — already a common pattern, no new heavy dep beyond `framer-motion` which we'll add if not present.)
- Tapping the row expands inline: reveals full timestamp + full SMS body in a soft inset panel underneath, plus a small "Copy OTP" ghost button. No card nesting.

Empty state: "No syncs yet — OTPs will appear here the moment they arrive."

## 4. `/settings` route

Full page (same max-w container, back arrow → `/`), containing:

- **Push message configuration** (renamed from "ntfy Configuration"). Same fields as today: Publish topic, Subscribe topic, "Generate random topics" ghost button, Encryption passphrase, helper line about AES-256-GCM. Actions stacked: **Save configuration** (primary emerald, full width) then **Send test message** (ghost, full width).
- **Filter rules (advanced)** — accordion, collapsed. Same keyword + regex inputs, "Update rules" primary sm, "Reset to defaults" as a small text link.
- **About / safety** — the loop-protection reassurance ("Two topics per pair — loops are structurally impossible") lives here as a muted paragraph, not a badge.

Both sections use the same flat card style as home (1px hairline border, no shadow, 16px padding, 20px vertical gap). Moving these off the home means they're less likely to be fiddled with by accident, which was the concern.

## 5. Notification designs — `/notifications` preview route

Presentational route rendering three states on a neutral device-mockup background. Single `<PingNotification variant="brief" | "collapsed" | "expanded" otp={...} sender={...} direction={...} body={...} />` component.

**A. Brief (heads-up)** — matches Mezo's brief size and includes a Copy CTA.

```
┌──────────────────────────────────────────────────────┐
│ [icon]  VK-SBICRD-T                    [ Copy ]   ⌄ │
│         6 3 0 7 7 5                                  │
└──────────────────────────────────────────────────────┘
```

- Taller pill (~96px) matching Mezo's brief proportions, not the current thin PingSync one.
- Two-line left block: small sender ID on top, **OTP big and bold** below (`text-[28px] font-semibold tabular-nums tracking-[0.22em]`, auto-fits to `text-2xl` at 9–10 digits).
- Trailing **Copy** pill button (emerald outline, tap target ≥40px) + expand chevron.
- No brand image on the right, no WA Share, no Delete.

**B. Collapsed (notification shade)** — big OTP + Copy CTA.

```
┌──────────────────────────────────────────────────────┐
│ [icon]  VK-SBICRD-T                                  │
│         6 3 0 7 7 5                     [ Copy ]  ⌄  │
└──────────────────────────────────────────────────────┘
```

- Same two-line layout as brief but a bit taller, more breathing room.
- OTP at `text-[32px] font-semibold tabular-nums tracking-[0.25em]`, auto-fits down at 10 digits.
- Right side: **Copy** pill + expand chevron. No brand image, no badge pill around the OTP (fixes Mezo clumsiness).

**C. Expanded** — no "PingSync" label (the icon is enough).

```
┌──────────────────────────────────────────────────────┐
│ [icon]  VK-SBICRD-T                              ⌃   │
│                                                       │
│         6 3 0 7 7 5                                   │
│                                                       │
│         630775 is the OTP for Trxn. of INR 403.00    │
│         at FLIPKART with your credit card ending      │
│         0931. OTP is valid for 10 mins. Do not share. │
│                                                       │
│         ────────────────────────────────────────      │
│                        Copy OTP                       │
└──────────────────────────────────────────────────────┘
```

- Sender ID only in the header row — the notification icon already identifies PingSync.
- OTP huge and bold at top; full SMS body in normal weight below.
- One single full-width **Copy OTP** action at the bottom. No WA Share, no Delete, no bell/silence clutter.

All three states share the same type ramp, icon, and color logic (deep blue accent for incoming OTPs, emerald for outgoing test messages).

## 6. Notification icon + logo

Verified: Android status-bar / notification small icons must be **monochrome white silhouette on transparent** at 24dp — the system applies the theme tint (dark icon on light status bar, light icon on dark). Color icons get rendered as a white square on many OEM skins.

Deliverables (SVG under `src/assets/`):
- `notification-mono.svg` — 24×24, single path, white fill, transparent background. Two overlapping speech bubbles with a small sync arc, bolder consistent strokes (~2px equivalent), optically balanced inside a 22px safe area. Renders correctly whether tinted black (light mode) or white (dark mode).
- `app-icon.svg` — full-color launcher variant using the new deep emerald for the sync arc, used in the app header and as the leading icon in the notification mockups.
- `logo.tsx` — sharper in-app React SVG: tighter corner radius on bubbles, thicker uniform stroke, tighter overlap, and the corner status dot becomes a small filled sync-arrow instead of a plain dot.

The `/notifications` preview shows the mono icon on both a light and dark status-bar strip so the user can confirm both modes.

## 7. Polish (applied throughout)

- `font-variant-numeric: tabular-nums` global utility for OTPs and timestamps.
- One elevation only: flat cards, 1px hairline, no shadows.
- Motion: 150ms ease-out on switch, accordion, row expand, and swipe-dismiss spring. Nothing else animates.
- Icon budget on home: `RefreshCw`, `ChevronDown`, `Settings` (gear) — everything else is text or the app's own arrow glyphs.
- Skeleton emerald shimmer on the OTP slot while a sync is mid-flight.

## Technical notes

- Files touched/created:
  - `src/styles.css` — new tokens (`--primary` deeper emerald, `--incoming`, `--incoming-soft`, `--accent`), tabular-nums utility.
  - `src/routes/index.tsx` — rewrite to status + ledger + footer only.
  - `src/routes/settings.tsx` — new; hosts Push message configuration + Filter rules + About.
  - `src/routes/notifications.tsx` — new; renders the three notification mockups on light + dark backgrounds.
  - `src/components/logo.tsx`, `src/components/ledger-row.tsx`, `src/components/ping-notification.tsx` — new.
  - `src/assets/notification-mono.svg`, `src/assets/app-icon.svg` — new.
- Add `framer-motion` if not already installed, for the swipe-to-dismiss gesture on ledger rows.
- Local `useState` only; no data layer changes.
- Accessibility: arrow glyphs get `aria-label`, OTP cells get `aria-label="One-time code 630775"` so screen readers don't read spaced digits as separate numbers.
