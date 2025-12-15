'use client';

import { useMemo } from 'react';
import { useSignatures } from '@/lib/api/signatures';

interface SignatureTickerProps {
  campaignId?: string;
  enabled?: boolean;
}

export default function SignatureTicker({ campaignId, enabled = true }: SignatureTickerProps) {
  // 샘플 서명 데이터 (실제 서명이 없을 때 표시)
  const sampleSignatures = [
    { id: 'sample-1', name: '김민수', content: '평화를 위해 행동합니다' },
    { id: 'sample-2', name: '이지은', content: '더 나은 세상을 만들어요' },
    { id: 'sample-3', name: '박준형', content: '함께 변화를 만듭니다' },
    { id: 'sample-4', name: '최서연', content: '정의를 위해 서명합니다' },
    { id: 'sample-5', name: '정우진', content: '미래 세대를 위해' },
    { id: 'sample-6', name: '강하늘', content: '희망을 전합니다' },
    { id: 'sample-7', name: '윤아름', content: '연대의 힘을 믿습니다' },
    { id: 'sample-8', name: '임동혁', content: '변화는 시작되었습니다' },
    { id: 'sample-9', name: '한소희', content: '함께 만드는 내일' },
    { id: 'sample-10', name: '송재현', content: '용기 있는 목소리' },
    { id: 'sample-11', name: '조민지', content: '정의로운 사회를 위해' },
    { id: 'sample-12', name: '김태형', content: '우리의 권리를 지킵니다' },
    { id: 'sample-13', name: '박수진', content: '평등한 세상을 꿈꿉니다' },
    { id: 'sample-14', name: '이현우', content: '모두의 목소리를 듣습니다' },
    { id: 'sample-15', name: '최유진', content: '행동하는 시민' },
  ];

  const { data: fetchedSignatures = [] } = useSignatures(campaignId, enabled);

  const signatures = useMemo(() => {
    if (!enabled) return [];
    
    // campaignId가 없거나 서명이 없으면 샘플 데이터 사용
    if (!campaignId || fetchedSignatures.length === 0) {
      return [...sampleSignatures, ...sampleSignatures];
    }

    // 서명 개수가 적으면 복제해서 연속성 유지
    if (fetchedSignatures.length < 50) {
      return [...fetchedSignatures, ...fetchedSignatures];
    }
    
    return fetchedSignatures;
  }, [campaignId, enabled, fetchedSignatures]);

  if (!enabled || signatures.length === 0) {
    return null;
  }

  // 4줄로 나누기
  const rows = [
    signatures.slice(0, Math.ceil(signatures.length / 4)),
    signatures.slice(Math.ceil(signatures.length / 4), Math.ceil(signatures.length / 2)),
    signatures.slice(Math.ceil(signatures.length / 2), Math.ceil(signatures.length * 3 / 4)),
    signatures.slice(Math.ceil(signatures.length * 3 / 4)),
  ];

  // 각 행의 애니메이션 속도
  const baseSpeed = signatures.length < 50 ? 25 : 40;
  const speeds = [
    baseSpeed,
    baseSpeed + 5,
    baseSpeed + 10,
    baseSpeed - 5,
  ];

  const shouldDuplicate = signatures.length < 50;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="absolute left-0 right-0 flex gap-8 whitespace-nowrap"
          style={{
            top: `${15 + rowIndex * 22}%`,
            animation: `scroll-${rowIndex} ${speeds[rowIndex]}s linear infinite`,
          }}
        >
          {/* 첫 번째 세트 */}
          {row.map((sig) => (
            <div
              key={`${sig.id}-1-${rowIndex}`}
              className="inline-flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full border border-gray-500/30 text-gray-200/70 text-sm font-semibold shadow-lg"
            >
              <span className="text-gray-100/90 font-black">{sig.name}</span>
              {sig.content && (
                <>
                  <span className="text-gray-300/70">•</span>
                  <span className="truncate max-w-[200px]">{sig.content}</span>
                </>
              )}
            </div>
          ))}
          {/* 두 번째 세트 (연속성을 위해) */}
          {shouldDuplicate && row.map((sig) => (
            <div
              key={`${sig.id}-2-${rowIndex}`}
              className="inline-flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full border border-gray-500/30 text-gray-200/70 text-sm font-semibold shadow-lg"
            >
              <span className="text-gray-100/90 font-black">{sig.name}</span>
              {sig.content && (
                <>
                  <span className="text-gray-300/70">•</span>
                  <span className="truncate max-w-[200px]">{sig.content}</span>
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

