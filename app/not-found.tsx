"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconHome,
  IconArrowLeft,
  IconBookDownload,
  IconAlertTriangle,
} from "@tabler/icons-react";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <main
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans select-none"
      style={{
        background:
          "linear-gradient(135deg, #0B0F17 0%, #1F150D 35%, #4A2809 70%, #0B0F17 100%)",
      }}
    >
      {/* Quầng sáng vàng hổ phách lan tỏa nhẹ ở trung tâm */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(236, 169, 33, 0.14) 0%, transparent 65%)",
        }}
      />

      {/* Chữ 404 khổng lồ in chìm giữa màn hình */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="text-[180px] sm:text-[320px] lg:text-[420px] font-black tracking-tighter text-white/[0.03] leading-none">
          404
        </span>
      </div>

      {/* NỘI DUNG CHÍNH Ở TRUNG TÂM */}
      <div className="relative z-10 max-w-xl w-full mx-auto text-center space-y-6">
        {/* Eyebrow Tag */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#ECA921]/40 bg-[#ECA921]/10">
          <IconAlertTriangle className="w-4 h-4 text-[#ECA921]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ECA921]">
            ERROR 404 • KHÔNG TÌM THẤY TRANG
          </span>
        </div>

        {/* Số 404 nổi bật */}
        <div className="text-7xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFF3D1] via-[#ECA921] to-[#B8731B] drop-shadow-md tracking-tight leading-none py-1">
          404
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-[#FFF3D1] uppercase tracking-tight">
          Trang Bạn Tìm Kiếm Không Tồn Tại
        </h1>

        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-lg mx-auto">
          Đường dẫn sản phẩm hoặc bài viết này có thể đã được cập nhật quy cách
          mới hoặc chuyển sang danh mục khác trên hệ thống{" "}
          <strong className="text-[#ECA921]">Khánh An Foods</strong>.
        </p>

        {/* Cụm 3 nút điều hướng */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-amber-100 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-2 active:scale-95"
          >
            <IconArrowLeft className="w-4 h-4" />
            <span>Quay Lại Trang Trước</span>
          </button>

          <Link
            href="/"
            className="cursor-pointer px-6 py-3 rounded-xl bg-[#ECA921] hover:bg-[#D89512] text-gray-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 active:scale-95"
          >
            <IconHome className="w-4 h-4" />
            <span>Về Trang Chủ</span>
          </Link>

          <Link
            href="/catalog"
            className="cursor-pointer px-5 py-3 rounded-xl bg-gray-900/90 hover:bg-gray-900 text-[#ECA921] border border-[#ECA921]/40 font-bold text-xs transition-all flex items-center gap-2 active:scale-95"
          >
            <IconBookDownload className="w-4 h-4" />
            <span>Tra Cứu Catalog</span>
          </Link>
        </div>
      </div>
    </main>
  );
}