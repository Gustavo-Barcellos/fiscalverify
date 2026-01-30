import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { handleSubscribe } from "@/lib/subscribeHandler";

export async function POST(request) {
  /** @type {{ name?: string; email?: string; consent?: boolean; companyWebsite?: string; captcha?: string }} */
  const payload = await request.json();
  const captchaToken = cookies().get("fv_captcha")?.value;
  const result = await handleSubscribe(payload, { captchaToken });

  return NextResponse.json({ message: result.message }, { status: result.status });
}
