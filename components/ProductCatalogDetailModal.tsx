"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  IconX,
  IconCheck,
  IconBuildingStore,
  IconWorld,
  IconBox,
  IconStars,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";

export interface ProductDetail {
  id: string;
  stt: number;
  tenTiengViet: string;
  tenTiengAnh: string;
  nhom: string;
  phuHopMon: string;
  quyCachCatHang: string;
  phanTichThuongHieu: string;
  mucDoPhoBien: string;
  dacDiemSanPham: string;
  phuHopKenhQuan: string;
  thuongHieuXuatXu: string;
  quyCachThung: string;
  imageUrl: string;
}

interface ModalProps {
  product: ProductDetail | null;
  onClose: () => void;
  isAdmin?: boolean;
  onEdit?: (product: ProductDetail) => void;
  onDelete?: (product: ProductDetail) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  isAdmin: propIsAdmin,
  onEdit,
  onDelete,
}: ModalProps) {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const isAdminMode = propIsAdmin ?? pathname?.startsWith("/admin");

  // Helper tách chuỗi phân cách bởi dấu ';' thành mảng danh sách
  const parseList = (text: string) =>
    text
      ? text
          .split(";")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  const thuongHieuList = parseList(product.thuongHieuXuatXu);
  const rawQuyCachList = parseList(product.quyCachThung);
  const phuHopMonList = parseList(product.phuHopMon);

  // 🎯 ĐỒNG BỘ HIỂN THỊ: GẮN THƯƠNG HIỆU VÀO TRƯỚC SỐ KÝ / THÙNG NẾU CHƯA CÓ
  const quyCachThungList = useMemoFormattedQuyCach(
    thuongHieuList,
    rawQuyCachList,
  );

  function useMemoFormattedQuyCach(brands: string[], specs: string[]) {
    return specs.map((spec, idx) => {
      // Nếu spec đã có chứa tên thương hiệu rồi thì giữ nguyên
      const matchingBrand = brands.find((b) => {
        const brandNameOnly = b.split(":")[0].trim();
        return spec.toLowerCase().includes(brandNameOnly.toLowerCase());
      });

      if (matchingBrand) {
        return spec;
      }

      // Nếu chưa có, lấy thương hiệu tương ứng theo index gộp vào trước số ký/thùng
      const brandFull = brands[idx] || brands[0];
      if (brandFull) {
        const brandNameOnly = brandFull.split(":")[0].trim();
        return `${brandNameOnly}: ${spec}`;
      }

      return spec;
    });
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-7xl rounded-2xl shadow-2xl overflow-hidden border border-amber-100 flex flex-col max-h-[90vh]"
      >
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-5 flex items-center justify-between border-b border-amber-500/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#ECA921] bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                MÃ STT: #{product.stt}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-200 bg-white/10 px-2.5 py-0.5 rounded-full">
                {product.nhom}
              </span>
            </div>
            <h3 className="text-xl font-black text-amber-100 mt-1.5">
              {product.tenTiengViet}
            </h3>
            <p className="text-xs text-gray-300 italic font-medium">
              {product.tenTiengAnh}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer p-2 rounded-full bg-white/10 hover:bg-amber-500/20 text-gray-300 hover:text-white transition-colors"
          >
            <IconX className="w-6 h-6" />
          </button>
        </div>

        {/* Nội dung Modal */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-gray-700">
          {/* Khung Ảnh + Thông Số Chính dạng Grid Card sạch sẽ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Ảnh sản phẩm */}
            <div className="lg:col-span-5 rounded-2xl overflow-hidden border-2 border-amber-200/80 shadow-md bg-gray-100 h-60 lg:h-72">
              <img
                src={product.imageUrl}
                alt={product.tenTiengViet}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Khung Thông Số B2B */}
            <div className="lg:col-span-7 bg-amber-50/40 p-5 rounded-2xl border border-amber-100/80 space-y-4">
              {/* 1. Thương hiệu & Xuất xứ */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                  <IconWorld className="w-4 h-4 text-[#ECA921]" />
                  <span>Thương hiệu & Xuất xứ:</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pl-5">
                  {thuongHieuList.length > 0 ? (
                    thuongHieuList.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-white border border-amber-200 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-2xs"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-800 font-semibold">
                      {product.thuongHieuXuatXu}
                    </span>
                  )}
                </div>
              </div>

              {/* 2. Quy cách thùng / Nguồn (Đã ưu tiên hiển thị thương hiệu lên trước số ký) */}
              <div className="space-y-1.5 pt-2 border-t border-amber-200/40">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                  <IconBox className="w-4 h-4 text-[#ECA921]" />
                  <span>Quy cách thùng / Theo nguồn:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-5">
                  {quyCachThungList.length > 0 ? (
                    quyCachThungList.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white/80 border border-amber-200/70 text-xs font-medium text-gray-800 px-2.5 py-1 rounded-md"
                      >
                        • {item}
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-gray-800 font-semibold">
                      {product.quyCachThung}
                    </span>
                  )}
                </div>
              </div>

              {/* 3. Mức độ phổ biến & Kênh quán */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-amber-200/40">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-1">
                    <IconStars className="w-4 h-4 text-[#ECA921]" />
                    <span>Mức độ phổ biến:</span>
                  </div>
                  <span className="inline-block bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-300/60 ml-5">
                    {product.mucDoPhoBien}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-1">
                    <IconBuildingStore className="w-4 h-4 text-[#ECA921]" />
                    <span>Phù hợp kênh quán:</span>
                  </div>
                  <div className="text-xs text-gray-800 font-semibold leading-relaxed ml-5">
                    {product.phuHopKenhQuan}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bảng Chi Tiết Hạng Mục */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs divide-y divide-gray-200">
              <thead className="bg-amber-100/40 font-bold text-[#4A2E16]">
                <tr>
                  <th className="p-3.5 w-1/4">Hạng mục</th>
                  <th className="p-3.5">Thông tin chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                <tr>
                  <td className="p-3.5 font-bold text-gray-700 bg-amber-50/20">
                    Phù hợp món ăn
                  </td>
                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      {phuHopMonList.map((mon, idx) => (
                        <span
                          key={idx}
                          className="text-gray-800 font-medium rounded-md text-xs"
                        >
                          {mon}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-gray-700 bg-amber-50/20">
                    Quy cách & Cắt hàng
                  </td>
                  <td className="p-3.5 text-gray-900 font-medium leading-relaxed">
                    {product.quyCachCatHang}
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-gray-700 bg-amber-50/20">
                    Đặc điểm sản phẩm
                  </td>
                  <td className="p-3.5 text-gray-900 font-medium leading-relaxed">
                    {product.dacDiemSanPham}
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-gray-700 bg-amber-50/20">
                    Phân tích thương hiệu
                  </td>
                  <td className="p-3.5 text-gray-800 leading-relaxed font-medium">
                    {product.phanTichThuongHieu}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="relative bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          {/* 🎯 TOAST THÔNG BÁO KHI ĐÃ COPY */}
          {copied && (
            <div className="absolute -top-14 right-6 z-50 bg-gray-900/95 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl border border-amber-400/40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center">
                <IconCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span>
                Đã sao chép thông tin sản phẩm! Hãy nhấn{" "}
                <strong className="text-[#ECA921] underline">
                  Ctrl + V (Dán)
                </strong>{" "}
                vào khung chat Zalo.
              </span>
            </div>
          )}

          <span className="text-xs text-gray-500 font-medium">
            Cung cấp bởi{" "}
            <strong className="text-gray-900 font-bold">Khánh An Foods</strong>
          </span>

          {isAdminMode ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit?.(product);
                }}
                className="cursor-pointer px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md flex items-center gap-2"
              >
                <IconEdit className="w-4 h-4" /> Chỉnh sửa sản phẩm
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete?.(product);
                }}
                className="cursor-pointer px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md flex items-center gap-2"
              >
                <IconTrash className="w-4 h-4" /> Xóa sản phẩm
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={async () => {
                const zaloNumber = "0399829074";
                const message = `Xin chào Khánh An Foods, tôi muốn nhận báo giá cho sản phẩm:\n- Mã STT: #${product.stt}\n- Tên sản phẩm: ${product.tenTiengViet} (${product.tenTiengAnh})\n- Thương hiệu: ${product.thuongHieuXuatXu}\n- Quy cách: ${product.quyCachThung}\n\nNhờ shop tư vấn giúp tôi nhé!`;

                // 1. Copy sẵn nội dung vào Clipboard và bật thông báo
                try {
                  await navigator.clipboard.writeText(message);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 5000);
                } catch (err) {
                  console.error("Không thể copy tự động:", err);
                }

                // 2. Chờ 600ms để khách kịp nhìn thấy thông báo đã copy rồi mới bật App Zalo
                setTimeout(() => {
                  window.location.href = `zalo://conversation?phone=${zaloNumber}`;

                  // 3. Dự phòng mở Web nếu máy không có App Zalo
                  setTimeout(() => {
                    if (document.hasFocus()) {
                      window.open(`https://zalo.me/${zaloNumber}`, "_blank");
                    }
                  }, 1500);
                }, 600);
              }}
              className={`cursor-pointer px-6 py-2.5 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
                copied
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-[#ECA921] hover:bg-[#D89512]"
              }`}
            >
              <IconCheck className="w-4 h-4" />
              {copied ? "Đã sao chép! Đang mở Zalo..." : "Yêu cầu báo giá"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
