'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Link from 'next/link';
import { useAuthCheck, useMe, useChangePassword } from '@/lib/api/auth';
import { useMyCampaigns } from '@/lib/api/mypage';
import type { Campaign } from '@/lib/api/campaigns';


interface UserInfo {
  email: string;
  created_at: string;
}

export default function MyPage() {
  const router = useRouter();
  const { data: authData, isLoading: authLoading } = useAuthCheck();
  const { data: userInfo, refetch: refetchUserInfo } = useMe();
  const { data: campaigns = [], refetch: refetchCampaigns } = useMyCampaigns();
  const [activeTab, setActiveTab] = useState<'campaigns' | 'profile'>('campaigns');

  const isAdmin = authData?.isAuthenticated || false;
  const loading = authLoading;

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    } else if (isAdmin) {
      refetchUserInfo();
      refetchCampaigns();
    }
  }, [loading, isAdmin, router, refetchUserInfo, refetchCampaigns]);

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
          <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
          <p className="mt-2 text-gray-600">내 캠페인과 계정 정보를 관리하세요</p>
        </div>

        {/* 탭 메뉴 */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${activeTab === 'campaigns'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
            >
              내 캠페인 ({campaigns.length})
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${activeTab === 'profile'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
            >
              회원정보
            </button>
          </nav>
        </div>

        {/* 캠페인 탭 */}
        {activeTab === 'campaigns' && (
          <div>
            {campaigns.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                <p className="text-gray-500">아직 생성한 캠페인이 없습니다.</p>
                <Link
                  href="/campaigns/new"
                  className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  새 캠페인 만들기
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign: Campaign) => (
                  <div
                    key={campaign.id}
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {campaign.title}
                        </h3>
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                          <span>조회수: {campaign.view_count || 0}</span>
                          <span>
                            생성일: {new Date(campaign.created_at).toLocaleDateString('ko-KR')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CampaignUrlCopyButton campaignId={campaign.id} />
                        <Link
                          href={`/admin/analytics`}
                          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          통계
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 회원정보 탭 */}
        {activeTab === 'profile' && (
          <div>
            <ProfileTab userInfo={userInfo} />
          </div>
        )}
      </div>
    </div>
  );
}

function CampaignUrlCopyButton({ campaignId }: { campaignId: string }) {
  const [copied, setCopied] = useState(false);
  // 현재 도메인 자동 사용 (https://www.makecampaign.xyz 또는 localhost:3000)
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const campaignUrl = `${baseUrl}/campaigns/${campaignId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(campaignUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
      // Fallback: 텍스트 영역 생성하여 복사
      const textArea = document.createElement('textarea');
      textArea.value = campaignUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={campaignUrl}
        readOnly
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        style={{ minWidth: '300px', maxWidth: '400px' }}
        onClick={(e) => (e.target as HTMLInputElement).select()}
      />
      <button
        onClick={handleCopy}
        className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        {copied ? '복사됨!' : '복사'}
      </button>
    </div>
  );
}

function ProfileTab({ userInfo }: { userInfo: UserInfo | null }) {
  const changePassword = useChangePassword();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword) {
      setError('현재 비밀번호와 새 비밀번호를 입력해주세요.');
      return;
    }

    if (newPassword.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await changePassword.mutateAsync({
        currentPassword,
        newPassword,
      });

      setSuccess('비밀번호가 변경되었습니다.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '비밀번호 변경 중 오류가 발생했습니다.';
      setError(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      {/* 회원정보 표시 */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">회원정보</h2>
        <dl className="space-y-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">이메일</dt>
            <dd className="mt-1 text-sm text-gray-900">{userInfo?.email || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">가입일</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {userInfo?.created_at
                ? new Date(userInfo.created_at).toLocaleDateString('ko-KR')
                : '-'}
            </dd>
          </div>
        </dl>
      </div>

      {/* 비밀번호 변경 */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">비밀번호 변경</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700"
            >
              현재 비밀번호
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              새 비밀번호
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              새 비밀번호 확인
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}
          {success && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
              {success}
            </div>
          )}
          <button
            type="submit"
            disabled={changePassword.isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {changePassword.isPending ? '변경 중...' : '비밀번호 변경'}
          </button>
        </form>
      </div>
    </div>
  );
}

