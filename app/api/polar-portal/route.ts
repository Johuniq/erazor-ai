import { createClient } from "@/lib/supabase/server";
import { Polar } from "@polar-sh/sdk";
import { NextResponse } from "next/server";

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: "production",
});

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("[Polar Portal] User ID:", user.id, "Email:", user.email);

  try {
    let customer;

    // Step 1: Try to get customer by externalId
    try {
      console.log("[Polar Portal] Fetching customer by externalId...");
      customer = await polar.customers.getExternal({
        externalId: user.id,
      });
      console.log("[Polar Portal] Customer found by externalId:", customer.id);
    } catch {
      console.log("[Polar Portal] Customer not found by externalId, searching by email...");
      
      // Step 2: Try to find customer by email
      try {
        const customers = await polar.customers.list({
          email: user.email || "",
          limit: 1,
        });
        
        if (customers.result.items.length > 0) {
          customer = customers.result.items[0];
          console.log("[Polar Portal] Customer found by email:", customer.id);
          
          // Update externalId if not set
          if (!customer.externalId) {
            console.log("[Polar Portal] Updating customer externalId...");
            customer = await polar.customers.update({
              id: customer.id,
              customerUpdate: {
                externalId: user.id,
              },
            });
          }
        } else {
          // Step 3: Create new customer if not found
          console.log("[Polar Portal] No customer found, creating new...");
          customer = await polar.customers.create({
            email: user.email || "",
            name: user.user_metadata?.full_name || user.user_metadata?.name || "User",
            externalId: user.id,
          });
          console.log("[Polar Portal] Customer created:", customer.id);
        }
      } catch (searchError) {
        console.error("[Polar Portal] Failed to search/create customer:", searchError);
        throw searchError;
      }
    }

    // Step 4: Create session
    console.log("[Polar Portal] Creating session with customerId:", customer.id);
    const session = await polar.customerSessions.create({
      customerId: customer.id,
    });
    console.log("[Polar Portal] Session created, URL:", session.customerPortalUrl);

    return NextResponse.json({
      url: session.customerPortalUrl,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[Polar Portal] Final error:", errorMessage);

    return NextResponse.json(
      {
        error: "Error creating portal session",
        message: errorMessage,
        userId: user.id,
      },
      {
        status: 500,
      }
    );
  }
}