"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BannerSlide {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  bgImage: string;
  link: string;
}

const BANNERS: BannerSlide[] = [
  {
    id: 1,
    title: "SIÊU SALE THỰC PHẨM 11/11",
    subtitle:
      "Giảm tới 50% cho toàn bộ thực phẩm tươi sống & hải sản nhập khẩu",
    badge: "ƯU ĐÃI ĐẶC BIỆT",
    bgImage:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600",
    link: "/catalog",
  },
  {
    id: 2,
    title: "Thịt Bò Nhập Khẩu Tiêu Chuẩn USDA",
    subtitle: "Tươi ngon trọn vị - Giao nhanh trong 2 giờ nội thành",
    badge: "HÀNG MỚI VỀ",
    bgImage:
      "https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=1600",
    link: "/catalog",
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Tự động chuyển slide mỗi 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[480px] overflow-hidden bg-gray-900">
      {BANNERS.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* 1. Ảnh nền tràn 100% màn hình */}
          <img
            src={banner.bgImage}
            alt={banner.title}
            className="w-full h-full object-cover opacity-60"
          />

          {/* 2. Lớp phủ đen Gradient giúp nổi chữ */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

          {/* 3. Nội dung Chữ (Giữ cố định căn lề trái cực đẹp) */}
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="max-w-7xl w-full mx-auto px-6 md:px-12">
              <div className="max-w-xl text-white space-y-4">
                {/* Badge */}
                <span className="inline-block bg-[#ECA921] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {banner.badge}
                </span>

                {/* Tiêu đề chính */}
                <h2 className="text-3xl md:text-5xl font-black leading-tight drop-shadow-md">
                  {banner.title}
                </h2>

                {/* Mô tả phụ */}
                <p className="text-sm md:text-base text-gray-200 line-clamp-2 drop-shadow">
                  {banner.subtitle}
                </p>

                {/* Nút bấm */}
                <div className="pt-2">
                  <Link href={banner.link}>
                    <Button className="bg-[#ECA921] hover:bg-[#D89512] text-white font-semibold px-6 py-2.5 rounded-lg shadow-lg">
                      Khám phá ngay
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Dấu chấm chuyển slide */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-[#ECA921]"
                : "w-2.5 bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
