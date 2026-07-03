"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Home, CreditCard, Activity, LifeBuoy, Bitcoin, Copy, Check, Delete } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useApp } from "@/lib/store";
import { copyToClipboard } from "@/lib/data";
import type { CardItem, CryptoAsset } from "@/lib/data";

/* ── Real QR code with luxury framing ── */
export function DepositQR({ value, size = 172 }: { value: string; size?: number }) {
  return (
    <div
      className="mx-auto"
      style={{
        width: size + 24,
        height: size + 24,
        borderRadius: 20,
        background: "#fff",
        display: "grid",
        placeItems: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
      }}
    >
      <QRCodeSVG
        value={value}
        size={size}
        bgColor="#ffffff"
        fgColor="#05060a"
        level="M"
        marginSize={0}
      />
    </div>
  );
}

/* ── Copyable value row (functional clipboard) ── */
export function CopyField({ label, value, mono = true, mandatory }: { label: string; value: string; mono?: boolean; mandatory?: boolean }) {
  const { toast } = useApp();
  const [done, setDone] = useState(false);
  const onCopy = async () => {
    const ok = await copyToClipboard(value);
    if (ok) {
      setDone(true);
      toast(`${label} copiado`);
      setTimeout(() => setDone(false), 1800);
    } else {
      toast("Não foi possível copiar", "error");
    }
  };
  return (
    <div style={{ background: "var(--surface-2)", border: "1px solid var(--hairline-cool)", borderRadius: "var(--r-md)", padding: "12px 14px" }}>
      <div className="flex items-center justify-between mb-1">
        <span className="t-label" style={{ fontSize: 9.5 }}>{label}</span>
        {mandatory && <span className="t-xs" style={{ color: "var(--warning)", fontWeight: 600 }}>obrigatório</span>}
      </div>
      <div className="flex items-center gap-2">
        <span className={mono ? "t-mono" : undefined} style={{ flex: 1, fontSize: 13, wordBreak: "break-all", color: "var(--ink-1)" }}>{value}</span>
        <button onClick={onCopy} className="grid place-items-center active:scale-90 transition" style={{ width: 38, height: 38, flexShrink: 0, borderRadius: 12, background: done ? "rgba(79,214,160,0.16)" : "var(--grad-gold-soft)", border: "1px solid var(--hairline)", color: done ? "var(--success)" : "var(--gold-300)", cursor: "pointer" }} aria-label={`Copiar ${label}`}>
          {done ? <Check size={17} /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
}

/* ── Numeric PIN pad ── */
export function PinPad({ value, onChange, length = 4 }: { value: string; onChange: (v: string) => void; length?: number }) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];
  const press = (k: string) => {
    if (k === "del") return onChange(value.slice(0, -1));
    if (k === "" || value.length >= length) return;
    onChange((value + k).slice(0, length));
  };
  return (
    <div>
      <div className="flex justify-center gap-3 mb-7">
        {Array.from({ length }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ scale: value.length === i + 1 ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.25 }}
            style={{
              width: 15, height: 15, borderRadius: 99,
              background: i < value.length ? "var(--grad-gold)" : "transparent",
              border: i < value.length ? "none" : "1.5px solid var(--surface-3)",
            }}
          />
        ))}
      </div>
      <div className="grid grid-cols-3" style={{ gap: 12, maxWidth: 264, margin: "0 auto" }}>
        {keys.map((k, i) => (
          <button
            key={i}
            onClick={() => press(k)}
            disabled={k === ""}
            className="grid place-items-center active:scale-95 transition"
            style={{
              height: 62, borderRadius: 18,
              background: k === "" ? "transparent" : k === "del" ? "transparent" : "var(--surface-2)",
              border: k === "" || k === "del" ? "none" : "1px solid var(--hairline-cool)",
              color: "var(--ink-1)", fontFamily: "var(--font-display)", fontSize: 23, fontWeight: 600,
              cursor: k === "" ? "default" : "pointer",
            }}
          >
            {k === "del" ? <Delete size={22} color="var(--ink-2)" /> : k}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Spending limit slider ── */
export function LimitSlider({ value, min, max, step, onChange }: { value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  const pct = Math.round(((value - min) / (max - min)) * 100);
  return (
    <div>
      <div style={{ position: "relative", height: 30, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", left: 0, right: 0, height: 6, borderRadius: 99, background: "var(--surface-3)" }} />
        <div style={{ position: "absolute", left: 0, width: `${pct}%`, height: 6, borderRadius: 99, background: "var(--grad-gold)" }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ position: "absolute", left: 0, right: 0, width: "100%", margin: 0, appearance: "none", WebkitAppearance: "none", background: "transparent", height: 30, cursor: "pointer" }}
          className="limit-slider"
        />
      </div>
    </div>
  );
}

/* ── Signature metal credit card ── */
export function CardVisual({
  card,
  revealed,
  frozen,
  compact,
}: {
  card: CardItem;
  revealed?: boolean;
  frozen?: boolean;
  compact?: boolean;
}) {
  const isGold = card.tier === "gold";
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1.585",
        borderRadius: "var(--r-lg)",
        padding: compact ? 16 : 22,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        background: isGold ? "var(--grad-card-gold)" : "var(--grad-card-obsidian)",
        boxShadow: "var(--sh-card)",
        filter: frozen ? "saturate(0.35) brightness(0.72)" : undefined,
        transition: "filter .3s",
      }}
    >
      {/* sheen */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(120% 80% at 15% 0%, rgba(247,236,208,0.14), transparent 45%), radial-gradient(90% 70% at 100% 100%, rgba(138,108,255,0.10), transparent 55%)",
          pointerEvents: "none",
        }}
      />
      {/* guilloché lines */}
      <div
        style={{
          position: "absolute",
          right: -40,
          top: -40,
          width: 220,
          height: 220,
          borderRadius: "50%",
          border: "1px solid rgba(216,184,120,0.14)",
          boxShadow: "0 0 0 14px rgba(216,184,120,0.05), 0 0 0 30px rgba(216,184,120,0.03)",
          pointerEvents: "none",
        }}
      />

      <div className="flex items-start justify-between" style={{ position: "relative" }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "0.14em", fontSize: 13 }}>
            eNor
          </div>
          <div className="t-xs" style={{ marginTop: 2, opacity: 0.8 }}>
            {card.label}
          </div>
        </div>
        <div className="t-label" style={{ color: isGold ? "var(--gold-300)" : "var(--platinum)", fontSize: 9.5 }}>
          {card.tier === "gold" ? "Gold" : "Obsidian"}
        </div>
      </div>

      {/* chip */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 40,
            height: 30,
            borderRadius: 7,
            background: "linear-gradient(135deg,#e8ce93,#a5854a)",
            boxShadow: "inset 0 1px 2px rgba(255,255,255,0.4)",
          }}
        />
        <div style={{ width: 22, height: 18, opacity: 0.7, border: "2px solid rgba(255,255,255,0.6)", borderLeft: "none", borderRadius: "0 12px 12px 0" }} />
      </div>

      <div style={{ position: "relative" }}>
        <div className="t-mono" style={{ fontSize: compact ? 15 : 17.5, letterSpacing: "0.1em", fontWeight: 600 }}>
          {revealed && !frozen ? card.pan : `••••  ••••  ••••  ${card.last4}`}
        </div>
        <div className="flex justify-between mt-2" style={{ fontSize: 12, opacity: 0.85 }}>
          <span className="t-mono">{revealed && !frozen ? `EXP ${card.expiry}` : "MARINA COSTA"}</span>
          <span className="t-mono">{revealed && !frozen ? `CVV ${card.cvv}` : card.type === "virtual" ? "VIRTUAL" : "VISA"}</span>
        </div>
      </div>

      {frozen && (
        <div className="absolute inset-0 grid place-items-center" style={{ background: "rgba(5,6,10,0.35)" }}>
          <span className="t-label" style={{ color: "var(--platinum)" }}>❄ Congelado</span>
        </div>
      )}
    </div>
  );
}

