'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AuthModal from './auth/AuthModal';

export default function Header() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check');
      const result = await response.json();
      setIsAdmin(result.isAuthenticated || false);
    } catch (err) {
      console.error('Auth check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewCampaign = () => {
    router.push('/campaigns/new');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAdmin(false);
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
    checkAuth(); // 인증 상태 다시 확인
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-gray-900">
            캠페인 빌더
          </Link>
          <nav className="flex items-center gap-4">
            <button
              onClick={handleNewCampaign}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              새 캠페인 만들기
            </button>
            {!loading && (
              <>
                {isAdmin ? (
                  <>
                    <Link
                      href="/mypage"
                      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      마이페이지
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenAuth('login')}
                      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      로그인
                    </button>
                    <button
                      onClick={() => handleOpenAuth('signup')}
                      className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                    >
                      회원가입
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

