import { useQuery } from "@tanstack/react-query";
import type { Campaign } from "./campaigns";

// 내 캠페인 목록 조회
export function useMyCampaigns() {
  return useQuery<Campaign[]>({
    queryKey: ["mypage", "campaigns"],
    queryFn: async () => {
      const response = await fetch("/api/mypage/campaigns");
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "캠페인 목록 조회 실패");
      }
      return result.data || [];
    },
    enabled: false, // 수동으로 호출
  });
}

