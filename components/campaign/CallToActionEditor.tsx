'use client';

import { useCampaignStore } from '@/store/campaignStore';

export default function CallToActionEditor() {
    const { draftCampaign, updateDraftCampaign } = useCampaignStore();

    if (!draftCampaign) return null;

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
            <label className="block text-sm font-medium text-gray-700">
                행동강령 (Call to Action)
            </label>
            <input
                type="text"
                value={draftCampaign.callToAction}
                onChange={(e) => updateDraftCampaign({ callToAction: e.target.value })}
                placeholder="예: 지금 서명하기, 더 알아보기, 참여하기"
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="mt-2 text-xs text-gray-500">
                사용자에게 어떤 행동을 취하도록 할지 명확하게 작성하세요
            </p>
        </div>
    );
}

