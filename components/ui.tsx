"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useApp } from "@/lib/store";

/* ── Header ── */
export function Header({
  title,
  back,
  right,
  transparent,
}: {
  title?: string;
  back?: boolean;
  right?: React.ReactNode;
  transparent?: boolean;
}) {
  const { back: goBack } = useApp();
  return (
    <header
      className="flex items-center justify-between px-5"
      style={{
        flexShrink: 0,
        minHeight: 60,
        zIndex: 20,
        background: transparent
          ? "linear-gradient(to bottom, var(--obsidian) 38%, rgba(5,6,10,0.6) 68%, transparent)"
          : "linear-gradient(to bottom, var(--obsidian) 55%, transparent)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      {back ? (
        <button
          onClick={goBack}
          className="grid place-items-center rounded-full active:scale-90 transition"
          style={{ width: 40, height: 40, background: "var(--surface-2)", border: "1px solid var(--hairline-cool)" }}
        >
          <ChevronLeft size={20} />
        </button>
      ) : (
        <span style={{ width: 40 }} />
      )}
      {title && <span className="t-h3">{title}</span>}
      <span style={{ minWidth: 40, display: "flex", justifyContent: "flex-end" }}>{right}</span>
    </header>
  );
}

/* ── Button ── */
type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "gold" | "glass" | "ghost" | "danger";
  full?: boolean;
};
export function Button({ variant = "gold", full = true, children, style, ...rest }: BtnProps) {
  const base: React.CSSProperties = {
    minHeight: 54,
    borderRadius: "var(--r-full)",
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: 15.5,
    width: full ? "100%" : "auto",
    padding: "0 26px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    border: "none",
    cursor: "pointer",
  };
  const variants: Record<string, React.CSSProperties> = {
    gold: { background: "var(--grad-gold)", color: "#241a08", boxShadow: "var(--sh-gold)" },
    glass: { background: "var(--surface-2)", color: "var(--ink-1)", border: "1px solid var(--hairline-cool)" },
    ghost: { background: "transparent", color: "var(--gold-300)" },
    danger: { background: "rgba(255,107,107,0.12)", color: "var(--danger)", border: "1px solid rgba(255,107,107,0.28)" },
  };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      style={{ ...base, ...variants[variant], ...style }}
      {...(rest as any)}
    >
      {children}
    </motion.button>
  );
}

/* ── Card surface ── */
export function Panel({
  children,
  gold,
  className,
  style,
  onClick,
}: {
  children: React.ReactNode;
  gold?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  return (
    <motion.div
      whileTap={onClick ? { scale: 0.99 } : undefined}
      onClick={onClick}
      className={className}
      style={{
        background: gold ? "var(--grad-gold-soft)" : "var(--surface)",
        border: `1px solid ${gold ? "var(--hairline)" : "var(--hairline-cool)"}`,
        borderRadius: "var(--r-lg)",
        padding: 18,
        cursor: onClick ? "pointer" : undefined,
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── Screen scaffold ── */
function partitionHeader(children: React.ReactNode) {
  const headers: React.ReactNode[] = [];
  const body: React.ReactNode[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === Header) headers.push(child);
    else body.push(child);
  });
  return { headers, body };
}

const scrollAreaStyle: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  overflowX: "hidden",
  WebkitOverflowScrolling: "touch",
  overscrollBehavior: "contain",
  touchAction: "pan-y",
};

export function BareScreen({ children }: { children: React.ReactNode }) {
  const { headers, body } = partitionHeader(children);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {headers}
      <div style={scrollAreaStyle}>{body}</div>
    </div>
  );
}

export function Screen({
  children,
  bottomNav,
  fixedCta,
  noPad,
}: {
  children: React.ReactNode;
  bottomNav?: boolean;
  fixedCta?: React.ReactNode;
  noPad?: boolean;
}) {
  const { headers, body } = partitionHeader(children);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {headers}
      <div
        style={{
          ...scrollAreaStyle,
          padding: noPad ? 0 : "4px 20px 20px",
          paddingBottom: bottomNav ? 96 : fixedCta ? 24 : 28,
        }}
      >
        {body}
      </div>
      {fixedCta && (
        <div
          className="px-5 pt-4 pb-6"
          style={{ background: "linear-gradient(to top, var(--obsidian) 68%, transparent)", flexShrink: 0, zIndex: 15 }}
        >
          {fixedCta}
        </div>
      )}
    </div>
  );
}

