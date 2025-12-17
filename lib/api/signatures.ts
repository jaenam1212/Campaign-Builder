import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Signature {
  id: string;
  name: string;
  content?: string;
  created_at: string;
}

export interface CreateSignatureData {
  name: string;
  content?: string;
}

// 서명 목록 조회
export function useSignatures(campaignId: string | undefined, enabled: boolean = true) {
  return useQuery<Signature[]>({
    queryKey: ['signatures', campaignId],
    queryFn: async () => {
      if (!campaignId) return [];
      const response = await fetch(`/api/campaigns/${campaignId}/signatures`);
      if (!response.ok) {
        return [];
      }
      const result = await response.json();
      return result.signatures || [];
    },
    enabled: enabled && !!campaignId,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    refetchOnWindowFocus: false, // 창 포커스 시 재요청 안 함
    // refetchInterval 제거 - 불필요한 자동 갱신 방지
  });
}

// 서명 생성
export function useCreateSignature(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSignatureData) => {
      if (!campaignId) {
        throw new Error('Campaign ID is required');
      }
      const response = await fetch(`/api/campaigns/${campaignId}/signatures`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          content: data.content,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || '서명 저장에 실패했습니다.');
      }
      return result.data;
    },
    onSuccess: () => {
      // 서명 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['signatures', campaignId] });
    },
  });
}

