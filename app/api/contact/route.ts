import { verifyOrigin } from "@/lib/csrf-protection"
import { checkCombinedRateLimit, getRateLimitHeaders, rateLimiters } from "@/lib/redis-rate-limiter"
import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"

const resend = new Resend(process.env.RESEND_API_KEY)

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
})

export async function POST(request: NextRequest) {
  try {
    // CSRF protection
    const { valid, origin, reason } = verifyOrigin(request)
    if (!valid) {
      console.warn(`[CSRF] Blocked contact request - ${reason || "Unknown"} (Origin: ${origin || "none"})`)
      return NextResponse.json({ message: "Forbidden - Invalid origin" }, { status: 403 })
    }

    // Rate limiting - 5 submissions per hour per IP
    const ipIdentifier = request.headers.get("x-forwarded-for") || 
                         request.headers.get("x-real-ip") || 
                         "unknown"
    
    const rateLimit = await checkCombinedRateLimit(
      request,
      rateLimiters.ipGlobal,
      ipIdentifier,
      rateLimiters.ipAuth
    )

    if (!rateLimit.success) {
      return NextResponse.json(
        { 
          message: "Too many contact submissions. Please try again later.",
          resetAt: new Date(rateLimit.reset * 1000).toISOString(),
        },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimit),
        }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validation = contactSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          message: "Invalid input",
          errors: validation.error.errors 
        },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, subject, message } = validation.data

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "Erazor AI Contact <contact@erazor.app>",
      to: process.env.CONTACT_EMAIL || "hello@erazor.app",
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>From:</strong> ${firstName} ${lastName}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 10px;">Message:</h3>
            <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #4F46E5; border-radius: 4px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #666; font-size: 12px; text-align: center;">
            This email was sent from the Erazor AI contact form.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json(
        { message: "Failed to send message. Please try again later." },
        { status: 500 }
      )
    }

    // Also send confirmation email to user
    await resend.emails.send({
      from: "Erazor AI <noreply@erazor.app>",
      to: email,
      subject: "We received your message - Erazor AI",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">Erazor AI</h1>
          </div>
          
          <div style="padding: 30px; background-color: #ffffff;">
            <h2 style="color: #333; margin-top: 0;">Thanks for reaching out, ${firstName}!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              We've received your message and our team will get back to you within 24 hours during business days.
            </p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0; color: #666;"><strong>Your message:</strong></p>
              <p style="margin: 10px 0; color: #333;">${message.substring(0, 200)}${message.length > 200 ? '...' : ''}</p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              In the meantime, feel free to explore our tools:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://erazor.app/tools/remove-background" 
                 style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 5px;">
                Background Remover
              </a>
              <a href="https://erazor.app/tools/upscale" 
                 style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 5px;">
                Image Upscaler
              </a>
            </div>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="color: #666; font-size: 12px; margin: 5px 0;">
              © ${new Date().getFullYear()} Erazor AI. All rights reserved.
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({
      message: "Message sent successfully",
      id: data?.id,
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
