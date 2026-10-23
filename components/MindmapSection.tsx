"use client";

import React, { useState } from "react";
import Link from "next/link";

interface CategoryNode {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  posX: number; // % ngang
  posY: number; // % dọc
  // Đường cong SVG uốn lượn riêng cho từng ô (Tâm SVG ở M 500 340)
  svgPath: string;
}

export default function MindmapSection() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  // DANH SÁCH 8-9 NGÀNH HÀNG VỚI ĐƯỜNG UỐN CONG SVG ĐỘC BẢN
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
      // Uốn vòng lượn lên góc trên bên trái
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
      // Uốn cong hình chữ S nhẹ vươn thẳng lên đỉnh
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
      // Uốn lượn hình sóng sang góc trên bên phải
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
      // Uốn võng nhẹ ngang sang bên phải
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
      // Uốn cong mềm xuống góc dưới bên phải
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
      // Uốn ziczac nhẹ xuống trực tiếp đáy
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
      // Uốn sâu xuống góc dưới bên trái
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
      // Uốn lượn vòng rộng sang ngang bên trái
      svgPath: "M 500 340 C 350 280, 220 380, 100 299",
    },
  ];

  return (
    <section className="py-16 overflow-hidden my-8 rounded-3xl">
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Tiêu đề */}
        <h2 className="text-2xl md:text-3xl font-black text-[#4A2E16] uppercase tracking-wider mb-2">
          HỆ CUNG ỨNG NGÀNH HÀNG KHÁNH AN
        </h2>
        <p className="text-xs md:text-sm text-gray-500 max-w-xl mx-auto mb-8">
          Nhấp vào các nhóm ngành hàng bên dưới để tra cứu toàn bộ danh mục sản
          phẩm.
        </p>

        {/* --- GIAO DIỆN DESKTOP: MINDMAP TỎA TRÒN 360° --- */}
        <div className="hidden lg:block relative w-full h-[680px] my-4">
          {/* 1. ĐƯỜNG NỐI CONG SVG ĐỨT NÉT ĐỘC BẢN CHO TỪNG Ô */}
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
                  stroke={active ? "#ECA921" : "#F3D382"}
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
                  FOODS HUB
                </span>
              </div>
            </Link>
            <div className="absolute inset-0 rounded-full bg-[#ECA921]/20 animate-ping duration-2500 -z-10" />
          </div>

          {/* 3. CÁC Ô TRÒN NGÀNH HÀNG */}
          {categories.map((cat) => (
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
                <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-[#ECA921] shadow-lg overflow-hidden relative transition-all duration-300 transform group-hover:-translate-y-2 group-hover:scale-110 group-hover:shadow-2xl">
                  {/* Ảnh căng 100% hình tròn */}
                  <img
                    src={cat.imageUrl}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay Đen Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

                  {/* Chữ nằm trực tiếp trên hình */}
                  <div className="absolute inset-0 flex flex-col justify-end items-center text-center p-2 text-white z-10 pb-3">
                    <span className="font-extrabold text-xs md:text-sm leading-tight drop-shadow-md text-amber-100 group-hover:text-[#ECA921] transition-colors">
                      {cat.title}
                    </span>
                    <span className="text-[10px] text-gray-200 mt-0.5 line-clamp-1 opacity-90">
                      {cat.subtitle}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* --- GIAO DIỆN MOBILE & TABLET (Responsive Grid) --- */}
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

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
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
                  <div className="absolute inset-0 flex flex-col justify-end items-center text-center p-2 text-white pb-3">
                    <span className="font-bold text-xs text-amber-100">
                      {cat.title}
                    </span>
                    <span className="text-[9px] text-gray-300">
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
