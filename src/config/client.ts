// ─────────────────────────────────────────────────────────────────
//  RAVNEET CLIENT CONFIG
//  Run ./switch.sh and select Ravneet to activate this.
// ─────────────────────────────────────────────────────────────────

export const CLIENT = {
  artistName: "Ravneet",
  brandName: "Nails by Ravneet",
  email: "hello@nailsbyravneet.com",
  instagram: "@nailsbyravneet",
  adminPassword: "ravneet123",
  stripeSource: "nails-by-ravneet",
  peerPrefix: "nailsravneet-",

  meta: {
    title: "Nails by Ravneet | Luxury Nail Art Studio",
    description:
      "Bespoke nail art that tells your story. Premium gel, chrome, and custom nail art by Ravneet — where beauty meets artistry.",
    ogTitle: "Nails by Ravneet",
    ogDescription: "Bespoke nail art that tells your story.",
  },

  about: {
    story1:
      "It started at age fourteen with a bottle of drugstore polish and a bathroom mirror. Ravneet wasn't trying to build a brand — she was just obsessed. Flash-forward eight years, and that obsession turned into a studio where every client leaves with nails that feel like a piece of wearable art.",
    story2:
      "No rushed appointments. No cookie-cutter sets. Just Ravneet, her tools, and a genuine conversation about exactly what you want — then delivering it better than you imagined.",
    bookCta: "Book with Ravneet",
  },

  testimonials: [
    {
      id: 1, name: "Sophia R.", service: "Chrome Powder",
      quote: "Ravneet is an absolute genius. My rose gold chrome nails had everyone asking where I got them. Won't go anywhere else.",
      rating: 5, avatar: "/images/avatars/a1.jpg",
    },
    {
      id: 2, name: "Anika P.", service: "Custom Nail Art",
      quote: "She painted the tiniest florals on my nails and they look like a work of art. Truly one-of-a-kind experience.",
      rating: 5, avatar: "/images/avatars/a2.jpg",
    },
    {
      id: 3, name: "Maya T.", service: "Gel Extensions",
      quote: "The longest lasting gel manicure I've ever had. Three weeks in and they still look perfect. Obsessed!",
      rating: 5, avatar: "/images/avatars/a3.jpg",
    },
    {
      id: 4, name: "Priya K.", service: "French Ombré",
      quote: "The baby boomer look she created was so soft and elegant. Got so many compliments at my wedding.",
      rating: 5, avatar: "/images/avatars/a4.jpg",
    },
    {
      id: 5, name: "Jessica L.", service: "Nail Sculpting",
      quote: "I've tried so many nail techs and Ravneet is BY FAR the best. Perfect shape, perfect thickness, no lifting.",
      rating: 5, avatar: "/images/avatars/a5.jpg",
    },
    {
      id: 6, name: "Divya S.", service: "Nail Restoration",
      quote: "My nails were so damaged but she transformed them completely. They're stronger than ever and look gorgeous.",
      rating: 5, avatar: "/images/avatars/a6.jpg",
    },
  ],
};

export type ClientConfig = typeof CLIENT;
