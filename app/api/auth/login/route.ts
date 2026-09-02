import { NextRequest, NextResponse } from "next/server";
import { setSession } from "@/lib/session";
import type { ProblemDetail } from "@/lib/types";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const springResponse = await fetch(
    `${process.env.SPRING_API_URL}/api/v1/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (!springResponse.ok) {
    const problem: ProblemDetail = await springResponse.json().catch(() => ({
      status: springResponse.status,
      title: "Login failed",
    }));
    return NextResponse.json(problem, { status: springResponse.status });
  }

  const { token, userId, tenantId, role } = await springResponse.json();
  await setSession(token, { userId, tenantId, role });

  // Never echo the token back to the client - it already lives in the httpOnly cookie.
  return NextResponse.json({ userId, tenantId, role });
}
