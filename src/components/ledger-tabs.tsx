import { motion } from "framer-motion";

export type TabKey = string;

export function LedgerTabs<T extends TabKey>({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: T; label: string; indicator?: boolean }[];
  active: T;
  onChange: (key: T) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-muted/60 p-1">
      {tabs.map((t) => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className="relative flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
          >
            {isActive && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-full bg-card shadow-sm"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span
              className={`relative flex items-center justify-center gap-1.5 ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {t.label}
              {t.indicator && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15 }}
                  className="h-1.5 w-1.5 rounded-full bg-primary motion-reduce:transition-none"
                  aria-label="New"
                />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
