"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Delete, ShieldCheck, ScanFace, FileText, CheckCircle2, XCircle } from "lucide-react";
import { useApp } from "@/lib/store";
import { Screen, Header, Button, Steps, Field, Input, Panel, Badge, Spinner, BareScreen } from "@/components/ui";

export function Splash() {
  const { nav, jump } = useApp();
  return (
    <BareScreen>
    <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: "100%", padding: 28 }}>
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        style={{
          width: 92, height: 92, borderRadius: 26, display: "grid", placeItems: "center",
          background: "var(--surface-2)", border: "1px solid var(--gold-600)",
          marginBottom: 28, boxShadow: "var(--sh-gold)",
        }}
      >
        <img src="/enor-logo-white.png" alt="eNor" style={{ width: 52, height: 52, objectFit: "contain" }} />
      </motion.div>
      <motion.h1 initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="t-display mb-3">
        eNor <span className="gold-text">Card</span>
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="t-body mb-10" style={{ maxWidth: 260 }}>
        O cartão que transforma seu portfólio cripto em poder de compra global.
      </motion.p>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }} style={{ width: "100%" }}>
        <Button onClick={() => nav("phone")}>Criar minha conta</Button>
        <button onClick={() => jump("home", "home")} style={{ marginTop: 14, background: "none", border: "none", color: "var(--gold-300)", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15, cursor: "pointer", width: "100%" }}>
          Já tenho conta
        </button>
      </motion.div>
    </div>
    </BareScreen>
  );
}

export function Phone() {
  const { nav } = useApp();
  return (
    <Screen fixedCta={<Button onClick={() => nav("otp")}>Continuar</Button>}>
      <Header back />
      <Steps total={4} active={1} />
      <h1 className="t-h1 mb-2">Qual o seu número?</h1>
      <p className="t-body mb-7">Enviaremos um código de verificação por SMS.</p>
      <Field label="Telefone">
        <Input type="tel" defaultValue="+55 11 98765-4321" />
      </Field>
      <p className="t-xs">Ao continuar, você concorda em receber mensagens de verificação.</p>
    </Screen>
  );
}

export function Otp() {
  const { nav } = useApp();
  return (
    <Screen fixedCta={<Button onClick={() => nav("passcode")}>Verificar</Button>}>
      <Header back />
      <Steps total={4} active={2} />
      <h1 className="t-h1 mb-2">Confirme o código</h1>
      <p className="t-body mb-7">Enviamos um SMS para +55 11 98765-4321.</p>
      <div className="flex gap-2 justify-between mb-6">
        {["4", "8", "2", "9", "1", "0"].map((d, i) => (
          <div key={i} className="grid place-items-center t-amount" style={{ width: 48, height: 58, borderRadius: 14, background: "var(--surface-2)", border: "1px solid var(--hairline)", fontSize: 22 }}>
            {d}
          </div>
        ))}
      </div>
      <p className="t-xs text-center">Reenviar em <span style={{ color: "var(--gold-300)" }}>0:42</span></p>
    </Screen>
  );
}

export function Passcode() {
  const { nav, screen } = useApp();
  const [code, setCode] = useState("");
  const isLogin = screen === "passcode-login";
  const press = (k: string) => {
    if (k === "del") return setCode((c) => c.slice(0, -1));
    if (code.length >= 6) return;
    const next = code + k;
    setCode(next);
    if (next.length === 6) setTimeout(() => nav(isLogin ? "kyc-approved" : "terms1", { replace: true }), 260);
  };
  return (
    <BareScreen>
    <div className="flex flex-col" style={{ minHeight: "100%", padding: "8px 24px 28px" }}>
      <Header back={!isLogin} transparent />
      <div className="flex flex-col items-center" style={{ marginTop: isLogin ? 40 : 8 }}>
        {isLogin && (
          <div style={{ width: 60, height: 60, borderRadius: 18, background: "var(--surface-2)", border: "1px solid var(--gold-600)", boxShadow: "var(--sh-gold)", display: "grid", placeItems: "center", marginBottom: 18 }}><img src="/enor-logo-white.png" alt="eNor" style={{ width: 34, height: 34, objectFit: "contain" }} /></div>
        )}
        <h1 className="t-h1 mb-1 text-center">{isLogin ? "Olá, Marina" : "Crie seu passcode"}</h1>
        <p className="t-sm mb-7 text-center">{isLogin ? "Digite seu passcode para entrar" : "6 dígitos para proteger sua conta"}</p>
        <div className="flex gap-3.5 mb-9" style={{ gap: 14 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ width: 14, height: 14, borderRadius: 99, transition: "all .2s", transform: i < code.length ? "scale(1.15)" : "none", background: i < code.length ? "var(--gold-400)" : "transparent", border: `2px solid ${i < code.length ? "var(--gold-400)" : "var(--surface-3)"}` }} />
          ))}
        </div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: 12, maxWidth: 292, margin: "0 auto", width: "100%" }}>
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((k, i) =>
          k === "" ? (
            <div key={i} />
          ) : (
            <motion.button
              key={i}
              whileTap={{ scale: 0.92, background: "var(--surface-3)" }}
              onClick={() => press(k)}
              className="grid place-items-center"
              style={{ height: 62, borderRadius: 16, background: "var(--surface-2)", border: "1px solid var(--hairline-cool)", color: "var(--ink-1)", fontSize: 22, fontFamily: "var(--font-display)", fontWeight: 500, cursor: "pointer" }}
            >
              {k === "del" ? <Delete size={20} color="var(--ink-3)" /> : k}
            </motion.button>
          )
        )}
      </div>
    </div>
    </BareScreen>
  );
}

