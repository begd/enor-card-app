"use client";

import React, { createContext, useContext, useCallback, useRef, useState } from "react";

export type ScreenId = string;

type Toast = { id: number; msg: string; type: "success" | "error" | "info" };

type Store = {
  screen: ScreenId;
  tab: string;
  direction: number;
  nav: (to: ScreenId, opts?: { replace?: boolean }) => void;
  back: () => void;
  goTab: (tab: ScreenId) => void;
  jump: (to: ScreenId, tab?: string) => void;

  // domain state
  frozen: Record<string, boolean>;
  revealed: Record<string, boolean>;
  toggleFreeze: (id: string) => boolean;
  toggleReveal: (id: string) => void;

  flags: Record<string, boolean>;
  setFlag: (k: string, v: boolean) => void;

  vars: Record<string, string>;
  setVar: (k: string, v: string) => void;

  // toast
  toasts: Toast[];
  toast: (msg: string, type?: Toast["type"]) => void;

  // sheet
  sheet: React.ReactNode | null;
  openSheet: (node: React.ReactNode) => void;
  closeSheet: () => void;
};

const Ctx = createContext<Store | null>(null);

export function useApp() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useApp outside provider");
  return s;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = useState<ScreenId>("splash");
  const [tab, setTab] = useState("home");
  const [direction, setDirection] = useState(1);
  const history = useRef<ScreenId[]>([]);

  const [frozen, setFrozen] = useState<Record<string, boolean>>({ c3: true });
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [vars, setVars] = useState<Record<string, string>>({
    crypto: "btc",
    collateral: "0.35",
    reason: "Não reconheço esta compra",
  });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [sheet, setSheet] = useState<React.ReactNode | null>(null);

  const nav = useCallback((to: ScreenId, opts?: { replace?: boolean }) => {
    setDirection(1);
    setScreen((cur) => {
      if (!opts?.replace && cur !== to) history.current.push(cur);
      return to;
    });
    setSheet(null);
  }, []);

  const back = useCallback(() => {
    setDirection(-1);
    setSheet(null);
    const prev = history.current.pop();
    if (prev) {
      setScreen(prev);
    } else {
      // no history (e.g. arrived via jump/dev menu) — fall back to the active tab
      setScreen((cur) => (cur === tab ? cur : tab));
    }
  }, [tab]);

  const goTab = useCallback((t: ScreenId) => {
    setDirection(1);
    history.current = [];
    setTab(t);
    setScreen(t);
    setSheet(null);
  }, []);

  const jump = useCallback((to: ScreenId, t?: string) => {
    history.current = [];
    setDirection(1);
    if (t) setTab(t);
    setScreen(to);
    setSheet(null);
  }, []);

  const toggleFreeze = useCallback((id: string) => {
    let next = false;
    setFrozen((f) => {
      next = !f[id];
      return { ...f, [id]: next };
    });
    return next;
  }, []);

  const toggleReveal = useCallback((id: string) => {
    setRevealed((r) => ({ ...r, [id]: !r[id] }));
  }, []);

  const setFlag = useCallback((k: string, v: boolean) => setFlags((f) => ({ ...f, [k]: v })), []);
  const setVar = useCallback((k: string, v: string) => setVars((x) => ({ ...x, [k]: v })), []);

  const toast = useCallback((msg: string, type: Toast["type"] = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const openSheet = useCallback((node: React.ReactNode) => setSheet(node), []);
  const closeSheet = useCallback(() => setSheet(null), []);

  return (
    <Ctx.Provider
      value={{
        screen, tab, direction, nav, back, goTab, jump,
        frozen, revealed, toggleFreeze, toggleReveal,
        flags, setFlag, vars, setVar,
        toasts, toast, sheet, openSheet, closeSheet,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
