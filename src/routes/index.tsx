import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings as SettingsIcon, RefreshCw, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { PingSyncLogo } from "@/components/logo";
import { LedgerRow, type LedgerEntry } from "@/components/ledger-row";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "PingSync — SMS Auto-Forwarding" },
      { name: "description", content: "Forward OTPs and important SMS between your devices, end-to-end encrypted." },
    ],
  }),
});

const SEED: LedgerEntry[] = [
  {
    id: "1",
    direction: "incoming",
    sender: "VK-SBICRD-T",
    otp: "630775",
    time: "2m ago",
    timestamp: "Tue Jul 21 · 8:38 am",
    body: "630775 is the OTP for Trxn. of INR 403.00 at FLIPKART with your credit card ending 0931. OTP is valid for 10 mins. Do not share it with anyone - SBI Card",
  },
  {
    id: "2",
    direction: "incoming",
    sender: "VA-AXISBK-T",
    otp: "999318",
    time: "12m ago",
    timestamp: "Tue Jul 21 · 8:28 am",
    body: "999318 is SECRET OTP for txn of INR 403.00 on Axis Bank card XX7829 at Flipkart. OTP valid for 5 mins.",
  },
  {
    id: "3",
    direction: "outgoing",
    sender: "AX-XPBEES-S",
    otp: "477085",
    time: "48m ago",
    timestamp: "Tue Jul 21 · 7:52 am",
    body: "Sandisk 128GB MicroSDXC Memo.. from moglix, AWB:1378050948952 is out for delivery, plz share delivery code: 477085 with executive.",
  },
  {
    id: "4",
    direction: "outgoing",
    sender: "PingSync-Test",
    otp: "1234",
    time: "2h ago",
    timestamp: "Tue Jul 21 · 6:41 am",
    body: "PingSync test message · pair verified.",
  },
];

function Index() {
  const [active, setActive] = useState(true);
  const [entries, setEntries] = useState<LedgerEntry[]>(SEED);
  const [diagOpen, setDiagOpen] = useState(false);

  const dismiss = (id: string) => {
    const removed = entries.find((e) => e.id === id);
    setEntries((es) => es.filter((e) => e.id !== id));
    if (!removed) return;
    toast("Removed", {
      description: `${removed.sender} · ${removed.otp}`,
      action: {
        label: "Undo",
        onClick: () => setEntries((es) => [removed, ...es]),
      },
    });
  };

  return (
    <main className="min-h-screen bg-background px-5 pb-16 pt-8 sm:pt-12">
      <Toaster position="bottom-center" />
      <div className="mx-auto w-full max-w-xl space-y-6">
        {/* Header */}
        <header className="flex items-center gap-3">
          <PingSyncLogo />
          <div className="flex flex-1 flex-col">
            <h1 className="text-xl font-semibold tracking-tight">PingSync</h1>
            <p className="text-xs text-muted-foreground">Forward what matters. Quietly.</p>
          </div>
          <Link
            to="/settings"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Settings"
          >
            <SettingsIcon className="h-5 w-5" />
          </Link>
        </header>

        {/* Primary status */}
        <Card className="flex items-center justify-between gap-4 rounded-2xl border-border bg-card p-5 shadow-none">
          <div className="min-w-0">
            <p className="text-base font-semibold text-foreground">SMS Auto-Forwarding</p>
            <p
              className={`mt-1 text-sm ${
                active ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              {active ? "Active · listening" : "Inactive"}
            </p>
          </div>
          <Switch
            checked={active}
            onCheckedChange={setActive}
            className="scale-125 data-[state=checked]:bg-primary"
            aria-label="Toggle SMS auto-forwarding"
          />
        </Card>

        {/* Diagnostics */}
        <button
          type="button"
          onClick={() => setDiagOpen((v) => !v)}
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-muted/50 transition-colors"
        >
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="flex-1 text-xs text-muted-foreground">
            Diagnostics · sent 48m ago · received 2h ago
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              diagOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {diagOpen && (
          <div className="-mt-3 space-y-1 rounded-xl bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
            <p>Publish topic · reachable</p>
            <p>Subscribe topic · listening</p>
            <p>Encryption · AES-256-GCM</p>
          </div>
        )}

        {/* Ledger */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Recent Sync Ledger
            </h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Refresh"
                onClick={() => toast.success("Refreshed")}
                className="text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setEntries([])}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear all
              </button>
            </div>
          </div>

          <Card className="divide-y divide-border rounded-2xl border-border bg-card p-0 shadow-none overflow-hidden">
            {entries.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                No syncs yet — OTPs will appear here the moment they arrive.
              </p>
            ) : (
              entries.map((e) => <LedgerRow key={e.id} entry={e} onDismiss={dismiss} />)
            )}
          </Card>

          <p className="px-1 pt-1 text-[11px] text-muted-foreground/70">
            Swipe a row to dismiss.{" "}
            <Link to="/notifications" className="underline underline-offset-2 hover:text-foreground">
              Preview notifications
            </Link>
          </p>
        </section>

        <p className="pt-4 text-center text-[11px] text-muted-foreground/70">
          PingSync • End-to-end encrypted
        </p>
      </div>
    </main>
  );
}
