import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
      return new NextResponse('Image not found', { status: 404 });
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
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    }

    // 일반 URL인 경우 리다이렉트
    if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
      return NextResponse.redirect(imageData);
    }

    return new NextResponse('Invalid image format', { status: 400 });
  } catch (error) {
    console.error('Error serving OG image:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

