import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { logUserRegistration, logUserLogin, logUserLogout } from "@/utils/userActivityLogger";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  console.log('🔔 Clerk webhook received');
  
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  console.log('📋 Webhook headers:', {
    svix_id: svix_id ? 'present' : 'missing',
    svix_timestamp: svix_timestamp ? 'present' : 'missing',
    svix_signature: svix_signature ? 'present' : 'missing'
  });

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('❌ Missing webhook headers');
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  console.log('🎯 Webhook event type:', eventType);

  if (eventType === "user.created") {
    const { id, email_addresses, public_metadata } = evt.data;
    
    console.log("User created:", {
      id,
      email: email_addresses[0]?.email_address,
      metadata: public_metadata
    });

    try {
      // Save the user to your database
      const user = await prisma.user.create({
        data: {
          id: id,
          email: email_addresses[0]?.email_address || "",
          role: (public_metadata?.role as any) || "BUYER", // Default to BUYER if no role specified
        }
      });

      console.log("User saved to database successfully:", user.id);
      
      // Log user registration activity
      logUserRegistration(user.id, user.role, user.email, {
        registrationMethod: 'clerk',
        timestamp: new Date().toISOString(),
        webhookEvent: 'user.created'
      });
    } catch (error) {
      console.error("Error saving user to database:", error);
      // Don't return error to Clerk webhook to avoid retries
    }
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, public_metadata } = evt.data;
    
    console.log("User updated:", {
      id,
      email: email_addresses[0]?.email_address,
      metadata: public_metadata
    });

    try {
      // Update the user in your database
      const user = await prisma.user.update({
        where: { id: id },
        data: {
          email: email_addresses[0]?.email_address || "",
          role: (public_metadata?.role as any) || "BUYER",
        }
      });

      console.log("User updated in database successfully:", user.id);
    } catch (error) {
      console.error("Error updating user in database:", error);
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;
    
    console.log("User deleted:", id);

    try {
      // Soft delete the user from your database
      await prisma.user.delete({
        where: { id: id }
      });

      console.log("User deleted from database successfully:", id);
    } catch (error) {
      console.error("Error deleting user from database:", error);
    }
  }

  return new Response("", { status: 200 });
}