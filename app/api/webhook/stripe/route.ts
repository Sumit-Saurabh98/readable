import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

// Add this export for App Router
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {

    const body = await req.text();

  const headerList = await headers();

  const signature = headerList.get("Stripe-Signature") as string;

  console.log("Webhook received, signature present:", !!signature);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
    console.log("Event constructed successfully:", event.type);
  } catch(error) {
    console.error("Webhook signature verification failed:", error);
    return new Response("Webhook error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const courseId = session?.metadata?.courseId;
    const customerId = session?.customer as string;

    if (!courseId || !customerId) {
      return new Response("Missing metadata", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        stripeCustomerId: customerId,
      },
    });

    if (!user) {
      return new Response("User not found", { status: 400 });
    }

    await prisma.enrollment.update({
      where: {
        id: session?.metadata?.enrollmentId,
      },
      data: {
        userId: user.id,
        courseId: courseId,
        amount: session?.amount_total as number,
        status: "Active",
      },
    });
  }

  return new Response(null, { status: 200 });
    
  } catch (error) {
    console.error("Webhook handler error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
