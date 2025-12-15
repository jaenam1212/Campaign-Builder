'use client';

import { useEffect } from 'react';
import CampaignPreview from '@/components/CampaignPreview';
import { useCampaignStore } from '@/store/campaignStore';
import { useTrackView } from '@/lib/api/campaigns';

interface CampaignDetailClientProps {
  campaign: {
    id: string;
    title: string;
    subtitle?: string;
    image?: string;
    content: string;
    action_items?: any[];
    action_items_title?: string;
    show_action_items?: boolean;
    colors?: any;
    font?: any;
    background_gradient?: string;
    effects?: any;
    require_auth?: boolean;
    created_at?: string;
    updated_at?: string;
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
      subtitle: campaign.subtitle,
      image: campaign.image,
      content: campaign.content,
      actionItems: campaign.action_items || [],
      actionItemsTitle: campaign.action_items_title,
      showActionItems: campaign.show_action_items,
      colors: campaign.colors,
      font: campaign.font || null,
      backgroundGradient: campaign.background_gradient || null,
      effects: campaign.effects || null,
      requireAuth: campaign.require_auth,
      createdAt: campaign.created_at,
      updatedAt: campaign.updated_at,
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

