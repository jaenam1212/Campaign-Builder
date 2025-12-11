import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcrypt';
import { isAdmin, getUserId } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { error: '사용자 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: '현재 비밀번호와 새 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: '비밀번호는 최소 6자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // 현재 사용자 정보 조회
    const { data: userData, error: userError } = await supabase
      .from('admin_users')
      .select('password_hash')
      .eq('id', userId)
      .maybeSingle();

    if (userError || !userData) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 현재 비밀번호 확인
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      userData.password_hash
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: '현재 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 새 비밀번호 해시화
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // 비밀번호 업데이트
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({ password_hash: newPasswordHash })
      .eq('id', userId);

    if (updateError) {
      console.error('Password update error:', updateError);
      return NextResponse.json(
        { error: '비밀번호 변경에 실패했습니다.', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

