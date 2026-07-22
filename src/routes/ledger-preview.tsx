import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ArrowLeft, Inbox } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { LedgerRow, type LedgerEntry } from "@/components/ledger-row";
import { LedgerTabs } from "@/components/ledger-tabs";

export const Route = createFileRoute("/ledger-preview")({
  component: LedgerPreview,
  head: () => ({
    meta: [
      { title: "Ledger tab layouts — PingSync" },
      { name: "description", content: "Compare two Sync Ledger tab layouts side by side." },
    ],
  }),
});

const SEED: LedgerEntry[] = [
  {
    id: "a1",
    direction: "incoming",
    sender: "JM-AXISBK-T",
    otp: "230945",
    time: "2m ago",
    timestamp: "Tue Jul 22 · 10:58 pm",
    body: "230945 is SECRET OTP for txn of INR 403.00 on Axis Bank card XX7829 at Flipkart. OTP valid for 5 mins.",
    unread: true,
  },
  {
    id: "a2",
    direction: "incoming",
    sender: "VK-SBICRD-T",
    otp: "630775",
    time: "12m ago",
    timestamp: "Tue Jul 22 · 10:48 pm",
    body: "630775 is the OTP for Trxn. of INR 403.00 at FLIPKART with your credit card ending 0931.",
  },
  {
    id: "a3",
    direction: "outgoing",
    sender: "AX-XPBEES-S",
    otp: "477085",
    time: "48m ago",
    timestamp: "Tue Jul 22 · 10:12 pm",
    body: "Delivery code 477085 shared with executive.",
  },
  {
    id: "a4",
    direction: "outgoing",
    sender: "PingSync-Test",
    otp: "1234",
    time: "2h ago",
    timestamp: "Tue Jul 22 · 8:41 pm",
    body: "PingSync test message · pair verified.",
  },
];



function Variant({
  title,
  subtitle,
  tabs,
  seed,
}: {
  title: string;
  subtitle: string;
  tabs: { key: string; label: string }[];
  seed: LedgerEntry[];
}) {
  const [entries, setEntries] = useState(seed);
  const [tab, setTab] = useState(tabs[0].key);

  const counts = useMemo(() => {
    const rec = entries.filter((e) => e.direction === "incoming").length;
    const sent = entries.filter((e) => e.direction === "outgoing").length;
    return { received: rec, sent, all: entries.length };
  }, [entries]);

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
      action: { label: "Undo", onClick: () => setEntries((es) => [removed, ...es]) },
    });
  };

  return (
    <section className="space-y-3">
      <div className="px-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>

      <LayoutGroup id={`preview-${title}`}>
        <LedgerTabs
          tabs={tabs.map((t) => ({
            ...t,
            count:
              t.key === "received" ? counts.received : t.key === "sent" ? counts.sent : counts.all,
          }))}
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
              <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                <Inbox className="h-7 w-7 text-muted-foreground/40" strokeWidth={1.5} />
                <p className="text-xs text-muted-foreground">Nothing here yet.</p>
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
    </section>
  );
}

function LedgerPreview() {
  return (
    <main className="min-h-screen bg-background px-5 pb-16 pt-8 sm:pt-12">
      <Toaster position="bottom-center" />
      <div className="mx-auto w-full max-w-xl space-y-8">
        <header className="flex items-center gap-3">
          <Link
            to="/"
            aria-label="Back"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Ledger tab layouts</h1>
            <p className="text-xs text-muted-foreground">Pick the one that feels right.</p>
          </div>
        </header>

        <Variant
          title="Variant A"
          subtitle="Received / Sent / All — default Received"
          tabs={[
            { key: "received", label: "Received" },
            { key: "sent", label: "Sent" },
            { key: "all", label: "All" },
          ]}
          seed={SEED}
        />

        <Variant
          title="Variant B"
          subtitle="Received / Sent only — cleaner, no All"
          tabs={[
            { key: "received", label: "Received" },
            { key: "sent", label: "Sent" },
          ]}
          seed={SEED}
        />
      </div>
    </main>
  );
}
