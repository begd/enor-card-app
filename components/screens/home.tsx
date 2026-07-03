"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus, ArrowUpRight, Snowflake, Eye, EyeOff, ShieldCheck, Bitcoin, Receipt } from "lucide-react";
import { useApp } from "@/lib/store";
import { Screen, Panel, Badge } from "@/components/ui";
import { CardVisual, BottomNav } from "@/components/pieces";
import { CARDS, TXS, CREDIT, CRYPTO, brl, shortDate, collateralUsd, USD_BRL } from "@/lib/data";

function QuickAction({ Icon, label, onClick }: { Icon: any; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2" style={{ background: "none", border: "none", cursor: "pointer", flex: 1 }}>
      <div className="grid place-items-center" style={{ width: 52, height: 52, borderRadius: 16, background: "var(--surface-2)", border: "1px solid var(--hairline-cool)" }}>
        <Icon size={20} color="var(--gold-300)" />
      </div>
      <span className="t-xs" style={{ color: "var(--ink-2)", fontWeight: 500 }}>{label}</span>
    </button>
  );
}

export function HomeScreen() {
  const { nav, jump, toggleFreeze, toggleReveal, revealed, frozen, toast } = useApp();
  const card = CARDS[0];
  const usedPct = (CREDIT.limitUsed / CREDIT.limitTotal) * 100;
  const collateralBrl = collateralUsd() * USD_BRL;

  return (
    <>
      <Screen bottomNav>
        <div className="flex items-center justify-between" style={{ marginTop: 8, marginBottom: 18 }}>
          <div>
            <div className="t-xs">Bem-vinda de volta</div>
            <div className="t-h2">Marina Costa</div>
          </div>
          <Badge tone="success"><ShieldCheck size={12} style={{ marginRight: 4 }} />Verificada</Badge>
        </div>

        {/* Available credit hero */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Panel gold style={{ padding: 22, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -30, top: -30, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(216,184,120,0.18), transparent 70%)" }} />
            <div className="t-label" style={{ fontSize: 10 }}>Disponível para gastar</div>
            <div className="t-amount gold-text mt-1" style={{ fontSize: 40 }}>{brl(CREDIT.limitAvailable)}</div>
            <div style={{ height: 6, borderRadius: 99, background: "var(--surface-3)", margin: "16px 0 8px", overflow: "hidden" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${usedPct}%` }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} style={{ height: "100%", background: "var(--grad-gold)", borderRadius: 99 }} />
            </div>
            <div className="flex justify-between t-xs">
              <span>Limite {brl(CREDIT.limitTotal)}</span>
              <span>Usado {brl(CREDIT.limitUsed)}</span>
            </div>
          </Panel>
        </motion.div>

        {/* Quick actions */}
        <div className="flex gap-2 mt-5 mb-6">
          <QuickAction Icon={Bitcoin} label="Depositar" onClick={() => nav("topup")} />
          <QuickAction Icon={Receipt} label="Pagar fatura" onClick={() => toast("Fatura em dia ✓")} />
          <QuickAction Icon={ArrowUpRight} label="Sacar" onClick={() => nav("transfer")} />
          <QuickAction Icon={Plus} label="Novo cartão" onClick={() => nav("card-product-info")} />
        </div>

        {/* Card + controls */}
        <div className="flex items-center justify-between mb-3">
          <span className="t-label">Meu cartão principal</span>
          <button onClick={() => jump("cards", "cards")} style={{ background: "none", border: "none", color: "var(--gold-300)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Ver todos</button>
        </div>
        <div onClick={() => jump("cards", "cards")} style={{ cursor: "pointer" }}>
          <CardVisual card={card} revealed={revealed[card.id]} frozen={frozen[card.id]} />
        </div>
        <div className="flex gap-2 mt-3 mb-7">
          <button onClick={() => toggleReveal(card.id)} className="flex-1 flex items-center justify-center gap-2" style={{ minHeight: 46, borderRadius: 99, background: "var(--surface-2)", border: "1px solid var(--hairline-cool)", color: "var(--ink-1)", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}>
            {revealed[card.id] ? <EyeOff size={16} /> : <Eye size={16} />} {revealed[card.id] ? "Ocultar" : "Revelar"}
          </button>
          <button onClick={() => { const f = toggleFreeze(card.id); toast(f ? "Cartão congelado ❄" : "Cartão descongelado"); }} className="flex-1 flex items-center justify-center gap-2" style={{ minHeight: 46, borderRadius: 99, background: frozen[card.id] ? "rgba(138,108,255,0.14)" : "var(--surface-2)", border: "1px solid var(--hairline-cool)", color: frozen[card.id] ? "var(--aurora-violet)" : "var(--ink-1)", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}>
            <Snowflake size={16} /> {frozen[card.id] ? "Descongelar" : "Congelar"}
          </button>
        </div>

        {/* Collateral health */}
        <Panel onClick={() => jump("collateral", "wallet")} className="flex items-center justify-between mb-6">
          <div>
            <div className="t-label" style={{ fontSize: 10 }}>Saúde do colateral</div>
            <div className="t-h2 mt-1" style={{ color: "var(--success)" }}>Saudável</div>
            <div className="t-xs mt-1">Garantia {brl(collateralBrl)} · LTV {CREDIT.ltv}%</div>
          </div>
          <div style={{ position: "relative", width: 54, height: 54 }}>
            <svg width={54} height={54} style={{ transform: "rotate(-90deg)" }}>
              <circle cx={27} cy={27} r={22} fill="none" stroke="var(--surface-3)" strokeWidth={5} />
              <circle cx={27} cy={27} r={22} fill="none" stroke="var(--success)" strokeWidth={5} strokeLinecap="round" strokeDasharray={2 * Math.PI * 22} strokeDashoffset={2 * Math.PI * 22 * (1 - CREDIT.ltv / CREDIT.liquidationLtv)} />
            </svg>
            <div className="absolute inset-0 grid place-items-center t-mono" style={{ fontSize: 13, fontWeight: 700, color: "var(--success)" }}>{CREDIT.ltv}%</div>
          </div>
        </Panel>

        {/* Recent tx */}
        <div className="flex items-center justify-between mb-2">
          <span className="t-label">Transações recentes</span>
          <button onClick={() => jump("activity", "activity")} style={{ background: "none", border: "none", color: "var(--gold-300)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Ver tudo</button>
        </div>
        <Panel style={{ padding: "4px 16px" }}>
          {TXS.slice(0, 4).map((tx, i) => (
            <div key={tx.id} onClick={() => { nav("tx-detail"); }} className="flex items-center gap-3" style={{ padding: "12px 0", borderBottom: i < 3 ? "1px solid var(--hairline-cool)" : "none", cursor: "pointer" }}>
              <div className="grid place-items-center" style={{ width: 40, height: 40, borderRadius: 12, background: "var(--surface-2)", fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--ink-2)" }}>{tx.merchant.slice(0, 1)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="t-h3" style={{ fontSize: 14.5 }}>{tx.merchant}</div>
                <div className="t-xs">{shortDate(tx.date)} · {tx.category}</div>
              </div>
              <div className="t-mono" style={{ fontSize: 14.5, fontWeight: 600, color: tx.amountBrl < 0 ? "var(--ink-1)" : "var(--success)" }}>
                {tx.amountBrl < 0 ? "" : "+"}{brl(Math.abs(tx.amountBrl)).replace("R$", "R$ ")}
              </div>
            </div>
          ))}
        </Panel>
      </Screen>
      <BottomNav />
    </>
  );
}
