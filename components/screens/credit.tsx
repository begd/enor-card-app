"use client";

import React from "react";
import { Lock, Zap, Gauge, Globe } from "lucide-react";
import { useApp } from "@/lib/store";
import { Screen, Header, Panel, Button, Steps } from "@/components/ui";
import { LtvRing } from "@/components/pieces";
import { CREDIT, brl, usd, collateralUsd } from "@/lib/data";

export function CreditIntro() {
  const { nav } = useApp();
  const items = [
    { Icon: Lock, t: "Colateral seguro", s: "Seu cripto fica custodiado na eNor, sempre seu" },
    { Icon: Zap, t: "Cartão imediato", s: "Virtual liberado assim que o limite for aprovado" },
    { Icon: Gauge, t: "Até 67% de LTV", s: "Limite calculado sobre o valor do colateral" },
    { Icon: Globe, t: "Aceito no mundo todo", s: "Rede global, sem IOF surpresa no exterior" },
  ];
  return (
    <Screen fixedCta={<Button onClick={() => nav("credit-precontract")}>Continuar</Button>}>
      <Header back title="Ativar crédito" />
      <h1 className="t-h1 mb-2">Crédito colateralizado</h1>
      <p className="t-body mb-6">Use seu portfólio cripto como garantia e receba limite de crédito sem vender seus ativos.</p>
      {items.map(({ Icon, t, s }) => (
        <Panel key={t} className="flex items-center gap-3 mb-3" style={{ padding: 15 }}>
          <div className="grid place-items-center" style={{ width: 44, height: 44, borderRadius: 13, background: "var(--grad-gold-soft)", border: "1px solid var(--hairline)" }}><Icon size={20} color="var(--gold-300)" /></div>
          <div><div className="t-h3" style={{ fontSize: 15 }}>{t}</div><div className="t-xs">{s}</div></div>
        </Panel>
      ))}
    </Screen>
  );
}

export function CreditPrecontract() {
  const { nav } = useApp();
  return (
    <Screen fixedCta={<Button onClick={() => nav("terms2")}>Li e compreendo</Button>}>
      <Header back title="Condições" />
      <h1 className="t-h1 mb-2">Informações pré-contratuais</h1>
      <p className="t-sm mb-5">Antes de contratar, confira as condições essenciais do produto.</p>
      <Panel>
        {[
          ["Produto", "eNor Card — crédito colateralizado"],
          ["Anuidade", "Isenta no MVP"],
          ["LTV máximo", "67% do valor do colateral"],
          ["Colateral aceito", "BTC · ETH · USDC"],
          ["Emissor do cartão", "PayCaddy"],
          ["Custódia do colateral", "eNor Securities"],
        ].map(([k, v], i, arr) => (
          <div key={k} className="flex justify-between items-center" style={{ padding: "13px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--hairline-cool)" : "none" }}>
            <span className="t-sm">{k}</span>
            <span className="t-sm" style={{ color: "var(--ink-1)", fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{v}</span>
          </div>
        ))}
      </Panel>
      <p className="t-xs mt-4">Em caso de inadimplência, ou se o LTV atingir o nível de liquidação, parte do colateral pode ser liquidada conforme contrato.</p>
    </Screen>
  );
}

export function Terms2() {
  const { nav, flags, setFlag } = useApp();
  const ok = flags.terms2;
  return (
    <Screen fixedCta={<Button disabled={!ok} onClick={() => nav("collateral-deposit")}>Aceitar e depositar garantia</Button>}>
      <Header back title="Contrato de crédito" />
      <h1 className="t-h1 mb-1">Contrato de crédito</h1>
      <p className="t-sm mb-5">Aceite 2 — contrato do produto de crédito colateralizado.</p>
      <Panel style={{ maxHeight: 240, overflowY: "auto" }}>
        <p className="t-sm"><b style={{ color: "var(--ink-1)" }}>Contrato de Crédito Colateralizado eNor.</b></p>
        <p className="t-sm mt-3">Ao aceitar, você autoriza a eNor a reter o colateral depositado como garantia do limite de crédito concedido.</p>
        <p className="t-sm mt-3">O limite será comunicado ao emissor (PayCaddy) exclusivamente em valor fiat, sem exposição do colateral em cripto.</p>
        <p className="t-sm mt-3">Você mantém a titularidade do cripto, sujeito às condições de liquidação previstas.</p>
      </Panel>
      <div onClick={() => setFlag("terms2", !ok)} className="flex items-start gap-3 mt-4" style={{ cursor: "pointer" }}>
        <div className="grid place-items-center" style={{ width: 24, height: 24, borderRadius: 7, marginTop: 1, flexShrink: 0, background: ok ? "var(--grad-gold)" : "transparent", border: `2px solid ${ok ? "transparent" : "var(--surface-3)"}`, color: "#241a08", fontSize: 13, fontWeight: 800 }}>{ok ? "✓" : ""}</div>
        <span className="t-sm">Aceito o Contrato de Crédito Colateralizado eNor</span>
      </div>
    </Screen>
  );
}

export function LimitApproved() {
  const { nav, jump } = useApp();
  return (
    <Screen fixedCta={<><Button onClick={() => { nav("card-create-virtual"); }}>Emitir cartão virtual</Button><Button variant="glass" full style={{ marginTop: 10 }} onClick={() => jump("home", "home")}>Ir para o início</Button></>}>
      <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: "76%" }}>
        <div className="mb-4"><LtvRing ltv={CREDIT.ltv} max={CREDIT.ltvMax} liq={CREDIT.liquidationLtv} size={132} /></div>
        <div className="t-label">Limite aprovado</div>
        <div className="t-amount gold-text mb-2" style={{ fontSize: 40 }}>{brl(CREDIT.limitTotal)}</div>
        <p className="t-body" style={{ maxWidth: 280 }}>Seu colateral de {usd(collateralUsd())} foi confirmado e seu crédito está ativo.</p>
      </div>
    </Screen>
  );
}

export function LimitDetails() {
  const { nav } = useApp();
  const usedPct = (CREDIT.limitUsed / CREDIT.limitTotal) * 100;
  return (
    <Screen bottomNav fixedCta={<Button onClick={() => nav("collateral-deposit")}>Aumentar limite</Button>}>
      <Header back title="Limite e crédito" />
      <Panel gold style={{ padding: 22 }}>
        <div className="t-label" style={{ fontSize: 10 }}>Limite total</div>
        <div className="t-amount mt-1" style={{ fontSize: 34 }}>{brl(CREDIT.limitTotal)}</div>
        <div style={{ height: 6, borderRadius: 99, background: "var(--surface-3)", margin: "16px 0 8px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${usedPct}%`, background: "var(--grad-gold)", borderRadius: 99 }} />
        </div>
        <div className="flex justify-between t-xs"><span>Usado {brl(CREDIT.limitUsed)}</span><span>Disponível {brl(CREDIT.limitAvailable)}</span></div>
      </Panel>
      <Panel className="mt-4">
        {[["Ativo", "BTC + ETH"], ["Valor em garantia", usd(collateralUsd())], ["LTV atual", `${CREDIT.ltv}%`], ["LTV de liquidação", `${CREDIT.liquidationLtv}%`]].map(([k, v], i, arr) => (
          <div key={k} className="flex justify-between" style={{ padding: "11px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--hairline-cool)" : "none" }}>
            <span className="t-sm">{k}</span><span className="t-mono" style={{ fontWeight: 600 }}>{v}</span>
          </div>
        ))}
      </Panel>
    </Screen>
  );
}
