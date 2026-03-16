import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Pinyon_Script } from "next/font/google";
import "./globals.css";

// Cormorant Garamond — ultra-luxury high-contrast fashion serif (used by Vogue, luxury brands)
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

// DM Sans — modern geometric humanist sans, clean and editorial
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// Pinyon Script — delicate high-fashion script, more refined than Great Vibes
const pinyonScript = Pinyon_Script({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-great-vibes",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nails by Tisha | Luxury Nail Art Studio",
  description:
    "Bespoke nail art that tells your story. Premium gel, chrome, and custom nail art by Tisha — where beauty meets artistry.",
  keywords: ["nail art", "nail salon", "gel nails", "chrome nails", "luxury nail studio"],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Nails by Tisha",
    description: "Bespoke nail art that tells your story.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${pinyonScript.variable}`}
    >
      <body className="antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
