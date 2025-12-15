'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import CampaignPreview from '@/components/CampaignPreview';
import { useCampaign, useTrackView } from '@/lib/api/campaigns';

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: campaign, isLoading, error } = useCampaign(id);
  const trackView = useTrackView();

  useEffect(() => {
    if (id) {
      // 조회수 추적 (비동기, 에러가 나도 페이지는 정상 표시)
      trackView.mutate({
        campaignId: id,
        userAgent: navigator.userAgent,
        referer: document.referrer,
      });
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
            <p className="text-red-600">{error.message || '캠페인을 불러올 수 없습니다.'}</p>
            <a
              href="/"
              className="mt-4 inline-block text-sm text-red-700 underline"
            >
              메인으로 돌아가기
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-4xl bg-white shadow-2xl">
        <CampaignPreview editable={false} />
      </div>
    </div>
  );
}

