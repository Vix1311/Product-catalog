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

export default function BlogSection() {
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

  // 2. Tự động chuyển bài sau mỗi 5 giây
  useEffect(() => {
    if (isPaused || posts.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % posts.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, posts.length]);

  if (isLoading) {
    return (
      <section className="py-20 flex flex-col items-center justify-center text-[#ECA921] gap-3">
        <IconLoader2 className="w-10 h-10 animate-spin" />
        <p className="font-bold text-gray-600 text-sm">
          Đang tải ...
        </p>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  const activePost = posts[activeIndex];
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
    <section className="py-10 relative overflow-hidden">
      {/* Định nghĩa CSS Keyframes ngay trong component để không phải cấu hình tailwind.config.js */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-slide {
          animation: fadeSlideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>

      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Tiêu đề mục (Thêm animate trượt nhẹ) */}
        <div className="animate-fade-slide flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
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
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 hover:bg-[#ECA921] text-[#8C5210] hover:text-gray-950 text-xs font-extrabold border border-amber-200/70 transition-all shrink-0 group hover:shadow-lg hover:-translate-y-0.5 duration-300"
          >
            <span>Khám phá tất cả bài viết</span>
            <IconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:items-stretch">
          {/* CỘT TRÁI: CARD LỚN */}
          {/* Bỏ key ở <article> để giữ nguyên khung, đưa key vào thẻ <div> bên trong để nội dung tự thay đổi mượt mà */}
          <article className="bg-white rounded-3xl overflow-hidden border border-amber-200/80 shadow-md hover:shadow-xl transition-all duration-500 w-full lg:flex-1 flex flex-col justify-between relative group/card">
            {/* Thanh Progress Bar chạy 5s (dừng lại khi hover) */}
            {posts.length > 1 && (
              <div
                key={`progress-${activePost.id}`}
                className="absolute top-0 left-0 h-1 bg-[#ECA921] z-20"
                style={{
                  animation: "progress 5s linear forwards",
                  animationPlayState: isPaused ? "paused" : "running",
                }}
              />
            )}

            {/* Wrapper chứa nội dung sẽ animation khi activePost thay đổi */}
            <div
              key={activePost.id}
              className="animate-fade-slide h-full flex flex-col justify-between"
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
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-500" />

                  <span className="absolute top-4 left-4 bg-[#ECA921] text-gray-950 text-[11px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <IconFlame className="w-3.5 h-3.5" /> Tiêu điểm cẩm nang
                  </span>

                  <span className="absolute bottom-4 left-4 bg-gray-900/85 backdrop-blur-xs text-amber-200 text-[11px] font-bold px-3 py-1 rounded-lg border border-amber-400/30 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
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
                    className="block group-title"
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 hover:bg-[#ECA921] text-white hover:text-gray-950 text-xs font-extrabold transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 group/btn"
                >
                  <span>Đọc chi tiết</span>
                  <IconArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>

                <div className="flex items-center gap-1.5 hidden sm:flex">
                  {posts.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`Chuyển đến bài ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        activeIndex === idx
                          ? "w-6 bg-[#ECA921]"
                          : "w-2 bg-gray-200 hover:bg-amber-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* CỘT PHẢI: CARD NHỎ */}
          {sidePosts.length > 0 && (
            <div className="w-full lg:w-[430px] flex flex-col justify-between gap-3 shrink-0">
              {sidePosts.map(({ post, originalIndex, isNextUp }, index) => (
                <div
                  key={`${post.id}-${originalIndex}`}
                  onClick={() => setActiveIndex(originalIndex)}
                  className={`group cursor-pointer bg-white rounded-2xl p-2.5 sm:p-3 border transition-all duration-300 flex items-center gap-3.5 flex-1 animate-fade-slide hover:-translate-x-1 ${
                    isNextUp
                      ? "border-[#ECA921] bg-amber-50/40 shadow-sm ring-1 ring-[#ECA921]/30"
                      : "border-gray-100 hover:border-amber-200 hover:bg-amber-50/20 hover:shadow-md"
                  }`}
                  style={{ animationDelay: `${index * 100}ms`, opacity: 0 }} // Tạo hiệu ứng xuất hiện lần lượt
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-amber-100/80">
                    <img
                      src={
                        post.imageUrl ||
                        "https://placehold.co/100x100?text=No+Img"
                      }
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    {isNextUp && (
                      <span className="absolute bottom-1 left-1 bg-gray-900/90 text-[#ECA921] text-[8px] font-black uppercase px-1.5 py-0.5 rounded">
                        Kế tiếp
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-extrabold text-[#B8731B] uppercase tracking-wider truncate">
                        {post.category}
                      </span>
                      <span className="text-gray-400 font-medium shrink-0 flex items-center gap-0.5">
                        <IconClock className="w-3 h-3 text-[#ECA921]" />
                        {post.readTime || "5 phút"}
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
                        className="inline-flex items-center gap-0.5 font-bold text-gray-700 group-hover:text-[#ECA921] transition-colors"
                      >
                        Xem ngay{" "}
                        <IconChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
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
