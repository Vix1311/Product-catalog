"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  IconNetwork,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";

interface CategoryNode {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  posX: number;
  posY: number;
  svgPath: string;
}

export default function MindmapSection() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const categories: CategoryNode[] = [
    {
      id: "thit-nhap-khau",
      title: "Thịt Nhập Khẩu",
      subtitle: "Bò, Heo, Cừu",
      imageUrl:
        "https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=400",
      link: "/catalog?group=thit-nhap-khau",
      posX: 18,
      posY: 14,
      svgPath: "M 500 340 C 420 220, 240 100, 180 95",
    },
    {
      id: "surimi",
      title: "Surimi & Chả Cá",
      subtitle: "Thanh cua, Viên lẩu",
      imageUrl:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400",
      link: "/catalog?group=surimi",
      posX: 50,
      posY: 11,
      svgPath: "M 500 340 C 530 240, 470 120, 500 75",
    },
    {
      id: "sauce",
      title: "Sauce / Nước Sốt",
      subtitle: "Sốt lẩu, Sốt BBQ",
      imageUrl:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400",
      link: "/catalog?group=sauce",
      posX: 82,
      posY: 14,
      svgPath: "M 500 340 C 580 200, 750 150, 820 95",
    },
    {
      id: "mayonnaise",
      title: "Mayonnaise",
      subtitle: "Sốt béo, Sốt salad",
      imageUrl:
        "https://images.unsplash.com/photo-1589985107050-d79e5781a70c?q=80&w=400",
      link: "/catalog?group=mayonnaise",
      posX: 90,
      posY: 48,
      svgPath: "M 500 340 C 650 380, 780 280, 900 326",
    },
    {
      id: "bia",
      title: "Bia & Đồ Uống",
      subtitle: "Bia nhập khẩu",
      imageUrl:
        "https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=400",
      link: "/catalog?group=bia",
      posX: 82,
      posY: 82,
      svgPath: "M 500 340 C 620 450, 750 500, 820 558",
    },
    {
      id: "cha-bong",
      title: "Chà Bông Heo / Gà",
      subtitle: "Ruốc xù, Ruốc cay",
      imageUrl:
        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=400",
      link: "/catalog?group=cha-bong",
      posX: 50,
      posY: 88,
      svgPath: "M 500 340 C 460 440, 540 520, 500 598",
    },
    {
      id: "rte",
      title: "RTE / RTC",
      subtitle: "Thịt / Cá ăn liền",
      imageUrl:
        "https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=400",
      link: "/catalog?group=rte",
      posX: 18,
      posY: 82,
      svgPath: "M 500 340 C 380 480, 260 510, 180 558",
    },
    {
      id: "oem-odm",
      title: "Gia Công OEM / ODM",
      subtitle: "Sản xuất theo yêu cầu",
      imageUrl:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400",
      link: "/catalog?group=oem-odm",
      posX: 10,
      posY: 48,
      svgPath: "M 500 340 C 350 280, 220 380, 100 326",
    },
  ];

  // Hàm xử lý cuộn Carousel trên Mobile
  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = 240;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section
      // Desktop: cao vừa khít 100vh trừ đi 76px của Header
      className="w-full py-8 lg:py-4 lg:h-[calc(100vh-76px)] lg:min-h-[560px] lg:max-h-[900px] flex flex-col justify-between overflow-hidden relative border-y border-amber-200/60 shadow-xs"
      style={{
        backgroundImage: "radial-gradient(#ECA921 0.65px, transparent 0.65px)",
        backgroundSize: "24px 24px",
        backgroundColor: "#FFFFFF",
      }}
    >
      <div className="max-w-7xl w-full h-full mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col justify-between">
        {/* TIÊU ĐỀ 3 TẦNG (Thu gọn margin trên Desktop để nhường chỗ cho Mindmap) */}
        <div className="max-w-2xl mx-auto mb-4 lg:mb-1 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#B8731B] text-[11px] font-bold mb-1.5">
            <IconNetwork className="w-3.5 h-3.5" />
            <span>HỆ SINH THÁI PHÂN PHỐI TOÀN DIỆN</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 uppercase tracking-tight">
            Hệ Cung Ứng Ngành Hàng Khánh An
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Nhấp trực tiếp vào từng nhóm ngành hàng bên dưới để tra cứu danh mục
            sản phẩm và quy cách đóng gói tương ứng.
          </p>
        </div>

        {/* --- GIAO DIỆN DESKTOP: MINDMAP TỎA TRÒN 360° VỪA KHÍT MÀN HÌNH --- */}
        <div className="hidden lg:block relative w-full flex-1 min-h-0 my-1">
          {/* 1. ĐƯỜNG NỐI CONG SVG (preserveAspectRatio="none" giúp luôn khớp vị trí %) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 1000 680"
            preserveAspectRatio="none"
            fill="none"
          >
            {categories.map((cat) => {
              const active = activeNode === cat.id;
              return (
                <path
                  key={cat.id}
                  d={cat.svgPath}
                  stroke={active ? "#ECA921" : "#E5C178"}
                  strokeWidth={active ? "4" : "2.5"}
                  strokeDasharray={active ? "8 4" : "6 6"}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* 2. LOGO KHÁNH AN TẠI TRUNG TÂM */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
            <Link href="/catalog" className="block group">
              <div className="w-36 h-36 xl:w-40 xl:h-40 rounded-full bg-gradient-to-br from-[#ECA921] to-[#D89512] text-white p-2 shadow-2xl flex flex-col items-center justify-center border-4 border-white transition-transform duration-300 group-hover:scale-105 cursor-pointer">
                <img
                  src="/logo.png"
                  alt="Khánh An Logo"
                  className="h-9 xl:h-11 w-auto object-contain brightness-0 invert mb-1"
                />
                <span className="font-black text-sm xl:text-base tracking-wider">
                  KHÁNH AN
                </span>
                <span className="text-[9px] text-amber-100 uppercase font-semibold tracking-widest">
                  FOODS
                </span>
              </div>
            </Link>
            <div className="absolute inset-0 rounded-full bg-[#ECA921]/20 animate-ping duration-2500 -z-10" />
          </div>

          {/* 3. CÁC Ô TRÒN NGÀNH HÀNG */}
          {categories.map((cat) => {
            const isHovered = activeNode === cat.id;
            return (
              <div
                key={cat.id}
                style={{ left: `${cat.posX}%`, top: `${cat.posY}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <Link
                  href={cat.link}
                  onMouseEnter={() => setActiveNode(cat.id)}
                  onMouseLeave={() => setActiveNode(null)}
                  className="group relative block cursor-pointer"
                >
                  <div
                    className={`w-28 h-28 xl:w-32 xl:h-32 rounded-full border-4 shadow-lg overflow-hidden relative transition-all duration-300 transform group-hover:-translate-y-1.5 group-hover:scale-110 group-hover:shadow-2xl ${
                      isHovered
                        ? "border-[#ECA921] ring-4 ring-[#ECA921]/30"
                        : "border-[#ECA921]"
                    }`}
                  >
                    <img
                      src={cat.imageUrl}
                      alt={cat.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-2.5 text-white z-15">
                      <span className="font-extrabold text-xs xl:text-[13px] leading-snug drop-shadow-md text-amber-100 group-hover:text-[#ECA921] transition-colors">
                        {cat.title}
                      </span>
                      <span className="text-[10px] text-gray-200 mt-0.5 line-clamp-1 opacity-90 px-1">
                        {cat.subtitle}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* --- GIAO DIỆN MOBILE & TABLET: CAROUSEL LƯỚT NGANG TỐI ƯU DIỆN TÍCH --- */}
        <div className="lg:hidden flex flex-col items-center w-full my-2">
          {/* Nút Trung Tâm thu gọn dạng Pill ngang để tiết kiệm chiều dọc */}
          <Link
            href="/catalog"
            className="inline-flex items-center gap-3 px-5 py-2.5 mb-5 rounded-full bg-gradient-to-r from-[#ECA921] to-[#D89512] text-white shadow-md border-2 border-white active:scale-95 transition-transform"
          >
            <img
              src="/logo.png"
              alt="Khánh An Logo"
              className="h-6 w-auto object-contain brightness-0 invert"
            />
            <div className="text-left leading-tight">
              <span className="block font-black text-xs tracking-wider">
                KHÁNH AN FOODS
              </span>
              <span className="block text-[10px] text-amber-100">
                Xem toàn bộ danh mục →
              </span>
            </div>
          </Link>

          {/* Vùng Carousel trượt ngang */}
          <div className="relative w-full flex items-center">
            {/* Nút điều hướng Trái */}
            <button
              type="button"
              onClick={() => scrollCarousel("left")}
              aria-label="Trượt sang trái"
              className="absolute left-0 z-20 w-8 h-8 rounded-full bg-white/90 border border-amber-300 shadow-md flex items-center justify-center text-[#B8731B] active:scale-90"
            >
              <IconChevronLeft className="w-5 h-5" />
            </button>

            {/* Danh sách cuộn ngang (Snap Carousel) */}
            <div
              ref={carouselRef}
              className="flex items-center gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-8 py-3 w-full no-scrollbar"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.link}
                  className="snap-center shrink-0 group relative block"
                >
                  <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full border-4 border-[#ECA921] shadow-md overflow-hidden relative active:scale-95 transition-transform">
                    <img
                      src={cat.imageUrl}
                      alt={cat.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-3 text-white">
                      <span className="font-extrabold text-xs sm:text-sm text-amber-100 leading-snug drop-shadow">
                        {cat.title}
                      </span>
                      <span className="text-[10px] text-gray-200 mt-1 line-clamp-1">
                        {cat.subtitle}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Nút điều hướng Phải */}
            <button
              type="button"
              onClick={() => scrollCarousel("right")}
              aria-label="Trượt sang phải"
              className="absolute right-0 z-20 w-8 h-8 rounded-full bg-white/90 border border-amber-300 shadow-md flex items-center justify-center text-[#B8731B] active:scale-90"
            >
              <IconChevronRight className="w-5 h-5" />
            </button>
          </div>

          <span className="text-[11px] text-gray-400 mt-1">
            Vuốt ngang để xem thêm các nhóm ngành hàng
          </span>
        </div>
      </div>
    </section>
  );
}
