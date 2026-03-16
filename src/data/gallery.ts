export interface GalleryItem {
  id: number;
  title: string;
  category: "Gel" | "Chrome" | "Nail Art" | "French" | "Sculpt";
  image: string;
  span?: "wide" | "tall" | "large" | "normal";
}
export type GalleryCategory = "All" | "Gel" | "Chrome" | "Nail Art" | "French" | "Sculpt";

export const galleryItems: GalleryItem[] = [
  { id: 1,  title: "Rose Chrome Set",      category: "Chrome",   image: "/images/gallery/g1.jpg",  span: "large"  },
  { id: 2,  title: "Blush Ombré Gel",      category: "Gel",      image: "/images/gallery/g2.jpg",  span: "normal" },
  { id: 3,  title: "Floral Hand-Painted",  category: "Nail Art", image: "/images/gallery/g3.jpg",  span: "tall"   },
  { id: 4,  title: "Nude French",          category: "French",   image: "/images/gallery/g4.jpg",  span: "normal" },
  { id: 5,  title: "Warm Taupe Chrome",    category: "Chrome",   image: "/images/gallery/g5.jpg",  span: "normal" },
  { id: 6,  title: "Abstract Art",         category: "Nail Art", image: "/images/gallery/g6.jpg",  span: "wide"   },
  { id: 7,  title: "Nude Almond Sculpt",   category: "Sculpt",   image: "/images/gallery/g7.jpg",  span: "normal" },
  { id: 8,  title: "Glitter Ombré",        category: "French",   image: "/images/gallery/g8.jpg",  span: "normal" },
  { id: 9,  title: "Deep Berry Gel",       category: "Gel",      image: "/images/gallery/g9.jpg",  span: "normal" },
  { id: 10, title: "Silver Mirror",        category: "Chrome",   image: "/images/gallery/g10.jpg", span: "tall"   },
  { id: 11, title: "3D Pearl Design",      category: "Nail Art", image: "/images/gallery/g11.jpg", span: "normal" },
  { id: 12, title: "Baby Boomer",          category: "French",   image: "/images/gallery/g12.jpg", span: "normal" },
];

export const galleryCategories: GalleryCategory[] = ["All", "Gel", "Chrome", "Nail Art", "French", "Sculpt"];
