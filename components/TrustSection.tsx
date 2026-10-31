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
  IconLoader2,
} from "@tabler/icons-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

interface BlogPostItem {
  id: string;
  slug?: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  imageUrl: string;
  createdAt?: string;
}

export default function TrustSection() {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // 1. Gọi API lấy danh sách bài viết
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/posts`);
        if (res.ok) {
          const data = await res.json();
          // Xử lý linh hoạt mảng trả về
          const rawPosts = Array.isArray(data) ? data : data.posts || [];

          const formattedPosts = rawPosts.map((post: any) => ({
            ...post,
            date: post.createdAt
              ? new Date(post.createdAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "Đang cập nhật",
          }));

          // Lấy tối đa 6 bài viết mới nhất để làm Showcase
          setPosts(formattedPosts.slice(0, 6));
        }
      } catch (error) {
        console.error("Lỗi khi fetch bài viết showcase:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 2. Tự động chuyển bài sau mỗi 5 giây (chỉ chạy khi có bài viết)
  useEffect(() => {
    if (isPaused || posts.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % posts.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, posts.length]);

  // Nếu đang tải dữ liệu
  if (isLoading) {
    return (
      <section className="py-20 flex flex-col items-center justify-center text-[#ECA921] gap-3">
        <IconLoader2 className="w-10 h-10 animate-spin" />
        <p className="font-bold text-gray-600 text-sm">
          Đang tải cẩm nang B2B...
        </p>
      </section>
    );
  }

  // Nếu không có bài viết nào
  if (posts.length === 0) {
    return null; // Hoặc bạn có thể return 1 đoạn text "Chưa có bài viết"
  }

  // Bài viết đang hiển thị ở Card lớn bên trái
  const activePost = posts[activeIndex];

  // Lấy tối đa 4 bài viết tiếp theo để xếp bên phải (xử lý an toàn nếu mảng ít hơn 5 bài)
  const sidePostsCount = Math.min(posts.length - 1, 4);
  const sidePosts = Array.from({ length: sidePostsCount }).map((_, i) => {
    const offset = i + 1;
    const originalIndex = (activeIndex + offset) % posts.length;
    return {
      post: posts[originalIndex],
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

        {/* BỐ CỤC: BÊN TRÁI CARD LỚN - BÊN PHẢI CARD NHỎ */}
        <div className="flex flex-col lg:flex-row gap-6 lg:items-stretch">
          {/* CỘT TRÁI: CARD LỚN CHIẾM PHẦN LỚN DIỆN TÍCH (flex-1) */}
          <article
            key={activePost.id}
            className="bg-white rounded-3xl overflow-hidden border border-amber-200/80 shadow-md hover:shadow-xl transition-all duration-500 w-full lg:flex-1 flex flex-col justify-between"
          >
            <div>
              <Link
                href={`/blog/${activePost.slug || activePost.id}`}
                className="h-64 sm:h-76 overflow-hidden relative bg-gray-900 block group"
              >
                <img
                  src={
                    activePost.imageUrl ||
                    "https://placehold.co/800x600?text=No+Image"
                  }
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
                    {activePost.readTime || "5 phút đọc"}
                  </span>
                </div>

                <Link
                  href={`/blog/${activePost.slug || activePost.id}`}
                  className="block"
                >
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 hover:text-[#B8731B] transition-colors leading-snug line-clamp-2">
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
                href={`/blog/${activePost.slug || activePost.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 hover:bg-[#ECA921] text-white hover:text-gray-950 text-xs font-extrabold transition-colors shadow-sm"
              >
                <span>Đọc chi tiết bài viết</span>
                <IconArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center gap-1.5 hidden sm:flex">
                {posts.map((_, idx) => (
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

          {/* CỘT PHẢI: CARD NHỎ (Chỉ render khi có nhiều hơn 1 bài viết) */}
          {sidePosts.length > 0 && (
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
                      src={
                        post.imageUrl ||
                        "https://placehold.co/100x100?text=No+Img"
                      }
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
                        {post.readTime || "5 phút đọc"}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-gray-900 line-clamp-2 group-hover:text-[#B8731B] transition-colors leading-snug">
                      {post.title}
                    </h4>

                    <div className="flex items-center justify-between text-[10px] text-gray-400 pt-0.5">
                      <span>{post.date}</span>
                      <Link
                        href={`/blog/${post.slug || post.id}`}
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
          )}
        </div>
      </div>
    </section>
  );
}
