# PingSync — Design Refresh v3

## 1. Ingest the current UI

Bring the codebase in line with the screenshots you shared:
- **Home**: header with logo + subtitle + settings gear, big SMS Auto-Forwarding switch card, Diagnostics row that expands into a details panel (Delivery / Encryption / Registration + "Test round-trip"), and the Sync Ledger.
- **Settings**: keep as-is (Push message config + loop-protection footer).
- **Typography**: drop the Inter Google Font. Use the OS default stack — `-apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif` — so it renders in Samsung One UI / Roboto natively on Android and doesn't cost a font request.

## 2. Sync Ledger — tabs (two variants to compare)

Build a `/ledger-preview` route that shows both variants stacked, each fully functional, so you can pick:

- **Variant A — Received / Sent / All** (default tab: Received)
- **Variant B — Received / Sent** (no All; default: Received)

Tab bar sits directly under the "RECENT SYNC LEDGER" label, sliding-underline indicator, count badge next to each tab label (e.g. `Received · 3`). Once you pick, the winner ships to `/` and the preview route is removed.

## 3. Chip colors & row treatment

- **Received** → green chip background behind OTP + green diagonal-down-left arrow (↙) on a green tinted circle. Green stays the brand color and now highlights the thing that matters most.
- **Sent** → blue chip background behind OTP + blue diagonal-up-right arrow (↗) on a blue tinted circle.
- Same tabular-numeral OTP scaling (auto-shrinks for 9–10 digit).

## 4. Swipe-to-reveal (replaces swipe-to-dismiss)

Swiping a row left no longer removes it. Instead it reveals a two-action tray behind the row:
- **Copy** (green) — copies the OTP, row springs back, toast confirms.
- **Delete** (muted red) — removes with undo toast (same undo behavior as before, just now behind an explicit tap).

Rubber-band resistance past the reveal threshold; row snaps to either closed or open state; tapping the row body while open closes it.

## 5. Animation pass (the big investment)

Introduce `framer-motion` and apply consistent spring tokens (`{ type: "spring", stiffness: 380, damping: 30 }` for taps, gentler for layout).

**Toggle + status**
- Switch thumb springs; track color cross-fades between muted and green over 240ms.
- "Active · listening" label cross-fades in with a 4px slide-up, and the label gets a tiny **pulsing green dot** (breathing 1.6s loop) so "listening" reads at a glance.

**Diagnostics**
- Chevron rotates with spring, panel expands with `height auto` layout animation and content fades in staggered (3 rows, 40ms stagger).

**Ledger rows**
- Mount stagger: 60ms per row, fade + 8px slide-up.
- Tap ripple: subtle 0.98 scale on press.
- Expand/collapse: shared-layout height animation, body text fades in.
- Swipe-to-reveal: gesture-driven translateX with rubber-band; action tray icons scale from 0.8→1 as they cross reveal threshold.
- Delete: row collapses height to 0 + fades; undo toast slides up with spring; restoring animates it back into position at its original index.

**Tab switching**
- Sliding underline (`layoutId="tab-underline"`) glides between tabs.
- List cross-fades with a 12px directional slide (matches swipe direction between tabs).
- Empty states fade in with a friendly line ("No sent OTPs yet — send a test from Settings.").

**Copy / feedback**
- Copy button morphs icon → checkmark with a spring scale, 900ms hold, then reverts.
- Toasts use spring slide-up with slight overshoot.

**Page transitions**
- Home ↔ Settings ↔ Notifications get a 180ms fade + 6px slide via route-level `AnimatePresence`.

## 6. Additional improvements I recommend

1. **Sticky mini-header** on scroll: once you scroll past the SMS card, a slim bar with the toggle state ("Active · listening" + tiny switch) sticks to the top so the primary control is always reachable.
2. **Long-press on OTP chip** = instant copy (skip expanding the row). Haptic-style scale feedback.
3. **Unread indicator**: a green dot on the left edge of rows that arrived since last app open — clears when you tap or copy.
4. **Diagnostics dot semantic**: green = both fresh (<1h), amber = one stale, red = failure. Currently it's static.
5. **Empty ledger illustration**: a single monoline echo-bubble mark, muted, with one-line copy — better than the current plain text.
6. **Reduced motion**: honor `prefers-reduced-motion` — animations collapse to simple opacity fades.

## Technical notes

- Add `framer-motion` (`bun add framer-motion`).
- Update `src/styles.css`: remove Google Fonts import, set system font stack on `body`, add `--incoming` (green) and `--outgoing` (blue) semantic tokens plus their `-foreground` and `-muted` variants (OKLCH). Add reduced-motion media query zeroing out transform durations.
- Refactor `src/components/ledger-row.tsx`:
  - Replace pointer-swipe-dismiss with framer-motion `drag="x"` + `dragConstraints` reveal.
  - Use `motion.div` with `layout` for expand/collapse.
  - Extract arrow chip + OTP chip into small subcomponents so tab variants can reuse.
- New `src/components/ledger-tabs.tsx` — controlled tabs with `layoutId` underline; accepts `tabs` array so Variant A and B share the component.
- Update `src/routes/index.tsx` — swap in the chosen (or, temporarily, Variant A) tabbed ledger, add sticky mini-header via `IntersectionObserver`, refined Diagnostics.
- New `src/routes/ledger-preview.tsx` — renders both variants with labels so you can compare.
- Update `src/routes/__root.tsx` — remove Inter link tag; wrap `<Outlet />` in `AnimatePresence` for page transitions.
- `src/components/ping-notification.tsx` — no functional changes; just verify chip colors still match the new incoming/outgoing tokens (green for received notifications).

## Out of scope for this pass

- Notification icon redesign (already shipped, keeping current mono glyph).
- Settings page visual changes.
- Any backend / real SMS wiring.
