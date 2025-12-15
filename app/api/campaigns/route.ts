import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserId } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      subtitle,
      image,
      content,
      actionItems,
      actionItemsTitle,
      showActionItems,
      colors,
      font,
      backgroundGradient,
      effects,
      requireAuth,
    } = body;

    // 필수 필드 검증
    if (!title || !content) {
      return NextResponse.json(
        { error: '제목과 내용은 필수입니다.' },
        { status: 400 }
      );
    }

    // 현재 사용자 ID 가져오기
    const userId = await getUserId();

    // Supabase에 저장
    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        title,
        subtitle: subtitle || null,
        image: image || null,
        content,
        action_items: actionItems || [],
        action_items_title: actionItemsTitle || '행동강령',
        show_action_items: showActionItems !== false,
        colors: colors || {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
          background: '#ffffff',
          text: '#1f2937',
        },
        font: font || null,
        background_gradient: backgroundGradient || null,
        effects: effects || null,
        require_auth: requireAuth || false,
        user_id: userId || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { 
          error: '캠페인 저장 실패', 
          details: error.message,
          hint: error.hint,
          code: error.code
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving campaign:', error);
    return NextResponse.json(
      { 
        error: '서버 오류가 발생했습니다.',
        details: error?.message || '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

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

