"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import MegaMenu, { categoriesList } from "@/components/MegaMenu";
import { Input } from "@/components/ui/input";
import {
  IconMenu2,
  IconX,
  IconSearch,
  IconPlus,
  IconLogout,
  IconChevronDown,
} from "@tabler/icons-react";

interface StickyHeaderProps {
  searchQuery?: string;
  setSearchQuery?: (val: string) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  cartCount?: number;
}

// Danh sách các mục menu mới (Thay "Nội Địa" & "B2B" bằng "Surimi" & "ODM/OEM")
const navLinks = [
  {
    name: "Surimi",
    href: "/catalog?group=surimi",
    hasDropdown: true,
  },
  {
    name: "ODM/OEM",
    href: "/catalog?group=odm-oem",
    hasDropdown: true,
  },
  {
    name: "Về Khánh An",
    href: "/bio",
    hasDropdown: false,
  },
  {
    name: "Blog",
    href: "/blog",
    hasDropdown: true,
  },
];

function StickyHeaderContent({
  searchQuery: externalSearchQuery,
  setSearchQuery: externalSetSearchQuery,
  isLoggedIn,
  onLogout,
  cartCount = 0,
}: StickyHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State quản lý
  const [searchValue, setSearchValue] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Đóng/mở vùng chứa thanh search
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Lấy từ khóa từ URL khi mới load trang
  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    setSearchValue(searchFromUrl);
  }, [searchParams]);

  // Tự động đưa con trỏ chuột vào ô input khi bấm mở icon tìm kiếm
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Xử lý khi người dùng gõ phím tìm kiếm
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    if (externalSetSearchQuery) {
      externalSetSearchQuery(val);
    }
  };

  // Submit form tìm kiếm
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchValue.trim();

    const currentGroup = searchParams.get("group");
    const currentSub =
      searchParams.get("subCategory") || searchParams.get("sub");

    const params = new URLSearchParams();
    if (currentGroup) params.set("group", currentGroup);
    if (currentSub) params.set("subCategory", currentSub);
    if (trimmed) {
      params.set("search", trimmed);
    }

    router.push(`/catalog?${params.toString()}`);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Xóa nội dung tìm kiếm
  const handleClearSearch = () => {
    setSearchValue("");
    if (externalSetSearchQuery) {
      externalSetSearchQuery("");
    }

    const currentGroup = searchParams.get("group");
    const currentSub =
      searchParams.get("subCategory") || searchParams.get("sub");

    const params = new URLSearchParams();
    if (currentGroup) params.set("group", currentGroup);
    if (currentSub) params.set("subCategory", currentSub);

    router.push(`/catalog?${params.toString()}`);
  };

  // XỬ LÝ ĐĂNG XUẤT THỰC TẾ
  const handleLogoutAction = async () => {
    if (onLogout) {
      await onLogout(); // Gọi hàm logout từ Component Cha truyền xuống
    }
    setIsMobileMenuOpen(false); // Đóng Drawer nếu ở Mobile
    router.push("/"); // Chuyển hướng về trang chủ
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* 1. LOGO THƯƠNG HIỆU & MEGA MENU */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <img
                src="/logo.png"
                alt="KA Foods Logo"
                className="h-8 md:h-9 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <img
                src="/logo1.png"
                alt="Khánh An"
                className="h-4 md:h-5 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>
          </div>

          {/* 2. CÁC MỤC ĐIỀU HƯỚNG MỚI (Surimi, ODM/OEM, Xuất khẩu, Về Khánh An, Blog) */}
          <nav className="hidden lg:flex items-center gap-7">
            {/* MegaMenu Desktop */}
            <div className="hidden lg:block">
              <MegaMenu />
            </div>
            {navLinks.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="flex items-center font-bold gap-1.5 text-[15px] text-gray-800 hover:text-[#ECA921] transition-colors py-1 group"
              >
                <span>{item.name}</span>
                {item.hasDropdown && (
                  <IconChevronDown
                    stroke={2}
                    className="w-4 h-4 text-gray-600 group-hover:text-[#ECA921] transition-transform duration-200 group-hover:rotate-180"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* 3. KHU VỰC BÊN PHẢI: ICON SEARCH & NÚT ADMIN (KHI ĐÃ ĐĂNG NHẬP) */}
          <div className="flex items-center gap-2.5">
            {/* Nút Icon Tìm Kiếm (Nhấn vào để bật/tắt phần chứa thanh search) */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 rounded-full transition-colors ${
                isSearchOpen
                  ? "bg-amber-100 text-[#ECA921]"
                  : "text-gray-700 hover:bg-amber-50 hover:text-[#ECA921]"
              }`}
              aria-label="Toggle Search"
            >
              {isSearchOpen ? (
                <IconX className="w-5 h-5" />
              ) : (
                <IconSearch className="w-5 h-5" />
              )}
            </button>

            {/* ĐÃ BỎ NÚT ĐĂNG NHẬP - Chỉ hiển thị nút Thêm mới & Thoát khi isLoggedIn = true */}
            {isLoggedIn && (
              <div className="hidden lg:flex items-center gap-2.5">
                <Link
                  href="/admin"
                  className="px-3.5 py-2 bg-[#ECA921] hover:bg-[#D89512] text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <IconPlus className="w-4 h-4" /> Thêm mới
                </Link>
                <button
                  onClick={handleLogoutAction}
                  className="px-3.5 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-100 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <IconLogout className="w-4 h-4" /> Thoát
                </button>
              </div>
            )}

            {/* 4. NÚT HAMBURGER MENU (Mobile) */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-[#ECA921] transition-colors focus:outline-none"
                aria-label="Toggle Mobile Menu"
              >
                {isMobileMenuOpen ? (
                  <IconX className="w-6 h-6 text-[#ECA921]" />
                ) : (
                  <IconMenu2 className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- PHẦN CHỨA THANH SEARCH XỔ XUỐNG MƯỢT MÀ --- */}
      {/* --- PHẦN CHỨA THANH SEARCH NỔI SÁT PHẢI (DẠNG HỘP GỌN) --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div
          className={`absolute top-0 right-4 sm:right-6 lg:right-8 z-50 w-[calc(100%-2rem)] sm:w-[420px] bg-white/95 backdrop-blur-md border border-amber-100 rounded-2xl p-3 shadow-xl transition-all duration-300 ease-out origin-top-right ${
            isSearchOpen
              ? "opacity-100 translate-y-2 visible pointer-events-auto scale-100"
              : "opacity-0 -translate-y-2 invisible pointer-events-none scale-95"
          }`}
        >
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Tìm kiếm sản phẩm, món ăn..."
                value={searchValue}
                onChange={handleInputChange}
                className="w-full pl-9 pr-8 py-2 text-sm border-amber-200 focus:border-[#ECA921] bg-amber-50/30 focus:bg-white rounded-full transition-all"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 hover:text-[#ECA921] transition-colors"
                aria-label="Submit search"
              >
                <IconSearch className="w-4 h-4" />
              </button>

              {searchValue && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 hover:text-gray-600 text-xs font-bold transition-transform hover:scale-110"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#ECA921] hover:bg-[#D89512] active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-full transition-all shrink-0 shadow-sm"
            >
              Tìm
            </button>
          </form>
        </div>
      </div>

      {/* --- MOBILE DRAWER MENU --- */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-amber-100 bg-white px-4 pt-4 pb-6 shadow-xl space-y-4 transition-all">
          {/* Các mục Menu mới trên Mobile */}
          <div className="space-y-1">
            {navLinks.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-semibold text-gray-700 hover:text-[#ECA921] hover:bg-amber-50 transition-colors"
              >
                <span>{item.name}</span>
                {item.hasDropdown && (
                  <IconChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </Link>
            ))}
          </div>

          {/* Accordion Danh mục sản phẩm trên Mobile */}
          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg bg-amber-50/60 text-[#4A2E16] font-bold text-sm"
            >
              <span>📂 DANH MỤC SẢN PHẨM</span>
              <IconChevronDown
                className={`w-5 h-5 text-[#ECA921] transition-transform duration-300 ${
                  isMobileCategoryOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isMobileCategoryOpen && (
              <div className="mt-2 pl-2 space-y-1 py-1">
                {categoriesList.map((cat, index) => (
                  <Link
                    key={index}
                    href={cat.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-lg text-xs font-semibold text-gray-700 hover:text-[#ECA921] hover:bg-amber-50 transition-colors"
                  >
                    {cat.icon}
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Cụm Nút Mobile (Chỉ hiển thị khi đã đăng nhập, ẩn nút Đăng Nhập) */}
          {isLoggedIn && (
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 bg-[#ECA921] hover:bg-[#D89512] text-white rounded-xl text-sm font-semibold text-center transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <IconPlus className="w-4 h-4" /> Thêm sản phẩm mới
              </Link>
              <button
                onClick={handleLogoutAction}
                className="w-full py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <IconLogout className="w-4 h-4" /> Đăng xuất
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

// Bọc Suspense ngay tại export default của StickyHeader
export default function StickyHeader(props: StickyHeaderProps) {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-40 h-16 bg-white/95 border-b border-amber-100 shadow-sm" />
      }
    >
      <StickyHeaderContent {...props} />
    </Suspense>
  );
}
