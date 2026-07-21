import { ChevronDown, ChevronUp } from "lucide-react";
import { NotificationMonoIcon } from "./logo";

type Variant = "brief" | "collapsed" | "expanded";

export type NotificationProps = {
  variant: Variant;
  sender: string;
  otp: string;
  body?: string;
  theme?: "light" | "dark";
};

function otpClass(otp: string, base: number) {
  const len = otp.length;
  const size = len >= 9 ? Math.round(base * 0.78) : base;
  return { fontSize: `${size}px`, letterSpacing: len >= 9 ? "0.14em" : "0.22em" };
}

/** The small leading icon slot — colored circle in the mockup that stands
 *  in for the Android-tinted status-bar icon. */
function IconChip({ theme }: { theme: "light" | "dark" }) {
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${
        theme === "dark" ? "bg-white/90 text-black" : "bg-primary text-primary-foreground"
      }`}
    >
      <NotificationMonoIcon size={20} />
    </span>
  );
}

function CopyPill({ theme }: { theme: "light" | "dark" }) {
  return (
    <button
      type="button"
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
        theme === "dark"
          ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
          : "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
      }`}
    >
      Copy
    </button>
  );
}

export function PingNotification({
  variant,
  sender,
  otp,
  body,
  theme = "light",
}: NotificationProps) {
  const isDark = theme === "dark";
  const shell = isDark
    ? "bg-[#2a2a2a] text-white"
    : "bg-[#f2f2f2] text-neutral-900";
  const subtle = isDark ? "text-white/60" : "text-neutral-500";

  if (variant === "brief") {
    return (
      <div className={`flex items-center gap-3 rounded-[28px] px-4 py-3.5 shadow-sm ${shell}`}>
        <IconChip theme={theme} />
        <div className="min-w-0 flex-1">
          <p className={`text-[13px] font-medium ${subtle}`}>{sender}</p>
          <p
            className="font-semibold tabular"
            style={otpClass(otp, 26)}
          >
            {otp}
          </p>
        </div>
        <CopyPill theme={theme} />
        <ChevronDown className={`h-5 w-5 ${subtle}`} />
      </div>
    );
  }

  if (variant === "collapsed") {
    return (
      <div className={`flex items-center gap-4 rounded-[28px] px-5 py-4 shadow-sm ${shell}`}>
        <IconChip theme={theme} />
        <div className="min-w-0 flex-1">
          <p className={`text-[13px] font-medium ${subtle}`}>{sender}</p>
          <p
            className="mt-0.5 font-semibold tabular leading-none"
            style={otpClass(otp, 34)}
          >
            {otp}
          </p>
        </div>
        <CopyPill theme={theme} />
        <ChevronDown className={`h-5 w-5 ${subtle}`} />
      </div>
    );
  }

  return (
    <div className={`rounded-[28px] shadow-sm ${shell}`}>
      <div className="flex items-start gap-4 px-5 pt-4">
        <IconChip theme={theme} />
        <div className="min-w-0 flex-1">
          <p className={`text-[13px] font-medium ${subtle}`}>{sender}</p>
          <p
            className="mt-1 font-semibold tabular leading-none"
            style={otpClass(otp, 34)}
          >
            {otp}
          </p>
        </div>
        <ChevronUp className={`h-5 w-5 ${subtle}`} />
      </div>
      <p className="px-5 pb-4 pt-3 text-[14px] leading-relaxed">{body}</p>
      <div className={isDark ? "border-t border-white/10" : "border-t border-black/10"}>
        <button
          type="button"
          className={`w-full py-3.5 text-center text-[15px] font-semibold ${
            isDark ? "text-white" : "text-primary"
          }`}
        >
          Copy OTP
        </button>
      </div>
    </div>
  );
}
