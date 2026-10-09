import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { success } from "zod";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.delete("sthanu_token");

  return NextResponse.json({
    success: true,
  });
}
