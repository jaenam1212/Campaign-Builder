'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthModal from './auth/AuthModal';
import { useAuthCheck, useLogout } from '@/lib/api/auth';

export default function Header() {
  const router = useRouter();
  const { data: authData, isLoading: authLoading } = useAuthCheck();
  const logout = useLogout();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  const isAdmin = authData?.isAuthenticated || false;

  const handleNewCampaign = () => {
    router.push('/campaigns/new');
  };

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  const handleCloseAuth = () => {
    setShowAuthModal(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-2 sm:px-4">
          <Link href="/" className="text-base sm:text-xl font-bold text-gray-900 truncate">
            캠페인 빌더
          </Link>
          <nav className="flex items-center gap-1 sm:gap-4">
            <button
              onClick={handleNewCampaign}
              className="rounded-md bg-blue-600 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-blue-700 whitespace-nowrap"
            >
              <span className="hidden sm:inline">새 캠페인 만들기</span>
              <span className="sm:hidden">새 캠페인</span>
            </button>
            {!authLoading && (
              <>
                {isAdmin ? (
                  <>
                    <Link
                      href="/mypage"
                      className="rounded-md border border-gray-300 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap"
                    >
                      <span className="hidden sm:inline">마이페이지</span>
                      <span className="sm:hidden">마이</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="rounded-md border border-gray-300 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap"
                    >
                      <span className="hidden sm:inline">로그아웃</span>
                      <span className="sm:hidden">로그아웃</span>
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => handleOpenAuth('login')}
                      className="rounded-md border border-gray-300 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap"
                    >
                      로그인
                    </button>
                    <button
                      onClick={() => handleOpenAuth('signup')}
                      className="rounded-md bg-gray-600 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-gray-700 whitespace-nowrap"
                    >
                      <span className="hidden sm:inline">회원가입</span>
                      <span className="sm:hidden">가입</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </nav>
        </div>
      </header>
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleCloseAuth}
        initialMode={authModalMode}
      />
    </>
  );
}

