'use client';

import { useEffect } from 'react';
import CampaignPreview from '@/components/CampaignPreview';
import { useCampaignStore } from '@/store/campaignStore';
import { useTrackView } from '@/lib/api/campaigns';

interface CampaignDetailClientProps {
  campaign: {
    id: string;
    title: string;
    subtitle?: string | null;
    image?: string | null;
    content: string;
    action_items?: string[] | null;
    action_items_title?: string | null;
    show_action_items?: boolean | null;
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
    } | null;
    font?: {
      family: string;
      weight: number;
    } | null;
    background_gradient?: string | null;
    effects?: {
      titleEffect?: string;
      backgroundOverlay?: string;
      signatureTicker?: boolean;
    } | null;
    require_auth?: boolean | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
}

export default function CampaignDetailClient({ campaign }: CampaignDetailClientProps) {
  const { setDraftCampaign } = useCampaignStore();
  const trackView = useTrackView();

  // 서버에서 받은 데이터를 전역 상태에 설정
  useEffect(() => {
    setDraftCampaign({
      id: campaign.id,
      title: campaign.title,
      subtitle: campaign.subtitle ?? undefined,
      image: campaign.image ?? undefined,
      content: campaign.content,
      actionItems: Array.isArray(campaign.action_items) ? campaign.action_items : [],
      actionItemsTitle: campaign.action_items_title ?? undefined,
      showActionItems: campaign.show_action_items ?? undefined,
      colors: campaign.colors || {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        background: '#ffffff',
        text: '#1f2937',
      },
      font: campaign.font ? (typeof campaign.font === 'object' ? campaign.font : undefined) : undefined,
      backgroundGradient: campaign.background_gradient ?? undefined,
      effects: campaign.effects ? (typeof campaign.effects === 'object' ? campaign.effects : undefined) : undefined,
      requireAuth: campaign.require_auth ?? false,
      createdAt: campaign.created_at ?? undefined,
      updatedAt: campaign.updated_at ?? undefined,
    });
  }, [campaign, setDraftCampaign]);

  // 조회수 추적
  useEffect(() => {
    if (campaign.id) {
      trackView.mutate({
        campaignId: campaign.id,
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
        referer: typeof window !== 'undefined' ? document.referrer : '',
      });
    }
  }, [campaign.id, trackView]);

  return <CampaignPreview editable={false} />;
}

