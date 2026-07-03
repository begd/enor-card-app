/* ============================================================
   Mock data — eNor Card (PayCaddy · crédito colateralizado)
   Valores realistas para validação com stakeholders high-ticket
   ============================================================ */

export type CryptoAsset = {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  priceUsd: number;
  change24h: number;
  color: string;
  collateralized?: number; // amount locked as collateral
};

export type CardItem = {
  id: string;
  tier: "obsidian" | "gold";
  type: "virtual" | "physical";
  label: string;
  last4: string;
  pan: string;
  cvv: string;
  expiry: string;
  status: "active" | "delivering" | "inactive";
  frozen: boolean;
  spendingLimit: number; // monthly limit in BRL
  spentThisMonth: number;
};

export type DepositNetwork = {
  id: string;
  name: string; // e.g. "Bitcoin"
  standard: string; // e.g. "Native SegWit", "ERC-20", "TRC-20"
  address: string;
  addressPrefix: string; // format hint (bc1..., 0x..., T...)
  memo?: string; // destination tag / memo when required
  minDeposit: string; // human string with unit
  confirmations: number; // required confirmations
  etaLabel: string; // estimated arrival
  networkFee: string; // approximate fee
  recommended?: boolean;
};

export type Tx = {
  id: string;
  merchant: string;
  icon: string;
  amountBrl: number;
  date: string;
  cardId: string;
  country: string;
  authCode: string;
  category: string;
};

export const USD_BRL = 5.42;

export const CRYPTO: CryptoAsset[] = [
  { id: "btc", symbol: "BTC", name: "Bitcoin", balance: 0.412, priceUsd: 98500, change24h: 2.34, color: "#f7931a", collateralized: 0.342 },
  { id: "eth", symbol: "ETH", name: "Ethereum", balance: 3.8, priceUsd: 3420, change24h: -1.12, color: "#8ea2f5", collateralized: 1.5 },
  { id: "usdc", symbol: "USDC", name: "USD Coin", balance: 4200, priceUsd: 1, change24h: 0.01, color: "#3b8ff0", collateralized: 0 },
];

export const CREDIT = {
  limitTotal: 82000,
  limitUsed: 17604.5,
  get limitAvailable() {
    return this.limitTotal - this.limitUsed;
  },
  collateralUsd: 46520,
  ltv: 34, // healthy
  ltvMax: 67,
  liquidationLtv: 83,
};

export const CARDS: CardItem[] = [
  { id: "c1", tier: "obsidian", type: "physical", label: "eNor Obsidian", last4: "3367", pan: "4532 8810 2244 3367", cvv: "503", expiry: "09/29", status: "active", frozen: false, spendingLimit: 82000, spentThisMonth: 17604.5 },
  { id: "c2", tier: "gold", type: "virtual", label: "Compras online", last4: "4821", pan: "4532 8810 2244 4821", cvv: "847", expiry: "09/29", status: "active", frozen: false, spendingLimit: 15000, spentThisMonth: 389.9 },
  { id: "c3", tier: "gold", type: "virtual", label: "Assinaturas", last4: "9103", pan: "4532 8810 2244 9103", cvv: "291", expiry: "09/29", status: "active", frozen: true, spendingLimit: 2000, spentThisMonth: 77.8 },
];

/* ── Deposit networks per asset (market-standard: unambiguous network choice) ── */
export const DEPOSIT_NETWORKS: Record<string, DepositNetwork[]> = {
  btc: [
    { id: "btc-native", name: "Bitcoin", standard: "Native SegWit (bech32)", address: "bc1q9x7f2enor4k7d8s3m0p5htz6q9wj2v4f8n1a2k7", addressPrefix: "bc1...", minDeposit: "0,0002 BTC", confirmations: 2, etaLabel: "~20–40 min", networkFee: "pago pelo remetente", recommended: true },
    { id: "btc-lightning", name: "Lightning", standard: "BOLT11", address: "lnbc1penor9x8s...4f2k7dq9wj2v4f8n", addressPrefix: "lnbc...", minDeposit: "0,00001 BTC", confirmations: 0, etaLabel: "instantâneo", networkFee: "< $0,01" },
  ],
  eth: [
    { id: "eth-erc20", name: "Ethereum", standard: "ERC-20", address: "0x8Ac7e4F1eNor2b9C4d5e6F7a8B9c0D1e2F3a4B5c", addressPrefix: "0x...", minDeposit: "0,005 ETH", confirmations: 12, etaLabel: "~3–5 min", networkFee: "~$1,80", recommended: true },
    { id: "eth-arbitrum", name: "Arbitrum One", standard: "L2", address: "0x3Fb2c1eNor9d8e7F6a5B4c3D2e1F0a9B8c7D6e5F", addressPrefix: "0x...", minDeposit: "0,002 ETH", confirmations: 20, etaLabel: "~1–2 min", networkFee: "~$0,10" },
  ],
  usdc: [
    { id: "usdc-erc20", name: "Ethereum", standard: "ERC-20", address: "0x9Bd4a2eNor1c3e5F7a9B1c3D5e7F9a1B3c5D7e9F", addressPrefix: "0x...", minDeposit: "10 USDC", confirmations: 12, etaLabel: "~3–5 min", networkFee: "~$1,50" },
    { id: "usdc-solana", name: "Solana", standard: "SPL", address: "EnoR7x8s3m0p5htz6q9wj2v4f8n1a2k7d4B5c6D7e8F9", addressPrefix: "Base58", minDeposit: "1 USDC", confirmations: 1, etaLabel: "~10 seg", networkFee: "< $0,01", recommended: true },
    { id: "usdc-tron", name: "Tron", standard: "TRC-20", address: "TEnoR9x8s3m0p5htz6q9wj2v4f8n1a2k7d", addressPrefix: "T...", memo: "8827194", minDeposit: "1 USDC", confirmations: 1, etaLabel: "~1 min", networkFee: "~$1,00" },
  ],
};

