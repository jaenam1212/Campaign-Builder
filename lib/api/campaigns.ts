import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useCampaignStore } from "@/store/campaignStore";

export interface Campaign {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  content: string;
  action_items?: string[];
  action_items_title?: string;
  show_action_items?: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  font?: {
    family: string;
    weight: number;
  } | null;
  background_gradient?: string | null;
  effects?: {
    titleEffect?: string;
    backgroundOverlay?: string;
    signatureTicker?: boolean;
  } | null;
  require_auth: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCampaignData {
  title: string;
  subtitle?: string;
  image?: string;
  content: string;
  actionItems?: string[];
  actionItemsTitle?: string;
  showActionItems?: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  font?: {
    family: string;
    weight: number;
  };
  backgroundGradient?: string;
  effects?: {
    titleEffect?: string;
    backgroundOverlay?: string;
    signatureTicker?: boolean;
  };
  requireAuth?: boolean;
}

// 캠페인 목록 조회
export function useCampaigns() {
  return useQuery<Campaign[]>({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const response = await fetch("/api/campaigns");
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "캠페인을 불러올 수 없습니다.");
      }
      return result.data || [];
    },
  });
}

// 캠페인 상세 조회
export function useCampaign(id: string | undefined) {
  const { setDraftCampaign } = useCampaignStore();

  const query = useQuery<Campaign>({
    queryKey: ["campaign", id],
    queryFn: async () => {
      if (!id) throw new Error("Campaign ID is required");
      const response = await fetch(`/api/campaigns/${id}`);
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "캠페인을 불러올 수 없습니다.");
      }
      return result.data;
    },
    enabled: !!id,
  });

  // React Query v4+에서는 onSuccess 대신 useEffect 사용
  useEffect(() => {
    if (query.data) {
      const data = query.data;
      // CampaignStore 형식으로 변환하여 저장
      setDraftCampaign({
        id: data.id,
        title: data.title,
        subtitle: data.subtitle ?? undefined,
        image: data.image ?? undefined,
        content: data.content,
        actionItems: data.action_items || [],
        actionItemsTitle: data.action_items_title ?? undefined,
        showActionItems: data.show_action_items ?? undefined,
        colors: data.colors,
        font: data.font ?? undefined,
        backgroundGradient: data.background_gradient ?? undefined,
        effects: data.effects ?? undefined,
        requireAuth: data.require_auth,
        createdAt: data.created_at ?? undefined,
        updatedAt: data.updated_at ?? undefined,
      });
    }
  }, [query.data, setDraftCampaign]);

  return query;
}

// 캠페인 생성
export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCampaignData) => {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          subtitle: data.subtitle,
          image: data.image,
          content: data.content,
          actionItems: data.actionItems || [],
          actionItemsTitle: data.actionItemsTitle || "행동강령",
          showActionItems: data.showActionItems !== false,
          colors: data.colors,
          font: data.font,
          backgroundGradient: data.backgroundGradient,
          effects: data.effects,
          requireAuth: data.requireAuth || false,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "캠페인 저장에 실패했습니다.");
      }
      return result.data;
    },
    onSuccess: () => {
      // 캠페인 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

// 캠페인 삭제
export function useDeleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "캠페인 삭제에 실패했습니다.");
      }
      return result;
    },
    onSuccess: () => {
      // 캠페인 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

// 조회수 추적
export function useTrackView() {
  return useMutation({
    mutationFn: async ({
      campaignId,
      userAgent,
      referer,
    }: {
      campaignId: string;
      userAgent: string;
      referer: string;
    }) => {
      const response = await fetch(`/api/campaigns/${campaignId}/track`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ip: null,
          userAgent,
          referer,
        }),
      });

      const result = await response.json();
      return result;
    },
  });
}
