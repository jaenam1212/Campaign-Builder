import { NextRequest, NextResponse } from "next/server";
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

    if (password.length < 6) {
      return NextResponse.json(
        { error: "비밀번호는 최소 6자 이상이어야 합니다." },
        { status: 400 }
      );
    }

    // 이미 존재하는 이메일인지 확인
    const { data: existingUser, error: checkError } = await supabase
      .from("admin_users")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Check existing user error:", checkError);
      return NextResponse.json(
        { error: "데이터베이스 오류가 발생했습니다.", details: checkError.message, code: checkError.code },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "이미 사용 중인 이메일입니다." },
        { status: 409 }
      );
    }

    // 비밀번호 해시화
    const passwordHash = await bcrypt.hash(password, 10);

    // DB에 관리자 계정 생성 (회원가입 시 자동으로 관리자 권한 부여)
    const { data: newUser, error: dbError } = await supabase
      .from("admin_users")
      .insert({
        email,
        password_hash: passwordHash,
        is_admin: true,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Signup DB error:", dbError);
      console.error("Error details:", JSON.stringify(dbError, null, 2));
      return NextResponse.json(
        { error: "회원가입에 실패했습니다.", details: dbError.message, code: dbError.code, hint: dbError.hint },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: { email: newUser.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