export const TXS: Tx[] = [
  { id: "t1", merchant: "Apple Store", icon: "", amountBrl: -12990, date: "2026-07-03T11:20:00", cardId: "c1", country: "BR", authCode: "AP8321", category: "Tecnologia" },
  { id: "t2", merchant: "Emirates", icon: "", amountBrl: -8740, date: "2026-07-02T09:12:00", cardId: "c1", country: "AE", authCode: "EK1120", category: "Viagem" },
  { id: "t3", merchant: "Netflix", icon: "", amountBrl: -55.9, date: "2026-07-02T08:00:00", cardId: "c3", country: "US", authCode: "NF4471", category: "Assinatura" },
  { id: "t4", merchant: "Erax Steakhouse", icon: "", amountBrl: -1287, date: "2026-07-01T21:45:00", cardId: "c1", country: "BR", authCode: "ER2210", category: "Restaurante" },
  { id: "t5", merchant: "Amazon", icon: "", amountBrl: -389.9, date: "2026-06-30T14:03:00", cardId: "c2", country: "BR", authCode: "AZ9931", category: "Compras" },
  { id: "t6", merchant: "Pagamento de fatura", icon: "", amountBrl: 15000, date: "2026-06-28T10:00:00", cardId: "c1", country: "BR", authCode: "PG0001", category: "Pagamento" },
  { id: "t7", merchant: "Spotify", icon: "", amountBrl: -21.9, date: "2026-06-27T08:00:00", cardId: "c3", country: "SE", authCode: "SP1180", category: "Assinatura" },
];

export const DISPUTES = [
  { id: "d1", protocol: "DSP-2026-004821", merchant: "Erax Steakhouse", amountBrl: 1287, reason: "Não reconheço esta compra", status: "in_review", date: "2026-06-29T10:00:00" },
];

export const DISPUTE_REASONS = [
  "Não reconheço esta compra",
  "Cobrança duplicada",
  "Valor diferente do combinado",
  "Produto ou serviço não recebido",
  "Cancelamento não processado",
];

export const FAQ = [
  { q: "Como adiciono fundos / deposito cripto?", a: "Vá em Cripto → Depositar, escolha o ativo (BTC, ETH ou USDC) e a rede, e envie para o endereço exibido (ou escaneie o QR Code). O saldo aparece após as confirmações da rede." },
  { q: "Como bloqueio meu cartão se eu perder ou for roubado?", a: "Em Cartões, toque em Congelar para bloquear na hora todas as compras e assinaturas recorrentes. Você pode descongelar quando quiser. Se precisar cancelar em definitivo, fale com o suporte." },
  { q: "O que faço se vir uma transação suspeita?", a: "Abra a transação no Extrato e toque em \"Não reconheço esta compra\". Você poderá descrever o ocorrido, anexar evidências e acompanhar o chargeback pelo app." },
  { q: "Posso usar meu cartão no exterior?", a: "Sim. O eNor Card é aceito internacionalmente. Você pode ativar ou desativar compras no exterior nas configurações de cada cartão." },
  { q: "Como atualizo o PIN do meu cartão?", a: "Em Cartões, toque em PIN → Alterar PIN e defina um novo código de 4 dígitos. Também é possível desbloquear o PIN pelo mesmo menu." },
  { q: "Como solicito um novo cartão se o meu quebrar?", a: "Em Cartões, toque em + para emitir um novo cartão virtual (instantâneo) ou solicitar um novo físico com entrega no endereço cadastrado." },
  { q: "O que faço se esquecer o PIN do cartão?", a: "Vá em Cartões → PIN. Você pode definir um novo PIN de 4 dígitos a qualquer momento, com confirmação, sem precisar do PIN antigo." },
  { q: "Como vejo meu histórico de transações?", a: "Toque em Extrato na barra inferior para ver todas as transações, filtrar por cartão e abrir os detalhes de cada compra." },
  { q: "Como o cartão colateralizado funciona?", a: "Você deposita cripto (BTC, ETH ou USDC) como garantia. Com base no valor do colateral, liberamos um limite de crédito. Seu cripto continua sendo seu — só fica bloqueado como garantia enquanto o crédito estiver ativo." },
  { q: "O que é LTV e por que ele importa?", a: "LTV (Loan-to-Value) é a razão entre o crédito utilizado e o valor do seu colateral. Quanto menor o LTV, mais saudável sua posição. Se o preço do cripto cair e o LTV se aproximar do limite de liquidação, avisamos para você reforçar o colateral." },
  { q: "Meu cripto pode ser liquidado?", a: "Apenas em cenário de inadimplência ou se o LTV atingir o nível de liquidação definido em contrato. Você recebe alertas antecipados para evitar isso." },
  { q: "Quais são os custos do cartão?", a: "A anuidade, taxas de saque e IOF aplicáveis são exibidos no seu contrato e no resumo de cada operação, sem cobranças ocultas." },
  { q: "Como reporto um problema técnico no app?", a: "Vá em Ajuda → Falar com suporte, selecione o assunto e descreva o problema. Nossa equipe responde em até 1 dia útil." },
];

/* ── Helpers ── */
export const brl = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export const usd = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

export const shortDate = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString())
    return `Hoje · ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return "Ontem";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
};

export const fullDate = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    return true;
  } catch {
    return false;
  }
};

export const portfolioUsd = () =>
  CRYPTO.reduce((s, a) => s + a.balance * a.priceUsd, 0);

export const collateralUsd = () =>
  CRYPTO.reduce((s, a) => s + (a.collateralized || 0) * a.priceUsd, 0);
