"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconFileUpload,
  IconTrash,
  IconEye,
  IconCheck,
  IconLoader2,
  IconFlame,
  IconPhoto,
  IconFileText,
  IconBulb,
  IconArrowLeft,
} from "@tabler/icons-react";
import Footer from "@/components/Footer";
import StickyHeader from "@/components/StickyHeader";
import { logoutApi } from "@/app/services/auth.service";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface PostSummary {
  id: string;
  slug?: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  imageUrl: string;
  featured: boolean;
}

const CATEGORIES = [
  "Kiến Thức Nguyên Liệu",
  "Kinh Nghiệm Bếp B2B",
  "Xu Hướng Ẩm Thực",
];

export default function AdminBlogPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);

  // State Form thêm bài viết từ File Word
  const [wordFile, setWordFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [tags, setTags] = useState<string>("Thịt nhập khẩu, Cẩm nang B2B");
  const [featured, setFeatured] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>("");

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

  const fetchAllPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch(`${API_BASE}/api/posts`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error("Chưa kết nối được API posts:", err);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCoverFile(file);
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    } else {
      setCoverPreview("");
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wordFile) {
      alert("Vui lòng chọn file Word (.docx) bài viết!");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("wordFile", wordFile);
    if (coverFile) formData.append("coverImage", coverFile);
    if (title.trim()) formData.append("title", title.trim());
    formData.append("category", category);
    formData.append("tags", tags);
    formData.append("featured", String(featured));

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/api/posts/import-word`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });

      if (res.ok) {
        setToastMsg("Đã đăng bài viết mới từ file Word thành công!");
        setTimeout(() => setToastMsg(""), 5000);
        setWordFile(null);
        setCoverFile(null);
        setCoverPreview("");
        setTitle("");
        setFeatured(false);
        await fetchAllPosts();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Lỗi: ${errData.message || "Không thể tạo bài viết"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Không thể kết nối tới máy chủ Backend!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (id: string, postTitle: string) => {
    if (!confirm(`Bạn có chắc muốn xóa bài viết "${postTitle}" không?`)) return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/api/posts/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Không thể xóa bài viết.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <StickyHeader isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <div className="min-h-screen bg-[#FAF8F5] text-gray-800">
        {/* 🎯 BANNER QUẢN TRỊ BLOG */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div
            className="w-full rounded-[28px] py-10 px-6 sm:px-12 shadow-2xl border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{
              background:
                "linear-gradient(90deg, #0B0F17 0%, #1F150D 25%, #4A2809 50%, #1F150D 75%, #0B0F17 100%)",
            }}
          >
            <div>
              <div className="inline-block px-3.5 py-1 rounded-full border border-[#ECA921]/40 bg-[#ECA921]/10 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ECA921]">
                  KHÁNH AN CMS ADMIN
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black uppercase text-[#FFF3D1]">
                QUẢN LÝ & ĐĂNG BÀI BLOG
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-gray-300">
                Tải trực tiếp file Word (.docx) để hệ thống tự động tạo mục lục,
                khung Mẹo, Bảng tra cứu và đẩy ảnh lên Cloudinary.
              </p>
            </div>

            <Link
              href="/blog"
              className="px-5 py-3 rounded-xl bg-[#ECA921] hover:bg-[#D89512] text-gray-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shrink-0"
            >
              <IconArrowLeft className="w-4 h-4" /> Xem Trang Blog Công Khai
            </Link>
          </div>
        </div>

        {/* NỘI DUNG CHÍNH: 5 CỘT FORM IMPORT WORD + 7 CỘT DANH SÁCH BÀI VIẾT */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* CỘT TRÁI (5 CỘT): FORM UPLOAD FILE WORD */}
            <div className="lg:col-span-5 bg-white rounded-3xl shadow-sm border border-amber-200/80 overflow-hidden">
              <div className="bg-gray-900 text-white px-6 py-4 border-b border-amber-500/30 flex items-center gap-2.5">
                <IconFileUpload className="w-5 h-5 text-[#ECA921]" />
                <h2 className="text-base font-black text-amber-100">
                  Thêm Bài Viết Mới Bằng File Word
                </h2>
              </div>

              <form
                onSubmit={handleCreatePost}
                className="p-6 space-y-4 text-xs"
              >
                {/* Hộp hướng dẫn quy tắc gõ trong Word */}
                <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 space-y-1.5 text-gray-700">
                  <div className="font-black text-[#8C5210] flex items-center gap-1.5">
                    <IconBulb className="w-4 h-4 text-[#ECA921]" />
                    Cách trình bày trong Word để tự lên khung đẹp:
                  </div>
                  <p>
                    • Gõ <strong>Tóm tắt: Ý 1; Ý 2; Ý 3</strong> → Tự động vào
                    hộp <em>Tóm tắt nội dung quan trọng (1, 2, 3)</em>.
                  </p>
                  <p>
                    • Gõ <strong>Mẹo: ...</strong> hoặc{" "}
                    <strong>Lưu ý: ...</strong> → Tự động vào hộp đen viền vàng.
                  </p>
                  <p>
                    • Kẻ <strong>Bảng (Table)</strong> trong Word → Tự động
                    thành <em>Bảng Tra Cứu Nhanh</em> màu hổ phách.
                  </p>
                </div>

                {/* 1. Chọn File Word */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1.5">
                    1. File nội dung Word (.docx){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-amber-300 hover:border-[#ECA921] bg-amber-50/30 rounded-2xl p-5 text-center transition-colors">
                    <IconFileText className="w-8 h-8 text-[#ECA921] mb-1.5" />
                    <span className="font-bold text-gray-800">
                      {wordFile
                        ? wordFile.name
                        : "Bấm để chọn file .docx từ máy tính"}
                    </span>
                    <span className="text-[11px] text-gray-400 mt-0.5">
                      Hỗ trợ tự động trích xuất cả ảnh và bảng bên trong file
                      Word
                    </span>
                    <input
                      type="file"
                      accept=".docx"
                      onChange={(e) => setWordFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* 2. Chọn Ảnh Bìa */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1.5">
                    2. Ảnh bìa bài viết (Tự động tải lên Cloudinary)
                  </label>
                  <label className="cursor-pointer flex items-center gap-3 border border-gray-200 hover:border-[#ECA921] rounded-2xl p-3 bg-gray-50 transition-colors">
                    {coverPreview ? (
                      <img
                        src={coverPreview}
                        alt="Preview"
                        className="w-16 h-12 rounded-xl object-cover border border-amber-200"
                      />
                    ) : (
                      <div className="w-16 h-12 rounded-xl bg-amber-100/60 text-[#B8731B] flex items-center justify-center">
                        <IconPhoto className="w-6 h-6" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-bold text-gray-800 line-clamp-1">
                        {coverFile
                          ? coverFile.name
                          : "Chọn ảnh đại diện (Thumbnail)"}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        JPG, PNG, WEBP (Khuyên dùng 1200x630px)
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* 3. Tiêu đề tùy chọn */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    3. Tiêu đề bài viết (Nếu bỏ trống sẽ tự lấy tên file Word)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="VD: Cách Phân Biệt Các Phần Thịt Bò Nhập Khẩu..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#ECA921]"
                  />
                </div>

                {/* 4. Chuyên mục & Tags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      Chuyên mục
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#ECA921]"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      Từ khóa (Cách nhau dấu phẩy)
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="Bò Mỹ, Lẩu Nướng, Food Cost"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#ECA921]"
                    />
                  </div>
                </div>

                {/* 5. Đánh dấu nổi bật */}
                <label className="flex items-center gap-2.5 pt-1 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#ECA921]"
                  />
                  <span>
                    Đặt làm Bài Viết Nổi Bật (Hiển thị to ở đầu trang Blog)
                  </span>
                </label>

                {toastMsg && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold flex items-center gap-2">
                    <IconCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{toastMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || !wordFile}
                  className="w-full cursor-pointer py-3.5 px-6 rounded-xl bg-[#ECA921] hover:bg-[#D89512] text-gray-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <IconLoader2 className="w-4 h-4 animate-spin" /> Đang Xử
                      Lý File Word & Đẩy Lên Cloud...
                    </>
                  ) : (
                    <>
                      <IconFileUpload className="w-4 h-4" /> Đăng Bài Viết Lên
                      Website
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* CỘT PHẢI (7 CỘT): DANH SÁCH BÀI VIẾT HIỆN CÓ */}
            <div className="lg:col-span-7 bg-white rounded-3xl shadow-sm border border-amber-100 overflow-hidden">
              <div className="px-6 py-4 bg-amber-50/60 border-b border-amber-100 flex items-center justify-between">
                <h2 className="text-base font-black text-gray-900">
                  Danh Sách Bài Viết Đã Đăng ({posts.length})
                </h2>
                <button
                  type="button"
                  onClick={fetchAllPosts}
                  className="text-xs font-bold text-[#B8731B] hover:underline cursor-pointer"
                >
                  Làm mới danh sách
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {loadingPosts ? (
                  <div className="p-12 text-center text-xs text-gray-400">
                    Đang tải danh sách bài viết...
                  </div>
                ) : posts.length === 0 ? (
                  <div className="p-12 text-center space-y-2">
                    <p className="text-sm font-bold text-gray-700">
                      Chưa có bài viết nào trong Database
                    </p>
                    <p className="text-xs text-gray-400">
                      Hãy chọn một file Word (.docx) ở khung bên trái để đăng
                      bài viết đầu tiên!
                    </p>
                  </div>
                ) : (
                  posts.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-amber-50/20 transition-colors"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-20 h-14 rounded-xl object-cover shrink-0 border border-amber-200"
                        />
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[#B8731B] bg-amber-100/70 px-2 py-0.5 rounded-md">
                              {item.category}
                            </span>
                            {item.featured && (
                              <span className="text-[10px] font-black text-gray-950 bg-[#ECA921] px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                <IconFlame className="w-3 h-3" /> Nổi bật
                              </span>
                            )}
                            <span className="text-[11px] text-gray-400">
                              {item.date}
                            </span>
                          </div>
                          <Link
                            href={`/blog/${item.slug || item.id}`}
                            className="block text-sm font-extrabold text-gray-900 truncate hover:text-[#B8731B]"
                          >
                            {item.title}
                          </Link>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/blog/${item.slug || item.id}`}
                          className="p-2 rounded-xl bg-gray-100 hover:bg-amber-100 text-gray-700 transition-colors"
                          title="Xem bài viết"
                        >
                          <IconEye className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeletePost(item.id, item.title)}
                          className="cursor-pointer p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                          title="Xóa bài viết"
                        >
                          <IconTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
