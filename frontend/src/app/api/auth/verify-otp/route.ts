import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:5289";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await axios.post(
      `${BACKEND_URL}/api/auth/verify-otp`,
      body,
    );

    const { token, isProfileComplete, user } = response.data;

    if (token) {
      const cookieStore = await cookies();
      cookieStore.set("sthanu_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 3600, //set to 1 hour, supabase,
      });
    }

    return NextResponse.json({
      isProfileComplete,
      user,
    });
  } catch (err: any) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.message || "Failed to verify OTP";
    return NextResponse.json({ message }, { status });
  }
}
