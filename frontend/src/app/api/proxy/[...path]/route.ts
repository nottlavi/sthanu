import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:5289";

async function handleProxy(
  request: NextRequest,
  { params }: { params: { path: string[] } },
) {
  try {
    const targetPath = params.path.join("/");

    const targetUrl = `${BACKEND_URL}/api/${targetPath}${request.nextUrl.search}`;

    const cookieStore = await cookies();
    const token = cookieStore.get("sthanu_token")?.value;

    const contentType = request.headers.get("content-type") || "";
    const headers: Record<string, string> = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let body: any = undefined;
    const fetchInit: RequestInit = {
      method: request.method,
      headers: headers,
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      if (contentType.includes("multipart/form-data")) {
        // Forward the exact raw body stream and incoming content-type header (with boundary)
        headers["Content-Type"] = contentType;
        body = request.body;
        // Node's native fetch duplex requirement when streaming request.body
        (fetchInit as any).duplex = "half";
      } else {
        headers["Content-Type"] = contentType || "application/json";
        body = await request.text();
      }
    }

    fetchInit.body = body;

    const response = await fetch(targetUrl, fetchInit);
    if (response.status === 204) {
      return NextResponse.json(null, { status: 200 });
    }

    const data = await response.json().catch(() => null);
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Proxy request failed" },
      { status: 500 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
