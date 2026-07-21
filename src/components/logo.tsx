export function PingSyncLogo({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-2xl bg-card border border-border ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 32 32"
        width={size * 0.62}
        height={size * 0.62}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="text-foreground"
      >
        {/* Left bubble */}
        <path d="M4 8.5a3.5 3.5 0 0 1 3.5-3.5H16a3.5 3.5 0 0 1 3.5 3.5V13A3.5 3.5 0 0 1 16 16.5h-4.5L8 20v-3.5H7.5A3.5 3.5 0 0 1 4 13z" />
        {/* Right bubble w/ sync arc */}
        <path
          d="M12.5 19a3.5 3.5 0 0 0 3.5 3.5h4.5L24 26v-3.5h.5A3.5 3.5 0 0 0 28 19v-4.5a3.5 3.5 0 0 0-3.5-3.5"
          className="text-primary"
          stroke="currentColor"
        />
      </svg>
    </span>
  );
}

/** Monochrome silhouette used as the notification icon (Android tints it). */
export function NotificationMonoIcon({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M3 6.5A3.5 3.5 0 0 1 6.5 3H13a3.5 3.5 0 0 1 3.5 3.5v3.25a.75.75 0 0 1-1.5 0V6.5A2 2 0 0 0 13 4.5H6.5A2 2 0 0 0 4.5 6.5V10a2 2 0 0 0 2 2H8a.75.75 0 0 1 .75.75v1.44l1.72-1.72a.75.75 0 0 1 1.06 1.06l-3 3A.75.75 0 0 1 7.25 16v-2.5H6.5A3.5 3.5 0 0 1 3 10z" />
      <path d="M11 14a3.5 3.5 0 0 1 3.5-3.5h3A3.5 3.5 0 0 1 21 14v3.5A3.5 3.5 0 0 1 17.5 21H17v2a.75.75 0 0 1-1.28.53l-3-3A.75.75 0 0 1 13.25 20H14.5a.75.75 0 0 1 .75.75v.94l1.72-1.72a.75.75 0 0 1 .53-.22h.0A2 2 0 0 0 19.5 17.5V14a2 2 0 0 0-2-2h-3a2 2 0 0 0-2 2 .75.75 0 0 1-1.5 0z" />
    </svg>
  );
}
