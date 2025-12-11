'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import CampaignPreview from '@/components/CampaignPreview';
import { useCampaignStore } from '@/store/campaignStore';

interface Campaign {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  content: string;
  action_items?: string[];
  action_items_title?: string;
  show_action_items?: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  require_auth: boolean;
  created_at: string;
  updated_at: string;
}

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { setDraftCampaign } = useCampaignStore();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCampaign(id);
    }
  }, [id]);

  const fetchCampaign = async (campaignId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/campaigns/${campaignId}`);
      const result = await response.json();

      if (result.success && result.data) {
        const campaignData = result.data;
        // CampaignStore 형식으로 변환
        setDraftCampaign({
          id: campaignData.id,
          title: campaignData.title,
          subtitle: campaignData.subtitle,
          image: campaignData.image,
          content: campaignData.content,
          actionItems: campaignData.action_items || [],
          actionItemsTitle: campaignData.action_items_title,
          showActionItems: campaignData.show_action_items,
          colors: campaignData.colors,
          requireAuth: campaignData.require_auth,
          createdAt: campaignData.created_at,
          updatedAt: campaignData.updated_at,
        });
        setCampaign(campaignData);
      } else {
        setError(result.error || '캠페인을 불러올 수 없습니다.');
      }
    } catch (err) {
      console.error('Error fetching campaign:', err);
      setError('캠페인을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
            <p className="text-red-600">{error}</p>
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

