"use client";

import dynamic from "next/dynamic";

const CyberOceanBackground = dynamic(() => import("./CyberOceanBackground"), {
  ssr: false,
  loading: () => <div className="cyber-ocean-bg cyber-ocean-fallback" aria-hidden />,
});

export function OceanBackdrop() {
  return <CyberOceanBackground />;
}
