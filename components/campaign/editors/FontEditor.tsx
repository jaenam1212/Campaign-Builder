'use client';

import { useCampaignStore } from '@/store/campaignStore';

export const AVAILABLE_FONTS = [
  { value: 'noto-sans-kr', label: 'Noto Sans KR', style: 'var(--font-noto-sans-kr)', weights: [100, 300, 400, 500, 700, 900], category: '깔끔한' },
  { value: 'black-han-sans', label: '검은고딕', style: 'var(--font-black-han-sans)', weights: [400], category: '강렬한' },
  { value: 'nanum-gothic', label: '나눔고딕', style: 'var(--font-nanum-gothic)', weights: [400, 700, 800], category: '깔끔한' },
  { value: 'nanum-myeongjo', label: '나눔명조', style: 'var(--font-nanum-myeongjo)', weights: [400, 700, 800], category: '우아한' },
  { value: 'jua', label: '주아', style: 'var(--font-jua)', weights: [400], category: '귀여운' },
  { value: 'do-hyeon', label: '도현', style: 'var(--font-do-hyeon)', weights: [400], category: '강렬한' },
  { value: 'sunflower', label: '해바라기', style: 'var(--font-sunflower)', weights: [300, 500, 700], category: '귀여운' },
  { value: 'gamja-flower', label: '감자꽃', style: 'var(--font-gamja-flower)', weights: [400], category: '재미있는' },
  { value: 'gothic-a1', label: 'Gothic A1', style: 'var(--font-gothic-a1)', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], category: '모던한' },
  { value: 'gowun-batang', label: '고운바탕', style: 'var(--font-gowun-batang)', weights: [400, 700], category: '우아한' },
  { value: 'east-sea-dokdo', label: '독도', style: 'var(--font-east-sea-dokdo)', weights: [400], category: '손글씨' },
  { value: 'single-day', label: '싱글데이', style: 'var(--font-single-day)', weights: [400], category: '손글씨' },
];

export default function FontEditor() {
  const { draftCampaign, updateDraftCampaign } = useCampaignStore();

  if (!draftCampaign) return null;

  const currentFont = draftCampaign.font?.family || 'noto-sans-kr';
  const currentWeight = draftCampaign.font?.weight || 400;
  const selectedFontData = AVAILABLE_FONTS.find((f) => f.value === currentFont);
  const availableWeights = selectedFontData?.weights || [400];

  const handleFontChange = (fontValue: string) => {
    const fontData = AVAILABLE_FONTS.find((f) => f.value === fontValue);
    if (!fontData) return;

    // 선택한 폰트에서 지원하는 가중치 중 가장 가까운 값 찾기
    const closestWeight = fontData.weights.reduce((prev, curr) =>
      Math.abs(curr - currentWeight) < Math.abs(prev - currentWeight) ? curr : prev
    );

    updateDraftCampaign({
      font: {
        family: fontValue,
        weight: closestWeight,
      },
    });
  };

  const handleWeightChange = (weight: number) => {
    updateDraftCampaign({
      font: {
        family: currentFont,
        weight,
      },
    });
  };

  // 카테고리별로 폰트 그룹화
  const categories = ['강렬한', '깔끔한', '우아한', '귀여운', '재미있는', '손글씨', '모던한'];
  const groupedFonts = categories.map((category) => ({
    category,
    fonts: AVAILABLE_FONTS.filter((font) => font.category === category),
  }));

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        폰트 설정
      </label>

      {/* 폰트 선택 */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            폰트 스타일
          </label>
          <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-md p-2">
            {groupedFonts.map(({ category, fonts }) => {
              if (fonts.length === 0) return null;
              return (
                <div key={category}>
                  <div className="text-xs font-semibold text-gray-500 mb-1 px-2 pt-2">
                    {category}
                  </div>
                  {fonts.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => handleFontChange(font.value)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        currentFont === font.value
                          ? 'bg-blue-100 border-blue-500 border'
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                      style={{
                        fontFamily: font.style,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{font.label}</span>
                        {currentFont === font.value && (
                          <span className="text-blue-600 text-xs">✓</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        가나다라마바사 ABCD 1234
                      </div>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* 폰트 굵기 */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            폰트 굵기
          </label>
          <div className="space-y-2">
            {availableWeights.map((weight) => (
              <button
                key={weight}
                onClick={() => handleWeightChange(weight)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  currentWeight === weight
                    ? 'bg-blue-100 border-blue-500 border'
                    : 'hover:bg-gray-50 border border-gray-200'
                }`}
                style={{
                  fontFamily: selectedFontData?.style,
                  fontWeight: weight,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    {weight === 100 && '얇게 (100)'}
                    {weight === 200 && '아주 가늘게 (200)'}
                    {weight === 300 && '가늘게 (300)'}
                    {weight === 400 && '보통 (400)'}
                    {weight === 500 && '중간 (500)'}
                    {weight === 600 && '세미볼드 (600)'}
                    {weight === 700 && '굵게 (700)'}
                    {weight === 800 && '아주 굵게 (800)'}
                    {weight === 900 && '블랙 (900)'}
                  </span>
                  {currentWeight === weight && (
                    <span className="text-blue-600 text-xs">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 미리보기 */}
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="text-xs text-gray-500 mb-2">미리보기</div>
          <div
            className="p-4 bg-gray-50 rounded-md text-center"
            style={{
              fontFamily: selectedFontData?.style,
              fontWeight: currentWeight,
            }}
          >
            <div className="text-2xl mb-2">
              {draftCampaign.title || '캠페인 제목'}
            </div>
            <div className="text-sm text-gray-600">
              가나다라마바사 ABCD 1234
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

