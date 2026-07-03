"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Paperclip, ChevronDown, HelpCircle, FileWarning, MessageCircle, ChevronRight } from "lucide-react";
import { useApp } from "@/lib/store";
import { Screen, Header, Panel, Button, Field, Input, Badge } from "@/components/ui";
import { BottomNav } from "@/components/pieces";
import { DISPUTE_REASONS, DISPUTES, FAQ, brl, shortDate } from "@/lib/data";

/* ── F5: Disputes ── */
export function DisputeReason() {
  const { nav, vars, setVar } = useApp();
  return (
    <Screen fixedCta={<Button onClick={() => nav("dispute-evidence")}>Continuar</Button>}>
      <Header back title="Contestar" />
      <h1 className="t-h1 mb-2">Qual o motivo?</h1>
      <p className="t-sm mb-5">Selecione o motivo da contestação e descreva o ocorrido.</p>
      {DISPUTE_REASONS.map((r) => {
        const sel = vars.reason === r;
        return (
          <Panel key={r} onClick={() => setVar("reason", r)} className="flex items-center justify-between mb-2" style={{ padding: 15, border: `2px solid ${sel ? "var(--gold-400)" : "var(--hairline-cool)"}`, background: sel ? "var(--grad-gold-soft)" : "var(--surface)" }}>
            <span className="t-sm" style={{ color: "var(--ink-1)", fontWeight: 500 }}>{r}</span>
            {sel && <span style={{ color: "var(--gold-300)" }}>✓</span>}
          </Panel>
        );
      })}
      <Field label="Descrição (opcional)">
        <textarea rows={3} placeholder="Descreva o que aconteceu..." style={{ width: "100%", padding: "12px 16px", background: "var(--surface-2)", border: "1px solid var(--hairline-cool)", borderRadius: "var(--r-md)", color: "var(--ink-1)", fontSize: 15, resize: "none", fontFamily: "var(--font-body)", outline: "none" }} />
      </Field>
    </Screen>
  );
}

export function DisputeEvidence() {
  const { nav, toast } = useApp();
  return (
    <Screen fixedCta={<><Button onClick={() => nav("dispute-confirm")}>Continuar</Button><Button variant="ghost" full style={{ marginTop: 6 }} onClick={() => nav("dispute-confirm")}>Pular esta etapa</Button></>}>
      <Header back title="Evidências" />
      <h1 className="t-h1 mb-2">Anexar evidências</h1>
      <p className="t-sm mb-5">Comprovantes ou capturas ajudam na análise (opcional).</p>
      <Panel onClick={() => toast("Arquivo anexado (simulado)")} className="flex flex-col items-center text-center" style={{ padding: 32, border: "2px dashed var(--hairline)", cursor: "pointer" }}>
        <div className="grid place-items-center mb-3" style={{ width: 52, height: 52, borderRadius: 16, background: "var(--surface-2)" }}><Paperclip size={22} color="var(--gold-300)" /></div>
        <div className="t-h3">Toque para anexar</div>
        <div className="t-xs mt-1">PNG, JPG ou PDF · até 10 MB</div>
      </Panel>
    </Screen>
  );
}

