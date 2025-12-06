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

  try {
    let customer;

    // Step 1: Try to get customer by externalId
    try {
      customer = await polar.customers.getExternal({
        externalId: user.id,
      });
    } catch {
      // Step 2: Try to find customer by email
      try {
        const customers = await polar.customers.list({
          email: user.email || "",
          limit: 1,
        });
        
        if (customers.result.items.length > 0) {
          customer = customers.result.items[0];
          
          // Update externalId if not set
          if (!customer.externalId) {
            customer = await polar.customers.update({
              id: customer.id,
              customerUpdate: {
                externalId: user.id,
              },
            });
          }
        } else {
          // Step 3: Create new customer if not found
          customer = await polar.customers.create({
            email: user.email || "",
            name: user.user_metadata?.full_name || user.user_metadata?.name || "User",
            externalId: user.id,
          });
        }
      } catch (searchError) {
        console.error("[Polar Portal] Failed to search/create customer:", searchError);
        throw searchError;
      }
    }

    // Step 4: Create session
    const session = await polar.customerSessions.create({
      customerId: customer.id,
    });

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