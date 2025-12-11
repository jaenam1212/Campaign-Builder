import { NextRequest, NextResponse } from 'next/server';
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

    // 현재 사용자의 캠페인 조회
    let query = supabase
      .from('campaigns')
      .select('id, title, view_count, created_at, updated_at');

    // user_id가 있으면 해당 사용자의 캠페인만, 없으면 모든 캠페인
    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      // user_id가 null인 경우 (로그인 전에 만든 캠페인도 포함)
      query = query.is('user_id', null);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: '캠페인 조회 실패', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

