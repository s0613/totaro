export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createHubSpotContact } from "@/lib/hubspot";
import { sendMail } from "@/lib/mailer";

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

    // Integrate with HubSpot CRM (best-effort)
    const hubspotResult = await createHubSpotContact(data).catch((e) => {
      console.warn("[HubSpot] Error:", e);
      return { success: false, message: String(e) } as any;
    });

    if (!hubspotResult.success) {
      console.warn("[HubSpot] Failed to sync contact:", hubspotResult.message);
      // Continue anyway - don't fail the request if CRM is down
    }

    console.log("[Contact Form Submission]", {
      timestamp: new Date().toISOString(),
      data,
      firestoreDocId: undefined,
      hubspotContactId: (hubspotResult as any)?.contactId,
    });

    // Send email directly from API route
    try {
      const subject = `[TOTARO] 새 문의 접수: ${data.name} (${data.company})`;
      const html = `
        <h2>새 문의가 접수되었습니다</h2>
        <ul>
          <li><b>이름:</b> ${data.name}</li>
          <li><b>이메일:</b> ${data.email}</li>
          <li><b>회사명:</b> ${data.company}</li>
          <li><b>국가:</b> ${data.country ?? "-"}</li>
          <li><b>관심사:</b> ${(data.interest || []).join(", ")}</li>
          <li><b>메시지:</b><br/>${(data.message || "").replace(/\n/g, "<br/>")}</li>
          <li><b>접수 시간:</b> ${new Date().toISOString()}</li>
        </ul>
      `;
      await sendMail({
        to: ["totalointernational@gmail.com", "farchicken00@naver.com"],
        subject,
        html,
      });
    } catch (mailErr) {
      console.error("[Contact Email Error]", mailErr);
      // continue without failing the request
    }

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