/* ── Bottom navigation ── */
export function BottomNav() {
  const { tab, goTab } = useApp();
  const items = [
    { id: "home", label: "Início", Icon: Home },
    { id: "wallet", label: "Cripto", Icon: Bitcoin },
    { id: "cards", label: "Cartões", Icon: CreditCard },
    { id: "activity", label: "Extrato", Icon: Activity },
    { id: "help", label: "Ajuda", Icon: LifeBuoy },
  ];
  return (
    <nav
      className="absolute left-0 right-0 bottom-0 flex"
      style={{
        height: 84,
        paddingBottom: 18,
        background: "linear-gradient(to top, rgba(8,9,14,0.98), rgba(8,9,14,0.72))",
        backdropFilter: "blur(22px)",
        borderTop: "1px solid var(--hairline-cool)",
        zIndex: 25,
      }}
    >
      {items.map(({ id, label, Icon }) => {
        const active = tab === id;
        return (
          <button
            key={id}
            onClick={() => goTab(id)}
            className="flex-1 flex flex-col items-center justify-center gap-1"
            style={{ color: active ? "var(--gold-300)" : "var(--ink-4)", background: "none", border: "none", cursor: "pointer" }}
          >
            <div style={{ position: "relative" }}>
              <Icon size={21} strokeWidth={active ? 2.4 : 2} />
              {active && (
                <motion.div
                  layoutId="navdot"
                  style={{ position: "absolute", bottom: -7, left: "50%", x: "-50%", width: 4, height: 4, borderRadius: 99, background: "var(--gold-400)" }}
                />
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: 500 }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ── Crypto row ── */
export function CryptoRow({ asset, onClick, showCollateral }: { asset: CryptoAsset; onClick?: () => void; showCollateral?: boolean }) {
  const valueUsd = asset.balance * asset.priceUsd;
  const up = asset.change24h >= 0;
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3"
      style={{ padding: "12px 0", cursor: onClick ? "pointer" : undefined }}
    >
      <div
        className="grid place-items-center"
        style={{ width: 44, height: 44, borderRadius: 14, background: `${asset.color}1f`, color: asset.color, fontWeight: 700, fontSize: 15, fontFamily: "var(--font-mono)" }}
      >
        {asset.symbol.slice(0, 1)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="t-h3" style={{ fontSize: 15 }}>{asset.name}</div>
        <div className="t-xs t-mono">
          {asset.balance} {asset.symbol}
          {showCollateral && asset.collateralized ? (
            <span style={{ color: "var(--gold-400)" }}> · {asset.collateralized} em garantia</span>
          ) : null}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div className="t-mono" style={{ fontSize: 14.5, fontWeight: 600 }}>
          {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(valueUsd)}
        </div>
        <div className="t-xs t-mono" style={{ color: up ? "var(--success)" : "var(--danger)" }}>
          {up ? "▲" : "▼"} {Math.abs(asset.change24h)}%
        </div>
      </div>
    </div>
  );
}

/* ── LTV health ring ── */
export function LtvRing({ ltv, max = 67, liq = 83, size = 148 }: { ltv: number; max?: number; liq?: number; size?: number }) {
  const r = size / 2 - 12;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(ltv / liq, 1);
  const tone = ltv < max * 0.7 ? "var(--success)" : ltv < max ? "var(--warning)" : "var(--danger)";
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={10} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - pct) }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="t-label" style={{ fontSize: 9.5 }}>LTV</div>
        <div className="t-amount" style={{ fontSize: 30, color: tone }}>{ltv}%</div>
        <div className="t-xs">Liq. em {liq}%</div>
      </div>
    </div>
  );
}
