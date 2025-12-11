import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "이메일과 비밀번호를 입력해주세요." },
        { status: 400 }
      );
    }

    // DB에서 관리자 사용자 조회 (.maybeSingle() 사용 - 결과가 없어도 에러 발생 안 함)
    const { data: adminUser, error: dbError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .eq("is_admin", true)
      .maybeSingle();

    // 디버깅 로그
    console.log("Login attempt:", { email, dbError, adminUser: adminUser ? { email: adminUser.email, has_hash: !!adminUser.password_hash } : null });

    // PGRST116은 결과가 없을 때 발생하는 정상적인 에러이므로 무시
    if (dbError && dbError.code !== 'PGRST116') {
      console.error("DB Error:", dbError);
      return NextResponse.json(
        { error: "데이터베이스 오류가 발생했습니다.", details: dbError.message },
        { status: 500 }
      );
    }

    if (!adminUser) {
      return NextResponse.json(
        { error: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    // 비밀번호 확인 (password_hash가 null이 아닌지 확인)
    if (!adminUser.password_hash) {
      console.error("Password hash is missing");
      return NextResponse.json(
        { error: "계정 설정에 문제가 있습니다." },
        { status: 500 }
      );
    }

    const isValidPassword = await bcrypt.compare(
      password,
      adminUser.password_hash.trim()
    );

    console.log("Password check:", { isValid: isValidPassword });

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    // 쿠키에 관리자 세션 저장 (24시간 유지)
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24시간
      path: "/",
    });
    
    // 사용자 ID와 이메일을 쿠키에 저장 (마이페이지 등에서 사용)
    cookieStore.set("admin_user_id", adminUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24시간
      path: "/",
    });
    
    cookieStore.set("admin_user_email", adminUser.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24시간
      path: "/",
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
