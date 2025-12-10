import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Campaign {
  id?: string;
  title: string;
  subtitle?: string;
  image?: string;
  content: string;
  actionItems?: string[]; // 행동강령 리스트
  actionItemsTitle?: string; // 행동강령 제목
  showActionItems?: boolean; // 행동강령 표시 여부
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  requireAuth: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface CampaignStore {
  draftCampaign: Campaign | null;
  setDraftCampaign: (campaign: Campaign | null) => void;
  updateDraftCampaign: (updates: Partial<Campaign>) => void;
  clearDraftCampaign: () => void;
}

const defaultColors = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  background: '#ffffff',
  text: '#1f2937',
};

export const useCampaignStore = create<CampaignStore>()(
  persist(
    (set) => ({
      draftCampaign: null,
      setDraftCampaign: (campaign) => set({ draftCampaign: campaign }),
      updateDraftCampaign: (updates) =>
        set((state) => ({
          draftCampaign: state.draftCampaign
            ? { ...state.draftCampaign, ...updates }
            : ({ ...updates, colors: defaultColors } as Campaign),
        })),
      clearDraftCampaign: () => set({ draftCampaign: null }),
    }),
    {
      name: 'campaign-draft-storage',
    }
  )
);

