import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import CampaignDetailClient from './CampaignDetailClient';

// 이미지 URL을 절대 URL로 변환
async function getAbsoluteImageUrl(
  imageUrl: string | null | undefined,
  campaignId: string
): Promise<string | null> {
  if (!imageUrl) return null;

  // base64 data URL인 경우 OG 이미지 API 엔드포인트 사용
  if (imageUrl.startsWith('data:')) {
    return await getAbsoluteUrl(`/api/campaigns/${campaignId}/og-image`);
  }

  // 이미 절대 URL이면 그대로 반환
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    // 로컬호스트는 외부에서 접근 불가하므로 null 반환
    if (imageUrl.includes('localhost') || imageUrl.includes('127.0.0.1')) {
      return null;
    }
    return imageUrl;
  }

  // 상대 경로면 절대 URL로 변환
  return await getAbsoluteUrl(imageUrl);
}

// 절대 URL 생성
async function getAbsoluteUrl(path: string): Promise<string> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
  }

  // 환경 변수가 없으면 headers에서 호스트 정보 가져오기
  try {
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    return `${protocol}://${host}${path.startsWith('/') ? path : `/${path}`}`;
  } catch {
    // headers를 사용할 수 없으면 기본값 반환
    return `https://example.com${path.startsWith('/') ? path : `/${path}`}`;
  }
}

// 서버 컴포넌트에서 메타데이터 생성 (SEO)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('title, subtitle, content, image')
      .eq('id', id)
      .single();

    if (!campaign) {
      return {
        title: '캠페인을 찾을 수 없습니다',
        description: '요청하신 캠페인을 찾을 수 없습니다.',
      };
    }

    const title = campaign.title || '캠페인';
    const description = campaign.subtitle || campaign.content?.substring(0, 160) || '캠페인을 확인해보세요';
    const imageUrl = await getAbsoluteImageUrl(campaign.image, id);
    const pageUrl = await getAbsoluteUrl(`/campaigns/${id}`);

    // 메타데이터 구성
    const metadata: Metadata = {
      title: `${title} | 캠페인 빌더`,
      description: description,
      openGraph: {
        title: title,
        description: description,
        url: pageUrl,
        siteName: '캠페인 빌더',
        type: 'website',
        ...(imageUrl && {
          images: [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
        }),
      },
      twitter: {
        card: imageUrl ? 'summary_large_image' : 'summary',
        title: title,
        description: description,
        ...(imageUrl && {
          images: [imageUrl],
        }),
      },
    };

    return metadata;
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: '캠페인 | 캠페인 빌더',
      description: '캠페인을 확인해보세요',
    };
  }
}

// 서버 컴포넌트로 데이터 페칭
export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: campaign, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !campaign) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-4xl bg-white shadow-2xl">
        <CampaignDetailClient campaign={campaign} />
      </div>
    </div>
  );
}
