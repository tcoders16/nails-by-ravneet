export interface Product {
  id: string;
  name: string;
  category: "polish" | "extension" | "tool";
  price: number;          // in cents (Stripe format)
  displayPrice: string;   // e.g. "$24.99"
  shade?: string;         // hex color for swatches
  image: string;          // path to product image
  description: string;
  tags: string[];
  featured?: boolean;
}

export const PRODUCTS: Product[] = [
  // ── Nail Polish ──
  {
    id: "np-velvet-rose",
    name: "Velvet Rose",
    category: "polish",
    price: 1899,
    displayPrice: "$18.99",
    shade: "#A0334A",
    image: "/images/shop/np-velvet-rose.jpg",
    description: "A deep crimson rose with velvet-matte finish. Long-wear formula, chip-resistant for up to 14 days.",
    tags: ["matte", "red", "bestseller"],
    featured: true,
  },
  {
    id: "np-chrome-blush",
    name: "Chrome Blush",
    category: "polish",
    price: 2299,
    displayPrice: "$22.99",
    shade: "#E8B4B8",
    image: "/images/shop/np-chrome-blush.jpg",
    description: "Soft blush pink with a chrome mirror finish. Perfect for bridal and special occasions.",
    tags: ["chrome", "pink", "bridal"],
    featured: true,
  },
  {
    id: "np-midnight-noir",
    name: "Midnight Noir",
    category: "polish",
    price: 1899,
    displayPrice: "$18.99",
    shade: "#1A1A2E",
    image: "/images/shop/np-midnight-noir.jpg",
    description: "Deep obsidian black with subtle navy shimmer. Edgy and sophisticated for any occasion.",
    tags: ["dark", "shimmer", "edgy"],
  },
  {
    id: "np-gold-rush",
    name: "Gold Rush",
    category: "polish",
    price: 2499,
    displayPrice: "$24.99",
    shade: "#C9A84C",
    image: "/images/shop/np-gold-rush.jpg",
    description: "24K gold metallic finish with micro-glitter particles. Turns heads in any light.",
    tags: ["gold", "metallic", "glam"],
    featured: true,
  },
  {
    id: "np-lavender-dream",
    name: "Lavender Dream",
    category: "polish",
    price: 1899,
    displayPrice: "$18.99",
    shade: "#B8A9C9",
    image: "/images/shop/np-lavender-dream.jpg",
    description: "Soft pastel lavender with a creamy finish. The ultimate spring/summer hue.",
    tags: ["pastel", "purple", "summer"],
  },
  {
    id: "np-coral-kiss",
    name: "Coral Kiss",
    category: "polish",
    price: 1899,
    displayPrice: "$18.99",
    shade: "#E8735A",
    image: "/images/shop/np-coral-kiss.jpg",
    description: "Vibrant warm coral — a year-round staple that flatters every skin tone.",
    tags: ["coral", "warm", "everyday"],
  },
  {
    id: "np-pearl-white",
    name: "Pearl White",
    category: "polish",
    price: 1899,
    displayPrice: "$18.99",
    shade: "#F5F0E8",
    image: "/images/shop/np-pearl-white.jpg",
    description: "Sheer pearl white with a luminous shimmer. Effortlessly clean and elegant.",
    tags: ["white", "pearl", "minimal"],
  },
  {
    id: "np-berry-glaze",
    name: "Berry Glaze",
    category: "polish",
    price: 2099,
    displayPrice: "$20.99",
    shade: "#8B3A62",
    image: "/images/shop/np-berry-glaze.jpg",
    description: "Rich berry purple with a high-gloss glaze coat. Intense colour payoff, one coat coverage.",
    tags: ["purple", "berry", "gloss"],
  },

  // ── Nail Extensions ──
  {
    id: "ext-clear-coffin",
    name: "Clear Coffin Tips",
    category: "extension",
    price: 1499,
    displayPrice: "$14.99",
    image: "/images/shop/ext-clear-coffin.jpg",
    description: "Professional-grade clear coffin-shaped nail tips. Pack of 500 tips across 10 sizes. Salon-quality acrylic adhesion.",
    tags: ["coffin", "clear", "acrylic"],
    featured: true,
  },
  {
    id: "ext-almond-pink",
    name: "Soft Almond Tips — Blush",
    category: "extension",
    price: 1699,
    displayPrice: "$16.99",
    shade: "#F9C6DA",
    image: "/images/shop/ext-almond-pink.jpg",
    description: "Pre-tinted blush almond tips for a seamless French effect. Pack of 240 tips, 12 sizes.",
    tags: ["almond", "pink", "french"],
  },
  {
    id: "ext-stiletto-clear",
    name: "Stiletto Tips — Crystal Clear",
    category: "extension",
    price: 1699,
    displayPrice: "$16.99",
    image: "/images/shop/ext-stiletto-clear.jpg",
    description: "Ultra-sharp stiletto tips in crystal clear. 500-piece pack, high-impact drama nail shape.",
    tags: ["stiletto", "clear", "dramatic"],
    featured: true,
  },
  {
    id: "ext-square-white",
    name: "Square Tips — French White",
    category: "extension",
    price: 1299,
    displayPrice: "$12.99",
    shade: "#F8F8F8",
    image: "/images/shop/ext-square-white.jpg",
    description: "Classic square French tips for timeless nail art. Pack of 500 in pristine white, 10 sizes.",
    tags: ["square", "white", "french", "classic"],
  },

  // ── Tools ──
  {
    id: "tool-gel-kit",
    name: "Gel Starter Kit",
    category: "tool",
    price: 4999,
    displayPrice: "$49.99",
    image: "/images/shop/tool-gel-kit.jpg",
    description: "Everything to get started with gel nails at home. Includes base coat, top coat, 2 colours, LED mini lamp, and file set.",
    tags: ["gel", "kit", "beginner"],
    featured: true,
  },
  {
    id: "tool-nail-file-set",
    name: "Professional File Set",
    category: "tool",
    price: 1299,
    displayPrice: "$12.99",
    image: "/images/shop/tool-nail-file-set.jpg",
    description: "6-piece professional nail file and buffer set. Includes coarse, medium, fine and shine buffers.",
    tags: ["file", "tools", "professional"],
  },
];

export const CATEGORIES = [
  { key: "all",       label: "All Products" },
  { key: "polish",    label: "Nail Polish" },
  { key: "extension", label: "Nail Extensions" },
  { key: "tool",      label: "Tools & Kits" },
] as const;
