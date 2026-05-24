# PingSync Dashboard

Build a single-page light-theme dashboard for "PingSync" on the home route, replacing the placeholder in `src/routes/index.tsx`.

## Design system

Update `src/styles.css` light tokens:
- `--background`: soft white (`oklch(0.99 0.002 250)`)
- `--card`: subtle light gray (`oklch(0.975 0.003 250)`)
- `--border`: low-contrast (`oklch(0.93 0.004 250)`)
- `--primary`: mint green `#4ADE80` (`oklch(0.83 0.18 145)`), foreground near-black
- `--muted-foreground`: soft gray for log text
- Generous radius (`--radius: 1rem`), no heavy shadows
- Font: Inter via Google Fonts link in `__root.tsx` head

## Page layout (single column, max-w ~640px, centered, vertical rhythm)

1. **Header**
   - Custom inline SVG icon: two overlapping/echoing chat bubbles outlined in foreground, small mint-green filled dot at top-right as active status
   - Wordmark "PingSync" in semibold sans
   - Subtle one-line tagline under it

2. **Routing Card** (`Card` component)
   - `Label` + `Input` "Target Device Number", placeholder `+91 98765 43210`
   - `Button` "Save Configuration" (mint primary, full-width-ish)
   - Divider
   - Row: label "SMS Auto-Forwarding Service" left, large `Switch` right
   - Status text below toggle: "Inactive" (muted) ↔ "Active & Listening" (mint) driven by switch state

3. **Advanced Configuration Engine** (`Accordion` single-item, collapsed by default)
   - Trigger: "Advanced Configuration Engine"
   - Content:
     - `Input` "Target Keyword Filters (Comma Separated)" default `otp, code, verification, pwd, secret, secure, txn`
     - `Input` "Custom OTP Regex Pattern" default `\b\d{4,8}\b`
     - Small secondary `Button` "Update Rules"

4. **Active Safety Shield Badge**
   - Low-contrast pill/box with small shield icon (lucide `ShieldCheck`) + the exact copy provided
   - Muted background, muted-foreground text

5. **Recent Sync Ledger**
   - Heading "Recent Sync Ledger"
   - Two rows, each: small status dot (mint for forwarded, gray for blocked) + message + "• 2m ago" / "• 1h ago" in muted text
   - Thin dividers between items

## Technical details

- Files: edit `src/routes/index.tsx` (replace placeholder), edit `src/styles.css` (tokens + Inter font), edit `src/routes/__root.tsx` head (title "PingSync — SMS Forwarding", description, Inter font link)
- Local `useState` for switch on/off and saved-config feedback (toast via existing `sonner`)
- Use shadcn components already present: `card`, `input`, `label`, `button`, `switch`, `accordion`, `badge`, `sonner`
- Icons from `lucide-react`: `ShieldCheck`, `MessageCircle` (or custom inline SVG for the echo-bubbles logo)
- All colors via semantic tokens — no hardcoded hex in JSX
- Purely frontend, no backend wiring
