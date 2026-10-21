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

// 👉 THÊM PHẦN METADATA NÀY VÀO ĐỂ ĐỔI TIÊU ĐỀ & MÔ TẢ TRÊN GOOGLE
export const metadata: Metadata = {
  title: "Khánh An Foods | Phân Phối Thực Phẩm Nhập Khẩu Uy Tín",
  description:
    "Khánh An Foods là doanh nghiệp uy tín chuyên nhập khẩu và phân phối các dòng sản phẩm thực phẩm cao cấp cho hệ thống siêu thị, nhà hàng, khách sạn và công ty chế biến.",
  keywords: ["thực phẩm nhập khẩu", "Khánh An Foods", "phân phối thực phẩm"],
  openGraph: {
    siteName: "Khánh An Foods",
    title: "Khánh An Foods | Phân Phối Thực Phẩm Nhập Khẩu Uy Tín",
    description:
      "Chuyên cung cấp và phân phối các dòng sản phẩm thực phẩm nhập khẩu chất lượng cao.",
    url: "https://khanhanfoods.com",
    type: "website",
  },
};

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
        <Providers>
          {children}
          <FloatingContact />
        </Providers>
      </body>
    </html>
  );
}
