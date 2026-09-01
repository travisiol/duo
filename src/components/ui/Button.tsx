import Link from "next/link";
import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

type Variant = "accent" | "outline" | "quiet";
type Size = "md" | "lg" | "sm";

/* Pressable buttons sit on a hard offset shadow and travel into it on click,
   so the press is a physical event rather than a colour change. */
const base =
  "inline-flex items-center justify-center gap-2 font-mono uppercase tracking-[0.12em] font-medium " +
  "rounded-[11px] transition-all duration-100 whitespace-nowrap " +
  "disabled:opacity-40 disabled:pointer-events-none";

const pressable =
  "border-2 border-line-strong shadow-[3px_3px_0_var(--line-strong)] " +
  "active:translate-x-[3px] active:translate-y-[3px] active:shadow-none";

const variants: Record<Variant, string> = {
  /* The page's only filled surface. One per view, at most. */
  accent: `bg-accent text-on-accent hover:bg-accent-hi ${pressable}`,
  outline: `bg-surface text-fg hover:text-accent ${pressable}`,
  quiet: "text-fg-soft hover:text-fg",
};

const sizes: Record<Size, string> = {
  sm: "text-[0.6875rem] px-3 py-1.5",
  md: "text-xs px-5 py-2.5",
  lg: "text-xs px-7 py-3.5",
};

export function Button({
  variant = "outline",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button className={clsx(base, variants[variant], sizes[size], className)} {...props} />;
}

export function ButtonLink({
  href,
  variant = "outline",
  size = "md",
  className,
  children,
  external,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  external?: boolean;
}) {
  const cls = clsx(base, variants[variant], sizes[size], className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
