'use client';

import { useEffect } from 'react';
import { useCampaignStore } from '@/store/campaignStore';
import CampaignEditor from '@/components/CampaignEditor';
import Header from '@/components/Header';

export default function NewCampaignPage() {
  const { draftCampaign, updateDraftCampaign } = useCampaignStore();

  useEffect(() => {
    if (!draftCampaign) {
      updateDraftCampaign({
        title: '',
        subtitle: '',
        content: '',
        actionItems: [],
        requireAuth: false,
      });
    }
  }, [draftCampaign, updateDraftCampaign]);

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Header />
      <div className="flex-1 overflow-hidden">
        <CampaignEditor />
      </div>
    </div>
  );
}

