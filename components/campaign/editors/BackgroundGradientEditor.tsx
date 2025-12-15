'use client';

import { useCampaignStore } from '@/store/campaignStore';

export const GRADIENT_PRESETS = [
  {
    name: '순수 배경색',
    value: 'none',
    preview: '#ffffff',
    gradient: '',
  },
  // 강렬한 그라데이션 (ilovewar 스타일)
  {
    name: '전쟁의 불꽃',
    value: 'war-fire',
    preview: 'linear-gradient(135deg, #b91c1c 0%, #1f2937 50%, #c2410c 100%)',
    gradient: 'linear-gradient(135deg, #b91c1c 0%, #1f2937 50%, #c2410c 100%)',
  },
  {
    name: '불타는 결의',
    value: 'burning-resolve',
    preview: 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)',
    gradient: 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)',
  },
  {
    name: '어두운 분노',
    value: 'dark-rage',
    preview: 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 50%, #7c2d12 100%)',
    gradient: 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 50%, #7c2d12 100%)',
  },
  {
    name: '혁명의 불길',
    value: 'revolution-flame',
    preview: 'linear-gradient(135deg, #ef4444 0%, #f97316 50%, #dc2626 100%)',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 50%, #dc2626 100%)',
  },
  {
    name: '석양',
    value: 'sunset',
    preview: 'linear-gradient(135deg, #ff6b6b 0%, #ffd93d 50%, #6bcf7f 100%)',
    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ffd93d 50%, #6bcf7f 100%)',
  },
  {
    name: '바다',
    value: 'ocean',
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    name: '불타는 열정',
    value: 'fire',
    preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    name: '싱그러운 숲',
    value: 'forest',
    preview: 'linear-gradient(135deg, #13547a 0%, #80d0c7 100%)',
    gradient: 'linear-gradient(135deg, #13547a 0%, #80d0c7 100%)',
  },
  {
    name: '로즈골드',
    value: 'rose-gold',
    preview: 'linear-gradient(135deg, #d4af37 0%, #f8cdda 50%, #ffd700 100%)',
    gradient: 'linear-gradient(135deg, #d4af37 0%, #f8cdda 50%, #ffd700 100%)',
  },
  {
    name: '야경',
    value: 'night',
    preview: 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%)',
    gradient: 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%)',
  },
  {
    name: '라벤더',
    value: 'lavender',
    preview: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  },
  {
    name: '선명한 청록',
    value: 'cyan',
    preview: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
    gradient: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
  },
  {
    name: '따뜻한 자몽',
    value: 'grapefruit',
    preview: 'linear-gradient(135deg, #e96443 0%, #904e95 100%)',
    gradient: 'linear-gradient(135deg, #e96443 0%, #904e95 100%)',
  },
  {
    name: '민트 초콜릿',
    value: 'mint-chocolate',
    preview: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    gradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
  },
  {
    name: '복숭아',
    value: 'peach',
    preview: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  },
  {
    name: '황금빛',
    value: 'golden',
    preview: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
    gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
  },
  {
    name: '우주',
    value: 'cosmic',
    preview: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
    gradient: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
  },
  {
    name: '하늘색 꿈',
    value: 'sky-dream',
    preview: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  },
  {
    name: '네온',
    value: 'neon',
    preview: 'linear-gradient(135deg, #7f00ff 0%, #e100ff 100%)',
    gradient: 'linear-gradient(135deg, #7f00ff 0%, #e100ff 100%)',
  },
  {
    name: '에메랄드',
    value: 'emerald',
    preview: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  },
  {
    name: '베리',
    value: 'berry',
    preview: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)',
    gradient: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)',
  },
];

export default function BackgroundGradientEditor() {
  const { draftCampaign, updateDraftCampaign } = useCampaignStore();

  if (!draftCampaign) return null;

  const currentGradient = draftCampaign.backgroundGradient || 'none';

  const handleGradientChange = (presetValue: string) => {
    const preset = GRADIENT_PRESETS.find((p) => p.value === presetValue);
    if (!preset) return;

    updateDraftCampaign({
      backgroundGradient: presetValue,
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        배경 그라데이션
      </label>

      <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto">
        {GRADIENT_PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handleGradientChange(preset.value)}
            className={`relative group rounded-lg overflow-hidden transition-all ${
              currentGradient === preset.value
                ? 'ring-2 ring-blue-500 ring-offset-2'
                : 'hover:scale-105'
            }`}
            title={preset.name}
          >
            {/* 프리셋 미리보기 */}
            <div
              className="h-20 w-full"
              style={{
                background: preset.value === 'none' ? draftCampaign.colors.background : preset.preview,
              }}
            />

            {/* 선택 표시 */}
            {currentGradient === preset.value && (
              <div className="absolute top-1 right-1 flex items-center justify-center bg-blue-500 rounded-full w-6 h-6 shadow-lg">
                <span className="text-white text-sm">✓</span>
              </div>
            )}

            {/* 이름 라벨 - 항상 표시 */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs px-2 py-2 text-center font-medium">
              {preset.name}
            </div>
          </button>
        ))}
      </div>

      {/* 현재 선택된 그라데이션 정보 */}
      <div className="mt-3 border-t border-gray-200 pt-3">
        <div className="text-xs text-gray-500 mb-2">현재 선택</div>
        <div className="flex items-center gap-2">
          <div
            className="h-8 w-16 rounded border border-gray-300"
            style={{
              background:
                currentGradient === 'none'
                  ? draftCampaign.colors.background
                  : GRADIENT_PRESETS.find((p) => p.value === currentGradient)?.preview,
            }}
          />
          <span className="text-sm font-medium text-gray-700">
            {GRADIENT_PRESETS.find((p) => p.value === currentGradient)?.name}
          </span>
        </div>
      </div>

      {/* 안내 메시지 */}
      {currentGradient !== 'none' && (
        <div className="mt-2 text-xs text-gray-500 bg-blue-50 p-2 rounded">
          💡 그라데이션이 적용되면 배경색 설정은 무시됩니다.
        </div>
      )}
    </div>
  );
}

