"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IconNetwork } from "@tabler/icons-react";

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

  const categories: CategoryNode[] = [
    {
      id: "thit-nhap-khau",
      title: "Thịt Nhập Khẩu",
      subtitle: "Bò, Heo, Cừu",
      imageUrl:
        "https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=400",
      link: "/catalog?group=thit-nhap-khau",
      posX: 18,
      posY: 12,
      svgPath: "M 500 340 C 420 220, 240 100, 180 82",
    },
    {
      id: "surimi",
      title: "Surimi & Chả Cá",
      subtitle: "Thanh cua, Viên lẩu",
      imageUrl:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400",
      link: "/catalog?group=surimi",
      posX: 50,
      posY: 8,
      svgPath: "M 500 340 C 530 240, 470 120, 500 41",
    },
    {
      id: "sauce",
      title: "Sauce / Nước Sốt",
      subtitle: "Sốt lẩu, Sốt BBQ",
      imageUrl:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400",
      link: "/catalog?group=sauce",
      posX: 82,
      posY: 12,
      svgPath: "M 500 340 C 580 200, 750 150, 820 82",
    },
    {
      id: "mayonnaise",
      title: "Mayonnaise",
      subtitle: "Sốt béo, Sốt salad",
      imageUrl:
        "https://images.unsplash.com/photo-1589985107050-d79e5781a70c?q=80&w=400",
      link: "/catalog?group=mayonnaise",
      posX: 90,
      posY: 44,
      svgPath: "M 500 340 C 650 380, 780 280, 900 299",
    },
    {
      id: "bia",
      title: "Bia & Đồ Uống",
      subtitle: "Bia nhập khẩu",
      imageUrl:
        "https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=400",
      link: "/catalog?group=bia",
      posX: 82,
      posY: 78,
      svgPath: "M 500 340 C 620 450, 750 500, 820 530",
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
      posY: 78,
      svgPath: "M 500 340 C 380 480, 260 510, 180 530",
    },
    {
      id: "oem-odm",
      title: "Gia Công OEM / ODM",
      subtitle: "Sản xuất theo yêu cầu",
      imageUrl:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400",
      link: "/catalog?group=oem-odm",
      posX: 10,
      posY: 44,
      svgPath: "M 500 340 C 350 280, 220 380, 100 299",
    },
  ];

  return (
    <section
      className="w-full py-16 sm:py-20 overflow-hidden relative border-y border-amber-200/60 shadow-xs"
      style={{
        backgroundImage: "radial-gradient(#ECA921 0.65px, transparent 0.65px)",
        backgroundSize: "24px 24px",
        backgroundColor: "#FFFFFF",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* TIÊU ĐỀ 3 TẦNG */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#B8731B] text-xs font-bold mb-3">
            <IconNetwork className="w-3.5 h-3.5" />
            <span>HỆ SINH THÁI PHÂN PHỐI TOÀN DIỆN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight">
            Hệ Cung Ứng Ngành Hàng Khánh An
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Nhấp trực tiếp vào từng nhóm ngành hàng bên dưới để tra cứu danh mục
            sản phẩm và quy cách đóng gói tương ứng.
          </p>
        </div>

        {/* --- GIAO DIỆN DESKTOP: MINDMAP TỎA TRÒN 360° --- */}
        <div className="hidden lg:block relative w-full h-[680px] my-2">
          {/* 1. ĐƯỜNG NỐI CONG SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 1000 680"
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

          {/* 2. LOGO KHÁNH AN MÀU TRẮNG GỐC TẠI TRUNG TÂM */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
            <Link href="/catalog" className="block group">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-[#ECA921] to-[#D89512] text-white p-2 shadow-2xl flex flex-col items-center justify-center border-4 border-white transition-transform duration-300 group-hover:scale-105 cursor-pointer">
                <img
                  src="/logo.png"
                  alt="Khánh An Logo"
                  className="h-10 md:h-12 w-auto object-contain brightness-0 invert mb-1"
                />
                <span className="font-black text-base md:text-lg tracking-wider">
                  KHÁNH AN
                </span>
                <span className="text-[10px] text-amber-100 uppercase font-semibold tracking-widest">
                  FOODS
                </span>
              </div>
            </Link>
            <div className="absolute inset-0 rounded-full bg-[#ECA921]/20 animate-ping duration-2500 -z-10" />
          </div>

          {/* 3. CÁC Ô TRÒN NGÀNH HÀNG (Căn giữa chữ tuyệt đối & Giữ màu viền khi hover) */}
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
                    className={`w-32 h-32 md:w-36 md:h-36 rounded-full border-4 shadow-lg overflow-hidden relative transition-all duration-300 transform group-hover:-translate-y-2 group-hover:scale-110 group-hover:shadow-2xl ${
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

                    {/* Căn giữa chữ hoàn toàn trong ô tròn */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-3 text-white z-15">
                      <span className="font-extrabold text-xs md:text-sm leading-snug drop-shadow-md text-amber-100 group-hover:text-[#ECA921] transition-colors">
                        {cat.title}
                      </span>
                      <span className="text-[10px] text-gray-200 mt-1 line-clamp-1 opacity-90 px-1">
                        {cat.subtitle}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* --- GIAO DIỆN MOBILE & TABLET --- */}
        <div className="lg:hidden flex flex-col items-center gap-6 my-4">
          <div className="my-2">
            <Link href="/catalog" className="block group">
              <div className="w-36 h-36 rounded-full bg-gradient-to-br from-[#ECA921] to-[#D89512] text-white p-2 shadow-xl flex flex-col items-center justify-center border-4 border-white">
                <img
                  src="/logo.png"
                  alt="Khánh An Logo"
                  className="h-10 w-auto object-contain brightness-0 invert mb-1"
                />
                <span className="font-black text-base tracking-wider">
                  KHÁNH AN
                </span>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.link}
                className="group relative block mx-auto"
              >
                <div className="w-32 h-32 rounded-full border-4 border-[#ECA921] shadow-md overflow-hidden relative">
                  <img
                    src={cat.imageUrl}
                    alt={cat.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-2.5 text-white">
                    <span className="font-bold text-xs text-amber-100 leading-snug">
                      {cat.title}
                    </span>
                    <span className="text-[9px] text-gray-300 mt-0.5 line-clamp-1">
                      {cat.subtitle}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
