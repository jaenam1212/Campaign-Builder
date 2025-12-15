'use client';

import { useState } from 'react';
import { useCampaignStore } from '@/store/campaignStore';

export default function ShareButton() {
  const { draftCampaign } = useCampaignStore();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!draftCampaign?.id) {
      alert('먼저 캠페인을 저장해주세요.');
      return;
    }

    const shareUrl = `${window.location.origin}/campaigns/${draftCampaign.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: draftCampaign.title,
          text: draftCampaign.content,
          url: shareUrl,
        });
      } catch (err) {
        console.error('공유 실패:', err);
      }
    } else {
      // 클립보드에 복사
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
    >
      {copied ? '링크 복사됨!' : '공유하기'}
    </button>
  );
}

