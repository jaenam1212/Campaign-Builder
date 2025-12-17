import type { Metadata } from "next";
import {
  Noto_Sans_KR,
  Black_Han_Sans,
  Nanum_Gothic,
  Nanum_Myeongjo,
  Jua,
  Do_Hyeon,
  Sunflower,
  Gamja_Flower,
  Gothic_A1,
  Gowun_Batang,
  East_Sea_Dokdo,
  Single_Day
} from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/lib/react-query";
import GoogleTagManager, { GoogleTagManagerNoscript } from "@/components/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/next"

// 한글 웹폰트들 - 최적화된 로딩
// preload를 false로 설정하여 초기 로딩 성능 개선
// display: "swap"으로 폰트 로딩 중에도 텍스트 표시
const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  display: "swap",
  preload: true, // 기본 폰트이므로 preload
  fallback: ["system-ui", "sans-serif"],
});

const blackHanSans = Black_Han_Sans({
  variable: "--font-black-han-sans",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: false,
  fallback: ["system-ui", "sans-serif"],
});

const nanumGothic = Nanum_Gothic({
  variable: "--font-nanum-gothic",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
  preload: false,
  fallback: ["system-ui", "sans-serif"],
});

const nanumMyeongjo = Nanum_Myeongjo({
  variable: "--font-nanum-myeongjo",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
  preload: false,
  fallback: ["Georgia", "serif"],
});

const jua = Jua({
  variable: "--font-jua",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: false,
  fallback: ["system-ui", "sans-serif"],
});

const doHyeon = Do_Hyeon({
  variable: "--font-do-hyeon",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: false,
  fallback: ["system-ui", "sans-serif"],
});

const sunflower = Sunflower({
  variable: "--font-sunflower",
  weight: ["300", "500", "700"],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const gamjaFlower = Gamja_Flower({
  variable: "--font-gamja-flower",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: false,
  fallback: ["cursive"],
});

const gothicA1 = Gothic_A1({
  variable: "--font-gothic-a1",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: false,
  fallback: ["system-ui", "sans-serif"],
});

const gowunBatang = Gowun_Batang({
  variable: "--font-gowun-batang",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
  fallback: ["Georgia", "serif"],
});

const eastSeaDokdo = East_Sea_Dokdo({
  variable: "--font-east-sea-dokdo",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: true, // Header에서 사용되므로 preload
  fallback: ["cursive"],
});

const singleDay = Single_Day({
  variable: "--font-single-day",
  weight: ["400"],
  display: "swap",
  fallback: ["cursive"],
});

export const metadata: Metadata = {
  title: "캠페인 빌더",
  description: "캠페인을 쉽게 만들고 공유하세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`
          ${notoSansKR.variable}
          ${blackHanSans.variable}
          ${nanumGothic.variable}
          ${nanumMyeongjo.variable}
          ${jua.variable}
          ${doHyeon.variable}
          ${sunflower.variable}
          ${gamjaFlower.variable}
          ${gothicA1.variable}
          ${gowunBatang.variable}
          ${eastSeaDokdo.variable}
          ${singleDay.variable}
          antialiased
        `}
      >
        <GoogleTagManager />
        <GoogleTagManagerNoscript />
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
