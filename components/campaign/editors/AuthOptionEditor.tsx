'use client';

import { useCampaignStore } from '@/store/campaignStore';

export default function AuthOptionEditor() {
    const { draftCampaign, updateDraftCampaign } = useCampaignStore();

    if (!draftCampaign) return null;

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
            <label className="block text-sm font-medium text-gray-700">
                인증 옵션
            </label>
            <div className="mt-3 flex items-center gap-2">
                <label className="flex cursor-pointer items-center gap-2">
                    <input
                        type="checkbox"
                        checked={draftCampaign.requireAuth}
                        onChange={(e) => updateDraftCampaign({ requireAuth: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                        SNS 인증 및 서명이 필요합니다
                    </span>
                </label>
            </div>
            {draftCampaign.requireAuth && (
                <p className="mt-2 text-xs text-gray-500">
                    이 옵션을 활성화하면 캠페인 참여 시 로그인이 필요하며 서명 기능이 활성화됩니다.
                </p>
            )}
        </div>
    );
}

