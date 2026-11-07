"use client";

import React, { useRef } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconUsers,
} from "@tabler/icons-react";

interface CertificateItem {
  id: number;
  title: string;
  desc: string;
  imageUrl?: string;
  icon?: React.ElementType;
}

export default function AboutSection() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const certList: CertificateItem[] = [
    {
      id: 1,
      title: "Chứng Nhận HACCP",
      desc: "Giấy chứng nhận QUẢN LÝ AN TOÀN THỰC PHẨM - HACCP Codex 2020 số 3202200578 cấp ngày 17/09/2022",
      imageUrl: "https://vinachg.vn/wp-content/uploads/2024/08/haccp-la-gi.jpg",
    },
    {
      id: 2,
      title: "Hợp tác phát triển",
      desc: "Luôn sẵn sàng hợp tác và chia sẻ kinh nghiệm với mọi đối tác trong và ngoài nước.",
      imageUrl:
        "https://res-console.cloudinary.com/lnlh7orn/thumbnails/transform/v1/image/upload/Y19maWxsLGhfMjAwLHdfMjAw/v1/R2VtaW5pX0dlbmVyYXRlZF9JbWFnZV9jNHN5eHhjNHN5eHhjNHN5/template_primary",
    },
    {
      id: 3,
      title: "Khách hàng là trung tâm",
      desc: "“Làm hài lòng khách hàng” là chuẩn mực và không ngừng hoàn thiện",
      icon: IconUsers,
    },
  ];

  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.clientWidth * 0.8;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề & Giới thiệu */}
        <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#ECA921] mb-4 sm:mb-6 uppercase">
            VỀ CHÚNG TÔI
          </h2>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            Khánh An Foods sở hữu thương hiệu{" "}
            <strong className="text-gray-800">Chả Mực Khánh An</strong> nổi
            tiếng - món đặc sản truyền thống Hạ Long được phân phối tại các siêu
            thị đặc sản và các nhà hàng tại TP. HCM. Khánh An Foods là doanh
            nghiệp uy tín trong thị trường phân phối các dòng sản phẩm thực phẩm
            nhập khẩu cho các công ty chế biến, hệ thống siêu thị, nhà hàng,
            quán ăn... Với hệ thống kho xưởng đảm bảo an toàn thực phẩm, hồ sơ
            công bố, kiểm nghiệm sản phẩm đúng quy định, quản lý theo tiêu chuẩn
            HACCP. Doanh nghiệp chúng tôi hân hạnh được đồng hành cùng quý khách
            hàng.
          </p>
        </div>

        {/* Danh sách chứng nhận */}
        <div className="relative flex items-center mb-10">
          <button
            type="button"
            onClick={() => scrollCarousel("left")}
            aria-label="Trượt sang trái"
            className="sm:hidden absolute left-0 top-16 z-20 w-8 h-8 rounded-full bg-white/95 border border-amber-300 shadow-md flex items-center justify-center text-[#B8731B] active:scale-90"
          >
            <IconChevronLeft className="w-5 h-5" />
          </button>

          <div
            ref={carouselRef}
            className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scroll-smooth w-full px-6 sm:px-0 py-2 no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {certList.map((item) => (
              <div
                key={item.id}
                className="snap-center shrink-0 w-[78%] sm:w-auto flex flex-col items-center text-center group bg-amber-50/30 sm:bg-transparent p-5 sm:p-0 rounded-2xl border border-amber-100/80 sm:border-none"
              >
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-amber-100 group-hover:border-[#ECA921] shadow-md transition-all duration-300 mb-4 bg-white flex items-center justify-center p-2">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : item.icon ? (
                    <item.icon
                      className="w-16 h-16 text-[#ECA921] group-hover:scale-110 transition-transform duration-300"
                      stroke={1.5}
                    />
                  ) : null}
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-[#ECA921] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed px-2">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollCarousel("right")}
            aria-label="Trượt sang phải"
            className="sm:hidden absolute right-0 top-16 z-20 w-8 h-8 rounded-full bg-white/95 border border-amber-300 shadow-md flex items-center justify-center text-[#B8731B] active:scale-90"
          >
            <IconChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
