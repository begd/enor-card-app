"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Compass, X, Signal, Wifi, BatteryFull } from "lucide-react";
import { StoreProvider, useApp } from "@/lib/store";
import { Overlays } from "@/components/ui";

import { Splash, Phone, Otp, Passcode, Terms1, Profile, KycRedirect, KycPending, KycRejected, KycApproved } from "@/components/screens/onboarding";
import { HomeScreen } from "@/components/screens/home";
import { WalletScreen, AssetDetail, Collateral, CollateralDeposit, CollateralProcessing, TopUp, TopUpTracking, Transfer, Swap, TransferSuccess } from "@/components/screens/wallet";
import { CreditIntro, CreditPrecontract, Terms2, LimitApproved, LimitDetails } from "@/components/screens/credit";
import { CardsScreen, CardProductInfo, CardCreateVirtual, CardSetPin, CardDetails, CardRequestPhysical, CardDelivery, CardActivate } from "@/components/screens/cards";
import { ActivityScreen, TxDetail } from "@/components/screens/activity";
import { DisputeReason, DisputeEvidence, DisputeConfirm, DisputeSuccess, DisputeList, DisputeDetail, HelpScreen, Faq, Support } from "@/components/screens/support";
import { SuccessView } from "@/components/screens/wallet";
import { Screen, Header, Button } from "@/components/ui";
import { CardVisual } from "@/components/pieces";
import { CARDS } from "@/lib/data";
import { motion as m } from "framer-motion";

/* small success screens defined inline */
function CardCreateSuccess() {
  const { jump, nav } = useApp();
  return (
    <Screen fixedCta={<><Button onClick={() => jump("home", "home")}>Ir para o início</Button><Button variant="glass" full style={{ marginTop: 10 }} onClick={() => nav("card-product-info")}>Emitir outro cartão</Button></>}>
      <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: "40%" }}>
        <h1 className="t-h1 mb-1 mt-4">Cartão emitido</h1>
        <p className="t-body mb-6">Seu cartão virtual •••• 4821 já está ativo.</p>
      </div>
      <m.div initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 120, damping: 16 }}>
        <CardVisual card={CARDS[1]} />
      </m.div>
    </Screen>
  );
}
function CardActivateSuccess() {
  const { jump } = useApp();
  return <SuccessView title="Cartão ativado" subtitle="Seu eNor Obsidian •••• 3367 está pronto para uso em todo o mundo." cta="Ir para o início" onCta={() => jump("home", "home")} />;
}
function SupportSuccess() {
  const { jump } = useApp();
  return <SuccessView title="Mensagem enviada" subtitle="Responderemos em até 1 dia útil no e-mail marina.costa@email.com." cta="Voltar para Ajuda" onCta={() => jump("help", "help")} icon="✉" />;
}

const REGISTRY: Record<string, React.ComponentType> = {
  splash: Splash, phone: Phone, otp: Otp, passcode: Passcode, "passcode-login": Passcode,
  terms1: Terms1, profile: Profile, "kyc-redirect": KycRedirect, "kyc-pending": KycPending,
  "kyc-rejected": KycRejected, "kyc-approved": KycApproved,
  home: HomeScreen,
  wallet: WalletScreen, "asset-detail": AssetDetail, collateral: Collateral,
  "collateral-deposit": CollateralDeposit, "collateral-processing": CollateralProcessing,
  topup: TopUp, "topup-tracking": TopUpTracking, transfer: Transfer, "transfer-success": TransferSuccess, swap: Swap,
  "credit-intro": CreditIntro, "credit-precontract": CreditPrecontract, terms2: Terms2,
  "limit-approved": LimitApproved, "limit-details": LimitDetails,
  cards: CardsScreen, "card-product-info": CardProductInfo, "card-create-virtual": CardCreateVirtual,
  "card-set-pin": CardSetPin, "card-details": CardDetails,
  "card-create-success": CardCreateSuccess, "card-request-physical": CardRequestPhysical,
  "card-delivery": CardDelivery, "card-activate": CardActivate, "card-activate-success": CardActivateSuccess,
  activity: ActivityScreen, "tx-detail": TxDetail,
  "dispute-reason": DisputeReason, "dispute-evidence": DisputeEvidence, "dispute-confirm": DisputeConfirm,
  "dispute-success": DisputeSuccess, "dispute-list": DisputeList, "dispute-detail": DisputeDetail,
  help: HelpScreen, faq: Faq, support: Support, "support-success": SupportSuccess,
};

