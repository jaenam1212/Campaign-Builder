'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Campaign {
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
    require_auth: boolean;
    created_at: string;
    updated_at: string;
}

export default function CampaignList() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/campaigns');
            const result = await response.json();

            if (result.success) {
                setCampaigns(result.data || []);
            } else {
                setError(result.error || '캠페인을 불러올 수 없습니다.');
            }
        } catch (err) {
            console.error('Error fetching campaigns:', err);
            setError('캠페인을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">로딩 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
                <p className="text-red-600">{error}</p>
                <button
                    onClick={fetchCampaigns}
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
                <Link
                    key={campaign.id}
                    href={`/campaigns/${campaign.id}`}
                    className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
                >
                    {campaign.image && (
                        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                            <Image
                                src={campaign.image}
                                alt={campaign.title}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                                unoptimized
                            />
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
            ))}
        </div>
    );
}

