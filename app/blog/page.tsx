"use client";

import React, { useEffect, useState } from "react";
import {
  IconSearch,
  IconCalendar,
  IconClock,
  IconArrowRight,
  IconFlame,
  IconChefHat,
  IconBook,
} from "@tabler/icons-react";
import StickyHeader from "@/components/StickyHeader";
import { logoutApi } from "../services/auth.service";
import Footer from "@/components/Footer";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  imageUrl: string;
  featured?: boolean;
}

const BLOG_POSTS: BlogPost[] = [
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
    featured: true,
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
      "Nhiệt độ lý tưởng của khối thịt trước khi đưa lên máy cắt lát tự động để lát thịt cuộn tròn đẹp mắt, không bị vụn nát.",
    category: "Kinh Nghiệm Bếp B2B",
    date: "02/10/2026",
    readTime: "5 phút đọc",
    imageUrl:
      "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?q=80&w=800&auto=format&fit=crop",
  },
];

const CATEGORIES = [
  "Tất cả",
  "Kiến Thức Nguyên Liệu",
  "Kinh Nghiệm Bếp B2B",
  "Xu Hướng Ẩm Thực",
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchCategory =
      selectedCategory === "Tất cả" || post.category === selectedCategory;
    const matchSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const featuredPost =
    filteredPosts.find((p) => p.featured) || filteredPosts[0];
  const regularPosts = filteredPosts.filter((p) => p.id !== featuredPost?.id);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      const loggedInState = localStorage.getItem("isLoggedIn");
      setIsLoggedIn(!!(token && loggedInState === "true"));
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Lỗi logout API:", error);
    } finally {
      setIsLoggedIn(false);
      window.dispatchEvent(new Event("storage"));
    }
  };

  return (
    <div>
      {" "}
      <StickyHeader isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <div className="min-h-screen bg-[#FAF8F5] text-gray-800 pb-20">
        {/* 🎯 BANNER MẪU HÌNH 2: Thiết kế chuẩn xác theo mẫu "THỊT NHẬP KHẨU" */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div
            className="w-full rounded-[28px] py-14 px-6 text-center shadow-2xl border border-amber-500/20"
            style={{
              background:
                "linear-gradient(90deg, #0B0F17 0%, #1F150D 25%, #4A2809 50%, #1F150D 75%, #0B0F17 100%)",
            }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full border border-[#ECA921]/40 bg-[#ECA921]/10 mb-4">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[#ECA921]">
                KHÁNH AN FOODS INSIGHTS
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#FFF3D1] drop-shadow-sm">
              GÓC ẨM THỰC & CẨM NANG B2B
            </h1>
            <p className="mt-3.5 text-sm sm:text-base text-gray-200 max-w-2xl mx-auto font-normal leading-relaxed">
              Chia sẻ kiến thức chuyên sâu về nguồn thực phẩm nhập khẩu, bí
              quyết bảo quản và giải pháp tối ưu chi phí nguyên liệu cho nhà
              hàng.
            </p>
          </div>
        </div>

        {/* THANH LỌC DANH MỤC & TÌM KIẾM */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-amber-200/60 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Nút chọn danh mục */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? "bg-[#ECA921] text-gray-950 shadow-sm"
                        : "bg-amber-50/70 text-gray-700 hover:bg-amber-100/80 border border-amber-200/50"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Ô tìm kiếm bài viết */}
            <div className="relative w-full md:w-80">
              <IconSearch className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm bài viết, nguyên liệu..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#ECA921] focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* BÀI VIẾT TIÊU ĐIỂM (FEATURED POST) */}
        {featuredPost && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
            <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-amber-200/70 grid grid-cols-1 lg:grid-cols-12">
              {/* 🎯 Bấm vào Hình ảnh chuyển trang */}
              <Link
                href={`/blog/${featuredPost.id}`}
                className="lg:col-span-7 h-72 sm:h-96 lg:h-auto overflow-hidden relative bg-gray-900 block group"
              >
                <img
                  src={featuredPost.imageUrl}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-[#ECA921] text-gray-950 text-[11px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <IconFlame className="w-3.5 h-3.5" /> Bài viết nổi bật
                </span>
              </Link>

              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between bg-gradient-to-br from-white via-amber-50/20 to-amber-50/50">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs text-gray-500 font-semibold">
                    <span className="text-[#B8731B] bg-amber-100/80 px-2.5 py-1 rounded-md font-bold">
                      {featuredPost.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <IconCalendar className="w-3.5 h-3.5" />{" "}
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <IconClock className="w-3.5 h-3.5" />{" "}
                      {featuredPost.readTime}
                    </span>
                  </div>

                  {/* 🎯 Bấm vào Tiêu đề chuyển trang */}
                  <Link href={`/blog/${featuredPost.id}`} className="block">
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug hover:text-[#B8731B] transition-colors cursor-pointer">
                      {featuredPost.title}
                    </h2>
                  </Link>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-amber-200/50 flex items-center justify-between">
                  <Link
                    href={`/blog/${featuredPost.id}`}
                    className="cursor-pointer px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-[#ECA921] text-white hover:text-gray-950 text-xs font-bold transition-colors flex items-center gap-2 shadow-sm"
                  >
                    Đọc chi tiết <IconArrowRight className="w-4 h-4" />
                  </Link>
                  <span className="text-xs font-semibold text-gray-400">
                    Khánh An Editorial
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* DANH SÁCH BÀI VIẾT (GRID 3 CỘT) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden border border-amber-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* 🎯 Bấm vào Ảnh Thumbnail chuyển trang */}
                  <Link
                    href={`/blog/${post.id}`}
                    className="h-52 overflow-hidden relative bg-gray-100 block"
                  >
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-gray-900/85 backdrop-blur-xs text-[#ECA921] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-amber-400/30">
                      {post.category}
                    </span>
                  </Link>

                  {/* Nội dung Card */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium">
                      <span className="flex items-center gap-1">
                        <IconCalendar className="w-3.5 h-3.5 text-[#ECA921]" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconClock className="w-3.5 h-3.5 text-[#ECA921]" />
                        {post.readTime}
                      </span>
                    </div>

                    {/* 🎯 Bấm vào Tiêu đề Card chuyển trang */}
                    <Link href={`/blog/${post.id}`} className="block">
                      <h3 className="text-base font-extrabold text-gray-900 line-clamp-2 group-hover:text-[#B8731B] transition-colors cursor-pointer">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer Card */}
                <div className="px-5 pb-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href={`/blog/${post.id}`}
                    className="cursor-pointer px-4 py-2 rounded-lg bg-gray-900 group-hover:bg-[#ECA921] text-white group-hover:text-gray-950 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    Xem ngay <IconArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
