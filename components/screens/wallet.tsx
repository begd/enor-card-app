"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownToLine, ArrowUpFromLine, Repeat, Plus, Lock, TrendingUp, Info, ChevronDown, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useApp } from "@/lib/store";
import { Screen, Header, Panel, Button, Field, Input, Badge, Spinner } from "@/components/ui";
import { CryptoRow, BottomNav, LtvRing, DepositQR, CopyField } from "@/components/pieces";
import { CRYPTO, CREDIT, DEPOSIT_NETWORKS, usd, brl, portfolioUsd, collateralUsd, USD_BRL } from "@/lib/data";

function WalletAction({ Icon, label, onClick }: { Icon: any; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2" style={{ background: "none", border: "none", cursor: "pointer", flex: 1 }}>
      <div className="grid place-items-center" style={{ width: 54, height: 54, borderRadius: 17, background: "var(--grad-gold-soft)", border: "1px solid var(--hairline)" }}>
        <Icon size={21} color="var(--gold-300)" />
      </div>
      <span className="t-xs" style={{ color: "var(--ink-2)", fontWeight: 500 }}>{label}</span>
    </button>
  );
}

export function WalletScreen() {
  const { nav } = useApp();
  const total = portfolioUsd();
  return (
    <>
      <Screen bottomNav>
        <Header transparent title="Cripto" />
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Panel style={{ padding: 24, textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "var(--grad-hero)", pointerEvents: "none" }} />
            <div className="t-label" style={{ fontSize: 10 }}>Portfólio total</div>
            <div className="t-amount mt-1" style={{ fontSize: 38 }}>{usd(total)}</div>
            <div className="t-sm mt-1" style={{ color: "var(--success)" }}><TrendingUp size={13} style={{ display: "inline", marginRight: 4 }} />+{usd(total * 0.021)} (24h)</div>
          </Panel>
        </motion.div>

        <div className="flex gap-2 mt-5 mb-6">
          <WalletAction Icon={ArrowDownToLine} label="Depositar" onClick={() => nav("topup")} />
          <WalletAction Icon={ArrowUpFromLine} label="Sacar" onClick={() => nav("transfer")} />
          <WalletAction Icon={Repeat} label="Converter" onClick={() => nav("swap")} />
          <WalletAction Icon={Lock} label="Garantia" onClick={() => nav("collateral")} />
        </div>

        <Panel onClick={() => nav("collateral")} className="flex items-center justify-between mb-6" gold>
          <div>
            <div className="t-label" style={{ fontSize: 10 }}>Em garantia (colateral)</div>
            <div className="t-h1 mt-1 gold-text">{usd(collateralUsd())}</div>
            <div className="t-xs mt-1">Sustentando {brl(CREDIT.limitTotal)} de limite</div>
          </div>
          <Badge tone="success">LTV {CREDIT.ltv}%</Badge>
        </Panel>

        <div className="flex items-center justify-between mb-1">
          <span className="t-label">Meus ativos</span>
          <span className="t-xs">{CRYPTO.length} moedas</span>
        </div>
        <Panel style={{ padding: "4px 16px" }}>
          {CRYPTO.map((a, i) => (
            <div key={a.id} style={{ borderBottom: i < CRYPTO.length - 1 ? "1px solid var(--hairline-cool)" : "none" }}>
              <CryptoRow asset={a} showCollateral onClick={() => nav("asset-detail")} />
            </div>
          ))}
        </Panel>
      </Screen>
      <BottomNav />
    </>
  );
}

