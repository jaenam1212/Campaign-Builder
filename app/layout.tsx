import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 한글 웹폰트들
const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

const blackHanSans = Black_Han_Sans({
  variable: "--font-black-han-sans",
  subsets: ["latin"],
  weight: ["400"],
});

const nanumGothic = Nanum_Gothic({
  variable: "--font-nanum-gothic",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

const nanumMyeongjo = Nanum_Myeongjo({
  variable: "--font-nanum-myeongjo",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

const jua = Jua({
  variable: "--font-jua",
  subsets: ["latin"],
  weight: ["400"],
});

const doHyeon = Do_Hyeon({
  variable: "--font-do-hyeon",
  subsets: ["latin"],
  weight: ["400"],
});

const sunflower = Sunflower({
  variable: "--font-sunflower",
  weight: ["300", "500", "700"],
});

const gamjaFlower = Gamja_Flower({
  variable: "--font-gamja-flower",
  subsets: ["latin"],
  weight: ["400"],
});

const gothicA1 = Gothic_A1({
  variable: "--font-gothic-a1",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const gowunBatang = Gowun_Batang({
  variable: "--font-gowun-batang",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const eastSeaDokdo = East_Sea_Dokdo({
  variable: "--font-east-sea-dokdo",
  subsets: ["latin"],
  weight: ["400"],
});

const singleDay = Single_Day({
  variable: "--font-single-day",
  weight: ["400"],
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
          ${geistSans.variable}
          ${geistMono.variable}
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
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
