import Header from '@/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">현재 진행중인 캠페인</h1>
          <p className="mt-2 text-gray-600">생성한 캠페인들을 관리하고 확인하세요</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">아직 생성한 캠페인이 없습니다.</p>
          <p className="mt-2 text-sm text-gray-400">새 캠페인을 만들어보세요!</p>
        </div>
      </main>
    </div>
  );
}
