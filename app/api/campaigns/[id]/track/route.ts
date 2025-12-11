import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userAgent, referer } = body;

    // IP 주소 가져오기
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // 조회수 증가
    const { error: rpcError } = await supabase.rpc('increment_campaign_views', {
      campaign_uuid: id,
    });

    if (rpcError) {
      console.error('RPC error:', rpcError);
    }

    // 상세 조회 로그 저장 (선택적, 실패해도 조회수는 증가됨)
    try {
      await supabase.from('campaign_views').insert({
        campaign_id: id,
        ip_address: ip,
        user_agent: userAgent,
        referer: referer,
      });
    } catch (logError) {
      // 로그 저장 실패해도 조회수는 정상적으로 증가됨
      console.error('Log insert error:', logError);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Track view error:', error);
    // 조회수 추적 실패해도 페이지는 정상 표시되어야 함
    return NextResponse.json({ success: false }, { status: 200 });
  }
}

