import Header from '@/components/Header';

export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="mx-auto max-w-4xl bg-white shadow-2xl">
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="flex flex-col items-center justify-center">
                        {/* 스피너 */}
                        <div className="h-16 w-16 animate-spin rounded-full border-4 border-white border-t-blue-600"></div>
                        <p className="mt-6 text-white">캠페인을 불러오는 중...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

