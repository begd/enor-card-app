"use client";

import dynamic from "next/dynamic";

const Prototype = dynamic(() => import("@/components/Prototype"), { ssr: false });

export default function Page() {
  return <Prototype />;
}