export function DisputeConfirm() {
  const { nav, vars } = useApp();
  return (
    <Screen fixedCta={<Button onClick={() => nav("dispute-success")}>Confirmar contestação</Button>}>
      <Header back title="Revisar" />
      <h1 className="t-h1 mb-4">Revise sua contestação</h1>
      <Panel className="mb-4">
        {[["Estabelecimento", "Erax Steakhouse"], ["Valor", brl(1287)], ["Motivo", vars.reason]].map(([k, v], i, arr) => (
          <div key={k} className="flex justify-between" style={{ padding: "12px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--hairline-cool)" : "none" }}>
            <span className="t-sm">{k}</span><span className="t-sm" style={{ color: "var(--ink-1)", fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{v}</span>
          </div>
        ))}
      </Panel>
      <Panel style={{ background: "rgba(240,185,66,0.06)", border: "1px solid rgba(240,185,66,0.22)" }}>
        <div className="t-label mb-1" style={{ color: "var(--warning)" }}>Antes de confirmar</div>
        <p className="t-xs">Ao confirmar, abriremos a análise de chargeback junto ao emissor. O prazo médio é de <b style={{ color: "var(--ink-1)" }}>45 a 90 dias</b>. Você é responsável pela veracidade das informações — contestações indevidas podem ser revertidas e resultar na recobrança do valor.</p>
      </Panel>
    </Screen>
  );
}

export function DisputeSuccess() {
  const { nav } = useApp();
  return (
    <Screen fixedCta={<Button onClick={() => nav("dispute-list")}>Acompanhar disputa</Button>}>
      <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: "76%" }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14 }} className="grid place-items-center mb-6" style={{ width: 90, height: 90, borderRadius: "50%", background: "var(--grad-gold-soft)", border: "1px solid var(--hairline)" }}><FileWarning size={38} color="var(--gold-300)" /></motion.div>
        <h1 className="t-h1 mb-2">Contestação aberta</h1>
        <div className="t-label mb-1">Protocolo</div>
        <div className="t-amount gold-text mb-3" style={{ fontSize: 24 }}>DSP-2026-004822</div>
        <p className="t-body" style={{ maxWidth: 280 }}>Você acompanha cada etapa por aqui. Também enviamos o protocolo por e-mail.</p>
      </div>
    </Screen>
  );
}

export function DisputeList() {
  const { nav } = useApp();
  const all = [{ id: "d2", protocol: "DSP-2026-004822", merchant: "Erax Steakhouse", amountBrl: 1287, status: "open", date: new Date().toISOString() }, ...DISPUTES];
  return (
    <>
      <Screen bottomNav>
        <Header back title="Minhas disputas" />
        {all.map((d) => (
          <Panel key={d.id} onClick={() => nav("dispute-detail")} className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="t-h3" style={{ fontSize: 14.5 }}>{d.protocol}</span>
              <Badge tone={d.status === "open" ? "info" : "warning"}>{d.status === "open" ? "Aberta" : "Em análise"}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div><div className="t-sm" style={{ color: "var(--ink-1)" }}>{d.merchant}</div><div className="t-xs">{shortDate(d.date)}</div></div>
              <div className="t-mono" style={{ fontWeight: 600 }}>{brl(d.amountBrl)}</div>
            </div>
          </Panel>
        ))}
      </Screen>
      <BottomNav />
    </>
  );
}

export function DisputeDetail() {
  return (
    <Screen>
      <Header back title="Disputa" />
      <Panel className="mb-4">
        <div className="t-label">Protocolo</div>
        <div className="t-h2 mt-1">DSP-2026-004822</div>
        <div className="mt-2"><Badge tone="info">Aberta</Badge></div>
      </Panel>
      <span className="t-label">Andamento</span>
      <Panel style={{ marginTop: 8 }}>
        {[
          { t: "Contestação aberta", s: "Hoje", done: true },
          { t: "Em análise pelo emissor", s: "Pendente", done: false },
          { t: "Resolução", s: "—", done: false },
        ].map((s, i, arr) => (
          <div key={s.t} className="flex gap-3" style={{ paddingBottom: i < arr.length - 1 ? 16 : 0 }}>
            <div className="flex flex-col items-center">
              <div style={{ width: 12, height: 12, borderRadius: 99, background: s.done ? "var(--gold-400)" : "var(--surface-3)", border: s.done ? "none" : "2px solid var(--surface-3)" }} />
              {i < arr.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 24, background: s.done ? "var(--gold-600)" : "var(--surface-3)" }} />}
            </div>
            <div style={{ marginTop: -3, opacity: s.done ? 1 : 0.5 }}><div className="t-h3" style={{ fontSize: 14 }}>{s.t}</div><div className="t-xs">{s.s}</div></div>
          </div>
        ))}
      </Panel>
    </Screen>
  );
}