export function Terms1() {
  const { nav, flags, setFlag } = useApp();
  const ok = flags.terms1;
  return (
    <Screen fixedCta={<Button disabled={!ok} onClick={() => nav("profile")}>Aceitar e continuar</Button>}>
      <Header back />
      <Steps total={4} active={3} />
      <h1 className="t-h1 mb-1">Termos da conta</h1>
      <p className="t-sm mb-5">Aceite 1 — termos da plataforma, separado do contrato de crédito.</p>
      <Panel style={{ maxHeight: 230, overflowY: "auto", padding: 18 }}>
        <p className="t-sm"><b style={{ color: "var(--ink-1)" }}>1. Objeto.</b> Estes termos regulam o uso da conta eNor Card, plataforma de serviços financeiros da Enor Securities.</p>
        <p className="t-sm mt-3"><b style={{ color: "var(--ink-1)" }}>2. Elegibilidade.</b> Pessoas físicas maiores de 18 anos, residentes no Brasil.</p>
        <p className="t-sm mt-3"><b style={{ color: "var(--ink-1)" }}>3. Privacidade.</b> Dados tratados conforme a LGPD e nossa Política de Privacidade.</p>
        <p className="t-sm mt-3"><b style={{ color: "var(--ink-1)" }}>4. Segurança.</b> Você é responsável por manter passcode e dispositivo seguros.</p>
      </Panel>
      <div onClick={() => setFlag("terms1", !ok)} className="flex items-start gap-3 mt-4" style={{ cursor: "pointer" }}>
        <div className="grid place-items-center" style={{ width: 24, height: 24, borderRadius: 7, marginTop: 1, flexShrink: 0, background: ok ? "var(--grad-gold)" : "transparent", border: `2px solid ${ok ? "transparent" : "var(--surface-3)"}`, color: "#241a08", fontSize: 13, fontWeight: 800 }}>
          {ok ? "✓" : ""}
        </div>
        <span className="t-sm">Li e aceito os Termos da Conta eNor e a Política de Privacidade</span>
      </div>
    </Screen>
  );
}

export function Profile() {
  const { nav } = useApp();
  return (
    <Screen fixedCta={<Button onClick={() => nav("kyc-redirect")}>Continuar para verificação</Button>}>
      <Header back />
      <h1 className="t-h1 mb-1">Seus dados</h1>
      <p className="t-sm mb-5">Informações para abertura da conta PF.</p>
      <Field label="Nome completo"><Input defaultValue="Marina Costa" /></Field>
      <Field label="CPF"><Input defaultValue="123.456.789-00" /></Field>
      <Field label="E-mail"><Input defaultValue="marina.costa@email.com" /></Field>
      <Field label="Endereço"><Input defaultValue="Av. Brigadeiro Faria Lima, 3477 — SP" /></Field>
      <Panel className="flex items-center justify-between" style={{ padding: 14 }}>
        <span className="t-sm">Pessoa politicamente exposta (PEP)?</span>
        <Badge tone="neutral">Não</Badge>
      </Panel>
    </Screen>
  );
}

