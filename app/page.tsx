"use client";

import StickyHeader from "@/components/StickyHeader";
import HeroBanner from "@/components/HeroBanner";
import CategoryBanners from "@/components/CategoryBanners";
import AboutSection from "@/components/AboutSection";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";
import Link from "next/link";
import MindmapSection from "@/components/MindmapSection";
import { Button } from "@/components/ui/button";
import { logoutApi } from "./services/auth.service";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // 1. Kiểm tra trạng thái khi vừa vào trang
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      const loggedInState = localStorage.getItem("isLoggedIn");
      setIsLoggedIn(!!(token && loggedInState === "true"));
    };

    // Kiểm tra lần đầu khi mount
    checkAuth();

    // Lắng nghe sự kiện đăng nhập/đăng xuất
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // 2. Hàm Xử lý Đăng xuất thực sự
  const handleLogout = async () => {
    try {
      await logoutApi(); // Call API Logout & Xóa LocalStorage
    } catch (error) {
      console.error("Lỗi logout API:", error);
    } finally {
      setIsLoggedIn(false); // 👈 BẮT BUỘC: Đổi State ngay lập tức để UI render lại
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <div>
        {/* Header Dính */}
        <StickyHeader isLoggedIn={isLoggedIn} onLogout={handleLogout} />

        {/* 1. Hero Banner TRÀN MÀN HÌNH */}
        <HeroBanner />

        {/* 2. Khối 4 Ô BANNERS DANH MỤC TRÀN MÀN HÌNH (ĐẶT NGAY DƯỚI HERO) */}
        <CategoryBanners />

        {/* Các phần giới hạn chiều ngang chuẩn */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          {" "}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
            <div>
              <h2 className="text-2xl font-bold text-[#4A2E16]">
                Tra Cứu Toàn Bộ Catalog Thực Phẩm
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Xem chi tiết quy cách đóng gói, xuất xứ và tiêu chuẩn phân phối
                của hơn 500+ sản phẩm.
              </p>
            </div>
            <Link href="/catalog">
              <Button
                size="lg"
                className="bg-[#ECA921] hover:bg-[#D89512] text-white font-bold px-8 shadow transition-all border-none"
              >
                Xem Catalog Ngay →
              </Button>
            </Link>
          </div>
          <MindmapSection />
          {/* 3. Về Chúng Tôi (Chứng nhận & Pháp lý) */}
          <AboutSection />
          {/* 4. Tiêu chí & Đối tác */}
          <TrustSection />
        </main>
      </div>

      {/* Chân Trang */}
      <Footer />
    </div>
  );
}
