import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={clsx("eyebrow", className)}>{children}</p>;
}

/* A labelled cell on a hairline grid — the board's smallest unit of fact. */
export function Stat({
  label,
  value,
  tone = "plain",
}: {
  label: string;
  value: ReactNode;
  tone?: "plain" | "accent" | "muted";
}) {
  return (
    <div>
      <p className="eyebrow mb-1.5">{label}</p>
      <p
        className={clsx(
          "numeral text-sm",
          tone === "accent" && "text-accent",
          tone === "muted" && "text-fg-soft",
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={clsx(
        "w-full bg-surface border-2 border-line-strong rounded-[11px] px-3.5 py-3 text-sm text-fg",
        "placeholder:text-fg-muted focus:border-accent focus:outline-none transition-colors",
        className,
      )}
      {...props}
    />
  );
}

export function Labelled({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow block mb-2">{label}</span>
      {hint && <span className="block text-xs text-fg-muted mb-2.5 leading-relaxed">{hint}</span>}
      {children}
    </label>
  );
}
