import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

// Force dynamic rendering for App Router
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  console.log("🔵 Webhook handler started");
  
  try {
    // Step 1: Get request body
    const body = await req.text();
    console.log("🔵 Request body received, length:", body.length);
    
    if (!body) {
      console.error("❌ Empty request body");
      return new Response("Empty request body", { status: 400 });
    }

    // Step 2: Get headers
    const headerList = await headers();
    const signature = headerList.get("Stripe-Signature");
    
    console.log("🔵 Stripe signature present:", !!signature);
    console.log("🔵 Webhook secret configured:", !!env.STRIPE_WEBHOOK_SECRET);
    
    if (!signature) {
      console.error("❌ Missing Stripe-Signature header");
      return new Response("Missing Stripe signature", { status: 400 });
    }

    if (!env.STRIPE_WEBHOOK_SECRET) {
      console.error("❌ Webhook secret not configured");
      return new Response("Webhook secret not configured", { status: 500 });
    }

    // Step 3: Verify webhook signature
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        env.STRIPE_WEBHOOK_SECRET
      );
      console.log("✅ Webhook signature verified successfully");
      console.log("🔵 Event type:", event.type);
      console.log("🔵 Event ID:", event.id);
    } catch (error) {
      console.error("❌ Webhook signature verification failed:", {
        error: error instanceof Error ? error.message : 'Unknown error',
        signatureLength: signature.length,
        bodyLength: body.length,
        secretLength: env.STRIPE_WEBHOOK_SECRET.length
      });
      return new Response("Webhook signature verification failed", { status: 400 });
    }

    // Step 4: Process the event
    if (event.type === "checkout.session.completed") {
      console.log("🔵 Processing checkout.session.completed event");
      
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Extract metadata
      const courseId = session?.metadata?.courseId;
      const enrollmentId = session?.metadata?.enrollmentId;
      const userId = session?.metadata?.userId;
      const customerId = session?.customer as string;
      
      console.log("🔵 Session metadata:", {
        courseId,
        enrollmentId,
        userId,
        customerId: customerId ? `${customerId.substring(0, 10)}...` : null,
        paymentStatus: session.payment_status,
        amountTotal: session.amount_total
      });

      // Validate required data
      if (!courseId) {
        console.error("❌ Missing courseId in metadata");
        return new Response("Missing courseId in session metadata", { status: 400 });
      }

      if (!enrollmentId) {
        console.error("❌ Missing enrollmentId in metadata");
        return new Response("Missing enrollmentId in session metadata", { status: 400 });
      }

      if (!customerId) {
        console.error("❌ Missing customer ID in session");
        return new Response("Missing customer ID in session", { status: 400 });
      }

      if (session.payment_status !== "paid") {
        console.error("❌ Payment not completed, status:", session.payment_status);
        return new Response("Payment not completed", { status: 400 });
      }

      // Step 5: Find user by Stripe customer ID
      let user;
      try {
        console.log("🔵 Looking up user by Stripe customer ID");
        user = await prisma.user.findUnique({
          where: {
            stripeCustomerId: customerId,
          },
          select: {
            id: true,
            email: true,
            stripeCustomerId: true
          }
        });
        
        if (!user) {
          console.error("❌ User not found for Stripe customer ID:", customerId);
          return new Response("User not found for customer ID", { status: 404 });
        }
        
        console.log("✅ User found:", { userId: user.id, email: user.email });
      } catch (error) {
        console.error("❌ Database error finding user:", {
          error: error instanceof Error ? error.message : 'Unknown error',
          customerId
        });
        return new Response("Database error finding user", { status: 500 });
      }

      // Step 6: Check if enrollment exists
      let existingEnrollment;
      try {
        console.log("🔵 Checking existing enrollment");
        existingEnrollment = await prisma.enrollment.findUnique({
          where: {
            id: enrollmentId,
          },
          select: {
            id: true,
            status: true,
            userId: true,
            courseId: true
          }
        });
        
        if (!existingEnrollment) {
          console.error("❌ Enrollment not found:", enrollmentId);
          return new Response("Enrollment not found", { status: 404 });
        }
        
        console.log("🔵 Existing enrollment:", {
          id: existingEnrollment.id,
          status: existingEnrollment.status,
          userId: existingEnrollment.userId,
          courseId: existingEnrollment.courseId
        });
      } catch (error) {
        console.error("❌ Database error finding enrollment:", {
          error: error instanceof Error ? error.message : 'Unknown error',
          enrollmentId
        });
        return new Response("Database error finding enrollment", { status: 500 });
      }

      // Step 7: Update enrollment
      try {
        console.log("🔵 Updating enrollment to Active status");
        
        const updatedEnrollment = await prisma.enrollment.update({
          where: {
            id: enrollmentId,
          },
          data: {
            userId: user.id,
            courseId: courseId,
            amount: session.amount_total || 0,
            status: "Active",
            updatedAt: new Date()
          },
        });
        
        console.log("✅ Enrollment updated successfully:", {
          enrollmentId: updatedEnrollment.id,
          status: updatedEnrollment.status,
          amount: updatedEnrollment.amount
        });
        
        // Optional: Log successful payment for analytics
        console.log("💰 Payment processed successfully:", {
          userId: user.id,
          courseId,
          amount: session.amount_total,
          paymentIntentId: session.payment_intent,
          sessionId: session.id
        });
        
      } catch (error) {
        console.error("❌ Database error updating enrollment:", {
          error: error instanceof Error ? error.message : 'Unknown error',
          enrollmentId,
          userId: user.id,
          courseId
        });
        return new Response("Database error updating enrollment", { status: 500 });
      }
    } else {
      console.log("🔵 Unhandled event type:", event.type);
      // Return 200 for unhandled events (Stripe expects this)
    }

    console.log("✅ Webhook processed successfully");
    return new Response(JSON.stringify({ received: true }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error("❌ Unexpected error in webhook handler:", {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return new Response("Internal server error", { status: 500 });
  }
}