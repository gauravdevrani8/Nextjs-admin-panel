import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (req: NextRequest) => {
  // Extract raw body and Stripe-Signature header from the request
  const rawBody = await req.text(); // Get the raw body of the request
  const signature = req.headers.get("Stripe-Signature"); // Access the header from the request

  // Ensure the Stripe-Signature header exists
  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe-Signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify the event using Stripe's webhook signature
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Stripe webhook verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook error: ${err.message}` },
      { status: 400 }
    );
  }

  // Extract data from the Stripe event
  const session = event.data.object as Stripe.Checkout.Session;
  const customerId = session?.metadata?.customerId;
  const courseId = session?.metadata?.courseId;

  // Handle specific event types
  if (event.type === "checkout.session.completed") {
    if (!customerId || !courseId) {
      return NextResponse.json(
        { error: "Missing metadata in checkout session" },
        { status: 400 }
      );
    }

    try {
      // Save the purchase in your database
      await db.purchase.create({
        data: {
          customerId,
          courseId,
        },
      });
    } catch (dbError: any) {
      console.error("Database error:", dbError.message);
      return NextResponse.json(
        { error: `Database error: ${dbError.message}` },
        { status: 500 }
      );
    }
  } else {
    // Handle unexpected event types
    console.warn(`Unhandled event type: ${event.type}`);
    return NextResponse.json(
      { error: `Unhandled event type: ${event.type}` },
      { status: 400 }
    );
  }

  // Respond with success if everything worked
  return NextResponse.json({ message: "Success" }, { status: 200 });
};