export function AssetDetail() {
  const { nav, setVar } = useApp();
  const a = CRYPTO[0];
  return (
    <Screen fixedCta={<div className="flex gap-2"><Button variant="glass" onClick={() => { setVar("depAsset", a.id); nav("topup"); }}>Depositar</Button><Button onClick={() => nav("collateral-deposit")}>Usar como garantia</Button></div>}>
      <Header back title={a.name} />
      <div className="text-center mb-6">
        <div className="grid place-items-center mx-auto mb-3" style={{ width: 60, height: 60, borderRadius: 18, background: `${a.color}1f`, color: a.color, fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 24 }}>{a.symbol.slice(0, 1)}</div>
        <div className="t-amount" style={{ fontSize: 30 }}>{a.balance} {a.symbol}</div>
        <div className="t-sm">{usd(a.balance * a.priceUsd)}</div>
      </div>
      <Panel className="mb-3">
        <div className="flex justify-between" style={{ padding: "6px 0" }}><span className="t-sm">Preço</span><span className="t-mono">{usd(a.priceUsd)}</span></div>
        <div className="flex justify-between" style={{ padding: "6px 0" }}><span className="t-sm">Variação 24h</span><span className="t-mono" style={{ color: a.change24h >= 0 ? "var(--success)" : "var(--danger)" }}>{a.change24h >= 0 ? "+" : ""}{a.change24h}%</span></div>
        <div className="flex justify-between" style={{ padding: "6px 0" }}><span className="t-sm">Em garantia</span><span className="t-mono" style={{ color: "var(--gold-400)" }}>{a.collateralized} {a.symbol}</span></div>
        <div className="flex justify-between" style={{ padding: "6px 0" }}><span className="t-sm">Disponível</span><span className="t-mono">{(a.balance - (a.collateralized || 0)).toFixed(3)} {a.symbol}</span></div>
      </Panel>
    </Screen>
  );
}

export function Collateral() {
  const { nav } = useApp();
  return (
    <Screen fixedCta={<Button onClick={() => nav("collateral-deposit")}><Plus size={18} /> Reforçar garantia</Button>}>
      <Header back title="Colateral" />
      <div className="flex justify-center mb-5"><LtvRing ltv={CREDIT.ltv} max={CREDIT.ltvMax} liq={CREDIT.liquidationLtv} /></div>
      <Panel className="mb-3">
        <div className="flex justify-between" style={{ padding: "6px 0" }}><span className="t-sm">Valor em garantia</span><span className="t-mono">{usd(collateralUsd())}</span></div>
        <div className="flex justify-between" style={{ padding: "6px 0" }}><span className="t-sm">Limite liberado</span><span className="t-mono">{brl(CREDIT.limitTotal)}</span></div>
        <div className="flex justify-between" style={{ padding: "6px 0" }}><span className="t-sm">LTV máximo</span><span className="t-mono">{CREDIT.ltvMax}%</span></div>
        <div className="flex justify-between" style={{ padding: "6px 0" }}><span className="t-sm">Liquidação em</span><span className="t-mono" style={{ color: "var(--danger)" }}>{CREDIT.liquidationLtv}%</span></div>
      </Panel>
      <Panel className="flex gap-3" style={{ background: "rgba(79,214,160,0.06)", border: "1px solid rgba(79,214,160,0.2)" }}>
        <Info size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} />
        <p className="t-sm">Sua posição está <b style={{ color: "var(--success)" }}>saudável</b>. Há uma boa margem antes do nível de liquidação. Avisaremos se o LTV subir.</p>
      </Panel>
      <div className="mt-3">
        <span className="t-label">Ativos em garantia</span>
        <Panel style={{ padding: "4px 16px", marginTop: 8 }}>
          {CRYPTO.filter((a) => a.collateralized).map((a, i, arr) => (
            <div key={a.id} className="flex items-center gap-3" style={{ padding: "12px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--hairline-cool)" : "none" }}>
              <div className="grid place-items-center" style={{ width: 40, height: 40, borderRadius: 12, background: `${a.color}1f`, color: a.color, fontFamily: "var(--font-mono)", fontWeight: 700 }}>{a.symbol.slice(0, 1)}</div>
              <div style={{ flex: 1 }}><div className="t-h3" style={{ fontSize: 14.5 }}>{a.name}</div><div className="t-xs t-mono">{a.collateralized} {a.symbol}</div></div>
              <div className="t-mono" style={{ fontWeight: 600 }}>{usd((a.collateralized || 0) * a.priceUsd)}</div>
            </div>
          ))}
        </Panel>
      </div>
    </Screen>
  );
}

