export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createHubSpotContact } from "@/lib/hubspot";
import { sendMail } from "@/lib/mailer";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  country: z.string().optional().or(z.literal("")),
  interest: z.array(z.string()).min(1),
  message: z.string().max(2000, "메시지는 2000자 이하로 입력해주세요"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Debug logging
    console.log("[Contact API] Received data:", JSON.stringify(body, null, 2));

    // Validate
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      console.log("[Contact API] Validation failed:", result.error.flatten().fieldErrors);
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
    let emailSent = false;
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
      emailSent = true;
      console.log("[Contact Email] Successfully sent");
    } catch (mailErr) {
      console.error("[Contact Email Error]", mailErr);
      // Log detailed error information
      console.error("[Contact Email Error Details]", {
        error: mailErr,
        smtpUser: process.env.SMTP_USER ? "Set" : "Not set",
        smtpPass: process.env.SMTP_PASS ? "Set" : "Not set",
        smtpHost: process.env.SMTP_HOST,
        smtpPort: process.env.SMTP_PORT,
      });
    }

    return NextResponse.json({
      success: true,
      message: emailSent 
        ? "문의 접수 완료. 빠르게 회신드리겠습니다." 
        : "문의가 접수되었지만 이메일 전송에 문제가 있습니다. 관리자에게 문의해주세요.",
      emailSent,
    });
  } catch (error) {
    console.error("[Contact Form Error]", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
