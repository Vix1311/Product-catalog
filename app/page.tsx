"use client";

import StickyHeader from "@/components/StickyHeader";
import HeroBanner from "@/components/HeroBanner";
import CategoryBanners from "@/components/CategoryBanners";
import AboutSection from "@/components/AboutSection";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";
import Link from "next/link";
import MindmapSection from "@/components/MindmapSection";
import { logoutApi } from "./services/auth.service";
import { useEffect, useState, Suspense } from "react";
import {
  IconArrowRight,
  IconSparkles,
  IconBookDownload,
} from "@tabler/icons-react";

function HomeContent() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      const loggedInState = localStorage.getItem("isLoggedIn");
      setIsLoggedIn(!!(token && loggedInState === "true"));
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Lỗi logout API:", error);
    } finally {
      setIsLoggedIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-gray-800 font-sans flex flex-col justify-between">
      <div>
        {/* Header Dính */}
        <StickyHeader isLoggedIn={isLoggedIn} onLogout={handleLogout} />

        {/* 1. Hero Banner TRÀN MÀN HÌNH */}
        <HeroBanner />

        {/* 2. Khối 4 Ô BANNERS DANH MỤC TRÀN MÀN HÌNH */}
        <CategoryBanners />

        {/* VÙNG NỘI DUNG TRUNG TÂM: Phân tách rõ ràng từng Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          {/* KHỐI CTA TRA CỨU CATALOG (Dạng Đảo Nội Dung Nổi Bật) */}
          <div
            className="rounded-[28px] p-8 sm:p-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-xl border border-amber-500/25 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(90deg, #0B0F17 0%, #1F150D 30%, #4A2809 70%, #1F150D 100%)",
            }}
          >
            <div className="space-y-2 max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECA921]/15 border border-[#ECA921]/40 text-[#ECA921] text-[11px] font-bold uppercase tracking-widest">
                <IconSparkles className="w-3.5 h-3.5" />
                <span>KHÁNH AN B2B PRODUCT HUB</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#FFF3D1] tracking-tight">
                Tra Cứu Toàn Bộ Catalog Thực Phẩm Nhập Khẩu
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Xem chi tiết quy cách đóng gói thùng, thương hiệu xuất xứ, độ
                dày cắt chuẩn và gợi ý thực đơn của hơn{" "}
                <strong>500+ mặt hàng</strong> chuyên dụng cho kênh Nhà hàng,
                Lẩu Nướng & HORECA.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
              <Link
                href="/catalog"
                className="cursor-pointer px-7 py-3.5 rounded-xl bg-[#ECA921] hover:bg-[#D89512] text-gray-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 group"
              >
                <IconBookDownload className="w-4 h-4" />
                <span>Mở Catalog Ngay</span>
                <IconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
        {/* 3. SƠ ĐỒ HỆ CUNG ỨNG NGÀNH HÀNG (Đảo Nội Dung Nền Trắng) */}
        <MindmapSection />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          {/* 4. VỀ CHÚNG TÔI, NĂNG LỰC & HỒ SƠ PHÁP LÝ */}
          <AboutSection />
          {/* 5. GÓC ẨM THỰC & CẨM NANG B2B (Blog Showcase) */}
          <TrustSection />
        </div>
      </div>

      {/* Chân Trang */}
      <Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] text-sm text-gray-500 font-semibold">
          Đang tải trang...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