export function CollateralDeposit() {
  const { nav, vars, setVar } = useApp();
  const asset = CRYPTO.find((a) => a.id === vars.crypto) || CRYPTO[0];
  const amount = parseFloat(vars.collateral || "0") || 0;
  const valueUsd = amount * asset.priceUsd;
  const estLimit = valueUsd * (CREDIT.ltvMax / 100) * USD_BRL;
  return (
    <Screen fixedCta={<Button onClick={() => nav("collateral-processing")}>Confirmar depósito</Button>}>
      <Header back title="Depositar garantia" />
      <p className="t-sm mb-4">Escolha o ativo cripto que servirá de garantia para o seu limite.</p>
      {CRYPTO.map((a) => {
        const sel = vars.crypto === a.id;
        return (
          <Panel key={a.id} onClick={() => setVar("crypto", a.id)} className="flex items-center gap-3 mb-3" style={{ border: `2px solid ${sel ? "var(--gold-400)" : "var(--hairline-cool)"}`, background: sel ? "var(--grad-gold-soft)" : "var(--surface)", padding: 14 }}>
            <div className="grid place-items-center" style={{ width: 42, height: 42, borderRadius: 13, background: `${a.color}1f`, color: a.color, fontFamily: "var(--font-mono)", fontWeight: 700 }}>{a.symbol.slice(0, 1)}</div>
            <div style={{ flex: 1 }}><div className="t-h3" style={{ fontSize: 15 }}>{a.name}</div><div className="t-xs t-mono">Saldo {a.balance} {a.symbol}</div></div>
            {sel && <span style={{ color: "var(--gold-300)", fontSize: 18 }}>✓</span>}
          </Panel>
        );
      })}
      <Field label={`Quantidade (${asset.symbol})`}>
        <Input value={vars.collateral} onChange={(e) => setVar("collateral", e.target.value)} inputMode="decimal" />
      </Field>
      <Panel gold>
        <div className="flex justify-between" style={{ padding: "4px 0" }}><span className="t-sm">Valor do depósito</span><span className="t-mono">{usd(valueUsd)}</span></div>
        <div className="flex justify-between items-center" style={{ padding: "4px 0" }}><span className="t-sm">Limite estimado ({CREDIT.ltvMax}% LTV)</span><span className="t-mono gold-text" style={{ fontSize: 17, fontWeight: 700 }}>{brl(estLimit)}</span></div>
      </Panel>
    </Screen>
  );
}

