'use client';

import { useCampaignStore } from '@/store/campaignStore';

export default function ContentEditor() {
  const { draftCampaign, updateDraftCampaign } = useCampaignStore();

  if (!draftCampaign) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <label className="block text-sm font-medium text-gray-700">
        캠페인 내용
      </label>
      <textarea
        value={draftCampaign.content}
        onChange={(e) => updateDraftCampaign({ content: e.target.value })}
        placeholder="캠페인 내용을 입력하세요"
        rows={8}
        className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}

