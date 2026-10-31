"use client";

import React, { useRef } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface CertificateItem {
  id: number;
  title: string;
  desc: string;
  imageUrl: string;
}

export default function AboutSection() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const certList: CertificateItem[] = [
    {
      id: 1,
      title: "Chứng Nhận HACCP",
      desc: "Giấy chứng nhận QUẢN LÝ AN TOÀN THỰC PHẨM - HACCP Codex 2020 số 3202200578 cấp ngày 17/09/2022",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/2/23/HACCP_Certified_Logo.svg",
    },
    {
      id: 2,
      title: "Bao Bì Công Bố Sản Phẩm",
      desc: "Công bố SP số 01/khanhanfoods/2023 , niêm yết tại website Ban Quản lý an toàn Thực phẩm TP. HCM",
      imageUrl:
        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=300",
    },
    {
      id: 3,
      title: "Đăng Ký Doanh Nghiệp",
      desc: "Chứng nhận Đăng ký doanh nghiệp do Sở Kế hoạch và Đầu tư TP. HCM cấp - Công ty TNHH KHÁNH AN FOODS",
      imageUrl:
        "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=300",
    },
    {
      id: 4,
      title: "Kết Quả Kiểm Nghiệm",
      desc: "Bản Kết quả thử nghiệm Sản phẩm mã số TSL/1221100483-1 tại Trung tâm kiểm nghiệm TSL",
      imageUrl:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=300",
    },
  ];

  // Hàm xử lý cuộn Carousel trên Mobile
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
        {/* 1. Tiêu đề & Giới thiệu */}
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

        {/* 2. Danh sách chứng nhận (Carousel trên Mobile -> Grid từ màn hình sm trở lên) */}
        <div className="relative flex items-center">
          {/* Nút điều hướng Trái (Chỉ hiện trên Mobile) */}
          <button
            type="button"
            onClick={() => scrollCarousel("left")}
            aria-label="Trượt sang trái"
            className="sm:hidden absolute left-0 top-16 z-20 w-8 h-8 rounded-full bg-white/95 border border-amber-300 shadow-md flex items-center justify-center text-[#B8731B] active:scale-90"
          >
            <IconChevronLeft className="w-5 h-5" />
          </button>

          {/* Container chứa các mục: Flex trượt ngang ở Mobile, Grid ở Tablet/Desktop */}
          <div
            ref={carouselRef}
            className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scroll-smooth w-full px-6 sm:px-0 py-2 no-scrollbar"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {certList.map((item) => (
              <div
                key={item.id}
                className="snap-center shrink-0 w-[78%] sm:w-auto flex flex-col items-center text-center group bg-amber-50/30 sm:bg-transparent p-5 sm:p-0 rounded-2xl border border-amber-100/80 sm:border-none"
              >
                {/* Vòng tròn ảnh */}
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-amber-100 group-hover:border-[#ECA921] shadow-md transition-all duration-300 mb-4 bg-white flex items-center justify-center p-2">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                {/* Tiêu đề & Mô tả */}
                <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-[#ECA921] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed px-2">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Nút điều hướng Phải (Chỉ hiện trên Mobile) */}
          <button
            type="button"
            onClick={() => scrollCarousel("right")}
            aria-label="Trượt sang phải"
            className="sm:hidden absolute right-0 top-16 z-20 w-8 h-8 rounded-full bg-white/95 border border-amber-300 shadow-md flex items-center justify-center text-[#B8731B] active:scale-90"
          >
            <IconChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Chú thích nhỏ trên Mobile */}
        <p className="sm:hidden text-center text-[11px] text-gray-400 mt-2">
          Vuốt ngang để xem các chứng nhận
        </p>
      </div>
    </section>
  );
}
