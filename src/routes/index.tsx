import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Toaster, toast } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  component: Index,
});

function EchoBubblesLogo() {
  return (
    <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-card">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 text-foreground"
        aria-hidden="true"
      >
        <path d="M4 7.5a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-3l-3 2.5v-2.5H7a3 3 0 0 1-3-3z" />
        <path d="M10 14.5a3 3 0 0 0 3 3h1l2 1.5v-1.5h1a3 3 0 0 0 3-3v-2" opacity="0.55" />
      </svg>
      <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
    </span>
  );
}

function Index() {
  const [active, setActive] = useState(false);
  const [target, setTarget] = useState("");

  return (
    <main className="min-h-screen bg-background px-5 py-10 sm:py-14">
      <Toaster position="top-center" />
      <div className="mx-auto w-full max-w-xl space-y-6">
        {/* Header */}
        <header className="flex items-center gap-3">
          <EchoBubblesLogo />
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              PingSync
            </h1>
            <p className="text-xs text-muted-foreground">
              Forward what matters. Quietly.
            </p>
          </div>
        </header>

        {/* Routing Card */}
        <Card className="rounded-2xl border-border/70 bg-card p-6 shadow-none">
          <div className="space-y-2">
            <Label htmlFor="target" className="text-sm font-medium">
              Target Device Number
            </Label>
            <Input
              id="target"
              inputMode="tel"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="+91 98765 43210"
              className="h-11 rounded-xl bg-background"
            />
          </div>

          <Button
            onClick={() => toast.success("Configuration saved")}
            className="mt-4 h-11 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save Configuration
          </Button>

          <div className="my-6 h-px w-full bg-border" />

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                SMS Auto-Forwarding Service
              </p>
              <p
                className={`text-xs font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {active ? "Active & Listening" : "Inactive"}
              </p>
            </div>
            <Switch
              checked={active}
              onCheckedChange={setActive}
              className="scale-125 data-[state=checked]:bg-primary"
              aria-label="Toggle SMS auto-forwarding"
            />
          </div>
        </Card>

        {/* Advanced Configuration */}
        <Card className="rounded-2xl border-border/70 bg-card px-6 py-2 shadow-none">
          <Accordion type="single" collapsible>
            <AccordionItem value="advanced" className="border-b-0">
              <AccordionTrigger className="py-4 text-sm font-medium hover:no-underline">
                Advanced Configuration Engine
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-5">
                <div className="space-y-2">
                  <Label htmlFor="keywords" className="text-xs font-medium text-muted-foreground">
                    Target Keyword Filters (Comma Separated)
                  </Label>
                  <Input
                    id="keywords"
                    defaultValue="otp, code, verification, pwd, secret, secure, txn"
                    className="h-10 rounded-xl bg-background font-mono text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regex" className="text-xs font-medium text-muted-foreground">
                    Custom OTP Regex Pattern
                  </Label>
                  <Input
                    id="regex"
                    defaultValue={"\\b\\d{4,8}\\b"}
                    className="h-10 rounded-xl bg-background font-mono text-xs"
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toast.success("Rules updated")}
                  className="rounded-lg"
                >
                  Update Rules
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        {/* Safety Shield Badge */}
        <div className="flex items-start gap-3 rounded-2xl bg-muted/70 px-4 py-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground/80">
              Infinite Loop Protection Enabled:
            </span>{" "}
            All messages originating from the configured Target Device Number are
            structurally blocked from echoing.
          </p>
        </div>

        {/* Activity Log */}
        <section className="space-y-3">
          <h2 className="px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Recent Sync Ledger
          </h2>
          <Card className="divide-y divide-border/70 rounded-2xl border-border/70 bg-card p-0 shadow-none">
            <LogRow
              dotClass="bg-primary"
              text="HDFC Bank OTP matched and forwarded successfully"
              time="2m ago"
            />
            <LogRow
              dotClass="bg-muted-foreground/40"
              text="Incoming text from Target Number ignored (Loop Blocked)"
              time="1h ago"
            />
          </Card>
        </section>

        <p className="pt-2 text-center text-[11px] text-muted-foreground/70">
          PingSync · Local-only · No cloud relays
        </p>
      </div>
    </main>
  );
}

function LogRow({
  dotClass,
  text,
  time,
}: {
  dotClass: string;
  text: string;
  time: string;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <span className={`h-2 w-2 shrink-0 rounded-full ${dotClass}`} />
      <p className="flex-1 text-sm text-muted-foreground">
        <span className="text-foreground/80">{text}</span>
        <span className="text-muted-foreground"> · {time}</span>
      </p>
    </div>
  );
}
