import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Lock, Shuffle } from "lucide-react";
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

function SettingsPage() {
  const [pub, setPub] = useState("A62t1COXIjruOjAtscrjQjLK-out");
  const [sub, setSub] = useState("n4TvHxs9uXgoxtG1g8pfKmeR-in");
  const [pass, setPass] = useState("");
  const [keywords, setKeywords] = useState("otp, code, verification, pwd, secret, secure, txn");
  const [regex, setRegex] = useState("\\b\\d{4,8}\\b");

  return (
    <main className="min-h-screen bg-background px-5 pb-16 pt-8 sm:pt-12">
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

        {/* Push message configuration */}
        <Card className="space-y-5 rounded-2xl border-border bg-card p-5 shadow-none">
          <div>
            <h2 className="text-base font-semibold">Push message configuration</h2>
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

          <div className="space-y-2 pt-1">
            <Label htmlFor="pass" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Lock className="h-3.5 w-3.5" /> Encryption passphrase (shared between devices)
            </Label>
            <Input
              id="pass"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="•••••••••••••••••"
              className="h-11 rounded-xl bg-background font-mono text-xs tracking-widest"
            />
            <p className="text-[11px] text-muted-foreground">
              Same passphrase on both devices. AES-256-GCM, per-message salt.
            </p>
          </div>

          <div className="space-y-2 pt-1">
            <Button
              type="button"
              onClick={() => toast.success("Configuration saved")}
              className="h-11 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save configuration
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => toast.success("Test message sent")}
              className="h-11 w-full rounded-xl border border-border"
            >
              Send test message
            </Button>
          </div>
        </Card>

        {/* Filter rules */}
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
                    className="h-10 rounded-xl bg-background font-mono text-xs"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    size="sm"
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

        {/* About / safety */}
        <div className="space-y-1 px-1 text-xs text-muted-foreground">
          <p>
            <span className="text-foreground/80 font-medium">Loop protection.</span> Two topics per
            pair — one per direction. Messages from your paired device are structurally blocked from
            echoing.
          </p>
          <p>End-to-end encrypted · Local-only pairing · No cloud relays</p>
        </div>
      </div>
    </main>
  );
}
