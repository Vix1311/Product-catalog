"use client";

import React, { useState } from "react";
import Link from "next/link";
import MegaMenu, { categoriesList } from "@/components/MegaMenu";
import { Input } from "@/components/ui/input";
import {
  IconMenu2,
  IconX,
  IconSearch,
  IconPlus,
  IconLogout,
  IconLogin,
  IconChevronDown,
} from "@tabler/icons-react";

interface StickyHeaderProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  cartCount?: number;
}

export default function StickyHeader({
  searchQuery,
  setSearchQuery,
  isLoggedIn,
  onLogout,
  cartCount = 0,
}: StickyHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);

  // Danh mục ngành hàng B2B Khánh An
  const mobileCategories = [
    { name: "Thịt Nhập Khẩu", link: "/catalog?group=thit-nhap-khau" },
    { name: "Surimi & Chả Cá", link: "/catalog?group=surimi" },
    { name: "Sauce / Nước Sốt", link: "/catalog?group=sauce" },
    { name: "Mayonnaise", link: "/catalog?group=mayonnaise" },
    { name: "Bia & Đồ Uống", link: "/catalog?group=bia" },
    { name: "Chà Bông Heo / Gà", link: "/catalog?group=cha-bong" },
    { name: "RTE (Ăn Liền)", link: "/catalog?group=rte" },
    { name: "RTC (Sơ Chế Sẵn)", link: "/catalog?group=rtc" },
    { name: "Gia Công OEM / ODM", link: "/catalog?group=oem-odm" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* 1. LOGO THƯƠNG HIỆU */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
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

            {/* MegaMenu Desktop (Dùng Hover) */}
            <div className="hidden lg:block">
              <MegaMenu />
            </div>
          </div>

          {/* 2. Ô TÌM KIẾM TRUNG TÂM (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Input
              type="text"
              placeholder="Tìm kiếm sản phẩm, nhà cung cấp, món ăn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 text-sm border-amber-200 focus:border-[#ECA921] bg-amber-50/30 focus:bg-white rounded-full"
            />
            <IconSearch className="w-4 h-4 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* 3. ACTION BUTTONS (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            {!isLoggedIn ? (
              <Link
                href="/login"
                className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                Đăng Nhập
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/AddProduct"
                  className="px-3 py-2 bg-[#ECA921] hover:bg-[#D89512] text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <IconPlus className="w-4 h-4" /> Thêm mới
                </Link>
                <button
                  onClick={onLogout}
                  className="px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md text-xs font-semibold hover:bg-red-100 transition-colors flex items-center gap-1"
                >
                  <IconLogout className="w-4 h-4" /> Thoát
                </button>
              </div>
            )}
          </div>

          {/* 4. NÚT HAMBURGER MENU (Mobile) */}
          <div className="flex lg:hidden items-center gap-2">
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

      {/* --- MOBILE DRAWER MENU --- */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-amber-100 bg-white px-4 pt-4 pb-6 shadow-xl space-y-4 transition-all">
          {/* Ô Tìm kiếm Mobile */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Tìm kiếm sản phẩm, ngành hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 text-sm border-amber-200 focus:border-[#ECA921] bg-amber-50/30 focus:bg-white rounded-full"
            />
            <IconSearch className="w-4 h-4 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Danh mục dạng Accordion hỗ trợ CLICK trên Mobile */}
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

            {/* Danh sách ngành hàng hiện ra khi bấm */}
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

          {/* Cụm Nút Đăng nhập / Thêm mới / Thoát */}
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            {!isLoggedIn ? (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold text-center hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <IconLogin className="w-4 h-4" /> Đăng Nhập
              </Link>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/AddProduct"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-[#ECA921] hover:bg-[#D89512] text-white rounded-xl text-sm font-semibold text-center transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <IconPlus className="w-4 h-4" /> Thêm sản phẩm mới
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <IconLogout className="w-4 h-4" /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
