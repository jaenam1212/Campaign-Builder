'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCampaignStore } from '@/store/campaignStore';

export default function ImageUploader() {
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

  const handleRemove = () => {
    setImageUrl('');
    updateDraftCampaign({ image: '' });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <label className="block text-sm font-medium text-gray-700">
        이미지
      </label>
      <div className="mt-2 space-y-3">
        <input
          type="text"
          value={imageUrl}
          onChange={handleUrlChange}
          placeholder="이미지 URL 입력"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <div className="flex items-center gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            파일 선택
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          {imageUrl && (
            <button
              onClick={handleRemove}
              className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              삭제
            </button>
          )}
        </div>
        {imageUrl && (
          <div className="relative mt-2 h-32 w-full overflow-hidden rounded-md">
            <Image
              src={imageUrl}
              alt="미리보기"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
      </div>
    </div>
  );
}

