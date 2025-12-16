'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCampaigns, useDeleteCampaign } from '@/lib/api/campaigns';
import { useAuthCheck } from '@/lib/api/auth';

export default function CampaignList() {
    const { data: campaigns = [], isLoading, error, refetch } = useCampaigns();
    const deleteCampaign = useDeleteCampaign();
    const { data: authData } = useAuthCheck();
    const isAdmin = authData?.isAuthenticated || false;

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm('정말 이 캠페인을 삭제하시겠습니까?')) {
            return;
        }

        try {
            await deleteCampaign.mutateAsync(id);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : '알 수 없는 오류';
            alert(`삭제 실패: ${message}`);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">로딩 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
                <p className="text-red-600">{error.message || '캠페인을 불러올 수 없습니다.'}</p>
                <button
                    onClick={() => refetch()}
                    className="mt-2 text-sm text-red-700 underline"
                >
                    다시 시도
                </button>
            </div>
        );
    }

    if (campaigns.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                <p className="text-gray-500">아직 생성한 캠페인이 없습니다.</p>
                <p className="mt-2 text-sm text-gray-400">새 캠페인을 만들어보세요!</p>
                <Link
                    href="/campaigns/new"
                    className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    새 캠페인 만들기
                </Link>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
                <div
                    key={campaign.id}
                    className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
                >
                    <Link href={`/campaigns/${campaign.id}`}>
                        {campaign.image && (
                            <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                                {campaign.image.startsWith('data:') ? (
                                    <img
                                        src={campaign.image}
                                        alt={campaign.title}
                                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <Image
                                        src={campaign.image}
                                        alt={campaign.title}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                        unoptimized
                                    />
                                )}
                            </div>
                        )}
                        <div className="p-6">
                            <h2 className="mb-2 text-xl font-bold text-gray-900 line-clamp-2">
                                {campaign.title}
                            </h2>
                            {campaign.subtitle && (
                                <p className="mb-3 text-sm text-gray-600 line-clamp-1">
                                    {campaign.subtitle}
                                </p>
                            )}
                            <p className="mb-4 text-sm text-gray-500 line-clamp-2">
                                {campaign.content}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-400">
                                <span>
                                    {new Date(campaign.created_at).toLocaleDateString('ko-KR')}
                                </span>
                                {campaign.require_auth && (
                                    <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700">
                                        인증 필요
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                    {isAdmin && (
                        <button
                            onClick={(e) => handleDelete(campaign.id, e)}
                            className="absolute top-2 right-2 z-10 rounded-full bg-red-500 p-2 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                            title="캠페인 삭제"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

