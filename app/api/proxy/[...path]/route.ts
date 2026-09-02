import { NextRequest, NextResponse } from "next/server";
import { getSessionToken } from "@/lib/session";

async function forward(request: NextRequest, path: string[]) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json(
      { status: 401, title: "Not authenticated" },
      { status: 401 },
    );
  }

  const targetUrl = `${process.env.SPRING_API_URL}/api/v1/${path.join("/")}${request.nextUrl.search}`;

  const hasBody = !["GET", "HEAD", "DELETE"].includes(request.method)
    ? await request.text()
    : undefined;

  const springResponse = await fetch(targetUrl, {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: hasBody || undefined,
  });

  // 204 No Content has no body - reading .json() on it would throw.
  if (springResponse.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await springResponse.json().catch(() => null);
  return NextResponse.json(data, { status: springResponse.status });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return forward(request, (await params).path);
}
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return forward(request, (await params).path);
}
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return forward(request, (await params).path);
}
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return forward(request, (await params).path);
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return forward(request, (await params).path);
}
