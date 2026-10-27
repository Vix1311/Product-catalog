"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import MegaMenu, { categoriesList } from "@/components/MegaMenu";
import { Input } from "@/components/ui/input";
import {
  IconMenu2,
  IconX,
  IconSearch,
  IconPlus,
  IconLogout,
  IconChevronDown,
  IconBoxSeam,
  IconArticle,
  IconShieldLock,
  IconExternalLink,
} from "@tabler/icons-react";

interface StickyHeaderProps {
  searchQuery?: string;
  setSearchQuery?: (val: string) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  cartCount?: number;
}

// 1. Menu cho khách hàng bình thường (Client Menu)
const clientNavLinks = [
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

// 2. Menu dành riêng cho Admin khi URL có chứa /admin
const adminNavLinks = [
  {
    name: "Quản Lý Sản Phẩm",
    href: "/admin",
    icon: <IconBoxSeam className="w-4 h-4" />,
  },
  {
    name: "Quản Lý Blog",
    href: "/admin/blog",
    icon: <IconArticle className="w-4 h-4" />,
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
  const pathname = usePathname();

  // 🎯 Nhận diện xem trang hiện tại có thuộc khu vực Admin hay không
  const isAdminRoute = pathname?.startsWith("/admin");

  // State quản lý
  const [searchValue, setSearchValue] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Lấy từ khóa từ URL khi mới load trang
  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    setSearchValue(searchFromUrl);
  }, [searchParams]);

  // Tự động đưa con trỏ chuột vào ô input khi mở tìm kiếm
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    if (externalSetSearchQuery) {
      externalSetSearchQuery(val);
    }
  };

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

  const handleLogoutAction = async () => {
    if (onLogout) {
      await onLogout();
    }
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* 1. LOGO THƯƠNG HIỆU (+ HUY HIỆU ADMIN NẾU ĐANG Ở ROUTE /admin) */}
          <div className="flex items-center gap-3">
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

            {isAdminRoute && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#ECA921] bg-gray-900 px-2.5 py-1 rounded-full border border-amber-400/30 shadow-xs">
                <IconShieldLock className="w-3.5 h-3.5" /> Quản Trị
              </span>
            )}
          </div>

          {/* 2. CÁC MỤC ĐIỀU HƯỚNG CHÍNH (DESKTOP) */}
          <nav className="hidden lg:flex items-center gap-6">
            {isAdminRoute ? (
              // 🎯 Khi là trang Admin: Hiện Menu Quản Trị
              <div className="flex items-center gap-2">
                {adminNavLinks.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? "bg-[#ECA921] text-gray-950 shadow-sm"
                          : "text-gray-700 hover:text-gray-950 hover:bg-amber-50"
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  );
                })}

                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors ml-1"
                  title="Mở giao diện khách hàng ở tab mới"
                >
                  <IconExternalLink className="w-3.5 h-3.5" /> Xem Trang Khách
                </Link>
              </div>
            ) : (
              // Khi là trang User: Giữ nguyên MegaMenu và các liên kết thông thường
              <>
                <div className="hidden lg:block">
                  <MegaMenu />
                </div>
                {clientNavLinks.map((item, idx) => (
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
              </>
            )}
          </nav>

          {/* 3. KHU VỰC BÊN PHẢI */}
          <div className="flex items-center gap-2.5">
            {isAdminRoute ? (
              // 🎯 Nút Thao Tác Bên Phải Trong Khu Vực Admin
              <div className="flex items-center gap-2">
                <Link
                  href="/admin/add-product"
                  className="px-3.5 py-2 bg-[#ECA921] hover:bg-[#D89512] text-gray-950 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <IconPlus className="w-4 h-4" stroke={2.5} /> Thêm Sản Phẩm
                </Link>

                <button
                  type="button"
                  onClick={handleLogoutAction}
                  className="px-3.5 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-100 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <IconLogout className="w-4 h-4" /> Thoát
                </button>
              </div>
            ) : (
              // Nút Thao Tác Bên Phải Trang Khách Hàng
              <>
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

                {isLoggedIn && (
                  <div className="hidden lg:flex items-center gap-2">
                    <Link
                      href="/admin"
                      className="px-3.5 py-2 bg-gray-900 hover:bg-gray-800 text-[#ECA921] border border-amber-400/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <IconShieldLock className="w-4 h-4" /> Trang Admin
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogoutAction}
                      className="px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-100 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      <IconLogout className="w-4 h-4" /> Thoát
                    </button>
                  </div>
                )}
              </>
            )}

            {/* 4. NÚT HAMBURGER MENU (MOBILE) */}
            <div className="flex lg:hidden items-center">
              <button
                type="button"
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

      {/* --- PHẦN CHỨA THANH SEARCH NỔI (CHỈ XUẤT HIỆN KHI Ở TRANG USER) --- */}
      {!isAdminRoute && (
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
      )}

      {/* --- MOBILE DRAWER MENU --- */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-amber-100 bg-white px-4 pt-4 pb-6 shadow-xl space-y-4 transition-all">
          {isAdminRoute ? (
            // Menu Mobile khi ở trang Quản trị
            <div className="space-y-2">
              <div className="text-[11px] font-black text-gray-400 uppercase tracking-wider px-2">
                Menu Quản Trị Viên
              </div>
              {adminNavLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-800 hover:bg-amber-50"
                >
                  {item.icon} {item.name}
                </Link>
              ))}
              <Link
                href="/admin/products/add"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-[#8C5210] bg-amber-50"
              >
                <IconPlus className="w-4 h-4 text-[#ECA921]" /> Thêm Sản Phẩm
                Mới
              </Link>
              <Link
                href="/"
                target="_blank"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50"
              >
                <IconExternalLink className="w-4 h-4" /> Xem Trang Khách
              </Link>
              <button
                type="button"
                onClick={handleLogoutAction}
                className="w-full mt-2 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
                <IconLogout className="w-4 h-4" /> Đăng xuất quản trị
              </button>
            </div>
          ) : (
            // Menu Mobile khi ở trang Khách Hàng
            <>
              <div className="space-y-1">
                {clientNavLinks.map((item, idx) => (
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
                  type="button"
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

              {/* Cụm nút khi đã đăng nhập */}
              {isLoggedIn && (
                <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-2.5 bg-gray-900 text-[#ECA921] border border-amber-400/30 rounded-xl text-sm font-bold text-center transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <IconShieldLock className="w-4 h-4" /> Truy Cập Trang Admin
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogoutAction}
                    className="w-full py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <IconLogout className="w-4 h-4" /> Đăng xuất
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
}

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
