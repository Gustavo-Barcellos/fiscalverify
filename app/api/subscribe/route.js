import { NextResponse } from "next/server";
import { handleSubscribe } from "@/lib/subscribeHandler";

export async function POST(request) {
  /** @type {{ name?: string; email?: string; consent?: boolean; companyWebsite?: string; captcha?: string }} */
  const payload = await request.json();
  const result = await handleSubscribe(payload);

  return NextResponse.json({ message: result.message }, { status: result.status });
}
