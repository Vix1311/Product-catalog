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

  // ĐÃ CẬP NHẬT: Kéo posX, posY về gần trung tâm (50, 50) hơn
  // và chỉnh lại svgPath tương ứng để đường nối ngắn & cong mượt hơn
  const categories: CategoryNode[] = [
    {
      id: "thit-nhap-khau",
      title: "Thịt Nhập Khẩu",
      subtitle: "Bò, Heo, Cừu",
      imageUrl:
        "https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=400",
      link: "/catalog?group=thit-nhap-khau",
      posX: 25,
      posY: 22,
      svgPath: "M 500 340 C 400 250, 300 180, 250 150",
    },
    {
      id: "surimi",
      title: "Surimi & Chả Cá",
      subtitle: "Thanh cua, Viên lẩu",
      imageUrl:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400",
      link: "/catalog?group=surimi",
      posX: 50,
      posY: 15,
      svgPath: "M 500 340 C 520 260, 480 180, 500 102",
    },
    {
      id: "sauce",
      title: "Sauce / Nước Sốt",
      subtitle: "Sốt lẩu, Sốt BBQ",
      imageUrl:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400",
      link: "/catalog?group=sauce",
      posX: 75,
      posY: 22,
      svgPath: "M 500 340 C 600 250, 700 180, 750 150",
    },
    {
      id: "mayonnaise",
      title: "Mayonnaise",
      subtitle: "Sốt béo, Sốt salad",
      imageUrl:
        "https://images.unsplash.com/photo-1589985107050-d79e5781a70c?q=80&w=400",
      link: "/catalog?group=mayonnaise",
      posX: 85,
      posY: 50,
      svgPath: "M 500 340 C 650 360, 750 320, 850 340",
    },
    {
      id: "bia",
      title: "Bia & Đồ Uống",
      subtitle: "Bia nhập khẩu",
      imageUrl:
        "https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=400",
      link: "/catalog?group=bia",
      posX: 75,
      posY: 78,
      svgPath: "M 500 340 C 600 430, 700 500, 750 530",
    },
    {
      id: "cha-bong",
      title: "Chà Bông Heo / Gà",
      subtitle: "Ruốc xù, Ruốc cay",
      imageUrl:
        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=400",
      link: "/catalog?group=cha-bong",
      posX: 50,
      posY: 85,
      svgPath: "M 500 340 C 480 430, 520 500, 500 578",
    },
    {
      id: "rte",
      title: "RTE / RTC",
      subtitle: "Thịt / Cá ăn liền",
      imageUrl:
        "https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=400",
      link: "/catalog?group=rte",
      posX: 25,
      posY: 78,
      svgPath: "M 500 340 C 400 430, 300 500, 250 530",
    },
    {
      id: "oem-odm",
      title: "Gia Công OEM / ODM",
      subtitle: "Sản xuất theo yêu cầu",
      imageUrl:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400",
      link: "/catalog?group=oem-odm",
      posX: 15,
      posY: 50,
      svgPath: "M 500 340 C 350 320, 250 360, 150 340",
    },
  ];

  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = 200;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="w-full py-4 lg:py-2 lg:h-[calc(100vh-100px)] lg:min-h-[420px] lg:max-h-[650px] flex flex-col justify-between overflow-hidden relative border-y border-amber-200/60 shadow-xs"
      style={{
        backgroundImage: "radial-gradient(#ECA921 0.65px, transparent 0.65px)",
        backgroundSize: "24px 24px",
        backgroundColor: "#FFFFFF",
      }}
    >
      <div className="max-w-7xl w-full h-full mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col justify-between">
        <div className="max-w-2xl mx-auto mb-2 lg:mb-0 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#B8731B] text-[10px] font-bold mb-1">
            <IconNetwork className="w-3 h-3" />
            <span>HỆ SINH THÁI PHÂN PHỐI</span>
          </div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 uppercase tracking-tight">
            Hệ Cung Ứng Ngành Hàng
          </h2>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Nhấp vào từng nhóm ngành hàng để tra cứu danh mục sản phẩm
          </p>
        </div>

        <div className="hidden lg:block relative w-full flex-1 min-h-0 my-1">
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
                  strokeWidth={active ? "3" : "2"}
                  strokeDasharray={active ? "8 4" : "6 6"}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
            <Link href="/catalog" className="block group">
              <div className="w-24 h-24 xl:w-28 xl:h-28 rounded-full bg-gradient-to-br from-[#ECA921] to-[#D89512] text-white p-2 shadow-2xl flex flex-col items-center justify-center border-4 border-white transition-transform duration-300 group-hover:scale-105 cursor-pointer">
                <img
                  src="/logo.png"
                  alt="Khánh An Logo"
                  className="h-6 xl:h-8 w-auto object-contain brightness-0 invert mb-0.5"
                />
                <span className="font-black text-[11px] xl:text-xs tracking-wider">
                  KHÁNH AN
                </span>
                <span className="text-[7px] text-amber-100 uppercase font-semibold tracking-widest">
                  FOODS
                </span>
              </div>
            </Link>
            <div className="absolute inset-0 rounded-full bg-[#ECA921]/20 animate-ping duration-2500 -z-10" />
          </div>

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
                    className={`w-20 h-20 xl:w-24 xl:h-24 rounded-full border-[3px] shadow-md overflow-hidden relative transition-all duration-300 transform group-hover:-translate-y-1 group-hover:scale-110 group-hover:shadow-xl ${
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
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-1.5 text-white z-15">
                      <span className="font-extrabold text-[9px] xl:text-[11px] leading-tight drop-shadow-md text-amber-100 group-hover:text-[#ECA921] transition-colors">
                        {cat.title}
                      </span>
                      <span className="text-[7px] xl:text-[8px] text-gray-200 mt-0.5 line-clamp-1 opacity-90">
                        {cat.subtitle}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="lg:hidden flex flex-col items-center w-full mt-2">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2.5 px-4 py-1.5 mb-3 rounded-full bg-gradient-to-r from-[#ECA921] to-[#D89512] text-white shadow-md border-2 border-white active:scale-95 transition-transform"
          >
            <img
              src="/logo.png"
              alt="Khánh An Logo"
              className="h-5 w-auto object-contain brightness-0 invert"
            />
            <div className="text-left leading-tight">
              <span className="block font-black text-[11px] tracking-wider">
                KHÁNH AN FOODS
              </span>
            </div>
          </Link>

          <div className="relative w-full flex items-center">
            <button
              type="button"
              onClick={() => scrollCarousel("left")}
              className="absolute left-0 z-20 w-7 h-7 rounded-full bg-white/90 border border-amber-300 shadow-md flex items-center justify-center text-[#B8731B] active:scale-90"
            >
              <IconChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={carouselRef}
              className="flex items-center gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth px-6 py-2 w-full no-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.link}
                  className="snap-center shrink-0 group relative block"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[3px] border-[#ECA921] shadow-sm overflow-hidden relative active:scale-95 transition-transform">
                    <img
                      src={cat.imageUrl}
                      alt={cat.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-2 text-white">
                      <span className="font-extrabold text-[10px] sm:text-[11px] text-amber-100 leading-tight drop-shadow">
                        {cat.title}
                      </span>
                      <span className="text-[8px] text-gray-200 mt-0.5 line-clamp-1">
                        {cat.subtitle}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollCarousel("right")}
              className="absolute right-0 z-20 w-7 h-7 rounded-full bg-white/90 border border-amber-300 shadow-md flex items-center justify-center text-[#B8731B] active:scale-90"
            >
              <IconChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
