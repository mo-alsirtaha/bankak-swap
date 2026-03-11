import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "طلباتي",
  description: "تطبيق إدارة الطلبات",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-black text-white min-h-screen overflow-x-hidden pb-28`}
      >
        <main className="max-w-md mx-auto w-full px-4">
          {children}
        </main>

        <BottomNav />
      </body>
    </html>
  );
}