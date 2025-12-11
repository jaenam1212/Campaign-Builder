'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useCampaignStore } from '@/store/campaignStore';

interface CampaignStats {
  id: string;
  title: string;
  view_count: number;
  created_at: string;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<CampaignStats[]>([]);
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check');
      const result = await response.json();
      setIsAdmin(result.isAuthenticated || false);
      
      if (result.isAuthenticated) {
        fetchAnalytics();
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error('Auth check error:', err);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      const result = await response.json();
      
      if (result.success) {
        setCampaigns(result.data || []);
        const total = (result.data || []).reduce((sum: number, c: CampaignStats) => sum + (c.view_count || 0), 0);
        setTotalViews(total);
      }
    } catch (err) {
      console.error('Analytics fetch error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">통계 대시보드</h1>
          <p className="mt-2 text-gray-600">캠페인별 조회수 및 통계</p>
        </div>

        {/* 요약 카드 */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-gray-500">전체 캠페인</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              {campaigns.length}
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-gray-500">전체 조회수</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              {totalViews.toLocaleString()}
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-gray-500">평균 조회수</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              {campaigns.length > 0
                ? Math.round(totalViews / campaigns.length).toLocaleString()
                : '0'}
            </div>
          </div>
        </div>

        {/* 캠페인별 통계 테이블 */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    캠페인 제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    조회수
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    생성일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    링크
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {campaign.title}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {campaign.view_count?.toLocaleString() || 0}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(campaign.created_at).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-blue-600">
                      <a
                        href={`/campaigns/${campaign.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        보기
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

