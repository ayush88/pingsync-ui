import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Lock, Shuffle, Eye, EyeOff, Copy, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Settings — PingSync" },
      { name: "description", content: "Configure PingSync push messaging, encryption, and filter rules." },
    ],
  }),
});

function randomTopic() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: 22 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function passStrength(v: string): { label: string; level: 0 | 1 | 2 | 3; color: string } {
  if (!v) return { label: "", level: 0, color: "bg-muted" };
  let score = 0;
  if (v.length >= 8) score++;
  if (v.length >= 14) score++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  if (score <= 1) return { label: "Weak", level: 1, color: "bg-destructive" };
  if (score === 2) return { label: "OK", level: 2, color: "bg-amber-500" };
  return { label: "Strong", level: 3, color: "bg-primary" };
}

function PairingCard({
  pub,
  setPub,
  sub,
  setSub,
}: {
  pub: string;
  setPub: (v: string) => void;
  sub: string;
  setSub: (v: string) => void;
}) {
  return (
    <Card className="space-y-5 rounded-2xl border-border bg-card p-5 shadow-none">
      <div>
        <h2 className="text-base font-semibold">Pairing</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Two topics per pair · one per direction.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pub" className="text-xs font-medium text-muted-foreground">
          Publish topic (this device → other)
        </Label>
        <Input
          id="pub"
          value={pub}
          onChange={(e) => setPub(e.target.value)}
          className="h-11 rounded-xl bg-background font-mono text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sub" className="text-xs font-medium text-muted-foreground">
          Subscribe topic (other device → this)
        </Label>
        <Input
          id="sub"
          value={sub}
          onChange={(e) => setSub(e.target.value)}
          className="h-11 rounded-xl bg-background font-mono text-xs"
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setPub(randomTopic() + "-out");
            setSub(randomTopic() + "-in");
            toast.success("Generated new topics");
          }}
          className="h-9 rounded-full text-xs"
        >
          <Shuffle className="mr-1.5 h-3.5 w-3.5" /> Generate random topics
        </Button>
        <button
          type="button"
          onClick={() => toast.success("Test message sent")}
          className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          Send test message
        </button>
      </div>
    </Card>
  );
}

function SecurityCard({ pass, setPass }: { pass: string; setPass: (v: string) => void }) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const [copied, setCopied] = useState(false);
  const strength = useMemo(() => passStrength(pass), [pass]);
  const showCopy = !focused && pass.length > 0;

  const copy = async () => {
    await navigator.clipboard.writeText(pass);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <Card className="space-y-5 rounded-2xl border-border bg-card p-5 shadow-none">
      <div>
        <h2 className="text-base font-semibold">Security</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Shared passphrase encrypts every payload end-to-end.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pass" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Lock className="h-3.5 w-3.5" /> Encryption passphrase (shared between devices)
        </Label>
        <div className="relative">
          <Input
            id="pass"
            type={show ? "text" : "password"}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="•••••••••••••••••"
            className="h-11 rounded-xl bg-background pr-20 font-mono text-xs tracking-widest"
          />
          <div className="absolute inset-y-0 right-2 flex items-center gap-1">
            {showCopy && (
              <button
                type="button"
                onClick={copy}
                aria-label="Copy passphrase"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
              </button>
            )}
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide passphrase" : "Show passphrase"}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Strength meter */}
        <div className="flex items-center gap-2">
          <div className="flex flex-1 gap-1">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  strength.level >= n ? strength.color : "bg-muted"
                }`}
              />
            ))}
          </div>
          <span className="w-10 text-right text-[10px] font-medium text-muted-foreground">
            {strength.label}
          </span>
        </div>

        <p className="text-[11px] text-muted-foreground">
          Same passphrase on both devices. AES-256-GCM, per-message salt.
        </p>
      </div>
    </Card>
  );
}

function FilterRulesCard({
  keywords,
  setKeywords,
  regex,
  setRegex,
}: {
  keywords: string;
  setKeywords: (v: string) => void;
  regex: string;
  setRegex: (v: string) => void;
}) {
  const regexValid = useMemo(() => {
    try {
      new RegExp(regex);
      return true;
    } catch {
      return false;
    }
  }, [regex]);

  return (
    <Card className="rounded-2xl border-border bg-card px-5 py-1 shadow-none">
      <Accordion type="single" collapsible>
        <AccordionItem value="filter" className="border-b-0">
          <AccordionTrigger className="py-4 text-sm font-medium hover:no-underline">
            Filter rules (advanced)
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-5">
            <p className="text-xs text-muted-foreground">
              Applied after non-OTP number scrubbing. Defaults are fine for most users.
            </p>
            <div className="space-y-2">
              <Label htmlFor="kw" className="text-xs font-medium text-muted-foreground">
                Target keyword filters (comma-separated)
              </Label>
              <Input
                id="kw"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="h-10 rounded-xl bg-background font-mono text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rx" className="text-xs font-medium text-muted-foreground">
                Custom OTP regex pattern
              </Label>
              <Input
                id="rx"
                value={regex}
                onChange={(e) => setRegex(e.target.value)}
                className={`h-10 rounded-xl bg-background font-mono text-xs ${
                  regexValid ? "" : "border-destructive focus-visible:ring-destructive"
                }`}
                aria-invalid={!regexValid}
              />
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  /{regex}/
                </span>
                {!regexValid && (
                  <span className="text-[10px] font-medium text-destructive">Invalid regex</span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Button
                size="sm"
                disabled={!regexValid}
                onClick={() => toast.success("Rules updated")}
                className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Update rules
              </Button>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setKeywords("otp, code, verification, pwd, secret, secure, txn");
                  setRegex("\\b\\d{4,8}\\b");
                  toast.success("Reset to defaults");
                }}
              >
                Reset to defaults
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}

function SettingsPage() {
  const [pub, setPub] = useState("A62t1COXIjruOjAtscrjQjLK-out");
  const [sub, setSub] = useState("n4TvHxs9uXgoxtG1g8pfKmeR-in");
  const [pass, setPass] = useState("");
  const [keywords, setKeywords] = useState("otp, code, verification, pwd, secret, secure, txn");
  const [regex, setRegex] = useState("\\b\\d{4,8}\\b");

  return (
    <main className="min-h-screen bg-background px-5 pb-32 pt-8 sm:pt-12">
      <Toaster position="bottom-center" />
      <div className="mx-auto w-full max-w-xl space-y-6">
        <header className="flex items-center gap-3">
          <Link
            to="/"
            aria-label="Back"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        </header>

        <PairingCard pub={pub} setPub={setPub} sub={sub} setSub={setSub} />
        <SecurityCard pass={pass} setPass={setPass} />
        <FilterRulesCard
          keywords={keywords}
          setKeywords={setKeywords}
          regex={regex}
          setRegex={setRegex}
        />

        <div className="space-y-1 px-1 text-xs text-muted-foreground">
          <p>
            <span className="text-foreground/80 font-medium">Loop protection.</span> Two topics per
            pair — one per direction. Messages from your paired device are structurally blocked from
            echoing.
          </p>
          <p>End-to-end encrypted · Local-only pairing · No cloud relays</p>
        </div>
      </div>

      {/* Sticky save footer */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 backdrop-blur"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex w-full max-w-xl items-center gap-3 px-5 py-3">
          <Button
            type="button"
            onClick={() => toast.success("Configuration saved")}
            className="h-11 flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save configuration
          </Button>
        </div>
      </div>
    </main>
  );
}
