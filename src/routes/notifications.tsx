import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PingNotification } from "@/components/ping-notification";
import { NotificationMonoIcon } from "@/components/logo";

export const Route = createFileRoute("/notifications")({
  component: NotificationsPreview,
  head: () => ({
    meta: [
      { title: "Notification preview — PingSync" },
      { name: "description", content: "Preview of the PingSync brief, collapsed, and expanded notification states." },
    ],
  }),
});

const SAMPLE = {
  sender: "VK-SBICRD-T",
  otp: "630775",
  body: "630775 is the OTP for Trxn. of INR 403.00 at FLIPKART with your credit card ending 0931. OTP is valid for 10 mins. Do not share it with anyone - SBI Card",
};

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function StatusBar({ theme }: { theme: "light" | "dark" }) {
  const isDark = theme === "dark";
  return (
    <div
      className={`flex items-center justify-between rounded-t-xl px-5 py-2 text-xs ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <span>8:41</span>
      <div className="flex items-center gap-1.5">
        <NotificationMonoIcon size={14} />
        <span className="text-[10px]">78%</span>
      </div>
    </div>
  );
}

function NotificationsPreview() {
  return (
    <main className="min-h-screen bg-background px-5 pb-16 pt-8 sm:pt-12">
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
            <h1 className="text-xl font-semibold tracking-tight">Notification preview</h1>
            <p className="text-xs text-muted-foreground">Brief · Collapsed · Expanded</p>
          </div>
        </header>

        {/* Status bar icon check */}
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Status bar icon (monochrome, system-tinted)
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="overflow-hidden rounded-xl border border-border">
              <StatusBar theme="light" />
              <p className="bg-white px-5 py-4 text-[11px] text-neutral-500">Light theme</p>
            </div>
            <div className="overflow-hidden rounded-xl border border-border">
              <StatusBar theme="dark" />
              <p className="bg-black px-5 py-4 text-[11px] text-white/60">Dark theme</p>
            </div>
          </div>
        </div>

        <Section label="Brief (heads-up)">
          <PingNotification variant="brief" {...SAMPLE} theme="light" />
          <PingNotification variant="brief" {...SAMPLE} otp="1234567890" theme="light" />
        </Section>

        <Section label="Collapsed (notification shade)">
          <PingNotification variant="collapsed" {...SAMPLE} theme="light" />
          <PingNotification variant="collapsed" {...SAMPLE} theme="dark" />
        </Section>

        <Section label="Expanded">
          <PingNotification variant="expanded" {...SAMPLE} theme="light" />
          <PingNotification variant="expanded" {...SAMPLE} theme="dark" />
        </Section>

        <p className="pt-4 text-center text-[11px] text-muted-foreground/70">
          PingSync • End-to-end encrypted
        </p>
      </div>
    </main>
  );
}
