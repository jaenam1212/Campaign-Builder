import Header from '@/components/Header';
import CampaignList from '@/components/CampaignList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">현재 진행중인 캠페인</h1>
          <p className="mt-2 text-gray-600">생성한 캠페인들을 관리하고 확인하세요</p>
        </div>
        <CampaignList />
      </main>
    </div>
  );
}