export function CollateralProcessing() {
  const { nav } = useApp();
  const [step, setStep] = useState(0);
  const steps = ["Recebendo depósito on-chain", "Confirmando na rede", "Calculando limite"];
  React.useEffect(() => {
    const t = setInterval(() => setStep((s) => (s < 2 ? s + 1 : s)), 1100);
    const done = setTimeout(() => nav("limit-approved", { replace: true }), 3800);
    return () => { clearInterval(t); clearTimeout(done); };
  }, [nav]);
  return (
    <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: "100%", padding: 32 }}>
      <Spinner size={46} />
      <h1 className="t-h1 mt-7 mb-5">Processando depósito</h1>
      <div style={{ width: "100%", maxWidth: 280 }}>
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-3" style={{ padding: "10px 0", opacity: i <= step ? 1 : 0.4 }}>
            <div className="grid place-items-center" style={{ width: 24, height: 24, borderRadius: 99, background: i < step ? "var(--success)" : i === step ? "var(--gold-400)" : "var(--surface-3)", color: "#0a0c13", fontSize: 12, fontWeight: 800 }}>{i < step ? "✓" : i + 1}</div>
            <span className="t-sm" style={{ color: i <= step ? "var(--ink-1)" : "var(--ink-3)" }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* row used as a picker trigger */
function PickerRow({ label, children, onClick }: { label: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center justify-between w-full active:scale-[0.99] transition" style={{ background: "var(--surface-2)", border: "1px solid var(--hairline-cool)", borderRadius: "var(--r-md)", padding: "12px 14px", cursor: "pointer", textAlign: "left" }}>
      <div style={{ flex: 1 }}>
        <div className="t-label mb-1" style={{ fontSize: 9.5 }}>{label}</div>
        <div className="flex items-center gap-2">{children}</div>
      </div>
      <ChevronDown size={18} color="var(--ink-3)" />
    </button>
  );
}

export function TopUp() {
  const { nav, vars, setVar, openSheet, closeSheet } = useApp();
  const asset = CRYPTO.find((a) => a.id === (vars.depAsset || "btc")) || CRYPTO[0];
  const networks = DEPOSIT_NETWORKS[asset.id] || [];
  const network = networks.find((n) => n.id === vars.depNet) || networks.find((n) => n.recommended) || networks[0];

  const pickAsset = () => openSheet(
    <div>
      <h2 className="t-h2 mb-1">Selecione o ativo</h2>
      <p className="t-sm mb-4">Escolha a criptomoeda que deseja depositar.</p>
      {CRYPTO.map((a) => (
        <button key={a.id} onClick={() => { setVar("depAsset", a.id); setVar("depNet", (DEPOSIT_NETWORKS[a.id]?.find((n) => n.recommended) || DEPOSIT_NETWORKS[a.id]?.[0])?.id || ""); closeSheet(); }} className="flex items-center gap-3 w-full" style={{ padding: "12px 4px", background: "none", border: "none", borderBottom: "1px solid var(--hairline-cool)", cursor: "pointer" }}>
          <div className="grid place-items-center" style={{ width: 40, height: 40, borderRadius: 12, background: `${a.color}1f`, color: a.color, fontFamily: "var(--font-mono)", fontWeight: 700 }}>{a.symbol.slice(0, 1)}</div>
          <div style={{ flex: 1, textAlign: "left" }}><div className="t-h3" style={{ fontSize: 15 }}>{a.name}</div><div className="t-xs t-mono">{a.symbol}</div></div>
          {asset.id === a.id && <span style={{ color: "var(--gold-300)" }}>✓</span>}
        </button>
      ))}
    </div>
  );

  const pickNetwork = () => openSheet(
    <div>
      <h2 className="t-h2 mb-1">Selecione a rede</h2>
      <p className="t-sm mb-4">A rede precisa ser a mesma da carteira de origem. Enviar por outra rede pode causar perda dos fundos.</p>
      {networks.map((n) => (
        <button key={n.id} onClick={() => { setVar("depNet", n.id); closeSheet(); }} className="flex items-center gap-3 w-full" style={{ padding: "14px 4px", background: "none", border: "none", borderBottom: "1px solid var(--hairline-cool)", cursor: "pointer", textAlign: "left" }}>
          <div style={{ flex: 1 }}>
            <div className="flex items-center gap-2"><span className="t-h3" style={{ fontSize: 15 }}>{n.name}</span>{n.recommended && <Badge tone="success">Recomendada</Badge>}</div>
            <div className="t-xs t-mono" style={{ marginTop: 2 }}>{n.standard} · taxa {n.networkFee} · {n.etaLabel}</div>
          </div>
          {network?.id === n.id && <span style={{ color: "var(--gold-300)" }}>✓</span>}
        </button>
      ))}
    </div>
  );

  if (!network) return null;
  const qrValue = network.memo ? `${network.address}?memo=${network.memo}` : network.address;

  return (
    <Screen fixedCta={<Button onClick={() => nav("topup-tracking")}>Já fiz a transferência</Button>}>
      <Header back title="Depositar cripto" />

      <div className="flex flex-col gap-2.5 mb-4">
        <PickerRow label="Ativo" onClick={pickAsset}>
          <div className="grid place-items-center" style={{ width: 26, height: 26, borderRadius: 8, background: `${asset.color}1f`, color: asset.color, fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12 }}>{asset.symbol.slice(0, 1)}</div>
          <span className="t-h3" style={{ fontSize: 15 }}>{asset.name}</span>
          <span className="t-xs t-mono">{asset.symbol}</span>
        </PickerRow>
        <PickerRow label="Rede" onClick={pickNetwork}>
          <span className="t-h3" style={{ fontSize: 15 }}>{network.name}</span>
          <span className="t-xs t-mono">{network.standard}</span>
          {network.recommended && <Badge tone="success">Recomendada</Badge>}
        </PickerRow>
      </div>

      <DepositQR value={qrValue} />
      <p className="t-xs text-center mt-2 mb-4">Escaneie para enviar {asset.symbol} na rede {network.name}</p>

      <div className="flex flex-col gap-2.5 mb-4">
        <CopyField label={`Endereço ${asset.symbol} · ${network.name}`} value={network.address} />
        {network.memo && <CopyField label="Memo / Destination Tag" value={network.memo} mandatory />}
      </div>

      <Panel className="flex gap-3 mb-4" style={{ background: "rgba(242,198,107,0.06)", border: "1px solid rgba(242,198,107,0.24)" }}>
        <AlertTriangle size={18} color="var(--warning)" style={{ flexShrink: 0, marginTop: 1 }} />
        <p className="t-sm">Envie <b style={{ color: "var(--ink-1)" }}>somente {asset.symbol}</b> pela rede <b style={{ color: "var(--ink-1)" }}>{network.name}</b>{network.memo ? " com o memo acima" : ""}. Outros ativos ou redes podem ser perdidos.</p>
      </Panel>

      <Panel style={{ padding: "4px 16px" }}>
        {[
          ["Depósito mínimo", network.minDeposit],
          ["Confirmações na rede", network.confirmations === 0 ? "instantâneo" : `${network.confirmations} confirmações`],
          ["Chegada estimada", network.etaLabel],
          ["Taxa de rede", network.networkFee],
        ].map(([k, v], i, arr) => (
          <div key={k} className="flex items-center justify-between" style={{ padding: "11px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--hairline-cool)" : "none" }}>
            <span className="t-sm">{k}</span>
            <span className="t-mono" style={{ fontSize: 13.5, color: "var(--ink-1)" }}>{v}</span>
          </div>
        ))}
      </Panel>
    </Screen>
  );
}

export function TopUpTracking() {
  const { jump, vars } = useApp();
  const asset = CRYPTO.find((a) => a.id === (vars.depAsset || "btc")) || CRYPTO[0];
  const networks = DEPOSIT_NETWORKS[asset.id] || [];
  const network = networks.find((n) => n.id === vars.depNet) || networks[0];
  const target = Math.max(network?.confirmations || 2, 2);
  const [conf, setConf] = useState(0);
  const [detected, setDetected] = useState(false);

  React.useEffect(() => {
    const start = setTimeout(() => setDetected(true), 1400);
    const t = setInterval(() => setConf((c) => (c < target ? c + 1 : c)), 900);
    return () => { clearTimeout(start); clearInterval(t); };
  }, [target]);

  const pct = Math.round((conf / target) * 100);
  const done = conf >= target;

  return (
    <Screen fixedCta={done
      ? <Button onClick={() => jump("wallet", "wallet")}>Concluir</Button>
      : <Button variant="glass" onClick={() => jump("wallet", "wallet")}>Acompanhar depois</Button>}>
      <Header back title="Depósito" />
      <div className="flex flex-col items-center text-center" style={{ paddingTop: 20 }}>
        <motion.div
          key={done ? "done" : "wait"}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="grid place-items-center mb-6"
          style={{ width: 92, height: 92, borderRadius: "50%", background: done ? "rgba(79,214,160,0.14)" : "var(--grad-gold-soft)", border: `1px solid ${done ? "rgba(79,214,160,0.4)" : "var(--hairline)"}`, color: done ? "var(--success)" : "var(--gold-300)" }}
        >
          {done ? <CheckCircle2 size={44} /> : <Spinner size={40} />}
        </motion.div>
        <h1 className="t-h1 mb-2">{done ? "Depósito confirmado" : detected ? "Transação detectada" : "Aguardando transação"}</h1>
        <p className="t-body mb-7" style={{ maxWidth: 290 }}>
          {done
            ? `Seu saldo de ${asset.symbol} já está disponível na carteira eNor.`
            : detected
            ? `Recebemos sua transação de ${asset.symbol}. Aguardando confirmações da rede ${network?.name}.`
            : `Assim que a rede ${network?.name} propagar sua transação, ela aparece aqui automaticamente.`}
        </p>

        <div style={{ width: "100%" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="t-sm">Confirmações</span>
            <span className="t-mono" style={{ color: done ? "var(--success)" : "var(--gold-300)", fontWeight: 600 }}>{conf}/{target}</span>
          </div>
          <div style={{ height: 8, borderRadius: 99, background: "var(--surface-3)", overflow: "hidden" }}>
            <motion.div animate={{ width: `${pct}%` }} transition={{ ease: "easeOut" }} style={{ height: "100%", borderRadius: 99, background: done ? "var(--success)" : "var(--grad-gold)" }} />
          </div>
        </div>
      </div>
    </Screen>
  );
}

const cryptoAmt = (n: number, sym: string) => `${n.toLocaleString("pt-BR", { maximumFractionDigits: 6 })} ${sym}`;

export function Transfer() {
  const { nav, vars, setVar } = useApp();
  const asset = CRYPTO.find((a) => a.id === (vars.wdAsset || "btc")) || CRYPTO[0];
  const locked = asset.collateralized || 0;
  const free = Math.max(0, asset.balance - locked);
  const amount = parseFloat((vars.wdAmount || "").replace(",", ".")) || 0;

  const tooMuch = amount > free;
  const noFree = free <= 0;
  const valid = amount > 0 && !tooMuch && !noFree;

  const setMax = () => setVar("wdAmount", String(free));

  return (
    <Screen fixedCta={
      <Button disabled={!valid} onClick={() => { setVar("wdValue", cryptoAmt(amount, asset.symbol)); nav("transfer-success"); }}>
        {noFree ? "Nenhum saldo livre para saque" : tooMuch ? "Valor acima do saldo livre" : "Revisar saque"}
      </Button>
    }>
      <Header back title="Sacar cripto" />
      <p className="t-sm mb-4">Envie cripto do seu saldo livre para uma carteira externa.</p>

      {/* asset selector */}
      <div className="flex gap-2 mb-4">
        {CRYPTO.map((a) => {
          const sel = asset.id === a.id;
          return (
            <button key={a.id} onClick={() => { setVar("wdAsset", a.id); setVar("wdAmount", ""); }} className="flex items-center justify-center gap-2" style={{ flex: 1, minHeight: 46, borderRadius: 12, border: `1px solid ${sel ? "var(--gold-400)" : "var(--hairline-cool)"}`, background: sel ? "var(--grad-gold-soft)" : "var(--surface-2)", color: sel ? "var(--gold-300)" : "var(--ink-2)", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
              <span className="grid place-items-center" style={{ width: 22, height: 22, borderRadius: 7, background: `${a.color}22`, color: a.color, fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700 }}>{a.symbol.slice(0, 1)}</span>
              {a.symbol}
            </button>
          );
        })}
      </div>

      {/* balance breakdown */}
      <Panel className="mb-4" style={{ padding: "4px 16px" }}>
        <div className="flex items-center justify-between" style={{ padding: "11px 0", borderBottom: "1px solid var(--hairline-cool)" }}>
          <span className="t-sm">Saldo total</span>
          <span className="t-mono" style={{ color: "var(--ink-1)", fontSize: 13.5 }}>{cryptoAmt(asset.balance, asset.symbol)}</span>
        </div>
        <div className="flex items-center justify-between" style={{ padding: "11px 0", borderBottom: "1px solid var(--hairline-cool)" }}>
          <span className="t-sm" style={{ display: "flex", alignItems: "center", gap: 6 }}><Lock size={13} color="var(--gold-400)" /> Em garantia (bloqueado)</span>
          <span className="t-mono" style={{ color: "var(--gold-400)", fontSize: 13.5 }}>{cryptoAmt(locked, asset.symbol)}</span>
        </div>
        <div className="flex items-center justify-between" style={{ padding: "11px 0" }}>
          <span className="t-sm" style={{ color: "var(--ink-1)", fontWeight: 600 }}>Disponível para saque</span>
          <span className="t-mono" style={{ color: "var(--success)", fontSize: 14, fontWeight: 700 }}>{cryptoAmt(free, asset.symbol)}</span>
        </div>
      </Panel>

      {noFree ? (
        <Panel className="flex gap-3 mb-2" style={{ background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.24)" }}>
          <Info size={18} color="var(--danger)" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="t-sm" style={{ color: "var(--ink-1)" }}>Todo o seu {asset.symbol} está em garantia.</p>
            <p className="t-xs mt-1">Este ativo sustenta seu limite de crédito e não pode ser sacado enquanto estiver em uso. Quite a fatura ou reforce a garantia com outro ativo para liberá-lo.</p>
            <button onClick={() => nav("collateral")} style={{ marginTop: 8, background: "none", border: "none", color: "var(--gold-300)", fontWeight: 600, fontSize: 13, cursor: "pointer", padding: 0 }}>Ver colateral →</button>
          </div>
        </Panel>
      ) : (
        <>
          <Field label={`Valor a sacar (${asset.symbol})`}>
            <div style={{ position: "relative" }}>
              <Input value={vars.wdAmount || ""} onChange={(e) => setVar("wdAmount", e.target.value)} inputMode="decimal" placeholder="0,00" style={{ paddingRight: 68, borderColor: tooMuch ? "var(--danger)" : undefined }} />
              <button onClick={setMax} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "var(--surface-3)", border: "none", borderRadius: 8, color: "var(--gold-300)", fontSize: 12, fontWeight: 700, padding: "6px 10px", cursor: "pointer" }}>MÁX</button>
            </div>
            {tooMuch && <p className="t-xs mt-1" style={{ color: "var(--danger)" }}>Máximo disponível: {cryptoAmt(free, asset.symbol)}</p>}
          </Field>
          <Field label="Endereço da carteira de destino"><Input placeholder={`${asset.symbol === "BTC" ? "bc1q..." : "0x..."}`} /></Field>
          <Panel className="flex gap-3" style={{ background: "rgba(242,198,107,0.06)", border: "1px solid rgba(242,198,107,0.2)" }}>
            <Info size={18} color="var(--warning)" style={{ flexShrink: 0, marginTop: 2 }} />
            <p className="t-sm">Apenas o saldo <b style={{ color: "var(--ink-1)" }}>livre</b> pode ser sacado. O valor em garantia permanece bloqueado enquanto o crédito estiver ativo.</p>
          </Panel>
        </>
      )}
    </Screen>
  );
}

export function Swap() {
  const { nav, toast } = useApp();
  return (
    <Screen fixedCta={<Button onClick={() => { toast("Conversão realizada ✓"); nav("wallet", { replace: true }); }}>Converter agora</Button>}>
      <Header back title="Converter" />
      <p className="t-sm mb-4">Troque entre ativos do seu portfólio instantaneamente.</p>
      <Panel className="mb-2">
        <div className="t-label mb-2">De</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><div className="grid place-items-center" style={{ width: 34, height: 34, borderRadius: 10, background: "#f7931a1f", color: "#f7931a", fontFamily: "var(--font-mono)", fontWeight: 700 }}>B</div><span className="t-h3">BTC</span></div>
          <span className="t-amount" style={{ fontSize: 22 }}>0.05</span>
        </div>
      </Panel>
      <div className="flex justify-center" style={{ margin: "-6px 0", position: "relative", zIndex: 2 }}>
        <div className="grid place-items-center" style={{ width: 40, height: 40, borderRadius: 99, background: "var(--grad-gold)", color: "#241a08" }}><Repeat size={18} /></div>
      </div>
      <Panel style={{ marginTop: -6 }}>
        <div className="t-label mb-2">Para</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><div className="grid place-items-center" style={{ width: 34, height: 34, borderRadius: 10, background: "#3b8ff01f", color: "#3b8ff0", fontFamily: "var(--font-mono)", fontWeight: 700 }}>U</div><span className="t-h3">USDC</span></div>
          <span className="t-amount" style={{ fontSize: 22 }}>4.925</span>
        </div>
      </Panel>
      <div className="flex justify-between t-xs mt-4" style={{ padding: "0 4px" }}><span>Taxa de conversão</span><span className="t-mono">1 BTC = 98.500 USDC</span></div>
    </Screen>
  );
}

export function TransferSuccess() {
  const { jump, vars } = useApp();
  return (
    <SuccessView title="Saque enviado" amount={vars.wdValue} subtitle="Sua transação foi transmitida para a rede. Deve chegar à carteira de destino em instantes." cta="Voltar à carteira" onCta={() => jump("wallet", "wallet")} icon="↑" />
  );
}

/* shared success used across flows */
export function SuccessView({ title, subtitle, cta, onCta, secondary, onSecondary, icon = "✓", amount }: { title: string; subtitle: string; cta: string; onCta: () => void; secondary?: string; onSecondary?: () => void; icon?: string; amount?: string }) {
  return (
    <Screen fixedCta={<><Button onClick={onCta}>{cta}</Button>{secondary && <Button variant="glass" full style={{ marginTop: 10 }} onClick={onSecondary}>{secondary}</Button>}</>}>
      <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: "72%" }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14 }} className="grid place-items-center mb-6" style={{ width: 92, height: 92, borderRadius: "50%", background: "var(--grad-gold-soft)", border: "1px solid var(--hairline)", fontSize: 40, color: "var(--gold-300)" }}>{icon}</motion.div>
        <h1 className="t-h1 mb-2">{title}</h1>
        {amount && <div className="t-amount gold-text mb-2" style={{ fontSize: 34 }}>{amount}</div>}
        <p className="t-body" style={{ maxWidth: 280 }}>{subtitle}</p>
      </div>
    </Screen>
  );
}