const FLOWS: { group: string; items: [string, string, string?][] }[] = [
  { group: "F1 · Onboarding & KYC", items: [["splash", "Boas-vindas"], ["phone", "Telefone"], ["otp", "Código SMS"], ["passcode", "Criar passcode"], ["terms1", "Termos (Aceite 1)"], ["profile", "Dados cadastrais"], ["kyc-redirect", "Verificação KYC"], ["kyc-pending", "KYC em análise"], ["kyc-approved", "KYC aprovado"], ["kyc-rejected", "KYC recusado"]] },
  { group: "Cripto · Wallet", items: [["wallet", "Portfólio", "wallet"], ["asset-detail", "Detalhe do ativo"], ["collateral", "Colateral & LTV"], ["topup", "Depositar cripto"], ["topup-tracking", "Depósito · confirmações"], ["transfer", "Sacar cripto"], ["swap", "Converter"]] },
  { group: "F2 · Crédito", items: [["credit-intro", "Ativar crédito"], ["credit-precontract", "Pré-contratual"], ["terms2", "Contrato (Aceite 2)"], ["collateral-deposit", "Depositar garantia"], ["limit-approved", "Limite aprovado"], ["limit-details", "Limite & crédito"]] },
  { group: "F3 · Emissão", items: [["card-product-info", "Novo cartão"], ["card-create-virtual", "Criar virtual"], ["card-set-pin", "Definir PIN"], ["card-details", "Dados do cartão"], ["card-create-success", "Virtual emitido"], ["card-request-physical", "Solicitar físico"], ["card-delivery", "Rastrear entrega"], ["card-activate", "Ativar físico"], ["card-activate-success", "Físico ativado"]] },
  { group: "F4 · Uso diário", items: [["home", "Início", "home"], ["cards", "Cartões", "cards"], ["activity", "Extrato", "activity"], ["tx-detail", "Detalhe da transação"]] },
  { group: "F5 · Disputas & Suporte", items: [["dispute-reason", "Contestar"], ["dispute-evidence", "Evidências"], ["dispute-confirm", "Revisar"], ["dispute-success", "Aberta"], ["dispute-list", "Minhas disputas"], ["help", "Ajuda", "help"], ["faq", "FAQ"], ["support", "Suporte"]] },
];

function ScreenHost() {
  const { screen, direction } = useApp();
  const Comp = REGISTRY[screen] || Splash;
  return (
    <AnimatePresence mode="popLayout" custom={direction} initial={false}>
      <motion.div
        key={screen}
        custom={direction}
        initial={{ opacity: 0, x: direction * 26 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction * -26 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "absolute", inset: 0, overflow: "hidden" }}
      >
        <Comp />
      </motion.div>
    </AnimatePresence>
  );
}

function FlowNavigator() {
  const [open, setOpen] = useState(false);
  const { jump, screen } = useApp();
  return (
    <>
      <button onClick={() => setOpen((o) => !o)} className="grid place-items-center" style={{ position: "fixed", left: 22, bottom: 22, zIndex: 100, width: 48, height: 48, borderRadius: 99, background: "var(--grad-gold)", color: "#241a08", border: "none", cursor: "pointer", boxShadow: "var(--sh-gold)" }} aria-label="Navegar telas">
        {open ? <X size={20} /> : <Compass size={22} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="glass" style={{ position: "fixed", left: 22, bottom: 82, zIndex: 100, width: 300, maxHeight: "70vh", overflowY: "auto", borderRadius: 20, padding: 16, boxShadow: "var(--sh-lg)" }}>
            <div className="t-label mb-1">Navegar protótipo</div>
            {FLOWS.map((f) => (
              <div key={f.group} className="mb-2">
                <div className="t-xs" style={{ color: "var(--gold-400)", fontWeight: 700, margin: "10px 0 4px" }}>{f.group}</div>
                {f.items.map(([id, label, tab]) => (
                  <button key={id} onClick={() => { jump(id, tab); setOpen(false); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13.5, background: screen === id ? "var(--surface-3)" : "transparent", color: screen === id ? "var(--gold-300)" : "var(--ink-2)" }}>{label}</button>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function PhoneShell() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <span className="t-label" style={{ fontSize: 10 }}>eNor Card · Protótipo · Validação Stakeholders</span>
      <div
        style={{
          position: "relative",
          width: 390,
          height: "min(844px, calc(100dvh - 72px))",
          background: "var(--obsidian)",
          borderRadius: 46,
          border: "3px solid #23283a",
          boxShadow: "var(--sh-lg), 0 0 0 1px rgba(255,255,255,0.03)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* notch */}
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 128, height: 30, background: "#000", borderRadius: "0 0 20px 20px", zIndex: 40 }} />
        {/* status bar */}
        <div className="flex items-center justify-between" style={{ height: 46, padding: "14px 30px 0", fontSize: 12.5, fontWeight: 600, position: "relative", zIndex: 30, flexShrink: 0 }}>
          <span className="t-mono">9:41</span>
          <span className="flex items-center gap-1.5"><Signal size={14} /><Wifi size={14} /><BatteryFull size={18} /></span>
        </div>
        {/* app viewport */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "var(--grad-hero)" }}>
          <ScreenHost />
          <Overlays />
        </div>
      </div>
    </div>
  );
}

export default function Prototype() {
  return (
    <StoreProvider>
      <PhoneShell />
      <FlowNavigator />
    </StoreProvider>
  );
}
