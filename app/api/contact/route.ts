import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createHubSpotContact } from "@/lib/hubspot";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  country: z.string().optional(),
  interest: z.array(z.string()).min(1),
  message: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    // Integrate with HubSpot CRM
    const hubspotResult = await createHubSpotContact(data);

    if (!hubspotResult.success) {
      console.warn("[HubSpot] Failed to sync contact:", hubspotResult.message);
      // Continue anyway - don't fail the request if CRM is down
    }

    console.log("[Contact Form Submission]", {
      timestamp: new Date().toISOString(),
      data,
      hubspotContactId: hubspotResult.contactId,
    });

    // TODO: Send email notification
    // await sendEmail({ to: 'hello@totalo.com', subject: 'New Contact Form', body: ... });

    return NextResponse.json({
      success: true,
      message: "문의 접수 완료. 빠르게 회신드리겠습니다.",
    });
  } catch (error) {
    console.error("[Contact Form Error]", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
