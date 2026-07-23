import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Zap, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

const spring = { type: "spring" as const, stiffness: 380, damping: 32 };

type TestState = "idle" | "testing" | "success";

export function Diagnostics() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<TestState>("idle");
  const [latency, setLatency] = useState<number | null>(null);

  const runTest = () => {
    if (state !== "idle") return;
    setState("testing");
    setTimeout(() => {
      const ms = 700 + Math.floor(Math.random() * 400);
      setLatency(ms);
      setState("success");
      setTimeout(() => setState("idle"), 2200);
    }, 1200);
  };

  return (
    <div>
      <motion.button
        type="button"
        whileTap={{ scale: 0.99 }}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-muted/50 transition-colors"
      >
        <span className="h-2 w-2 rounded-full bg-primary" />
        <span className="flex-1 text-xs text-muted-foreground">
          Diagnostics · sent 48m ago · received 2m ago
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={spring}>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 8 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ ...spring, damping: 28 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
              {[
                "Publish topic · reachable",
                "Subscribe topic · listening",
                "Encryption · AES-256-GCM",
              ].map((line, i) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  {line}
                </motion.p>
              ))}

              <div className="mt-3 flex justify-end">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={runTest}
                  disabled={state !== "idle"}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors ${
                    state === "success"
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {state === "idle" && (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="inline-flex items-center gap-1.5"
                      >
                        <Zap className="h-3 w-3" /> Test round-trip
                      </motion.span>
                    )}
                    {state === "testing" && (
                      <motion.span
                        key="testing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="inline-flex items-center gap-1.5"
                      >
                        <Loader2 className="h-3 w-3 animate-spin" /> Testing…
                      </motion.span>
                    )}
                    {state === "success" && (
                      <motion.span
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={spring}
                        className="inline-flex items-center gap-1.5"
                      >
                        <Check className="h-3 w-3" /> Round-trip {latency} ms
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
