import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Settings as SettingsIcon, Inbox, RotateCw, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { PingSyncLogo } from "@/components/logo";
import { LedgerRow, type LedgerEntry } from "@/components/ledger-row";
import { LedgerTabs } from "@/components/ledger-tabs";
import { Diagnostics } from "@/components/diagnostics";

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

type TabKey = "received" | "sent";

const spring = { type: "spring" as const, stiffness: 380, damping: 32 };

function Index() {
  const [active, setActive] = useState(true);
  const [entries, setEntries] = useState<LedgerEntry[]>(SEED);
  const [tab, setTab] = useState<TabKey>("received");
  const [receivedViewed, setReceivedViewed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isMobile = useIsMobile();

  const hasUnreadReceived = useMemo(
    () => !receivedViewed && entries.some((e) => e.direction === "incoming" && e.unread),
    [entries, receivedViewed],
  );

  useEffect(() => {
    if (tab === "received") setReceivedViewed(true);
  }, [tab]);

  const visible = useMemo(() => {
    if (tab === "received") return entries.filter((e) => e.direction === "incoming");
    return entries.filter((e) => e.direction === "outgoing");
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

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success("Up to date · just now");
    }, 900);
  };

  const doClearAll = () => {
    const snapshot = entries;
    setEntries([]);
    setConfirmOpen(false);
    toast(`Cleared ${snapshot.length} ${snapshot.length === 1 ? "entry" : "entries"}`, {
      action: {
        label: "Undo",
        onClick: () => setEntries(snapshot),
      },
    });
  };

  const confirmBody = `This removes ${entries.length} ${entries.length === 1 ? "entry" : "entries"} from the ledger. Your paired device is not affected.`;

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
        <Diagnostics />

        {/* Ledger */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Recent activity
            </h2>
            <div className="flex items-center gap-1">
              <motion.button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing}
                whileTap={{ scale: 0.9 }}
                aria-label="Refresh"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-60"
              >
                <motion.span
                  animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
                  transition={refreshing ? { duration: 0.9, ease: "easeInOut" } : { duration: 0 }}
                  className="inline-flex"
                >
                  <RotateCw className="h-4 w-4" />
                </motion.span>
              </motion.button>
              <motion.button
                type="button"
                onClick={() => entries.length > 0 && setConfirmOpen(true)}
                disabled={entries.length === 0}
                whileTap={{ scale: 0.9 }}
                aria-label="Clear all"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40"
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>
            </div>
          </div>

          <LayoutGroup id="home-tabs">
            <LedgerTabs
              tabs={[
                { key: "received", label: "Received", indicator: hasUnreadReceived },
                { key: "sent", label: "Sent" },
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
                        : "No OTPs received — they'll show up here instantly."}
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
            </Link>
          </p>
        </section>

        <p className="pt-4 text-center text-[11px] text-muted-foreground/70">
          PingSync • End-to-end encrypted
        </p>
      </div>

      {/* Clear-all confirmation */}
      {isMobile ? (
        <Sheet open={confirmOpen} onOpenChange={setConfirmOpen}>
          <SheetContent side="bottom" className="rounded-t-2xl">
            <SheetHeader className="text-left">
              <SheetTitle>Clear all activity?</SheetTitle>
              <SheetDescription>{confirmBody}</SheetDescription>
            </SheetHeader>
            <SheetFooter className="mt-4 flex-row gap-2 sm:justify-end">
              <Button variant="ghost" onClick={() => setConfirmOpen(false)} className="flex-1 sm:flex-none">
                Cancel
              </Button>
              <Button variant="destructive" onClick={doClearAll} className="flex-1 sm:flex-none">
                Clear all
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ) : (
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear all activity?</AlertDialogTitle>
              <AlertDialogDescription>{confirmBody}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={doClearAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Clear all
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </main>
  );
}
