'use client';

interface AdBannerProps {
  slot?: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function AdBanner({ slot = 'default', style, className }: AdBannerProps) {
  // Google AdSense 또는 기타 광고 플랫폼 코드를 여기에 추가
  // 예: Google AdSense
  /*
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error('Ad error:', err);
    }
  }, []);
  */

  return (
    <div
      className={`ad-container ${className || ''}`}
      style={{
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        ...style,
      }}
      data-ad-slot={slot}
    >
      {/* 광고 플랫폼 코드를 여기에 추가 */}
      <div className="text-sm text-gray-500">
        광고 영역
        {/* Google AdSense 예시:
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slot}
          data-ad-format="auto"
        ></ins>
        */}
      </div>
    </div>
  );
}

