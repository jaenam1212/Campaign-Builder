'use client';

import { useState } from 'react';
import { useCampaignStore } from '@/store/campaignStore';

export default function ImageEditor() {
    const { draftCampaign, updateDraftCampaign } = useCampaignStore();
    const [imageUrl, setImageUrl] = useState(draftCampaign?.image || '');

    if (!draftCampaign) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImageUrl(result);
                updateDraftCampaign({ image: result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setImageUrl(url);
        updateDraftCampaign({ image: url });
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
            <label className="block text-sm font-medium text-gray-700">
                캠페인 이미지
            </label>
            <div className="mt-2 space-y-4">
                <input
                    type="text"
                    value={imageUrl}
                    onChange={handleUrlChange}
                    placeholder="이미지 URL을 입력하거나 파일을 업로드하세요"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="flex items-center gap-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="text-sm text-gray-600"
                    />
                    <span className="text-sm text-gray-500">또는 파일 선택</span>
                </div>
                {imageUrl && (
                    <div className="mt-4">
                        <img
                            src={imageUrl}
                            alt="캠페인 미리보기"
                            className="max-h-64 rounded-md object-cover"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

