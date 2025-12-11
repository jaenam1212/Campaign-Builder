import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    // 캠페인별 조회수 조회
    const { data, error } = await supabase
      .from('campaigns')
      .select('id, title, view_count, created_at')
      .order('view_count', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: '통계 조회 실패', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

