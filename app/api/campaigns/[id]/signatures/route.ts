import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserId } from '@/lib/auth';

// 서명 목록 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from('signatures')
      .select('*')
      .eq('campaign_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: '서명 조회 실패', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, signatures: data || [] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching signatures:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 서명 생성
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, content } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: '이름은 필수입니다.' },
        { status: 400 }
      );
    }

    // 현재 사용자 ID 가져오기 (옵션)
    const userId = await getUserId();

    const { data, error } = await supabase
      .from('signatures')
      .insert({
        campaign_id: id,
        name: name.trim(),
        content: content?.trim() || null,
        user_id: userId || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: '서명 저장 실패', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error creating signature:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

