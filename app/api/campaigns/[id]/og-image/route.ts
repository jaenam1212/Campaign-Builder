import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Edge Runtime으로 실행하여 CDN 캐싱 최적화
export const runtime = 'edge';

// 정적 생성 재검증 시간 (1년)
export const revalidate = 31536000;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 캠페인 데이터 조회
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .select('image')
      .eq('id', id)
      .single();

    if (error || !campaign || !campaign.image) {
      return new NextResponse('Image not found', {
        status: 404,
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=300', // 404도 5분간 캐싱
        }
      });
    }

    const imageData = campaign.image;

    // base64 data URL인 경우
    if (imageData.startsWith('data:image/')) {
      // data URL에서 base64 부분만 추출
      const base64Match = imageData.match(/^data:image\/([^;]+);base64,(.+)$/);
      if (base64Match) {
        const mimeType = base64Match[1];
        const base64Data = base64Match[2];

        // base64 디코드
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // 적절한 Content-Type 설정
        const contentType = `image/${mimeType}`;

        return new NextResponse(imageBuffer, {
          headers: {
            'Content-Type': contentType,
            // 강력한 캐싱: 1년간 캐싱, immutable로 재검증 방지
            'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
            // CDN 캐싱 추가
            'CDN-Cache-Control': 'public, max-age=31536000, immutable',
            'Vercel-CDN-Cache-Control': 'public, max-age=31536000, immutable',
            // ETag 생성으로 조건부 요청 지원
            'ETag': `"${id}-${base64Data.substring(0, 20)}"`,
          },
        });
      }
    }

    // 일반 URL인 경우 리다이렉트 (캐시 헤더 포함)
    if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
      return NextResponse.redirect(imageData, {
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600', // 1시간 캐싱
        }
      });
    }

    return new NextResponse('Invalid image format', {
      status: 400,
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      }
    });
  } catch (error) {
    console.error('Error serving OG image:', error);
    return new NextResponse('Internal server error', {
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    });
  }
}

