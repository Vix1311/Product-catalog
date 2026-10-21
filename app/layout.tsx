import type { Metadata } from "next";
// Import font từ next/font/google
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import FloatingContact from "@/components/FloatingContact";
import Providers from "./providers";

// Khởi tạo font
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"], // Bắt buộc có vietnamese để không lỗi dấu
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={jakarta.variable}>
      {/* Gắn class font vào body */}
      <body
        className={`${jakarta.className} antialiased bg-gray-50 text-gray-900`}
      >
        <Providers>{children}</Providers> <FloatingContact />
      </body>
    </html>
  );
}
