export interface Service {
  id: number;
  title: string;
  price: string;
  duration: string;
  description: string;
  icon: string;
  image: string;
  category: "manicure" | "extensions" | "nail-art" | "specialty" | "pedicure";
  featured?: boolean;
}

export const services: Service[] = [
  /* ── Manicure ── */
  {
    id: 1,
    title: "Classic Gel Manicure",
    price: "From $35",
    duration: "45 min",
    description: "Impeccably shaped nails finished with long-lasting gel polish. Clean, glossy, and chip-free for up to 3 weeks.",
    icon: "✦",
    image: "/images/gallery/g1.jpg",
    category: "manicure",
    featured: false,
  },
  {
    id: 2,
    title: "Builder Gel Overlay",
    price: "From $50",
    duration: "60 min",
    description: "Strengthen your natural nails with a thin builder gel overlay — added durability with a naturally thin finish.",
    icon: "◉",
    image: "/images/gallery/g2.jpg",
    category: "manicure",
    featured: false,
  },
  /* ── Extensions ── */
  {
    id: 3,
    title: "Gel Extensions",
    price: "From $65",
    duration: "75 min",
    description: "Long-lasting ultra-glossy gel extensions sculpted to your perfect shape — coffin, almond, square, or stiletto.",
    icon: "◈",
    image: "/images/gallery/g3.jpg",
    category: "extensions",
    featured: true,
  },
  {
    id: 4,
    title: "Acrylic Sculpt",
    price: "From $75",
    duration: "90 min",
    description: "Classic acrylic sets built for strength and length. Fully customisable in any shape, length, and finish.",
    icon: "✧",
    image: "/images/gallery/g7.jpg",
    category: "extensions",
    featured: false,
  },
  {
    id: 5,
    title: "Polygel Extensions",
    price: "From $80",
    duration: "90 min",
    description: "The best of both worlds — polygel is lighter than acrylic and stronger than gel, with a flawless finish.",
    icon: "❋",
    image: "/images/gallery/g4.jpg",
    category: "extensions",
    featured: false,
  },
  /* ── Nail Art ── */
  {
    id: 6,
    title: "Custom Nail Art",
    price: "From $55",
    duration: "75 min",
    description: "Hand-painted florals, geometric patterns, 3D gems, foils — fully bespoke nail art brought to life on each nail.",
    icon: "♡",
    image: "/images/gallery/g5.jpg",
    category: "nail-art",
    featured: true,
  },
  {
    id: 7,
    title: "French Ombré",
    price: "From $50",
    duration: "60 min",
    description: "The modern French reinvented — soft baby boomer gradient, glitter ombré, or bold neon French tips.",
    icon: "◉",
    image: "/images/gallery/g12.jpg",
    category: "nail-art",
    featured: false,
  },
  {
    id: 8,
    title: "3D Nail Art",
    price: "From $70",
    duration: "90 min",
    description: "Raised florals, butterflies, charms, and sculptured designs that turn your nails into wearable art.",
    icon: "✦",
    image: "/images/gallery/g6.jpg",
    category: "nail-art",
    featured: false,
  },
  /* ── Specialty ── */
  {
    id: 9,
    title: "Chrome Powder",
    price: "From $45",
    duration: "50 min",
    description: "Mirror-finish chrome in rose gold, silver, holographic, or duo-chrome. The ultimate statement nail.",
    icon: "◈",
    image: "/images/gallery/g9.jpg",
    category: "specialty",
    featured: true,
  },
  {
    id: 10,
    title: "Nail Restoration",
    price: "From $40",
    duration: "45 min",
    description: "Repair damaged nails, fill gaps, and rebuild the natural nail for a healthy and beautiful foundation.",
    icon: "♡",
    image: "/images/gallery/g11.jpg",
    category: "specialty",
    featured: false,
  },
  {
    id: 11,
    title: "Bridal Set",
    price: "From $120",
    duration: "120 min",
    description: "Your wedding-day nails, perfected. A fully bespoke consultation, trial, and flawless final set.",
    icon: "✧",
    image: "/images/gallery/g8.jpg",
    category: "specialty",
    featured: false,
  },
  /* ── Pedicure ── */
  {
    id: 12,
    title: "Gel Pedicure",
    price: "From $55",
    duration: "60 min",
    description: "A relaxing full-care pedicure finished with gel polish — soft, smooth, and summer-ready.",
    icon: "❋",
    image: "/images/gallery/g10.jpg",
    category: "pedicure",
    featured: false,
  },
];