export function KycRedirect() {
  const { nav } = useApp();
  return (
    <Screen fixedCta={<Button onClick={() => nav("kyc-pending")}>Iniciar verificação</Button>}>
      <Header back />
      <div className="flex flex-col items-center text-center mt-4 mb-6">
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="grid place-items-center mb-5" style={{ width: 88, height: 88, borderRadius: 26, background: "var(--grad-gold-soft)", border: "1px solid var(--hairline)" }}>
          <ScanFace size={40} color="var(--gold-300)" />
        </motion.div>
        <h1 className="t-h1 mb-2">Verifique sua identidade</h1>
        <p className="t-body" style={{ maxWidth: 280 }}>Você será direcionado ao nosso parceiro de KYC. Leva cerca de 3 minutos.</p>
      </div>
      {[
        { Icon: FileText, t: "Documento com foto", s: "RG, CNH ou passaporte" },
        { Icon: ScanFace, t: "Selfie com prova de vida", s: "Validação biométrica" },
        { Icon: ShieldCheck, t: "Dados protegidos", s: "Criptografia ponta a ponta" },
      ].map(({ Icon, t, s }) => (
        <Panel key={t} className="flex items-center gap-3 mb-3" style={{ padding: 14 }}>
          <div className="grid place-items-center" style={{ width: 42, height: 42, borderRadius: 13, background: "var(--surface-2)" }}><Icon size={20} color="var(--gold-300)" /></div>
          <div><div className="t-h3" style={{ fontSize: 14.5 }}>{t}</div><div className="t-xs">{s}</div></div>
        </Panel>
      ))}
      <Panel className="mt-1" style={{ background: "rgba(79,214,160,0.06)", border: "1px solid rgba(79,214,160,0.2)" }}>
        <div className="t-label mb-2" style={{ color: "var(--success)" }}>Dicas para aprovar de primeira</div>
        {[
          "Use boa iluminação e evite reflexos ao fotografar",
          "Envie um documento oficial válido e dentro da validade",
          "Selecione corretamente o tipo de documento (RG, CNH ou passaporte)",
        ].map((tip) => (
          <div key={tip} className="flex gap-2" style={{ padding: "5px 0" }}>
            <CheckCircle2 size={15} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} />
            <span className="t-sm">{tip}</span>
          </div>
        ))}
      </Panel>
    </Screen>
  );
}

export function KycPending() {
  const { nav } = useApp();
  return (
    <BareScreen>
    <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: "100%", padding: 32 }}>
      <Badge tone="warning">Em análise</Badge>
      <div className="my-7"><Spinner size={44} /></div>
      <h1 className="t-h1 mb-2">Verificando identidade</h1>
      <p className="t-body mb-2" style={{ maxWidth: 280 }}>Seus documentos foram enviados. A análise costuma levar até 2 dias úteis.</p>
      <p className="t-xs" style={{ maxWidth: 260 }}>Enquanto isso, você ainda não pode depositar colateral ou solicitar cartão.</p>
      <div className="mt-8" style={{ width: "100%" }}>
        <Button variant="glass" onClick={() => nav("kyc-approved", { replace: true })}>Simular aprovação →</Button>
        <button onClick={() => nav("kyc-rejected", { replace: true })} style={{ marginTop: 12, background: "none", border: "none", color: "var(--ink-3)", fontSize: 13, cursor: "pointer" }}>Simular recusa</button>
      </div>
    </div>
    </BareScreen>
  );
}

export function KycRejected() {
  const { nav } = useApp();
  return (
    <Screen fixedCta={<><Button onClick={() => nav("kyc-redirect")}>Tentar novamente</Button><Button variant="glass" full style={{ marginTop: 10 }} onClick={() => nav("support")}>Falar com suporte</Button></>}>
      <Header back />
      <div className="flex flex-col items-center text-center mt-8">
        <XCircle size={64} color="var(--danger)" />
        <Badge tone="danger">Não aprovado</Badge>
        <h1 className="t-h1 mt-4 mb-2">Verificação não concluída</h1>
        <p className="t-body" style={{ maxWidth: 280 }}>Não conseguimos validar seus documentos. Verifique a qualidade das fotos e tente novamente.</p>
      </div>
    </Screen>
  );
}

export function KycApproved() {
  const { jump } = useApp();
  return (
    <BareScreen>
    <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: "100%", padding: 32 }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14 }} className="grid place-items-center mb-6" style={{ width: 92, height: 92, borderRadius: "50%", background: "rgba(79,214,160,0.14)" }}>
        <CheckCircle2 size={48} color="var(--success)" />
      </motion.div>
      <h1 className="t-h1 mb-2">Conta verificada</h1>
      <p className="t-body mb-8" style={{ maxWidth: 280 }}>Sua identidade foi confirmada. Agora você pode ativar seu crédito colateralizado.</p>
      <div style={{ width: "100%" }}>
        <Button onClick={() => jump("credit-intro")}>Ativar meu crédito</Button>
        <button onClick={() => jump("home", "home")} style={{ marginTop: 12, background: "none", border: "none", color: "var(--ink-3)", fontSize: 13.5, cursor: "pointer" }}>Explorar o app primeiro</button>
      </div>
    </div>
    </BareScreen>
  );
}
