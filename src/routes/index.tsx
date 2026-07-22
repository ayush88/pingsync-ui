import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Settings as SettingsIcon, ChevronDown, Inbox } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { PingSyncLogo } from "@/components/logo";
import { LedgerRow, type LedgerEntry } from "@/components/ledger-row";
import { LedgerTabs } from "@/components/ledger-tabs";

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
    sender: "JM-AXISBK-T",
    otp: "230945",
    time: "2m ago",
    timestamp: "Tue Jul 22 · 10:58 pm",
    body: "230945 is SECRET OTP for txn of INR 403.00 on Axis Bank card XX7829 at Flipkart on 22-07-26 22:57:56. OTP valid for 5 mins. Please do not share this OTP.",
    unread: true,
  },
  {
    id: "2",
    direction: "incoming",
    sender: "VK-SBICRD-T",
    otp: "630775",
    time: "12m ago",
    timestamp: "Tue Jul 22 · 10:48 pm",
    body: "630775 is the OTP for Trxn. of INR 403.00 at FLIPKART with your credit card ending 0931. OTP is valid for 10 mins. Do not share it with anyone - SBI Card",
    unread: true,
  },
  {
    id: "3",
    direction: "outgoing",
    sender: "AX-XPBEES-S",
    otp: "477085",
    time: "48m ago",
    timestamp: "Tue Jul 22 · 10:12 pm",
    body: "Sandisk 128GB MicroSDXC Memo.. from moglix, AWB:1378050948952 is out for delivery, plz share delivery code: 477085 with executive.",
  },
  {
    id: "4",
    direction: "outgoing",
    sender: "PingSync-Test",
    otp: "1234",
    time: "2h ago",
    timestamp: "Tue Jul 22 · 8:41 pm",
    body: "PingSync test message · pair verified.",
  },
];

type TabKey = "received" | "sent" | "all";

const spring = { type: "spring" as const, stiffness: 380, damping: 32 };

function Index() {
  const [active, setActive] = useState(true);
  const [entries, setEntries] = useState<LedgerEntry[]>(SEED);
  const [diagOpen, setDiagOpen] = useState(false);
  const [tab, setTab] = useState<TabKey>("received");

  const counts = useMemo(
    () => ({
      received: entries.filter((e) => e.direction === "incoming").length,
      sent: entries.filter((e) => e.direction === "outgoing").length,
      all: entries.length,
    }),
    [entries],
  );

  const visible = useMemo(() => {
    if (tab === "received") return entries.filter((e) => e.direction === "incoming");
    if (tab === "sent") return entries.filter((e) => e.direction === "outgoing");
    return entries;
  }, [entries, tab]);

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
            <div className="mt-1 flex items-center gap-2 text-sm">
              <AnimatePresence mode="wait" initial={false}>
                {active ? (
                  <motion.span
                    key="on"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={spring}
                    className="flex items-center gap-2 font-medium text-primary"
                  >
                    <motion.span
                      className="h-2 w-2 rounded-full bg-primary"
                      animate={{ opacity: [1, 0.35, 1], scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
                    Active · listening
                  </motion.span>
                ) : (
                  <motion.span
                    key="off"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={spring}
                    className="text-muted-foreground"
                  >
                    Inactive
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
          <Switch
            checked={active}
            onCheckedChange={setActive}
            className="scale-125 data-[state=checked]:bg-primary"
            aria-label="Toggle SMS auto-forwarding"
          />
        </Card>

        {/* Diagnostics */}
        <div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.99 }}
            onClick={() => setDiagOpen((v) => !v)}
            className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-muted/50 transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <motion.span
                className="absolute inset-0 rounded-full bg-primary"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
            </span>
            <span className="flex-1 text-xs text-muted-foreground">
              Diagnostics · sent 48m ago · received 2m ago
            </span>
            <motion.div animate={{ rotate: diagOpen ? 180 : 0 }} transition={spring}>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </motion.button>
          <AnimatePresence initial={false}>
            {diagOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 8 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ ...spring, damping: 28 }}
                className="overflow-hidden"
              >
                <div className="rounded-xl bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
                  {["Publish topic · reachable", "Subscribe topic · listening", "Encryption · AES-256-GCM"].map(
                    (line, i) => (
                      <motion.p
                        key={line}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        {line}
                      </motion.p>
                    ),
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ledger */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Recent Sync Ledger
            </h2>
            <button
              type="button"
              onClick={() => setEntries([])}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all
            </button>
          </div>

          <LayoutGroup id="home-tabs">
            <LedgerTabs
              tabs={[
                { key: "received", label: "Received", count: counts.received },
                { key: "sent", label: "Sent", count: counts.sent },
                { key: "all", label: "All", count: counts.all },
              ]}
              active={tab}
              onChange={setTab}
            />
          </LayoutGroup>

          <Card className="divide-y divide-border rounded-2xl border-border bg-card p-0 shadow-none overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                {visible.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
                    <Inbox className="h-8 w-8 text-muted-foreground/40" strokeWidth={1.5} />
                    <p className="text-sm text-muted-foreground">
                      {tab === "sent"
                        ? "No sent OTPs yet — send a test from Settings."
                        : tab === "received"
                          ? "No OTPs received — they'll show up here instantly."
                          : "No syncs yet."}
                    </p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {visible.map((e, i) => (
                      <LedgerRow key={e.id} entry={e} index={i} onDismiss={dismiss} />
                    ))}
                  </AnimatePresence>
                )}
              </motion.div>
            </AnimatePresence>
          </Card>

          <p className="px-1 pt-1 text-[11px] text-muted-foreground/70">
            Swipe a row left to reveal Copy / Delete.{" "}
            <Link to="/notifications" className="underline underline-offset-2 hover:text-foreground">
              Preview notifications
            </Link>{" "}
            ·{" "}
            <Link to="/ledger-preview" className="underline underline-offset-2 hover:text-foreground">
              Compare tab layouts
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
