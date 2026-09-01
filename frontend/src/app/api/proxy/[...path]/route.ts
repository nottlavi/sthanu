import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:5289";

async function handleProxy(
  request: NextRequest,
  { params }: { params: { path: string[] } },
) {
  try {
    const targetPath = params.path.join("/");

    const targetUrl = `${BACKEND_URL}/api/${targetPath}`;

    const cookieStore = await cookies();
    const token = cookieStore.get("sthanu_token")?.value;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let body = undefined;

    if (request.method !== "GET" && request.method !== "HEAD") {
      try {
        body = await request.json();
      } catch (err: any) {
        body = undefined;
      }
    }

    const response = await axios({
      method: request.method,
      url: targetUrl,
      data: body,
      headers: headers,
      params: Object.fromEntries(request.nextUrl.searchParams),
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { message: "Proxy request failed" };
    return NextResponse.json(data, { status });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