/* ── Steps ── */
export function Steps({ total, active }: { total: number; active: number }) {
  return (
    <div className="flex gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 4,
            borderRadius: 99,
            background: i < active ? "var(--grad-gold)" : "var(--surface-3)",
            transition: "background .3s",
          }}
        />
      ))}
    </div>
  );
}

/* ── Field ── */
export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <label className="t-sm block mb-2" style={{ color: "var(--ink-2)", fontWeight: 500 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        minHeight: 52,
        padding: "12px 16px",
        background: "var(--surface-2)",
        border: "1px solid var(--hairline-cool)",
        borderRadius: "var(--r-md)",
        color: "var(--ink-1)",
        fontSize: 15.5,
        outline: "none",
        fontFamily: "var(--font-body)",
        ...props.style,
      }}
    />
  );
}

/* ── Badge ── */
export function Badge({ tone = "neutral", children }: { tone?: "success" | "warning" | "danger" | "info" | "neutral"; children: React.ReactNode }) {
  const map: Record<string, React.CSSProperties> = {
    success: { background: "rgba(79,214,160,0.14)", color: "var(--success)" },
    warning: { background: "rgba(242,198,107,0.14)", color: "var(--warning)" },
    danger: { background: "rgba(255,107,107,0.14)", color: "var(--danger)" },
    info: { background: "rgba(138,108,255,0.16)", color: "var(--aurora-violet)" },
    neutral: { background: "var(--surface-3)", color: "var(--ink-2)" },
  };
  return (
    <span
      className="inline-flex items-center"
      style={{ padding: "4px 11px", borderRadius: 99, fontSize: 11.5, fontWeight: 600, letterSpacing: "0.02em", ...map[tone] }}
    >
      {children}
    </span>
  );
}

/* ── Toast + Sheet host ── */
export function Overlays() {
  const { toasts, sheet, closeSheet } = useApp();
  return (
    <>
      <div className="absolute left-4 right-4 flex flex-col gap-2" style={{ top: 56, zIndex: 60, pointerEvents: "none" }}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="glass"
            style={{
              padding: "12px 16px",
              borderRadius: "var(--r-md)",
              fontSize: 13.5,
              fontWeight: 500,
              boxShadow: "var(--sh-md)",
              color: t.type === "error" ? "var(--danger)" : t.type === "success" ? "var(--success)" : "var(--ink-1)",
            }}
          >
            {t.msg}
          </motion.div>
        ))}
      </div>

      {sheet && (
        <div className="absolute inset-0" style={{ zIndex: 50 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSheet}
            className="absolute inset-0"
            style={{ background: "rgba(5,6,10,0.72)", backdropFilter: "blur(4px)" }}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            className="absolute left-0 right-0 bottom-0"
            style={{
              background: "var(--graphite)",
              borderRadius: "var(--r-2xl) var(--r-2xl) 0 0",
              border: "1px solid var(--hairline-cool)",
              padding: "12px 20px 32px",
              maxHeight: "86%",
              overflowY: "auto",
            }}
          >
            <div style={{ width: 40, height: 4, background: "var(--surface-3)", borderRadius: 99, margin: "0 auto 18px" }} />
            {sheet}
          </motion.div>
        </div>
      )}
    </>
  );
}

/* ── Spinner ── */
export function Spinner({ size = 32 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `3px solid var(--surface-3)`,
        borderTopColor: "var(--gold-400)",
        animation: "spin .8s linear infinite",
      }}
    />
  );
}
