import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { isAdmin, getUserId } from '@/lib/auth';

export async function GET(request: NextRequest) {
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
    const cookieStore = await cookies();
    const userEmail = cookieStore.get('admin_user_email')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: '사용자 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // DB에서 사용자 정보 조회
    const { data: userData, error: dbError } = await supabase
      .from('admin_users')
      .select('id, email, created_at')
      .eq('id', userId)
      .maybeSingle();

    if (dbError || !userData) {
      // DB에서 못 찾으면 쿠키 정보 반환
      return NextResponse.json({
        success: true,
        data: {
          email: userEmail || '관리자',
          created_at: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        email: userData.email,
        created_at: userData.created_at,
      },
    });
  } catch (error) {
    console.error('Get user info error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

