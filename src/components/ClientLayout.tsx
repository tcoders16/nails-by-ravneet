"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/cursor/CustomCursor"), { ssr: false });
const ParticleField = dynamic(() => import("@/components/particles/ParticleField"), { ssr: false });
const SmoothScrollProvider = dynamic(() => import("@/providers/SmoothScrollProvider"), { ssr: false });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      <CustomCursor />
      <ParticleField />
      {children}
    </SmoothScrollProvider>
  );
}
