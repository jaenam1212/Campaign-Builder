import { useQuery } from "@tanstack/react-query";

export interface CampaignStats {
  id: string;
  title: string;
  view_count: number;
  created_at: string;
}

// 관리자 통계 조회
export function useAnalytics() {
  return useQuery<CampaignStats[]>({
    queryKey: ["admin", "analytics"],
    queryFn: async () => {
      const response = await fetch("/api/admin/analytics");
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "통계 조회 실패");
      }
      return result.data || [];
    },
    enabled: false, // 수동으로 호출
  });
}

