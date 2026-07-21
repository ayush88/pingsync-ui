import { useRef, useState } from "react";
import { ChevronDown, ArrowDownLeft, ArrowUpRight, Copy } from "lucide-react";
import { toast } from "sonner";

export type LedgerEntry = {
  id: string;
  direction: "incoming" | "outgoing";
  sender: string;
  otp: string;
  time: string;
  timestamp: string;
  body: string;
};

function otpSizeClass(otp: string, base: "lg" | "xl" = "lg") {
  const len = otp.length;
  if (base === "xl") {
    if (len >= 9) return "text-2xl";
    return "text-[32px] leading-none";
  }
  if (len >= 9) return "text-base";
  return "text-lg";
}

export function LedgerRow({
  entry,
  onDismiss,
}: {
  entry: LedgerEntry;
  onDismiss: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [dragX, setDragX] = useState(0);
  const startX = useRef<number | null>(null);
  const dragging = useRef(false);

  const isIncoming = entry.direction === "incoming";

  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || startX.current == null) return;
    setDragX(e.clientX - startX.current);
  };
  const onPointerUp = () => {
    dragging.current = false;
    if (Math.abs(dragX) > 100) {
      onDismiss(entry.id);
    } else {
      setDragX(0);
    }
    startX.current = null;
  };

  const copy = async () => {
    await navigator.clipboard.writeText(entry.otp);
    toast.success(`Copied ${entry.otp}`);
  };

  return (
    <div className="relative overflow-hidden">
      <div
        className="select-none touch-pan-y"
        style={{
          transform: `translateX(${dragX}px)`,
          transition: dragging.current ? "none" : "transform 200ms ease-out",
          opacity: 1 - Math.min(Math.abs(dragX) / 300, 0.5),
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/40 transition-colors"
        >
          <span
            aria-label={isIncoming ? "Incoming" : "Outgoing"}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
              isIncoming ? "bg-incoming-soft text-incoming" : "bg-accent text-primary"
            }`}
          >
            {isIncoming ? (
              <ArrowDownLeft className="h-4 w-4" strokeWidth={2.5} />
            ) : (
              <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
            )}
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{entry.sender}</p>
            <p className="truncate text-xs text-muted-foreground">{entry.time}</p>
          </div>

          <div className="shrink-0 text-right">
            {isIncoming ? (
              <span
                aria-label={`One-time code ${entry.otp}`}
                className={`inline-block rounded-lg bg-incoming-soft px-2.5 py-1 font-semibold tabular tracking-[0.18em] text-incoming ${otpSizeClass(
                  entry.otp,
                )}`}
              >
                {entry.otp}
              </span>
            ) : (
              <span
                aria-label={`Code ${entry.otp}`}
                className={`inline-block font-semibold tabular tracking-[0.18em] text-muted-foreground ${otpSizeClass(
                  entry.otp,
                )}`}
              >
                {entry.otp}
              </span>
            )}
          </div>

          <ChevronDown
            className={`ml-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>

        {expanded && (
          <div className="space-y-2 bg-muted/40 px-4 pb-4 pt-2">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {entry.timestamp}
            </p>
            <p className="text-sm leading-relaxed text-foreground/90">{entry.body}</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                copy();
              }}
              className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
            >
              <Copy className="h-3.5 w-3.5" /> Copy OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
