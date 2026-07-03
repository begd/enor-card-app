"use client";

import React, { useState } from "react";
import { AlertOctagon, MapPin } from "lucide-react";
import { useApp } from "@/lib/store";
import { Screen, Header, Panel, Button, Badge } from "@/components/ui";
import { BottomNav } from "@/components/pieces";
import { TXS, CARDS, brl, shortDate, fullDate } from "@/lib/data";

export function ActivityScreen() {
  const { nav } = useApp();
  const [filter, setFilter] = useState("all");
  const list = filter === "all" ? TXS : TXS.filter((t) => t.cardId === filter);

  const grouped = list.reduce<Record<string, typeof TXS>>((acc, t) => {
    const key = shortDate(t.date).startsWith("Hoje") ? "Hoje" : shortDate(t.date);
    (acc[key] ||= []).push(t);
    return acc;
  }, {});

  return (
    <>
      <Screen bottomNav>
        <Header transparent title="Extrato" />
        <div style={{ display: "flex", gap: 8, overflowX: "auto", margin: "0 -20px 16px", padding: "0 20px 4px" }}>
          <Chip active={filter === "all"} onClick={() => setFilter("all")}>Todos</Chip>
          {CARDS.map((c) => <Chip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>•••• {c.last4}</Chip>)}
        </div>

        {Object.entries(grouped).map(([day, items]) => (
          <div key={day} className="mb-2">
            <div className="t-label mb-1" style={{ padding: "4px 2px" }}>{day}</div>
            <Panel style={{ padding: "4px 16px" }}>
              {items.map((tx, i) => (
                <div key={tx.id} onClick={() => nav("tx-detail")} className="flex items-center gap-3" style={{ padding: "12px 0", borderBottom: i < items.length - 1 ? "1px solid var(--hairline-cool)" : "none", cursor: "pointer" }}>
                  <div className="grid place-items-center" style={{ width: 40, height: 40, borderRadius: 12, background: "var(--surface-2)", fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--ink-2)" }}>{tx.merchant.slice(0, 1)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="t-h3" style={{ fontSize: 14.5 }}>{tx.merchant}</div>
                    <div className="t-xs">{tx.category} · {tx.country}</div>
                  </div>
                  <div className="t-mono" style={{ fontSize: 14.5, fontWeight: 600, color: tx.amountBrl < 0 ? "var(--ink-1)" : "var(--success)" }}>
                    {tx.amountBrl < 0 ? "" : "+"}{brl(Math.abs(tx.amountBrl))}
                  </div>
                </div>
              ))}
            </Panel>
          </div>
        ))}
      </Screen>
      <BottomNav />
    </>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ padding: "8px 16px", borderRadius: 99, whiteSpace: "nowrap", fontSize: 13, fontWeight: 600, cursor: "pointer", border: `1px solid ${active ? "transparent" : "var(--hairline-cool)"}`, background: active ? "var(--grad-gold)" : "transparent", color: active ? "#241a08" : "var(--ink-2)" }}>{children}</button>
  );
}

export function TxDetail() {
  const { nav } = useApp();
  const tx = TXS[3];
  const card = CARDS.find((c) => c.id === tx.cardId)!;
  return (
    <Screen fixedCta={<Button variant="danger" onClick={() => nav("dispute-reason")}><AlertOctagon size={18} /> Não reconheço esta compra</Button>}>
      <Header back title="Detalhe" />
      <div className="text-center mb-6 mt-2">
        <div className="grid place-items-center mx-auto mb-3" style={{ width: 64, height: 64, borderRadius: 20, background: "var(--surface-2)", fontSize: 26, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--ink-1)" }}>{tx.merchant.slice(0, 1)}</div>
        <div className="t-amount" style={{ fontSize: 32 }}>{brl(Math.abs(tx.amountBrl))}</div>
        <div className="t-h3 mt-2">{tx.merchant}</div>
        <div className="t-xs">{fullDate(tx.date)}</div>
      </div>
      <Panel className="mb-3">
        {[["Status", <Badge key="s" tone="success">Aprovada</Badge>], ["Categoria", tx.category], ["Cartão", `•••• ${card.last4}`], ["País", tx.country], ["Código de autorização", tx.authCode]].map(([k, v], i, arr) => (
          <div key={k as string} className="flex justify-between items-center" style={{ padding: "12px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--hairline-cool)" : "none" }}>
            <span className="t-sm">{k}</span>
            <span className="t-sm" style={{ color: "var(--ink-1)", fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </Panel>
      <Panel className="flex items-center gap-3">
        <MapPin size={18} color="var(--ink-3)" />
        <span className="t-sm">São Paulo, SP · Brasil</span>
      </Panel>
    </Screen>
  );
}
