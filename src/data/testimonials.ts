import { CLIENT } from "@/config/client";

export interface Testimonial {
  id: number;
  name: string;
  service: string;
  quote: string;
  rating: number;
  avatar: string;
}

export const testimonials: Testimonial[] = CLIENT.testimonials;
