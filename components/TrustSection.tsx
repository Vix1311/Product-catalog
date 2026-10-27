"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  IconCalendar,
  IconClock,
  IconArrowRight,
  IconFlame,
  IconBook,
  IconChevronRight,
} from "@tabler/icons-react";

interface BlogPostItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  imageUrl: string;
}

// 6 bài viết xoay vòng: 1 bài hiển thị ở Card lớn bên trái + 4 bài xếp dọc bên phải
const SHOWCASE_POSTS: BlogPostItem[] = [
  {
    id: "1",
    title:
      "Cách Phân Biệt Các Phần Thịt Bò Nhập Khẩu Mỹ & Úc Cho Quán Lẩu Nướng",
    excerpt:
      "Hướng dẫn chi tiết cách chọn Ba chỉ bò (Short Plate), Đầu thăn ngoại (Ribeye) và Lõi vai (Top Blade) giúp tối ưu chi phí cốt (Food Cost) mà vẫn giữ trọn độ mềm ngọt cho thực khách.",
    category: "Kiến Thức Nguyên Liệu",
    date: "20/10/2026",
    readTime: "6 phút đọc",
    imageUrl:
      "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Quy Trình Rã Đông Thịt Cấp Đông Chuẩn Nhà Hàng Không Bị Mất Nước",
    excerpt:
      "Mẹo rã đông chậm trong mát từ 0°C - 4°C giúp giữ nguyên cấu trúc sợi cơ, màu sắc đỏ tươi và độ ngọt tự nhiên của thịt nhập khẩu.",
    category: "Kinh Nghiệm Bếp B2B",
    date: "16/10/2026",
    readTime: "4 phút đọc",
    imageUrl:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    title:
      "Surimi & Chả Mực Hạ Long: Giải Pháp Thực Đơn Hút Khách Cho Chuỗi Lẩu",
    excerpt:
      "Tại sao các dòng viên thả lẩu cao cấp và chả mực giã tay lại trở thành món gọi thêm (Add-on) mang lại biên lợi nhuận cao nhất cho các quán lẩu hiện nay?",
    category: "Xu Hướng Ẩm Thực",
    date: "12/10/2026",
    readTime: "5 phút đọc",
    imageUrl:
      "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "4",
    title:
      "So Sánh Thương Hiệu Bò Kilcoy (Úc) Và Swift (Mỹ): Nên Chọn Loại Nào?",
    excerpt:
      "Phân tích chi tiết vân mỡ (Marbling), độ mềm và mức giá sỉ theo thùng của các thương hiệu thịt bò hàng đầu thế giới đang có mặt tại Khánh An Foods.",
    category: "Kiến Thức Nguyên Liệu",
    date: "08/10/2026",
    readTime: "7 phút đọc",
    imageUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "5",
    title:
      "Bí Quyết Tối Ưu Hao Hụt (Yield) Khi Cắt Thái Thịt Đông Lạnh Bằng Máy",
    excerpt:
      "Nhiệt độ lý tưởng của khối thịt trước khi đưa lên máy cắt lát công nghiệp từ -4°C đến -2°C giúp lát thịt cuộn tròn đẹp mắt, không bị vụn nát hay hao hụt.",
    category: "Kinh Nghiệm Bếp B2B",
    date: "04/10/2026",
    readTime: "5 phút đọc",
    imageUrl:
      "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "6",
    title:
      "Xu Hướng Thực Đơn Lẩu Nướng Mùa Lễ Hội: 5 Nhóm Nguyên Liệu Cháy Hàng",
    excerpt:
      "Dự báo nhu cầu tiêu thụ Dẻ sườn bò Mỹ, Ba chỉ heo Đức và các dòng viên thả lẩu phô mai giúp chủ quán chủ động kế hoạch trữ hàng giá tốt.",
    category: "Xu Hướng Ẩm Thực",
    date: "01/10/2026",
    readTime: "6 phút đọc",
    imageUrl:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop",
  },
];

