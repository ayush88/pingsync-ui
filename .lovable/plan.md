# Home + Settings polish

## 1. Ship Variant B, retire the preview
- Home ledger uses the 2-tab layout: **Received / Sent**, default Received.
- Delete `src/routes/ledger-preview.tsx` and remove the "Compare tab layouts" link from home.

## 2. Tab bar cleanup
- Drop count badges — labels only ("Received", "Sent").
- **New-arrivals indicator**: a small green dot to the right of the "Received" label when there are unread received rows; it disappears once the Received tab is viewed or all unread rows are cleared/copied. No pulsing/breathing loop — just a static 6px dot that fades in over 150ms (respects `prefers-reduced-motion`).
- Keep the sliding underline (`layoutId`) as the only motion on tab switch.

## 3. Section rename
Rename **"Recent Sync Ledger"** to **"Recent activity"** (short, plain, matches what users scan for). Alternates if you prefer: "Recent OTPs", "Activity". I'll go with **Recent activity** unless you pick another.

## 4. Section header controls
Replace the current single "Clear all" text button with a right-aligned icon row:
- **Refresh** icon button (`RotateCw`) — spins 360° on tap, then toast "Up to date · just now". Disabled while spinning.
- **Clear all** icon button (`Trash2`) — muted; opens a confirmation.

Layout: `Recent activity` on the left, `[⟳] [🗑]` on the right, both 32px hit targets, muted-foreground, hover→foreground.

## 5. Clear-all confirmation + undo
- Tapping Clear all opens a **bottom sheet** on mobile (shadcn `Sheet` from bottom) / **Dialog** on ≥sm: title "Clear all activity?", body "This removes {n} entries from the ledger. Your paired device is not affected.", actions **Cancel** (ghost) and **Clear all** (destructive).
- On confirm: rows animate out (stagger 30ms, fade + collapse height), then a toast "Cleared {n} entries" with an **Undo** action that restores the full list in original order.

## 6. Diagnostics CTA
Restore the CTA from the earlier screenshot. Inside the expanded diagnostics panel, below the 3 status lines, add a right-aligned pill button **"Test round-trip"** (outline, `Zap` icon). On tap:
- Button shows inline spinner + label "Testing…".
- After ~1.2s (mocked), morphs to a green check + "Round-trip 842 ms" for 2s, then reverts.
- Toast on failure path (not wired now, but leave the code path).

## 7. Settings page polish
You're right that Settings hasn't moved. Applying the same visual language as home:
- Group into two cards with clearer hierarchy: **Pairing** (publish/subscribe topics + generate) and **Security** (encryption passphrase + show/hide eye toggle).
- Move **Save configuration** into a sticky footer bar at the bottom of the viewport on mobile (safe-area padded), so it's always reachable while editing long fields. **Send test message** becomes a secondary ghost link inside the Pairing card, next to "Generate random topics".
- Passphrase field: add show/hide toggle (`Eye`/`EyeOff`), a subtle strength meter (weak/ok/strong based on length + charset), and a "Copy" affordance that only appears after focus-out with a value present.
- Filter rules accordion: same as today but with a monospace chip preview of the compiled regex (e.g. `/\b\d{4,8}\b/`) and inline validation (red border + tooltip on invalid regex).
- Animate accordion open/close with the same spring tokens used on home; page transition uses the shared route-level fade+slide.

If you'd rather keep Settings visually identical for now and only polish home, say the word and I'll skip section 7.

## Technical notes

- `src/routes/index.tsx`: track `lastViewedReceivedAt` in state; `hasUnreadReceived = entries.some(e => e.direction==='incoming' && e.unread && !viewed)`. Reset when `tab==='received'` mounts. Add refresh + clear-all handlers; wire shadcn `Sheet` (mobile) via `useIsMobile` to switch between Sheet and `AlertDialog`.
- `src/components/ledger-tabs.tsx`: remove `count` prop, add optional `indicator?: boolean` per tab; render dot after label.
- Diagnostics: extract into `src/components/diagnostics.tsx` to keep index.tsx small; owns the test-round-trip state machine.
- `src/routes/settings.tsx`: split into `PairingCard`, `SecurityCard`, `FilterRulesCard` subcomponents in-file; add sticky footer using `sticky bottom-0` with `bg-background/80 backdrop-blur` and `pb-[env(safe-area-inset-bottom)]`.
- Delete `src/routes/ledger-preview.tsx`; regenerate route tree happens automatically.
- No new dependencies.

## Out of scope
- Notification designs (unchanged).
- Backend / real SMS wiring.
- Icon redesign.
