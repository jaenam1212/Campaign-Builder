// Google Analytics 이벤트 추적 유틸리티

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Google Analytics 이벤트 추적
 * @param eventName 이벤트 이름
 * @param eventParams 이벤트 파라미터
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', eventName, eventParams);
  }
};

/**
 * 캠페인 생성 이벤트 추적
 */
export const trackCampaignCreate = (campaignId: string) => {
  trackEvent('campaign_create', {
    campaign_id: campaignId,
  });
};

/**
 * 캠페인 조회 이벤트 추적
 */
export const trackCampaignView = (campaignId: string) => {
  trackEvent('campaign_view', {
    campaign_id: campaignId,
  });
};

/**
 * 캠페인 서명 이벤트 추적
 */
export const trackCampaignSign = (campaignId: string) => {
  trackEvent('campaign_sign', {
    campaign_id: campaignId,
  });
};

/**
 * 사용자 로그인 이벤트 추적
 */
export const trackLogin = () => {
  trackEvent('login');
};

/**
 * 사용자 회원가입 이벤트 추적
 */
export const trackSignup = () => {
  trackEvent('signup');
};

