"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(true);

  // Effect 1: detect touch — runs once, triggers re-render on desktop
  useEffect(() => {
    if (!window.matchMedia("(hover: none)").matches) {
      setIsTouch(false);
    }
  }, []);

  // Effect 2: set up GSAP only after cursor elements are mounted (isTouch === false)
  useEffect(() => {
    if (isTouch) return;

    const dot  = dotRef.current!;
    const ring = ringRef.current!;

    // Let GSAP own the full transform — xPercent/yPercent handles centering
    // so there's no conflict with inline CSS transform
    gsap.set(dot,  { xPercent: -50, yPercent: -50 });
    gsap.set(ring, { xPercent: -50, yPercent: -50 });

    const xDot  = gsap.quickTo(dot,  "x", { duration: 0.04 });
    const yDot  = gsap.quickTo(dot,  "y", { duration: 0.04 });
    const xRing = gsap.quickTo(ring, "x", { duration: 0.2, ease: "power3.out" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.2, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      xDot(e.clientX); yDot(e.clientY);
      xRing(e.clientX); yRing(e.clientY);
    };
    const onEnter = () => gsap.to(ring, { scale: 1.8, duration: 0.25, ease: "power2.out" });
    const onLeave = () => gsap.to(ring, { scale: 1,   duration: 0.25, ease: "power2.out" });

    window.addEventListener("mousemove", onMove);
    document.querySelectorAll("a, button, [data-cursor]").forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });
    return () => window.removeEventListener("mousemove", onMove);
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 9999,
          width: 6, height: 6,
          background: "#fff", borderRadius: "50%",
          willChange: "transform",
          mixBlendMode: "difference",
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 9998,
          width: 28, height: 28,
          border: "1.5px solid #fff", borderRadius: "50%",
          willChange: "transform",
          mixBlendMode: "difference",
        }}
      />
    </>
  );
}
