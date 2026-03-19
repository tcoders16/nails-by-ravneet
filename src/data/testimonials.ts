export interface Testimonial {
  id: number;
  name: string;
  service: string;
  quote: string;
  rating: number;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sophia R.",
    service: "Chrome Powder",
    quote: "Tisha is an absolute genius. My rose gold chrome nails had everyone asking where I got them. Won't go anywhere else.",
    rating: 5, avatar: "/images/avatars/a1.jpg",
  },
  {
    id: 2,
    name: "Anika P.",
    service: "Custom Nail Art",
    quote: "She painted the tiniest florals on my nails and they look like a work of art. Truly one-of-a-kind experience.",
    rating: 5, avatar: "/images/avatars/a2.jpg",
  },
  {
    id: 3,
    name: "Maya T.",
    service: "Gel Extensions",
    quote: "The longest lasting gel manicure I've ever had. Three weeks in and they still look perfect. Obsessed!",
    rating: 5, avatar: "/images/avatars/a3.jpg",
  },
  {
    id: 4,
    name: "Priya K.",
    service: "French Ombré",
    quote: "The baby boomer look she created was so soft and elegant. Got so many compliments at my wedding.",
    rating: 5, avatar: "/images/avatars/a4.jpg",
  },
  {
    id: 5,
    name: "Jessica L.",
    service: "Nail Sculpting",
    quote: "I've tried so many nail techs and Tisha is BY FAR the best. Perfect shape, perfect thickness, no lifting.",
    rating: 5, avatar: "/images/avatars/a5.jpg",
  },
  {
    id: 6,
    name: "Divya S.",
    service: "Nail Restoration",
    quote: "My nails were so damaged but she transformed them completely. They're stronger than ever and look gorgeous.",
    rating: 5, avatar: "/images/avatars/a6.jpg",
  },
];
