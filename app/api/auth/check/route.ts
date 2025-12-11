import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin_session");

    return NextResponse.json(
      { isAuthenticated: adminSession?.value === "authenticated" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다.", isAuthenticated: false },
      { status: 500 }
    );
  }
}
