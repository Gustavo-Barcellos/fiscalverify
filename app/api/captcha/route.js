import { NextResponse } from "next/server";
import { createCaptchaChallenge } from "@/lib/captcha";

export async function GET() {
  const { question, token } = createCaptchaChallenge();
  const response = NextResponse.json({ question });

  response.cookies.set("fv_captcha", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });

  return response;
}
