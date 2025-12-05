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

    try {
      customer = await polar.customers.getExternal({
        externalId: user.id,
      });
    } catch {
      try {
        customer = await polar.customers.create({
          email: user.email || "",
          name: user.user_metadata?.full_name || user.user_metadata?.name || "User",
          externalId: user.id,
        });
      } catch (createError) {
        throw createError;
      }
    }

    try {
      const session = await polar.customerSessions.create({
        externalCustomerId: user.id,
      });

      return NextResponse.json({
        url: session.customerPortalUrl,
      });
    } catch (sessionError) {
      // Try with customer ID instead if externalCustomerId fails
      if (customer && customer.id) {
        try {
          const sessionRetry = await polar.customerSessions.create({
            customerId: customer.id,
          });
          return NextResponse.json({ url: sessionRetry.customerPortalUrl });
        } catch (retryError) {
          throw retryError;
        }
      }
      throw sessionError;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: "Error creating portal session",
        message: errorMessage,
        userId: user.id,
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}