/* ── F5: Help ── */
export function HelpScreen() {
  const { nav } = useApp();
  const items = [
    { Icon: HelpCircle, t: "Perguntas frequentes", s: "Dúvidas comuns sobre o cartão e cripto", to: "faq" },
    { Icon: FileWarning, t: "Minhas disputas", s: "Acompanhe suas contestações", to: "dispute-list" },
    { Icon: MessageCircle, t: "Falar com suporte", s: "Nossa equipe responde em até 1 dia útil", to: "support" },
  ];
  return (
    <>
      <Screen bottomNav>
        <Header transparent title="Ajuda" />
        {items.map(({ Icon, t, s, to }) => (
          <Panel key={t} onClick={() => nav(to)} className="flex items-center gap-3 mb-3" style={{ padding: 16 }}>
            <div className="grid place-items-center" style={{ width: 44, height: 44, borderRadius: 13, background: "var(--grad-gold-soft)", border: "1px solid var(--hairline)" }}><Icon size={20} color="var(--gold-300)" /></div>
            <div style={{ flex: 1 }}><div className="t-h3" style={{ fontSize: 15 }}>{t}</div><div className="t-xs">{s}</div></div>
            <ChevronRight size={18} color="var(--ink-3)" />
          </Panel>
        ))}
        <Panel className="mt-2">
          <div className="t-label mb-2">Contato direto</div>
          <div className="t-sm" style={{ color: "var(--ink-1)" }}>suporte.card@enorsecurities.com</div>
          <div className="t-sm mt-1">Seg–Sex · 9h às 18h (BRT)</div>
        </Panel>
      </Screen>
      <BottomNav />
    </>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Screen>
      <Header back title="Perguntas frequentes" />
      {FAQ.map((f, i) => (
        <div key={i} style={{ borderBottom: "1px solid var(--hairline-cool)" }}>
          <button onClick={() => setOpen(open === i ? null : i)} className="flex items-center justify-between w-full" style={{ padding: "16px 0", background: "none", border: "none", color: "var(--ink-1)", fontSize: 15, fontWeight: 500, textAlign: "left", cursor: "pointer", gap: 12 }}>
            <span style={{ flex: 1 }}>{f.q}</span>
            <ChevronDown size={18} color="var(--ink-3)" style={{ transform: open === i ? "rotate(180deg)" : "none", transition: "transform .2s", flexShrink: 0 }} />
          </button>
          {open === i && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} style={{ overflow: "hidden" }}>
              <p className="t-sm" style={{ paddingBottom: 16 }}>{f.a}</p>
            </motion.div>
          )}
        </div>
      ))}
    </Screen>
  );
}

export function Support() {
  const { nav } = useApp();
  return (
    <Screen fixedCta={<Button onClick={() => nav("support-success")}>Enviar mensagem</Button>}>
      <Header back title="Suporte" />
      <h1 className="t-h1 mb-4">Como podemos ajudar?</h1>
      <Field label="Assunto">
        <select style={{ width: "100%", minHeight: 52, padding: "12px 16px", background: "var(--surface-2)", border: "1px solid var(--hairline-cool)", borderRadius: "var(--r-md)", color: "var(--ink-1)", fontSize: 15, outline: "none" }}>
          <option>Cartão e transações</option>
          <option>Colateral, cripto e limite</option>
          <option>KYC e conta</option>
          <option>Outro assunto</option>
        </select>
      </Field>
      <Field label="Mensagem">
        <textarea rows={6} placeholder="Descreva sua dúvida ou problema..." style={{ width: "100%", padding: "12px 16px", background: "var(--surface-2)", border: "1px solid var(--hairline-cool)", borderRadius: "var(--r-md)", color: "var(--ink-1)", fontSize: 15, resize: "none", fontFamily: "var(--font-body)", outline: "none" }} />
      </Field>
    </Screen>
  );
}
