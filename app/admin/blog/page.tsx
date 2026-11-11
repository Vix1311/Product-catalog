"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
  IconFileUpload,
  IconTrash,
  IconEye,
  IconLoader2,
  IconFlame,
  IconPhoto,
  IconFileText,
  IconBulb,
  IconArrowLeft,
  IconRefresh,
  IconSearch,
  IconFilter,
  IconTag,
  IconChevronLeft,
  IconChevronRight,
  IconX,
} from "@tabler/icons-react";
import Footer from "@/components/Footer";
import StickyHeader from "@/components/StickyHeader";
import { logoutApi } from "@/app/services/auth.service";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import NotFoundPage from "@/app/not-found";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

interface PostSummary {
  id: string;
  slug?: string;
  title: string;
  category: string;
  tags?: string | string[];
  date: string;
  readTime: string;
  imageUrl: string;
  featured: boolean;
  createdAt?: string;
}

const CATEGORIES = [
  "Kiến Thức Nguyên Liệu",
  "Kinh Nghiệm Bếp B2B",
  "Xu Hướng Ẩm Thực",
];

const ITEMS_PER_PAGE = 7;

export default function AdminBlogPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);

  // State Bộ lọc & Phân trang
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [filterTag, setFilterTag] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // State Form thêm bài viết từ File Word
  const [wordFile, setWordFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [tags, setTags] = useState<string>("Thịt nhập khẩu, Cẩm nang B2B");
  const [featured, setFeatured] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // 1. THÊM REF ĐỂ TRỎ VÀO ĐẦU DANH SÁCH BÀI VIẾT VÀ KIỂM TRA RENDER LẦN ĐẦU
  const listTopRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // 2. EFFECT: CUỘN LÊN ĐẦU KHI CHUYỂN TRANG
  useEffect(() => {
    // Bỏ qua lần render đầu tiên để không bị cuộn khi vừa vào trang
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (listTopRef.current) {
      // Tính toán vị trí và cuộn mượt mà lên đầu (trừ đi 100px cho header/thanh điều hướng)
      const top =
        listTopRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [currentPage]);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      const loggedInState = localStorage.getItem("isLoggedIn");
      const isValid = !!(token && loggedInState === "true");

      if (!isValid) {
        router.replace("/");
      } else {
        setIsLoggedIn(true);
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [router]);

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
        const rawPosts = Array.isArray(data) ? data : data.posts || [];

        const formattedPosts = rawPosts.map((item: any) => ({
          ...item,
          date: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "Đang cập nhật",
        }));

        setPosts(formattedPosts);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCategory, filterTag]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = post.title
        ?.toLowerCase()
        .includes(searchQuery.trim().toLowerCase());

      const matchesCategory =
        filterCategory === "ALL" || post.category === filterCategory;

      let postTagsString = "";
      if (Array.isArray(post.tags)) {
        postTagsString = post.tags.join(", ").toLowerCase();
      } else if (typeof post.tags === "string") {
        postTagsString = post.tags.toLowerCase();
      }

      const matchesTag =
        !filterTag.trim() ||
        postTagsString.includes(filterTag.trim().toLowerCase());

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [posts, searchQuery, filterCategory, filterTag]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPosts.length / ITEMS_PER_PAGE),
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredPosts.length, totalPages, currentPage]);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterCategory("ALL");
    setFilterTag("");
    setCurrentPage(1);
  };

  if (isCheckingAuth) {
    return <NotFoundPage />;
  }

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
      toast.error("Vui lòng chọn file Word (.docx) bài viết!");
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
        toast.success(`Đã đăng bài viết mới từ file Word thành công!`);
        setWordFile(null);
        setCoverFile(null);
        setCoverPreview("");
        setTitle("");
        setFeatured(false);
        await fetchAllPosts();
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.error(`Lỗi: ${errData.message || "Không thể tạo bài viết"}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể kết nối tới máy chủ Backend!");
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
        toast.success("Đã xóa bài viết!");
      } else {
        toast.error("Không thể xóa bài viết từ hệ thống.");
      }
    } catch (err) {
      console.error("Lỗi khi gọi API xóa:", err);
      toast.error("Lỗi kết nối khi xóa bài viết.");
    }
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    filterCategory !== "ALL" ||
    filterTag.trim() !== "";

  return (
    <div>
      <StickyHeader isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <div className="min-h-screen bg-[#FAF8F5] text-gray-800">
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
                khung Mẹo, Bảng tra cứu, Video và đẩy ảnh lên Cloudinary.
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

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* --- CỘT TRÁI (UPLOAD FILE) GIỮ NGUYÊN --- */}
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
                <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 space-y-2 text-gray-700 shadow-xs">
                  <div className="font-black text-[#8C5210] flex items-center gap-1.5 text-sm">
                    <IconBulb className="w-4 h-4 text-[#ECA921]" />
                    Note định dạng file Word (.docx):
                  </div>
                  <ul className="space-y-1.5 pl-4 list-disc text-xs text-gray-600">
                    <li>
                      <strong>Tóm tắt nội dung:</strong> Gõ dòng bắt đầu bằng{" "}
                      <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-bold">
                        Tóm tắt: Ý 1; Ý 2; Ý 3
                      </code>{" "}
                      để tự động sinh hộp điểm chính dạng số 1, 2, 3.
                    </li>
                    <li>
                      <strong>Hộp lưu ý / Mẹo:</strong> Gõ câu bắt đầu bằng{" "}
                      <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-bold">
                        Mẹo: ...
                      </code>{" "}
                      hoặc{" "}
                      <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-bold">
                        Lưu ý: ...
                      </code>{" "}
                      để tự động bọc thành khung đen viền vàng.
                    </li>
                    <li>
                      <strong>Chèn Video xen kẽ:</strong> Tại vị trí muốn hiển
                      thị video trong Word, gõ trên 1 dòng riêng bắt đầu bằng{" "}
                      <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-bold">
                        VIDEO: https://link-video...
                      </code>
                    </li>
                    <li>
                      <strong>Chèn Hình ảnh xen kẽ:</strong> Dán (Paste) trực
                      tiếp ảnh vào đúng vị trí trong file Word hoặc gõ dòng{" "}
                      <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-bold">
                        IMAGE: https://link-anh...
                      </code>
                    </li>
                    <li>
                      <strong>Bảng (Table) & Mục lục (Heading 2):</strong> Kẻ
                      bảng và dùng Heading 2 trong Word để tự động tạo Bảng Tra
                      Cứu và Mục lục bên phải.
                    </li>
                  </ul>
                </div>

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
                      Hỗ trợ tự động trích xuất cả ảnh, VIDEO: và bảng bên trong
                      file Word
                    </span>
                    <input
                      type="file"
                      accept=".docx"
                      onChange={(e) => setWordFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>

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

                <button
                  type="submit"
                  disabled={submitting || !wordFile}
                  className="w-full cursor-pointer py-3.5 px-6 rounded-xl bg-[#ECA921] hover:bg-[#D89512] text-gray-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <IconLoader2 className="w-4 h-4 animate-spin" /> Đang Xử
                      Lý...
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

            {/* --- CỘT PHẢI (DANH SÁCH BÀI VIẾT) --- */}
            <div className="lg:col-span-7 bg-white rounded-3xl shadow-sm border border-amber-100 overflow-hidden">
              {/* 3. ĐẶT REF Ở ĐÂY ĐỂ ĐÍCH TỚI KHI CUỘN LÊN ĐẦU DANH SÁCH */}
              <div
                ref={listTopRef}
                className="px-6 py-4 bg-amber-50/60 border-b border-amber-100 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-base font-black text-gray-900">
                    Danh Sách Bài Viết Đã Đăng ({filteredPosts.length}
                    {hasActiveFilters ? `/${posts.length}` : ""})
                  </h2>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <IconX className="w-3.5 h-3.5" /> Xóa bộ lọc
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={fetchAllPosts}
                  disabled={loadingPosts}
                  title="Làm mới danh sách"
                  className="p-2 rounded-xl bg-white hover:bg-amber-100/80 text-[#B8731B] border border-amber-200/80 shadow-2xs transition-all cursor-pointer active:scale-95 disabled:opacity-50 shrink-0"
                >
                  <IconRefresh
                    className={`w-4 h-4 ${loadingPosts ? "animate-spin" : ""}`}
                  />
                </button>
              </div>

              <div className="p-4 sm:px-6 bg-gray-50/60 border-b border-gray-100 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <div className="sm:col-span-5 relative">
                    <IconSearch className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm theo tiêu đề..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#ECA921]"
                    />
                  </div>

                  <div className="sm:col-span-4 relative">
                    <IconFilter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#ECA921] truncate"
                    >
                      <option value="ALL">Tất cả chuyên mục</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3 relative">
                    <IconTag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={filterTag}
                      onChange={(e) => setFilterTag(e.target.value)}
                      placeholder="Lọc từ khóa..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#ECA921]"
                    />
                  </div>
                </div>
              </div>

              {/* 4. THÊM MIN-H ĐỂ THANH PHÂN TRANG LUÔN GIỮ NGUYÊN VỊ TRÍ, KHÔNG BỊ RÚT LÊN (ĐI THEO) KHI ÍT BÀI */}
              <div
                className={`divide-y divide-gray-100 ${!loadingPosts && filteredPosts.length > 0 ? "min-h-[680px]" : ""}`}
              >
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
                ) : filteredPosts.length === 0 ? (
                  <div className="p-12 text-center space-y-2">
                    <p className="text-sm font-bold text-gray-700">
                      Không tìm thấy bài viết nào khớp với bộ lọc
                    </p>
                    <p className="text-xs text-gray-400">
                      Hãy thử đổi từ khóa tìm kiếm hoặc chọn chuyên mục khác.
                    </p>
                  </div>
                ) : (
                  paginatedPosts.map((item) => {
                    const tagList = Array.isArray(item.tags)
                      ? item.tags
                      : typeof item.tags === "string" && item.tags.trim()
                        ? item.tags.split(",").map((t) => t.trim())
                        : [];

                    return (
                      <div
                        key={item.id}
                        className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-amber-50/20 transition-colors"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={
                              item.imageUrl ||
                              "https://placehold.co/200x150?text=No+Img"
                            }
                            alt={item.title}
                            className="w-20 h-14 rounded-xl object-cover shrink-0 border border-amber-200"
                          />
                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
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
                            {tagList.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1 pt-0.5">
                                {tagList.slice(0, 4).map((t, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setFilterTag(t)}
                                    className="text-[10px] text-gray-500 bg-gray-100 hover:bg-amber-100 hover:text-[#8C5210] px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                                  >
                                    #{t}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Link
                            href={`/blog/${item.slug || item.id}`}
                            className="p-2 rounded-xl bg-gray-100 hover:bg-amber-100 text-gray-700 transition-colors"
                          >
                            <IconEye className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeletePost(item.id, item.title)
                            }
                            className="cursor-pointer p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                          >
                            <IconTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* PHÂN TRANG */}
              {!loadingPosts && filteredPosts.length > ITEMS_PER_PAGE && (
                <div className="px-6 py-4 bg-amber-50/40 border-t border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <span className="text-gray-500">
                    Hiển thị{" "}
                    <strong className="text-gray-800">
                      {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                    </strong>{" "}
                    -{" "}
                    <strong className="text-gray-800">
                      {Math.min(
                        currentPage * ITEMS_PER_PAGE,
                        filteredPosts.length,
                      )}
                    </strong>{" "}
                    trên tổng số{" "}
                    <strong className="text-gray-800">
                      {filteredPosts.length}
                    </strong>{" "}
                    bài viết
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-amber-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
                    >
                      <IconChevronLeft className="w-4 h-4 text-gray-700" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                            currentPage === page
                              ? "bg-[#ECA921] text-gray-950 shadow-xs"
                              : "bg-white border border-gray-200 text-gray-700 hover:bg-amber-50"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-amber-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
                    >
                      <IconChevronRight className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
