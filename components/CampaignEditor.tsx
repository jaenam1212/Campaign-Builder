'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCampaignStore } from '@/store/campaignStore';
import { useCreateCampaign } from '@/lib/api/campaigns';
import CampaignPreview from './CampaignPreview';
import ColorEditor from './campaign/editors/ColorEditor';
import AuthOptionEditor from './campaign/editors/AuthOptionEditor';
import FontEditor from './campaign/editors/FontEditor';
import BackgroundGradientEditor from './campaign/editors/BackgroundGradientEditor';
import EffectsEditor from './campaign/editors/EffectsEditor';

export default function CampaignEditor() {
  const router = useRouter();
  const { draftCampaign, clearDraftCampaign } = useCampaignStore();
  const [showSettings, setShowSettings] = useState(true);
  const createCampaign = useCreateCampaign();

  if (!draftCampaign) {
    return <div>로딩 중...</div>;
  }

  const handleSave = async () => {
    if (!draftCampaign) return;

    try {
      await createCampaign.mutateAsync({
        title: draftCampaign.title,
        subtitle: draftCampaign.subtitle,
        image: draftCampaign.image,
        content: draftCampaign.content,
        actionItems: draftCampaign.actionItems || [],
        actionItemsTitle: draftCampaign.actionItemsTitle || '행동강령',
        showActionItems: draftCampaign.showActionItems !== false,
        colors: draftCampaign.colors,
        font: draftCampaign.font,
        backgroundGradient: draftCampaign.backgroundGradient,
        effects: draftCampaign.effects,
        requireAuth: draftCampaign.requireAuth || false,
      });

      alert('캠페인이 저장되었습니다!');
      // 전역 상태 초기화
      clearDraftCampaign();
      // 메인 페이지로 이동
      router.push('/');
    } catch (error) {
      console.error('Error saving campaign:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      alert(`저장 실패: ${errorMessage}`);
    }
  };

  return (
    <div className="relative flex h-full">
      {/* 설정 사이드바 */}
      <div
        className={`absolute right-0 top-0 z-40 h-full w-80 overflow-y-auto border-l border-gray-200 bg-white shadow-lg transition-transform ${
          showSettings ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-gray-900">설정</h2>
          <button
            onClick={() => setShowSettings(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <div className="space-y-6 p-4">
          <FontEditor />
          <ColorEditor />
          <BackgroundGradientEditor />
          <EffectsEditor />
          <AuthOptionEditor />
          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={createCampaign.isPending}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createCampaign.isPending ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </div>
      </div>

      {/* 미리보기 영역 */}
      <div className="flex-1 overflow-y-auto bg-gray-100">
        <div className="mx-auto max-w-4xl bg-white shadow-2xl">
          <CampaignPreview editable={true} />
        </div>
        {!showSettings && (
          <button
            onClick={() => setShowSettings(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full bg-blue-600 p-4 text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl md:bottom-8 md:right-8"
            title="설정 열기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
