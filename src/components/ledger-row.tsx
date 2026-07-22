import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { ChevronDown, ArrowDownLeft, ArrowUpRight, Copy, Trash2, Check } from "lucide-react";
import { toast } from "sonner";

export type LedgerEntry = {
  id: string;
  direction: "incoming" | "outgoing";
  sender: string;
  otp: string;
  time: string;
  timestamp: string;
  body: string;
  unread?: boolean;
};

function otpSizeClass(otp: string) {
  const len = otp.length;
  if (len >= 9) return "text-base";
  if (len >= 7) return "text-[17px]";
  return "text-lg";
}

const REVEAL_WIDTH = 140; // px of action tray revealed
const spring = { type: "spring" as const, stiffness: 380, damping: 32 };

export function LedgerRow({
  entry,
  onDismiss,
  index = 0,
}: {
  entry: LedgerEntry;
  onDismiss: (id: string) => void;
  index?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const x = useMotionValue(0);
  const trayOpacity = useTransform(x, [-REVEAL_WIDTH, -40, 0], [1, 0.4, 0]);
  const trayScale = useTransform(x, [-REVEAL_WIDTH, -40, 0], [1, 0.85, 0.8]);
  const suppressClick = useRef(false);

  const isIncoming = entry.direction === "incoming";

  const copy = async () => {
    await navigator.clipboard.writeText(entry.otp);
    setCopied(true);
    toast.success(`Copied ${entry.otp}`);
    window.setTimeout(() => setCopied(false), 1100);
  };

  const closeTray = () => {
    setOpen(false);
    x.set(0);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const shouldOpen = info.offset.x < -REVEAL_WIDTH / 2 || info.velocity.x < -400;
    if (shouldOpen) {
      setOpen(true);
      x.set(-REVEAL_WIDTH);
      suppressClick.current = true;
      window.setTimeout(() => (suppressClick.current = false), 200);
    } else {
      closeTray();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
      transition={{ delay: index * 0.04, ...spring }}
      className="relative overflow-hidden bg-card"
    >
      {/* Action tray behind the row */}
      <motion.div
        className="pointer-events-none absolute inset-y-0 right-0 flex items-stretch"
        style={{ opacity: trayOpacity }}
      >
        <motion.button
          type="button"
          onClick={() => {
            copy();
            closeTray();
          }}
          style={{ scale: trayScale }}
          className="pointer-events-auto flex w-[70px] flex-col items-center justify-center gap-1 bg-received/15 text-received"
          aria-label="Copy OTP"
        >
          <Copy className="h-4 w-4" strokeWidth={2.4} />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Copy</span>
        </motion.button>
        <motion.button
          type="button"
          onClick={() => {
            closeTray();
            onDismiss(entry.id);
          }}
          style={{ scale: trayScale }}
          className="pointer-events-auto flex w-[70px] flex-col items-center justify-center gap-1 bg-destructive/10 text-destructive"
          aria-label="Delete"
        >
          <Trash2 className="h-4 w-4" strokeWidth={2.4} />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Delete</span>
        </motion.button>
      </motion.div>

      {/* The row */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -REVEAL_WIDTH, right: 0 }}
        dragElastic={{ left: 0.15, right: 0 }}
        dragMomentum={false}
        style={{ x }}
        onDragEnd={onDragEnd}
        className="relative bg-card touch-pan-y"
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.985 }}
          onClick={() => {
            if (suppressClick.current) return;
            if (open) {
              closeTray();
              return;
            }
            setExpanded((v) => !v);
          }}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
        >
          {entry.unread && (
            <motion.span
              layoutId={`unread-${entry.id}`}
              className="absolute left-1 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          )}
          <span
            aria-label={isIncoming ? "Received" : "Sent"}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
              isIncoming ? "bg-received-soft text-received" : "bg-sent-soft text-sent"
            }`}
          >
            {isIncoming ? (
              <ArrowDownLeft className="h-4 w-4" strokeWidth={2.6} />
            ) : (
              <ArrowUpRight className="h-4 w-4" strokeWidth={2.6} />
            )}
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{entry.sender}</p>
            <p className="truncate text-xs text-muted-foreground">{entry.time}</p>
          </div>

          <div className="shrink-0">
            <span
              aria-label={`One-time code ${entry.otp}`}
              className={`inline-block rounded-lg px-2.5 py-1 font-bold tabular tracking-[0.14em] ${
                isIncoming
                  ? "bg-received-soft text-received"
                  : "bg-sent-soft text-sent"
              } ${otpSizeClass(entry.otp)}`}
            >
              {entry.otp}
            </span>
          </div>

          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={spring}
            className="ml-1 shrink-0 text-muted-foreground"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </motion.button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ ...spring, damping: 28 }}
              className="overflow-hidden bg-muted/50"
            >
              <div className="space-y-2 px-4 pb-4 pt-3">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {entry.timestamp}
                </p>
                <p className="text-sm leading-relaxed text-foreground/90">{entry.body}</p>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    copy();
                  }}
                  className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {copied ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.4, opacity: 0 }}
                        transition={spring}
                        className="flex items-center gap-1.5 text-received"
                      >
                        <Check className="h-3.5 w-3.5" strokeWidth={3} /> Copied
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.4, opacity: 0 }}
                        transition={spring}
                        className="flex items-center gap-1.5"
                      >
                        <Copy className="h-3.5 w-3.5" /> Copy OTP
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
