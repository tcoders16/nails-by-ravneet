import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PRODUCTS } from "@/data/products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "sk_test_placeholder") {
    return NextResponse.json(
      { error: "Stripe is not configured. Add STRIPE_SECRET_KEY to .env.local" },
      { status: 503 }
    );
  }

  const { items } = await req.json() as { items: { id: string; qty: number }[] };

  if (!items?.length) {
    return NextResponse.json({ error: "No items" }, { status: 400 });
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const { id, qty } of items) {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) continue;

    lineItems.push({
      quantity: qty,
      price_data: {
        currency: "usd",
        unit_amount: product.price,
        product_data: {
          name: product.name,
          description: product.description.slice(0, 150),
          metadata: { category: product.category },
        },
      },
    });
  }

  if (!lineItems.length) {
    return NextResponse.json({ error: "No valid items" }, { status: 400 });
  }

  const origin = req.headers.get("origin") ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/shop?cancelled=1`,
    shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "AU", "IN"] },
    billing_address_collection: "required",
    metadata: { source: "nails-by-tisha" },
  });

  return NextResponse.json({ url: session.url });
}
