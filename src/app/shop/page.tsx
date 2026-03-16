"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { ShoppingBag, X, Plus, Minus, Sparkles, Wrench, Palette, ArrowRight, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { PRODUCTS, CATEGORIES, type Product } from "@/data/products";

const CustomCursor = dynamic(() => import("@/components/cursor/CustomCursor"), { ssr: false });

const EASE = [0.22, 1, 0.36, 1] as const;
interface CartItem { product: Product; qty: number; }

/* ─── Cart context ─── */
export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const filtered = useMemo(() =>
    activeCategory === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCategory),
    [activeCategory]
  );
  const featured = PRODUCTS.filter(p => p.featured);

  function addToCart(product: Product) {
    setCart(prev => {
      const idx = prev.findIndex(i => i.product.id === product.id);
      if (idx >= 0) { const n = [...prev]; n[idx] = { ...n[idx], qty: n[idx].qty + 1 }; return n; }
      return [...prev, { product, qty: 1 }];
    });
  }

  function updateQty(id: string, delta: number) {
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));
  }

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalCents = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const totalDisplay = `$${(totalCents / 100).toFixed(2)}`;

  async function handleCheckout() {
    if (!cart.length) return;
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart.map(i => ({ id: i.product.id, qty: i.qty })) }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch { /* ignore */ }
    setCheckoutLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", color: "#fff" }}>
      <CustomCursor />

      {/* ── NAVBAR ── */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "1.1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(10,10,10,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ fontFamily: "var(--font-great-vibes)", fontSize: "1.6rem", color: "#fff", lineHeight: 1 }}>Nails by Ravneet</div>
          <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.45rem", fontWeight: 500, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginTop: "3px" }}>Luxury Nail Studio</div>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <a href="/" style={{ fontFamily: "var(--font-poppins)", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", textDecoration: "none", letterSpacing: "0.08em" }}>← Back</a>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setCartOpen(true)}
            style={{ position: "relative", background: "#fff", border: "none", borderRadius: "100px", padding: "0.65rem 1.3rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", color: "#111" }}
          >
            <ShoppingBag size={15} />
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.68rem", fontWeight: 700 }}>
              {totalItems > 0 ? `${totalItems} · ${totalDisplay}` : "Cart"}
            </span>
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  style={{ position: "absolute", top: -7, right: -7, width: 20, height: 20, borderRadius: "50%", background: "#8B1930", color: "#fff", fontSize: "0.55rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-poppins)" }}>
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* ── HERO ── */}
      <div ref={heroRef} style={{ position: "relative", height: "100vh", minHeight: 600, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {/* Hero background image */}
        <div style={{ position: "absolute", inset: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/shop/shop-hero.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", filter: "brightness(0.35) saturate(1.2)" }} />
        </div>

        {/* Overlay gradients */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 20% 50%, rgba(139,25,48,0.4) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0A0A0A 0%, transparent 40%, transparent 60%, #0A0A0A 100%)" }} />

        {/* Grid texture */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "60px 60px", opacity: 0.5 }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity, position: "relative", zIndex: 1, textAlign: "center", maxWidth: 800, margin: "0 auto" }} className="px-6 md:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>✦ &nbsp; Ravneet&apos;s Curated Picks</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(3.5rem,10vw,7.5rem)", fontWeight: 700, lineHeight: 0.88, color: "#fff", marginTop: "1rem", marginBottom: "1.5rem" }}>
            Nail<br /><em style={{ color: "#C9A0A8" }}>Shop</em>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            style={{ fontFamily: "var(--font-poppins)", fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.8, maxWidth: 420, margin: "0 auto 2.5rem" }}>
            Professional-grade polishes, gel extensions & tools — handpicked for salon results at home.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
            onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            style={{ fontFamily: "var(--font-poppins)", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", background: "#fff", color: "#111", border: "none", borderRadius: "100px", padding: "1rem 2.2rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            Shop Now <ArrowRight size={14} />
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.2))" }} />
          <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>Scroll</span>
        </motion.div>
      </div>

      {/* ── FEATURED HORIZONTAL SCROLL ── */}
      <div style={{ background: "#111", padding: "5rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="px-6 md:px-10" style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2rem", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Bestsellers</span>
              <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 700, color: "#fff", lineHeight: 1, marginTop: "0.4rem" }}>
                Featured Picks
              </h2>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
            {featured.map((p, i) => (
              <FeaturedCard key={p.id} product={p} onAdd={(pr) => { addToCart(pr); setCartOpen(true); }} delay={i * 0.07}
                inCart={cart.find(c => c.product.id === p.id)?.qty ?? 0} />
            ))}
          </div>
        </div>
      </div>

      {/* ── PRODUCT GRID ── */}
      <div id="products" style={{ background: "#0A0A0A", padding: "5rem 0" }}>
        <div className="px-6 md:px-10" style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* Section header */}
          <div style={{ marginBottom: "2.5rem" }}>
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>All Products</span>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 700, color: "#fff", lineHeight: 1, marginTop: "0.4rem", marginBottom: "1.5rem" }}>
              Browse the Collection
            </h2>

            {/* Category pills */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {CATEGORIES.map(cat => (
                <motion.button key={cat.key} onClick={() => setActiveCategory(cat.key)}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  style={{
                    fontFamily: "var(--font-poppins)", fontSize: "0.7rem", fontWeight: 500,
                    display: "flex", alignItems: "center", gap: "0.4rem",
                    padding: "0.6rem 1.2rem", borderRadius: "100px", cursor: "pointer",
                    border: activeCategory === cat.key ? "1.5px solid #fff" : "1.5px solid rgba(255,255,255,0.12)",
                    background: activeCategory === cat.key ? "#fff" : "rgba(255,255,255,0.04)",
                    color: activeCategory === cat.key ? "#111" : "rgba(255,255,255,0.5)",
                    transition: "all 0.18s",
                  }}>
                  {cat.key === "polish" && <Palette size={13} />}
                  {cat.key === "extension" && <Sparkles size={13} />}
                  {cat.key === "tool" && <Wrench size={13} />}
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={i * 0.04}
                  inCart={cart.find(c => c.product.id === p.id)?.qty ?? 0}
                  onAdd={(pr) => { addToCart(pr); setCartOpen(true); }} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── CART DRAWER ── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 100 }} />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(440px,100vw)", background: "#111", zIndex: 101, display: "flex", flexDirection: "column", borderLeft: "1px solid rgba(255,255,255,0.08)" }}>

              {/* Header */}
              <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: "1.3rem", fontWeight: 700, color: "#fff" }}>Your Cart</div>
                  <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>
                    {totalItems === 0 ? "Empty" : `${totalItems} item${totalItems > 1 ? "s" : ""} · ${totalDisplay}`}
                  </div>
                </div>
                <button onClick={() => setCartOpen(false)} style={{ background: "rgba(255,255,255,0.07)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <X size={16} />
                </button>
              </div>

              {/* Items */}
              <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.5rem" }}>
                {cart.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                    <ShoppingBag size={40} style={{ color: "rgba(255,255,255,0.1)", margin: "0 auto 1rem", display: "block" }} />
                    <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.82rem", color: "rgba(255,255,255,0.25)" }}>Your cart is empty</p>
                    <button onClick={() => setCartOpen(false)} style={{ marginTop: "1rem", fontFamily: "var(--font-poppins)", fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                      Continue shopping
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {cart.map(({ product, qty }) => (
                      <motion.div key={product.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "0.9rem 1rem", background: "rgba(255,255,255,0.04)", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <div style={{ width: 44, height: 44, borderRadius: "10px", overflow: "hidden", flexShrink: 0, border: "1px solid rgba(255,255,255,0.1)", background: "#1a1a1a" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.78rem", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.name}</div>
                          <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.7rem", fontWeight: 700, color: "#C9A0A8", marginTop: "2px" }}>${((product.price * qty) / 100).toFixed(2)}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
                          <button onClick={() => updateQty(product.id, -1)} style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Minus size={10} />
                          </button>
                          <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.8rem", fontWeight: 600, color: "#fff", minWidth: 16, textAlign: "center" }}>{qty}</span>
                          <button onClick={() => updateQty(product.id, 1)} style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Plus size={10} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Checkout */}
              {cart.length > 0 && (
                <div style={{ padding: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>Subtotal</span>
                    <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.75rem", fontWeight: 700, color: "#fff" }}>{totalDisplay}</span>
                  </div>
                  <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.62rem", color: "rgba(255,255,255,0.2)", marginBottom: "1rem", lineHeight: 1.5 }}>
                    Shipping & taxes calculated at checkout.
                  </p>
                  <motion.button onClick={handleCheckout} disabled={checkoutLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    style={{ width: "100%", fontFamily: "var(--font-poppins)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: "linear-gradient(135deg, #8B1930 0%, #A0334A 100%)", color: "#fff", border: "none", borderRadius: "12px", padding: "1rem", cursor: checkoutLoading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", opacity: checkoutLoading ? 0.6 : 1 }}>
                    {checkoutLoading ? <><Loader2 size={14} className="animate-spin" />Redirecting…</> : <>Checkout with Stripe <ChevronRight size={14} /></>}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Featured Card (dark, large) ─── */
function FeaturedCard({ product, onAdd, delay, inCart }: { product: Product; onAdd: (p: Product) => void; delay: number; inCart: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: EASE }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: "24px", overflow: "hidden", cursor: "default",
        border: hovered ? "1.5px solid rgba(255,255,255,0.18)" : "1.5px solid rgba(255,255,255,0.07)",
        transition: "border-color 0.25s, box-shadow 0.25s",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      {/* Image */}
      <div style={{ height: 240, position: "relative", overflow: "hidden", background: product.shade ? `${product.shade}44` : "#1a1a1a" }}>
        <motion.div animate={{ scale: hovered ? 1.07 : 1 }} transition={{ duration: 0.6, ease: EASE }}
          style={{ position: "absolute", inset: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        </motion.div>

        {/* Shade color overlay for polish */}
        {product.shade && product.category === "polish" && (
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 30%, ${product.shade}88 100%)`, mixBlendMode: "color", opacity: 0.6 }} />
        )}

        {/* Dark gradient at bottom */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)" }} />

        {/* Category tag */}
        <div style={{ position: "absolute", top: "1rem", left: "1rem", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)", padding: "0.3rem 0.75rem", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.12)" }}>
          <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.52rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)" }}>
            {product.category === "polish" ? "Nail Polish" : product.category === "extension" ? "Extension" : "Tool"}
          </span>
        </div>

        {/* Price badge */}
        <div style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(0,0,0,0.65)", backdropFilter: "blur(10px)", padding: "0.3rem 0.75rem", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.72rem", fontWeight: 700, color: "#fff" }}>{product.displayPrice}</span>
        </div>
      </div>

      {/* Info */}
      <div style={{ background: "#1A1A1A", padding: "1.25rem" }}>
        <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.88rem", fontWeight: 700, color: "#fff", marginBottom: "0.4rem" }}>{product.name}</div>
        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.6, marginBottom: "1rem" }}>
          {product.description.slice(0, 75)}…
        </p>
        <div style={{ display: "flex", gap: "0.3rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          {product.tags.slice(0, 3).map(tag => (
            <span key={tag} style={{ fontFamily: "var(--font-poppins)", fontSize: "0.48rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.06)", padding: "0.2rem 0.55rem", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.08)" }}>
              {tag}
            </span>
          ))}
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => onAdd(product)}
          style={{ width: "100%", fontFamily: "var(--font-poppins)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", background: inCart > 0 ? "linear-gradient(135deg,#8B1930,#A0334A)" : "rgba(255,255,255,0.1)", color: "#fff", border: inCart > 0 ? "none" : "1.5px solid rgba(255,255,255,0.15)", borderRadius: "10px", padding: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", transition: "background 0.2s" }}>
          <ShoppingBag size={12} />
          {inCart > 0 ? `In Cart (${inCart}) · Add More` : "Add to Cart"}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─── Product Card (dark grid) ─── */
function ProductCard({ product, onAdd, delay, inCart }: { product: Product; onAdd: (p: Product) => void; delay: number; inCart: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay, ease: EASE }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: "20px", overflow: "hidden",
        border: hovered ? "1.5px solid rgba(255,255,255,0.15)" : "1.5px solid rgba(255,255,255,0.06)",
        transition: "all 0.22s",
        boxShadow: hovered ? "0 16px 48px rgba(0,0,0,0.45)" : "none",
        background: "#141414",
      }}
    >
      {/* Image area */}
      <div style={{ height: 180, position: "relative", overflow: "hidden", background: "#1a1a1a" }}>
        <motion.div animate={{ scale: hovered ? 1.08 : 1 }} transition={{ duration: 0.5, ease: EASE }}
          style={{ position: "absolute", inset: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        </motion.div>

        {/* Shade tint overlay for polish */}
        {product.shade && product.category === "polish" && (
          <div style={{ position: "absolute", inset: 0, background: `${product.shade}33`, mixBlendMode: "color" }} />
        )}

        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)" }} />

        {/* Hover overlay with CTA */}
        <AnimatePresence>
          {hovered && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <motion.button initial={{ scale: 0.85, y: 4 }} animate={{ scale: 1, y: 0 }} onClick={() => onAdd(product)}
                style={{ fontFamily: "var(--font-poppins)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", background: "#fff", color: "#111", border: "none", borderRadius: "100px", padding: "0.65rem 1.4rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
                <ShoppingBag size={11} />
                {inCart > 0 ? `Add More` : "Add to Cart"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Price */}
        <div style={{ position: "absolute", bottom: "0.75rem", right: "0.75rem", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", padding: "0.2rem 0.65rem", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.68rem", fontWeight: 700, color: "#fff" }}>{product.displayPrice}</span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "1rem 1.1rem 1.1rem" }}>
        <div style={{ fontFamily: "var(--font-poppins)", fontSize: "0.8rem", fontWeight: 600, color: "#fff", marginBottom: "0.35rem" }}>{product.name}</div>
        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.55, marginBottom: "0.75rem" }}>
          {product.description.slice(0, 65)}…
        </p>
        <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
          {product.tags.slice(0, 2).map(tag => (
            <span key={tag} style={{ fontFamily: "var(--font-poppins)", fontSize: "0.45rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.05)", padding: "0.18rem 0.5rem", borderRadius: "100px" }}>
              {tag}
            </span>
          ))}
          {inCart > 0 && (
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.45rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#C9A0A8", background: "rgba(139,25,48,0.2)", padding: "0.18rem 0.5rem", borderRadius: "100px", border: "1px solid rgba(139,25,48,0.3)" }}>
              ✓ In Cart ({inCart})
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