export default function TrustSection() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Tự động chuyển bài sau mỗi 5 giây (5000ms)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SHOWCASE_POSTS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused]);

  // Bài viết đang hiển thị ở Card lớn bên trái
  const activePost = SHOWCASE_POSTS[activeIndex];

  // Lấy 4 bài viết tiếp theo xếp dọc bên phải để vừa mỏng gọn vừa cao bằng khít cột trái
  const sidePosts = [1, 2, 3, 4].map((offset) => {
    const originalIndex = (activeIndex + offset) % SHOWCASE_POSTS.length;
    return {
      post: SHOWCASE_POSTS[originalIndex],
      originalIndex,
      isNextUp: offset === 1,
    };
  });

  return (
    <section className="py-10">
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Tiêu đề mục */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#B8731B] text-xs font-bold mb-2">
              <IconBook className="w-3.5 h-3.5" />
              <span>KHÁNH AN FOODS INSIGHTS</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Góc Ẩm Thực & Cẩm Nang B2B
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Chia sẻ bí quyết chọn nguyên liệu nhập khẩu, bảo quản kho lạnh và
              tối ưu chi phí cho bếp nhà hàng.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 hover:bg-[#ECA921] text-[#8C5210] hover:text-gray-950 text-xs font-extrabold border border-amber-200/70 transition-all shrink-0 group"
          >
            <span>Khám phá tất cả bài viết</span>
            <IconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* BỐ CỤC: BÊN TRÁI CARD LỚN - BÊN PHẢI 4 CARD NHỎ MỎNG GỌN BẰNG KHÍT CỘT TRÁI */}
        <div className="flex flex-col lg:flex-row gap-6 lg:items-stretch">
          {/* CỘT TRÁI: CARD LỚN CHIẾM PHẦN LỚN DIỆN TÍCH (flex-1) */}
          <article
            key={activePost.id}
            className="bg-white rounded-3xl overflow-hidden border border-amber-200/80 shadow-md hover:shadow-xl transition-all duration-500 w-full lg:flex-1 flex flex-col justify-between"
          >
            <div>
              <Link
                href={`/blog/${activePost.id}`}
                className="h-64 sm:h-76 overflow-hidden relative bg-gray-900 block group"
              >
                <img
                  src={activePost.imageUrl}
                  alt={activePost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <span className="absolute top-4 left-4 bg-[#ECA921] text-gray-950 text-[11px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <IconFlame className="w-3.5 h-3.5" /> Tiêu điểm cẩm nang
                </span>

                <span className="absolute bottom-4 left-4 bg-gray-900/85 backdrop-blur-xs text-amber-200 text-[11px] font-bold px-3 py-1 rounded-lg border border-amber-400/30">
                  {activePost.category}
                </span>
              </Link>

              <div className="p-6 space-y-2.5">
                <div className="flex items-center gap-4 text-xs text-gray-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <IconCalendar className="w-4 h-4 text-[#ECA921]" />
                    {activePost.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <IconClock className="w-4 h-4 text-[#ECA921]" />
                    {activePost.readTime}
                  </span>
                </div>

                <Link href={`/blog/${activePost.id}`} className="block">
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 hover:text-[#B8731B] transition-colors leading-snug">
                    {activePost.title}
                  </h3>
                </Link>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2">
                  {activePost.excerpt}
                </p>
              </div>
            </div>

            {/* Chân Card Lớn */}
            <div className="px-6 pb-6 pt-3 border-t border-amber-100/70 flex items-center justify-between">
              <Link
                href={`/blog/${activePost.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 hover:bg-[#ECA921] text-white hover:text-gray-950 text-xs font-extrabold transition-colors shadow-sm"
              >
                <span>Đọc chi tiết bài viết</span>
                <IconArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center gap-1.5">
                {SHOWCASE_POSTS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Chuyển đến bài ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      activeIndex === idx
                        ? "w-5 bg-[#ECA921]"
                        : "w-1.5 bg-gray-200 hover:bg-amber-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </article>

          {/* CỘT PHẢI: 4 CARD NHỎ MỎNG GỌN VÀ CAO BẰNG KHÍT VỚI CỘT TRÁI */}
          <div className="w-full lg:w-[430px] flex flex-col justify-between gap-3 shrink-0">
            {sidePosts.map(({ post, originalIndex, isNextUp }) => (
              <div
                key={post.id}
                onClick={() => setActiveIndex(originalIndex)}
                className={`group cursor-pointer bg-white rounded-2xl p-2.5 sm:p-3 border transition-all duration-300 flex items-center gap-3.5 flex-1 ${
                  isNextUp
                    ? "border-[#ECA921] bg-amber-50/40 shadow-sm ring-1 ring-[#ECA921]/30"
                    : "border-gray-100 hover:border-amber-200 hover:bg-amber-50/20 shadow-xs"
                }`}
              >
                {/* Thumbnail nhỏ gọn */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-amber-100/80">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {isNextUp && (
                    <span className="absolute bottom-1 left-1 bg-gray-900/90 text-[#ECA921] text-[8px] font-black uppercase px-1.5 py-0.5 rounded">
                      Kế tiếp
                    </span>
                  )}
                </div>

                {/* Nội dung thu gọn ôm khít chữ */}
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-extrabold text-[#B8731B] uppercase tracking-wider truncate">
                      {post.category}
                    </span>
                    <span className="text-gray-400 font-medium shrink-0 flex items-center gap-0.5">
                      <IconClock className="w-3 h-3 text-[#ECA921]" />
                      {post.readTime}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-gray-900 line-clamp-2 group-hover:text-[#B8731B] transition-colors leading-snug">
                    {post.title}
                  </h4>

                  <div className="flex items-center justify-between text-[10px] text-gray-400 pt-0.5">
                    <span>{post.date}</span>
                    <Link
                      href={`/blog/${post.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-0.5 font-bold text-gray-700 hover:text-[#ECA921] transition-colors"
                    >
                      Xem ngay <IconChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
