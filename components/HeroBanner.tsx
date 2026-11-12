"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// ... (Giữ nguyên phần interface và BANNERS)
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
    title: "Thanh Cua Surimi Thượng Hạng",
    subtitle:
      "Thơm ngon, dai mềm chuẩn vị Nhật Bản. Tuyệt hảo cho món sushi, kimbap hay thả lẩu.",
    badge: "BEST SELLER",
    bgImage:
      "https://res.cloudinary.com/lnlh7orn/image/upload/f_auto/q_auto/Gemini_Generated_Image_6xk3e16xk3e16xk3.png",
    link: "/catalog?group=surimi",
  },
  {
    id: 2,
    title: "Set Nấu Sẵn RTC Uma Tiện Lợi",
    subtitle:
      "Giải pháp hoàn hảo cho bữa ăn gia đình. Chuẩn vị nhà hàng chỉ trong 15 phút chế biến.",
    badge: "MỚI RA MẮT",
    bgImage:
      "https://theme.hstatic.net/200000926141/1001297327/14/share_fb_home.jpg?v=271",
    link: "/catalog?group=rtc-uma",
  },
  {
    id: 3,
    title: "Bia Tsingtao Giải Khát Cực Đã",
    subtitle:
      "Hương vị sảng khoái, êm đằm từ lúa mạch hảo hạng. Lựa chọn tuyệt vời cho mọi bữa tiệc.",
    badge: "PREMIUM",
    bgImage:
      "https://iprorwxhjjirlj5o.leadongcdn.com/cloud/mmBpjKppRliSrkrpojlqj/Home-Banner-1920-1920.jpg",
    link: "/catalog?group=bia-tsingtao",
  },
  {
    id: 4,
    title: "Thịt Bò Nhập Khẩu Premium",
    subtitle:
      "Tươi ngon trọn vị, vân mỡ đan xen hoàn hảo. Giao tươi siêu tốc trong 2 giờ nội thành.",
    badge: "HÀNG NHẬP KHẨU",
    bgImage:
      "https://res.cloudinary.com/lnlh7orn/image/upload/f_auto/q_auto/Gemini_Generated_Image_7ik4rq7ik4rq7ik4.png",
    link: "/catalog?group=thit-nhap-khau",
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    // Sử dụng calc(100dvh - 80px) để trừ đi phần Header.
    // Thay số 80px bằng chiều cao thực tế Header của bạn (VD: 64px, 72px...)
    <div className="relative w-full h-[calc(100dvh-80px)] min-h-[500px] overflow-hidden bg-gray-900">
      {BANNERS.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* 1. Ảnh nền */}
          <img
            src={banner.bgImage}
            alt={banner.title}
            className="w-full h-full object-cover opacity-60"
          />

          {/* 2. Lớp phủ đen Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

          {/* 3. Nội dung Chữ */}
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="max-w-7xl w-full mx-auto px-6 md:px-12">
              <div className="max-w-xl text-white space-y-4">
                {/* Badge */}
                <span className="inline-block bg-[#ECA921] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {banner.badge}
                </span>

                {/* Tiêu đề chính */}
                <h2 className="text-4xl md:text-6xl font-black leading-tight drop-shadow-md">
                  {banner.title}
                </h2>

                {/* Mô tả phụ */}
                <p className="text-base md:text-lg text-gray-200 line-clamp-3 drop-shadow">
                  {banner.subtitle}
                </p>

                {/* Nút bấm */}
                <div className="pt-4">
                  <Link href={banner.link}>
                    <Button className="bg-[#ECA921] hover:bg-[#D89512] text-white font-semibold px-8 py-3 rounded-lg shadow-lg text-lg">
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
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-10 bg-[#ECA921]"
                : "w-3 bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
