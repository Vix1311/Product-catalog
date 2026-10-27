import React from "react";
import Link from "next/link";
import { IconArrowUpRight } from "@tabler/icons-react";

interface CategoryBannerItem {
  id: number;
  code: string;
  tag: string;
  title: string;
  subtitle: string;
  bgStyle: string;
  isLightBg?: boolean;
  imageUrl: string;
  link: string;
}

export default function CategoryBanners() {
  const categories: CategoryBannerItem[] = [
    {
      id: 1,
      code: "01",
      tag: "ĐẶC SẢN TRUYỀN THỐNG",
      title: "Chả Mực Hạ Long",
      subtitle: "Giã tay gia truyền, giòn sần sật chuẩn vị biển Quảng Ninh",
      bgStyle: "bg-gradient-to-br from-[#ECA921] to-[#D48806]",
      isLightBg: true,
      imageUrl:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400",
      link: "/catalog?group=cha-muc",
    },
    {
      id: 2,
      code: "02",
      tag: "DINH DƯỠNG CAO CẤP",
      title: "Thực Phẩm Sức Khỏe",
      subtitle: "Lẩu Đông Trùng Hạ Thảo tươi & nguyên liệu bổ dưỡng",
      bgStyle: "bg-gradient-to-br from-[#3A2210] to-[#1F1209]",
      imageUrl:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400",
      link: "/catalog?group=suc-khoe",
    },
    {
      id: 3,
      code: "03",
      tag: "TIỆN LỢI CHUẨN VỊ",
      title: "Ẩm Thực Đặc Sản",
      subtitle: "Hàu sữa Hạ Long chưng thịt & các dòng RTE ăn liền",
      bgStyle: "bg-gradient-to-br from-[#B8731B] to-[#8C5210]",
      imageUrl:
        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=400",
      link: "/catalog?group=dac-san",
    },
    {
      id: 4,
      code: "04",
      tag: "B2B HORECA WHOLESALE",
      title: "Nguyên Liệu Nhà Hàng",
      subtitle: "Giá sỉ theo thùng, đầy đủ hồ sơ kiểm dịch & ATVSTP",
      bgStyle: "bg-gradient-to-br from-[#141821] to-[#0B0F17]",
      imageUrl:
        "https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=400",
      link: "/catalog?group=thit-nhap-khau",
    },
  ];

  return (
    <section className="w-full border-b border-amber-200/60 shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.link}
            className={`${cat.bgStyle} group p-6 sm:p-7 flex items-center justify-between min-h-[210px] relative overflow-hidden transition-all duration-300 border-b sm:border-b-0 sm:border-r border-white/10 last:border-r-0`}
          >
            {/* Số thứ tự chìm làm điểm nhấn thiết kế */}
            <span
              className={`absolute -bottom-4 left-3 text-7xl font-black select-none pointer-events-none transition-transform duration-500 group-hover:scale-110 ${
                cat.isLightBg ? "text-black/5" : "text-white/5"
              }`}
            >
              {cat.code}
            </span>

            {/* Nội dung bên trái */}
            <div className="space-y-2.5 z-10 max-w-[62%]">
              <span
                className={`inline-block text-[9px] font-black uppercase tracking-[0.16em] px-2.5 py-0.5 rounded-full ${
                  cat.isLightBg
                    ? "bg-gray-950/10 text-gray-900"
                    : "bg-[#ECA921]/20 text-[#ECA921] border border-[#ECA921]/30"
                }`}
              >
                {cat.tag}
              </span>

              <h3
                className={`text-lg sm:text-xl font-black leading-snug ${
                  cat.isLightBg ? "text-gray-950" : "text-[#FFF3D1]"
                }`}
              >
                {cat.title}
              </h3>

              <p
                className={`text-xs leading-relaxed line-clamp-2 font-medium ${
                  cat.isLightBg ? "text-gray-900/80" : "text-gray-300"
                }`}
              >
                {cat.subtitle}
              </p>

              <div className="pt-1">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-extrabold px-3.5 py-1.5 rounded-xl transition-all shadow-xs ${
                    cat.isLightBg
                      ? "bg-gray-950 text-white group-hover:bg-gray-800"
                      : "bg-[#ECA921] text-gray-950 group-hover:bg-[#FFF3D1]"
                  }`}
                >
                  <span>Khám phá</span>
                  <IconArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </div>

            {/* Hình ảnh bên phải đóng khung tròn sang trọng */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shrink-0 border-4 border-white/25 shadow-xl relative z-10 bg-gray-900 group-hover:scale-105 transition-transform duration-500">
              <img
                src={cat.imageUrl}
                alt={cat.title}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
