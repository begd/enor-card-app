"use client";

import React, { useState } from "react";
import { motion, PanInfo } from "framer-motion";
import { Eye, EyeOff, Snowflake, KeyRound, Plus, MapPin, Truck, SlidersHorizontal, ChevronRight, ShieldCheck } from "lucide-react";
import { useApp } from "@/lib/store";
import { Screen, Header, Panel, Button, Field, Input, Badge } from "@/components/ui";
import { CardVisual, BottomNav, PinPad, LimitSlider, CopyField } from "@/components/pieces";
import { CARDS, brl } from "@/lib/data";

const STEP = 288; // card width (264) + gap (24)

function CardCarousel({ idx, setIdx, revealed, frozen }: { idx: number; setIdx: (i: number) => void; revealed: Record<string, boolean>; frozen: Record<string, boolean> }) {
  const onDragEnd = (_: unknown, info: PanInfo) => {
    const dir = info.offset.x < -60 || info.velocity.x < -400 ? 1 : info.offset.x > 60 || info.velocity.x > 400 ? -1 : 0;
    setIdx(Math.min(CARDS.length - 1, Math.max(0, idx + dir)));
  };
  return (
    <div style={{ overflow: "hidden", margin: "0 -20px 10px" }}>
      <motion.div
        style={{ display: "flex", gap: 24, padding: "6px 0 14px", paddingLeft: "calc(50% - 132px)", paddingRight: "calc(50% - 132px)", cursor: "grab" }}
        drag="x"
        dragConstraints={{ left: -STEP * (CARDS.length - 1), right: 0 }}
        dragElastic={0.14}
        onDragEnd={onDragEnd}
        animate={{ x: -idx * STEP }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
      >
        {CARDS.map((c, i) => (
          <motion.div
            key={c.id}
            onClick={() => setIdx(i)}
            animate={{ scale: i === idx ? 1 : 0.9, opacity: i === idx ? 1 : 0.45 }}
            transition={{ duration: 0.3 }}
            style={{ width: 264, flexShrink: 0, cursor: "pointer" }}
          >
            <CardVisual card={c} revealed={revealed[c.id]} frozen={frozen[c.id]} compact />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export function CardsScreen() {
  const { nav, toggleFreeze, toggleReveal, revealed, frozen, toast, openSheet, closeSheet, setVar } = useApp();
  const [idx, setIdx] = useState(0);
  const card = CARDS[idx];
  const limitPct = Math.min(100, Math.round((card.spentThisMonth / card.spendingLimit) * 100));

  const pinSheet = (
    <div>
      <h2 className="t-h2 mb-1">Gerenciar PIN</h2>
      <p className="t-sm mb-5">{card.label} · •••• {card.last4}</p>
      <Button variant="glass" style={{ marginBottom: 10 }} onClick={() => { setVar("pinNext", ""); closeSheet(); nav("card-set-pin"); }}><KeyRound size={18} /> Alterar PIN</Button>
      <Button variant="glass" onClick={() => { toast("PIN desbloqueado ✓"); closeSheet(); }}>Desbloquear PIN</Button>
    </div>
  );

  const limitSheet = <LimitSheet card={card} onDone={(v) => { toast(`Limite atualizado para ${brl(v)}`); closeSheet(); }} />;

  const freezeSheet = (
    <div>
      <div className="grid place-items-center mb-4" style={{ width: 56, height: 56, borderRadius: 18, background: "rgba(138,108,255,0.12)", margin: "0 auto" }}><Snowflake size={26} color="var(--aurora-violet)" /></div>
      <h2 className="t-h2 mb-2 text-center">Congelar cartão?</h2>
      <p className="t-sm mb-4 text-center">Ao congelar, você bloqueia na hora:</p>
      <Panel className="mb-5" style={{ padding: "6px 16px" }}>
        {["Todas as compras presenciais e online", "Assinaturas e pagamentos recorrentes", "Saques em caixas eletrônicos"].map((e, i, arr) => (
          <div key={e} className="flex items-center gap-2" style={{ padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--hairline-cool)" : "none" }}>
            <Snowflake size={15} color="var(--aurora-violet)" style={{ flexShrink: 0 }} /><span className="t-sm" style={{ color: "var(--ink-1)" }}>{e}</span>
          </div>
        ))}
      </Panel>
      <p className="t-xs mb-4 text-center">Você pode descongelar quando quiser, instantaneamente.</p>
      <Button onClick={() => { toggleFreeze(card.id); toast("Cartão congelado ❄"); closeSheet(); }}>Congelar agora</Button>
      <Button variant="ghost" full style={{ marginTop: 6 }} onClick={closeSheet}>Cancelar</Button>
    </div>
  );

  return (
    <>
      <Screen bottomNav>
        <Header transparent title="Cartões" right={<button onClick={() => nav("card-product-info")} className="grid place-items-center" style={{ width: 40, height: 40, borderRadius: 99, background: "var(--surface-2)", border: "1px solid var(--hairline-cool)", cursor: "pointer" }}><Plus size={18} color="var(--gold-300)" /></button>} />

        <CardCarousel idx={idx} setIdx={setIdx} revealed={revealed} frozen={frozen} />

        <div className="flex justify-center mb-5" style={{ gap: 6 }}>
          {CARDS.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 18 : 6, height: 6, borderRadius: 99, border: "none", padding: 0, background: i === idx ? "var(--gold-400)" : "var(--surface-3)", transition: "all .3s", cursor: "pointer" }} aria-label={`Cartão ${i + 1}`} />
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div><div className="t-h3">{card.label}</div><div className="t-xs">{card.type === "virtual" ? "Cartão virtual" : "Cartão físico"} · •••• {card.last4}</div></div>
          <Badge tone={frozen[card.id] ? "info" : "success"}>{frozen[card.id] ? "Congelado" : "Ativo"}</Badge>
        </div>

        {/* limit usage */}
        <Panel className="mb-4" onClick={() => openSheet(limitSheet)}>
          <div className="flex items-center justify-between mb-2">
            <span className="t-sm">Limite mensal</span>
            <span className="t-mono" style={{ fontSize: 13, color: "var(--gold-300)" }}>Ajustar ›</span>
          </div>
          <div style={{ height: 8, borderRadius: 99, background: "var(--surface-3)", overflow: "hidden", marginBottom: 8 }}>
            <div style={{ width: `${limitPct}%`, height: "100%", borderRadius: 99, background: limitPct > 85 ? "var(--warning)" : "var(--grad-gold)" }} />
          </div>
          <div className="flex justify-between t-xs">
            <span>Usado {brl(card.spentThisMonth)}</span>
            <span>Limite {brl(card.spendingLimit)}</span>
          </div>
        </Panel>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { Icon: revealed[card.id] ? EyeOff : Eye, l: revealed[card.id] ? "Ocultar" : "Revelar", on: () => toggleReveal(card.id) },
            { Icon: Snowflake, l: frozen[card.id] ? "Descong." : "Congelar", on: () => { if (frozen[card.id]) { toggleFreeze(card.id); toast("Cartão descongelado"); } else { openSheet(freezeSheet); } }, active: frozen[card.id] },
            { Icon: KeyRound, l: "PIN", on: () => openSheet(pinSheet) },
            { Icon: SlidersHorizontal, l: "Limite", on: () => openSheet(limitSheet) },
          ].map(({ Icon, l, on, active }) => (
            <button key={l} onClick={on} className="flex flex-col items-center justify-center gap-1.5" style={{ minHeight: 66, borderRadius: 16, background: active ? "rgba(138,108,255,0.12)" : "var(--surface-2)", border: "1px solid var(--hairline-cool)", color: active ? "var(--aurora-violet)" : "var(--ink-1)", cursor: "pointer" }}>
              <Icon size={18} /><span style={{ fontSize: 11, fontWeight: 600 }}>{l}</span>
            </button>
          ))}
        </div>

        <button onClick={() => { setVar("detailCard", card.id); nav("card-details"); }} className="flex items-center justify-between w-full mb-4" style={{ background: "var(--surface-2)", border: "1px solid var(--hairline-cool)", borderRadius: "var(--r-md)", padding: "14px 16px", cursor: "pointer" }}>
          <span className="t-sm" style={{ color: "var(--ink-1)", fontWeight: 500 }}>Ver dados completos do cartão</span>
          <ChevronRight size={18} color="var(--ink-3)" />
        </button>

        <span className="t-label">Configurações do cartão</span>
        <Panel style={{ marginTop: 8, padding: "4px 16px" }}>
          {[["Pagamentos online", true], ["Saques em ATM", true], ["Compras no exterior", true], ["Pagamento por aproximação", false]].map(([l, on], i, arr) => (
            <div key={l as string} className="flex items-center justify-between" style={{ padding: "14px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--hairline-cool)" : "none" }}>
              <span className="t-sm" style={{ color: "var(--ink-1)" }}>{l}</span>
              <Toggle initial={on as boolean} />
            </div>
          ))}
        </Panel>
      </Screen>
      <BottomNav />
    </>
  );
}

function LimitSheet({ card, onDone }: { card: typeof CARDS[number]; onDone: (v: number) => void }) {
  const [val, setVal] = useState(card.spendingLimit);
  const max = 120000;
  return (
    <div>
      <h2 className="t-h2 mb-1">Limite mensal</h2>
      <p className="t-sm mb-5">{card.label} · •••• {card.last4}</p>
      <div className="text-center mb-5">
        <div className="t-amount gold-text" style={{ fontSize: 34 }}>{brl(val)}</div>
        <div className="t-xs mt-1">de até {brl(max)} disponíveis pelo seu colateral</div>
      </div>
      <LimitSlider value={val} min={500} max={max} step={500} onChange={setVal} />
      <div className="flex gap-2 mt-4 mb-6">
        {[2000, 15000, 50000, max].map((v) => (
          <button key={v} onClick={() => setVal(v)} style={{ flex: 1, padding: "8px 0", borderRadius: 99, border: `1px solid ${val === v ? "var(--gold-400)" : "var(--hairline-cool)"}`, background: val === v ? "var(--grad-gold-soft)" : "transparent", color: val === v ? "var(--gold-300)" : "var(--ink-2)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            {v >= 1000 ? `${v / 1000}k` : v}
          </button>
        ))}
      </div>
      <Button onClick={() => onDone(val)}>Salvar limite</Button>
    </div>
  );
}

function Toggle({ initial }: { initial: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <button onClick={() => setOn(!on)} style={{ width: 50, height: 30, borderRadius: 99, border: "none", cursor: "pointer", background: on ? "var(--gold-400)" : "var(--surface-3)", position: "relative", transition: "background .2s" }}>
      <motion.div animate={{ x: on ? 20 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} style={{ position: "absolute", top: 3, left: 3, width: 24, height: 24, borderRadius: 99, background: "#fff" }} />
    </button>
  );
}

export function CardDetails() {
  const { vars, revealed, toggleReveal } = useApp();
  const card = CARDS.find((c) => c.id === vars.detailCard) || CARDS[0];
  const show = revealed[card.id];
  return (
    <Screen>
      <Header back title="Dados do cartão" right={<button onClick={() => toggleReveal(card.id)} className="grid place-items-center" style={{ width: 40, height: 40, borderRadius: 99, background: "var(--surface-2)", border: "1px solid var(--hairline-cool)", cursor: "pointer" }}>{show ? <EyeOff size={17} color="var(--gold-300)" /> : <Eye size={17} color="var(--gold-300)" />}</button>} />
      <div style={{ marginBottom: 20 }}><CardVisual card={card} revealed={show} frozen={false} /></div>
      {show ? (
        <div className="flex flex-col gap-2.5 mb-4">
          <CopyField label="Número do cartão" value={card.pan} />
          <div className="flex gap-2.5">
            <div style={{ flex: 1 }}><CopyField label="Validade" value={card.expiry} /></div>
            <div style={{ flex: 1 }}><CopyField label="CVV" value={card.cvv} /></div>
          </div>
          <CopyField label="Titular" value="MARINA COSTA" mono={false} />
        </div>
      ) : (
        <Panel className="flex flex-col items-center text-center" style={{ padding: 28 }}>
          <ShieldCheck size={30} color="var(--gold-300)" />
          <p className="t-sm mt-3" style={{ maxWidth: 240 }}>Por segurança, os dados sensíveis ficam ocultos. Toque no olho acima para revelar.</p>
        </Panel>
      )}
      <Panel style={{ padding: "4px 16px" }}>
        <div className="flex justify-between" style={{ padding: "11px 0", borderBottom: "1px solid var(--hairline-cool)" }}><span className="t-sm">Tipo</span><span className="t-mono" style={{ color: "var(--ink-1)", fontSize: 13.5 }}>{card.type === "virtual" ? "Virtual" : "Físico · metal"}</span></div>
        <div className="flex justify-between" style={{ padding: "11px 0", borderBottom: "1px solid var(--hairline-cool)" }}><span className="t-sm">Bandeira</span><span className="t-mono" style={{ color: "var(--ink-1)", fontSize: 13.5 }}>Visa Infinite</span></div>
        <div className="flex justify-between" style={{ padding: "11px 0" }}><span className="t-sm">Limite mensal</span><span className="t-mono" style={{ color: "var(--ink-1)", fontSize: 13.5 }}>{brl(card.spendingLimit)}</span></div>
      </Panel>
    </Screen>
  );
}

export function CardProductInfo() {
  const { nav } = useApp();
  return (
    <Screen>
      <Header back title="Novo cartão" />
      <h1 className="t-h1 mb-2">Escolha o tipo</h1>
      <p className="t-body mb-6">Virtual é instantâneo. Físico Obsidian chega em até 15 dias úteis.</p>
      <Panel onClick={() => nav("card-create-virtual")} className="mb-3" style={{ padding: 18 }}>
        <div className="flex items-center justify-between mb-2"><span className="t-h3">Cartão virtual</span><Badge tone="success">Instantâneo</Badge></div>
        <p className="t-sm">Pronto para usar agora. Emita quantos precisar para organizar seus gastos.</p>
      </Panel>
      <Panel onClick={() => nav("card-request-physical")} gold style={{ padding: 18 }}>
        <div className="flex items-center justify-between mb-2"><span className="t-h3 gold-text">eNor Obsidian físico</span><Badge tone="warning">Premium</Badge></div>
        <p className="t-sm">Cartão de metal, entrega premium no endereço cadastrado.</p>
      </Panel>
    </Screen>
  );
}

export function CardCreateVirtual() {
  const { nav, vars, setVar, flags } = useApp();
  const [nickname, setNickname] = useState(vars.newCardName || "Compras online");
  const limit = Number(vars.newCardLimit || "15000");
  const currencies = ["BRL", "USD", "EUR"];
  const cur = vars.newCardCurrency || "BRL";
  const pinReady = flags.newPinSet;

  React.useEffect(() => { setVar("newCardName", nickname); }, [nickname, setVar]);

  return (
    <Screen fixedCta={<Button disabled={!pinReady} onClick={() => nav("card-create-success")}>{pinReady ? "Emitir cartão" : "Defina o PIN para continuar"}</Button>}>
      <Header back title="Cartão virtual" />
      <div style={{ marginBottom: 22 }}>
        <CardVisual card={{ ...CARDS[1], last4: "••••", label: nickname || "Novo cartão" }} />
      </div>

      <Field label="Apelido do cartão"><Input value={nickname} onChange={(e) => setNickname(e.target.value)} maxLength={22} /></Field>

      <Field label="Moeda de exibição">
        <div className="flex gap-2">
          {currencies.map((c) => (
            <button key={c} onClick={() => setVar("newCardCurrency", c)} style={{ flex: 1, minHeight: 46, borderRadius: 12, border: `1px solid ${cur === c ? "var(--gold-400)" : "var(--hairline-cool)"}`, background: cur === c ? "var(--grad-gold-soft)" : "var(--surface-2)", color: cur === c ? "var(--gold-300)" : "var(--ink-2)", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>{c}</button>
          ))}
        </div>
      </Field>

      <Field label={`Limite mensal · ${brl(limit)}`}>
        <div style={{ padding: "6px 4px 0" }}>
          <LimitSlider value={limit} min={500} max={82000} step={500} onChange={(v) => setVar("newCardLimit", String(v))} />
        </div>
      </Field>

      <button onClick={() => { setVar("pinNext", "back-virtual"); nav("card-set-pin"); }} className="flex items-center justify-between w-full mt-2" style={{ background: "var(--surface-2)", border: `1px solid ${pinReady ? "rgba(79,214,160,0.3)" : "var(--hairline-cool)"}`, borderRadius: "var(--r-md)", padding: "14px 16px", cursor: "pointer" }}>
        <div className="flex items-center gap-3">
          <KeyRound size={18} color={pinReady ? "var(--success)" : "var(--gold-300)"} />
          <div style={{ textAlign: "left" }}>
            <div className="t-sm" style={{ color: "var(--ink-1)", fontWeight: 500 }}>PIN do cartão</div>
            <div className="t-xs">{pinReady ? "Definido" : "Necessário para compras presenciais"}</div>
          </div>
        </div>
        {pinReady ? <Badge tone="success">Pronto</Badge> : <ChevronRight size={18} color="var(--ink-3)" />}
      </button>
    </Screen>
  );
}

export function CardSetPin() {
  const { nav, back, toast, vars, setFlag } = useApp();
  const [phase, setPhase] = useState<"create" | "confirm">("create");
  const [pin, setPin] = useState("");
  const [first, setFirst] = useState("");

  React.useEffect(() => {
    if (pin.length !== 4) return;
    if (phase === "create") {
      setFirst(pin);
      setTimeout(() => { setPin(""); setPhase("confirm"); }, 180);
    } else {
      if (pin === first) {
        setFlag("newPinSet", true);
        toast("PIN definido com sucesso ✓");
        setTimeout(() => {
          const next = vars.pinNext;
          if (next === "back-virtual" || !next) back();
          else nav(next, { replace: true });
        }, 300);
      } else {
        toast("Os PINs não coincidem. Tente novamente.", "error");
        setTimeout(() => { setPin(""); setFirst(""); setPhase("create"); }, 400);
      }
    }
  }, [pin, phase, first, back, nav, setFlag, toast, vars.pinNext]);

  return (
    <Screen>
      <Header back title="Definir PIN" />
      <div className="text-center mb-8" style={{ marginTop: 12 }}>
        <div className="grid place-items-center mx-auto mb-4" style={{ width: 56, height: 56, borderRadius: 18, background: "var(--grad-gold-soft)", border: "1px solid var(--hairline)" }}>
          <KeyRound size={24} color="var(--gold-300)" />
        </div>
        <h1 className="t-h1 mb-2">{phase === "create" ? "Crie um PIN de 4 dígitos" : "Confirme o PIN"}</h1>
        <p className="t-body" style={{ maxWidth: 280, margin: "0 auto" }}>{phase === "create" ? "Use este PIN para compras presenciais e saques." : "Digite novamente para confirmar."}</p>
      </div>
      <PinPad value={pin} onChange={setPin} />
    </Screen>
  );
}

export function CardRequestPhysical() {
  const { nav } = useApp();
  return (
    <Screen fixedCta={<Button onClick={() => nav("card-delivery")}>Solicitar cartão físico</Button>}>
      <Header back title="Cartão físico" />
      <h1 className="t-h1 mb-2">Endereço de entrega</h1>
      <p className="t-sm mb-4">Confirme onde deseja receber seu eNor Obsidian.</p>
      <div style={{ position: "relative", height: 120, borderRadius: "var(--r-md)", overflow: "hidden", marginBottom: 16, background: "linear-gradient(135deg,#12151f,#1d2233)" }}>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,transparent,transparent 22px,rgba(150,165,210,0.06) 22px,rgba(150,165,210,0.06) 23px), repeating-linear-gradient(90deg,transparent,transparent 22px,rgba(150,165,210,0.06) 22px,rgba(150,165,210,0.06) 23px)" }} />
        <div className="absolute" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}><MapPin size={28} color="var(--gold-300)" /></div>
      </div>
      <Field label="CEP"><Input defaultValue="04538-133" /></Field>
      <Field label="Endereço"><Input defaultValue="Av. Brigadeiro Faria Lima, 3477 — Apto 142" /></Field>
      <Field label="Cidade / UF"><Input defaultValue="São Paulo, SP" /></Field>
    </Screen>
  );
}

export function CardDelivery() {
  const { nav } = useApp();
  return (
    <Screen bottomNav fixedCta={<Button onClick={() => nav("card-activate")}>Recebi meu cartão — Ativar</Button>}>
      <Header back title="Entrega" />
      <div style={{ marginBottom: 20, opacity: 0.75 }}><CardVisual card={CARDS[0]} /></div>
      <Panel>
        <div className="flex items-center gap-3 mb-4"><Badge tone="info"><Truck size={12} style={{ marginRight: 4 }} />Em trânsito</Badge><span className="t-xs">Previsão: 8 jul 2026</span></div>
        {[
          { t: "Saiu para entrega", s: "São Paulo, SP — hoje", done: true },
          { t: "Em transporte", s: "Centro de distribuição — 2 jul", done: true },
          { t: "Produzido", s: "28 jun", done: true },
          { t: "Entregue", s: "Aguardando", done: false },
        ].map((s, i, arr) => (
          <div key={s.t} className="flex gap-3" style={{ paddingBottom: i < arr.length - 1 ? 16 : 0 }}>
            <div className="flex flex-col items-center">
              <div style={{ width: 12, height: 12, borderRadius: 99, background: s.done ? "var(--gold-400)" : "var(--surface-3)", border: s.done ? "none" : "2px solid var(--surface-3)" }} />
              {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: s.done ? "var(--gold-600)" : "var(--surface-3)", minHeight: 24 }} />}
            </div>
            <div style={{ marginTop: -3, opacity: s.done ? 1 : 0.5 }}><div className="t-h3" style={{ fontSize: 14 }}>{s.t}</div><div className="t-xs">{s.s}</div></div>
          </div>
        ))}
      </Panel>
    </Screen>
  );
}

export function CardActivate() {
  const { nav, setVar } = useApp();
  return (
    <Screen fixedCta={<Button onClick={() => { setVar("pinNext", "card-activate-success"); nav("card-set-pin"); }}>Continuar</Button>}>
      <Header back title="Ativar cartão" />
      <h1 className="t-h1 mb-2">Ative seu Obsidian</h1>
      <p className="t-body mb-6">Digite os últimos 8 dígitos impressos no verso do cartão físico. Em seguida você define o PIN.</p>
      <Field label="Últimos 8 dígitos do cartão">
        <Input defaultValue="2244 3367" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.2em", fontSize: 20, textAlign: "center", minHeight: 60 }} maxLength={9} />
      </Field>
    </Screen>
  );
}
