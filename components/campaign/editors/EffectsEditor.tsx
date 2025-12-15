'use client';

import { useCampaignStore } from '@/store/campaignStore';

export const EFFECT_OPTIONS = {
  titleEffect: [
    { value: 'none', label: '효과 없음' },
    { value: 'float', label: '떠다니기' },
    { value: 'gradient-animate', label: '그라데이션 이동' },
    { value: 'split-text', label: 'Split Text' },
    { value: 'text-type', label: '타이핑 효과' },
    { value: 'shuffle', label: 'Shuffle' },
  ],
  backgroundOverlay: [
    { value: 'none', label: '오버레이 없음' },
    { value: 'radial-red', label: '빨간 라디얼' },
    { value: 'radial-blue', label: '파란 라디얼' },
    { value: 'radial-multi', label: '다중 라디얼' },
  ],
  signatureTicker: [
    { value: false, label: '서명 티커 끄기' },
    { value: true, label: '서명 티커 켜기' },
  ],
};

export default function EffectsEditor() {
  const { draftCampaign, updateDraftCampaign } = useCampaignStore();

  if (!draftCampaign) return null;

  const currentEffects = draftCampaign.effects || {
    titleEffect: 'none',
    backgroundOverlay: 'none',
    signatureTicker: false,
  };

  const handleEffectChange = (key: string, value: string | boolean) => {
    updateDraftCampaign({
      effects: {
        ...currentEffects,
        [key]: value,
      },
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        애니메이션 효과
      </label>

      <div className="space-y-4">
        {/* 제목 효과 */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            제목 애니메이션
          </label>
          <div className="space-y-2">
            {EFFECT_OPTIONS.titleEffect.map((option) => (
              <button
                key={option.value}
                onClick={() => handleEffectChange('titleEffect', option.value)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  currentEffects.titleEffect === option.value
                    ? 'bg-blue-100 border-blue-500 border'
                    : 'hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{option.label}</span>
                  {currentEffects.titleEffect === option.value && (
                    <span className="text-blue-600 text-xs">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 배경 오버레이 */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            배경 오버레이
          </label>
          <div className="space-y-2">
            {EFFECT_OPTIONS.backgroundOverlay.map((option) => (
              <button
                key={option.value}
                onClick={() => handleEffectChange('backgroundOverlay', option.value)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  currentEffects.backgroundOverlay === option.value
                    ? 'bg-blue-100 border-blue-500 border'
                    : 'hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{option.label}</span>
                  {currentEffects.backgroundOverlay === option.value && (
                    <span className="text-blue-600 text-xs">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 서명 티커 */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            배경 서명 스크롤
          </label>
          <div className="space-y-2">
            {EFFECT_OPTIONS.signatureTicker.map((option) => (
              <button
                key={String(option.value)}
                onClick={() => handleEffectChange('signatureTicker', option.value)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  currentEffects.signatureTicker === option.value
                    ? 'bg-blue-100 border-blue-500 border'
                    : 'hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{option.label}</span>
                  {currentEffects.signatureTicker === option.value && (
                    <span className="text-blue-600 text-xs">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 미리보기 설명 */}
      <div className="mt-4 border-t border-gray-200 pt-3">
        <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
          💡 애니메이션 효과는 실제 캠페인 페이지에서 확인할 수 있습니다.
        </div>
      </div>
    </div>
  );
}

