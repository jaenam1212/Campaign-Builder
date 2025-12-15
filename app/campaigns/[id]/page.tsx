import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import CampaignDetailClient from './CampaignDetailClient';

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
    const imageUrl = campaign.image || '/og-image.png';

    return {
      title: `${title} | 캠페인 빌더`,
      description: description,
      openGraph: {
        title: title,
        description: description,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        images: [imageUrl],
      },
    };
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
