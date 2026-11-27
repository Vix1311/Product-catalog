"use client";

import React, { useState, useEffect, useRef } from "react";
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
  IconInfoCircle,
  IconFlame,
  IconShieldLock,
  IconAlertTriangle,
  IconLoader2,
} from "@tabler/icons-react";

export interface ProductDetail {
  id: string;
  stt: number;
  tenTiengViet: string;
  tenTiengAnh: string;
  nhom: string;

  // --- CÁC TRƯỜNG CHO B2B ---
  phuHopMon?: string;
  quyCachCatHang?: string;
  phanTichThuongHieu?: string;
  mucDoPhoBien?: string;
  dacDiemSanPham?: string;
  phuHopKenhQuan?: string;
  thuongHieuXuatXu?: string;
  quyCachThung?: string;

  // --- CÁC TRƯỜNG CHO RTC ---
  moTa?: string;
  thanhPhan?: string;
  cachDung?: string;
  baoQuan?: string;
  luuY?: string;
  tieuChi?: string;

  // --- DỰ PHÒNG TRƯỜNG PRISMA GỐC ---
  description?: string | null;
  ingredients?: string | null;
  usageInstructions?: string | null;
  storageInstructions?: string | null;
  warnings?: string | null;
  highlights?: string | null;

  // --- DỰ PHÒNG RAW PRODUCT TỪ TRANG ADMIN ---
  rawProduct?: {
    marketPopularity?: string | null;
    description?: string | null;
    ingredients?: string | null;
    usageInstructions?: string | null;
    storageInstructions?: string | null;
    warnings?: string | null;
    highlights?: string | null;
  };

  imageUrl: string;
}

interface ModalProps {
  product: ProductDetail | null;
  onClose: () => void;
  isLoadingDetail?: boolean;
  isAdmin?: boolean;
  onEdit?: (product: ProductDetail) => void;
  onDelete?: (product: ProductDetail) => void;
}

// Component ảnh có trạng thái "Đang tải ..." (export để dùng chung bên trang Catalog)
export function ProductImage({
  src,
  alt,
  className = "",
  loading = "lazy",
  blurBackdrop = true,
}: {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  blurBackdrop?: boolean;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setLoadedSrc(src);
    }
  }, [src]);

  const isLoaded = loadedSrc === src;

  return (
    <div className="relative w-full h-full overflow-hidden bg-white">
      {!isLoaded && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-1.5 bg-gray-100 text-gray-500">
          <IconLoader2 className="w-5 h-5 text-[#ECA921] animate-spin" />
          <span className="text-xs font-semibold">Đang tải ...</span>
        </div>
      )}

      {/* Lớp nền mờ tự lấy theo màu ảnh gốc để lấp khoảng trống hai bên */}
      {blurBackdrop && (
        <img
          src={src}
          alt=""
          aria-hidden="true"
          loading={loading}
          className={`absolute inset-0 w-full h-full object-cover blur-xl scale-110 pointer-events-none transition-opacity duration-300 ${
            isLoaded ? "opacity-45" : "opacity-0"
          }`}
        />
      )}

      {/* Ảnh chính luôn hiển thị đầy đủ 100%, không bị cắt */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setLoadedSrc(src)}
        onError={() => setLoadedSrc(src)}
        className={`relative z-10 w-full h-full object-contain transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
      />
    </div>
  );
}

const cleanValue = (val?: string | null): string => {
  if (!val) return "";
  const trimmed = String(val).trim();
  if (
    !trimmed ||
    trimmed.toLowerCase() === "chưa cập nhật" ||
    trimmed.toLowerCase() === "null" ||
    trimmed.toLowerCase() === "undefined"
  ) {
    return "";
  }
  return trimmed;
};

export default function ProductDetailModal({
  product,
  onClose,
  isLoadingDetail = false,
  isAdmin: propIsAdmin,
  onEdit,
  onDelete,
}: ModalProps) {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const isAdminMode = propIsAdmin ?? pathname?.startsWith("/admin");

  // Tự fallback sang product.rawProduct để isAdminMode hiển thị đầy đủ y hệt trang Catalog mặc định
  const moTa = cleanValue(
    product.moTa || product.description || product.rawProduct?.description,
  );
  const thanhPhan = cleanValue(
    product.thanhPhan || product.ingredients || product.rawProduct?.ingredients,
  );
  const cachDung = cleanValue(
    product.cachDung ||
      product.usageInstructions ||
      product.rawProduct?.usageInstructions,
  );
  const baoQuan = cleanValue(
    product.baoQuan ||
      product.storageInstructions ||
      product.rawProduct?.storageInstructions,
  );
  const luuY = cleanValue(
    product.luuY || product.warnings || product.rawProduct?.warnings,
  );
  const tieuChi = cleanValue(
    product.tieuChi || product.highlights || product.rawProduct?.highlights,
  );

  const phuHopMon = cleanValue(product.phuHopMon);
  const quyCachCatHang = cleanValue(product.quyCachCatHang);
  const dacDiemSanPham = cleanValue(product.dacDiemSanPham);
  const phanTichThuongHieu = cleanValue(product.phanTichThuongHieu);
  const mucDoPhoBien = product.rawProduct
    ? cleanValue(product.rawProduct.marketPopularity)
    : cleanValue(product.mucDoPhoBien);
  const phuHopKenhQuan = cleanValue(product.phuHopKenhQuan);
  const thuongHieuXuatXu = cleanValue(product.thuongHieuXuatXu);
  const quyCachThung = cleanValue(product.quyCachThung);

  const parseList = (text?: string) =>
    text
      ? text
          .split(";")
          .map((item) => cleanValue(item))
          .filter(Boolean)
      : [];

  const parseLines = (text?: string) =>
    text
      ? text
          .split(/(?:\r?\n|;|- )/)
          .map((item) => cleanValue(item))
          .filter(Boolean)
      : [];

  const thuongHieuList = parseList(thuongHieuXuatXu);
  const rawQuyCachList = parseList(quyCachThung);
  const phuHopMonList = parseList(phuHopMon);

  const quyCachThungList = rawQuyCachList.map((spec, idx) => {
    const matchingBrand = thuongHieuList.find((b) => {
      const brandNameOnly = b.split(":")[0].trim();
      return spec.toLowerCase().includes(brandNameOnly.toLowerCase());
    });
    if (matchingBrand) return spec;
    const brandFull = thuongHieuList[idx] || thuongHieuList[0];
    if (brandFull) {
      return `${brandFull.split(":")[0].trim()}: ${spec}`;
    }
    return spec;
  });

  const hasB2BTableRows = Boolean(
    phuHopMonList.length > 0 ||
    quyCachCatHang ||
    dacDiemSanPham ||
    phanTichThuongHieu,
  );

  const infoCardsCount = [thanhPhan, cachDung, baoQuan].filter(Boolean).length;
  const gridColsClass =
    infoCardsCount === 3
      ? "grid-cols-1 md:grid-cols-3"
      : infoCardsCount === 2
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1";

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      {/* Giữ cứng chiều cao h-[88vh] để Modal không bị giật nhảy khi dữ liệu chi tiết tải xong */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-6xl h-[88vh] max-h-[850px] rounded-2xl shadow-2xl overflow-hidden border border-amber-100 flex flex-col"
      >
        {/* HEADER */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-5 flex items-center justify-between border-b border-amber-500/30 shrink-0">
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
            {cleanValue(product.tenTiengAnh) && (
              <p className="text-xs text-gray-300 italic font-medium">
                {product.tenTiengAnh}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-2 rounded-full bg-white/10 hover:bg-amber-500/20 text-gray-300 hover:text-white transition-colors"
          >
            <IconX className="w-6 h-6" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 p-6 overflow-y-auto text-sm text-gray-700 flex flex-col">
          {isLoadingDetail ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2.5 text-gray-500">
              <IconLoader2 className="w-8 h-8 text-[#ECA921] animate-spin" />
              <p className="text-sm font-semibold">Đang tải ...</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* HÀNG 1: ẢNH BÊN TRÁI + THÔNG TIN NHANH BÊN PHẢI */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                <div className="lg:col-span-5 rounded-2xl overflow-hidden border-2 border-amber-200/80 shadow-sm bg-white h-56 lg:h-64">
                  <ProductImage
                    src={product.imageUrl}
                    alt={product.tenTiengViet}
                    loading="eager"
                  />
                </div>

                <div className="lg:col-span-7 bg-amber-50/40 p-5 rounded-2xl border border-amber-100/80 flex flex-col justify-center space-y-4">
                  {thuongHieuList.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                        <IconWorld className="w-4 h-4 text-[#ECA921]" />
                        <span>Thương hiệu & Xuất xứ:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pl-5">
                        {thuongHieuList.map((item, idx) => (
                          <span
                            key={idx}
                            className="bg-white border border-amber-200 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-lg"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {quyCachThungList.length > 0 && (
                    <div className="space-y-1.5 pt-3 border-t border-amber-200/40">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                        <IconBox className="w-4 h-4 text-[#ECA921]" />
                        <span>Quy cách thùng / Theo nguồn:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-5">
                        {quyCachThungList.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white/80 border border-amber-200/70 text-xs font-medium text-gray-800 px-2.5 py-1 rounded-md"
                          >
                            - {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(mucDoPhoBien || phuHopKenhQuan) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-amber-200/40">
                      {mucDoPhoBien && (
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-1">
                            <IconStars className="w-4 h-4 text-[#ECA921]" />
                            <span>Mức độ phổ biến:</span>
                          </div>
                          <span className="inline-block bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-300/60 ml-5">
                            {mucDoPhoBien}
                          </span>
                        </div>
                      )}
                      {phuHopKenhQuan && (
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-1">
                            <IconBuildingStore className="w-4 h-4 text-[#ECA921]" />
                            <span>Phù hợp kênh quán:</span>
                          </div>
                          <div className="text-xs text-gray-800 font-semibold leading-relaxed ml-5">
                            {phuHopKenhQuan}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* HÀNG 2: MÔ TẢ SẢN PHẨM & TIÊU CHÍ NỔI BẬT */}
              {(moTa || tieuChi) && (
                <div className="bg-amber-50/30 p-5 rounded-2xl border border-amber-100/80 space-y-4">
                  {moTa && (
                    <div className="space-y-2">
                      <h4 className="text-base font-black text-[#4A2E16] flex items-center gap-2">
                        <IconInfoCircle className="w-5 h-5 text-[#ECA921]" />
                        Mô tả sản phẩm
                      </h4>
                      <p className="text-gray-800 leading-relaxed font-medium whitespace-pre-line">
                        {moTa}
                      </p>
                    </div>
                  )}

                  {tieuChi && (
                    <div
                      className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${
                        moTa ? "pt-4 border-t border-amber-200/50" : ""
                      }`}
                    >
                      {parseLines(tieuChi).map((tc, idx) => (
                        <div
                          key={idx}
                          className="flex gap-2.5 items-start text-xs sm:text-sm text-gray-800 font-semibold bg-white/80 p-3 rounded-xl border border-amber-100"
                        >
                          <div className="mt-0.5 bg-emerald-100 p-0.5 rounded-full shrink-0">
                            <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                          <span className="leading-relaxed">{tc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* HÀNG 3: THÀNH PHẦN - CÁCH DÙNG - BẢO QUẢN */}
              {infoCardsCount > 0 && (
                <div className={`grid ${gridColsClass} gap-4 items-stretch`}>
                  {thanhPhan && (
                    <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-2xs space-y-2 flex flex-col">
                      <h4 className="font-bold text-[#4A2E16] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#ECA921]"></span>{" "}
                        Thành phần chính
                      </h4>
                      <p className="text-gray-700 leading-relaxed font-medium text-xs sm:text-sm">
                        {thanhPhan}
                      </p>
                    </div>
                  )}

                  {cachDung && (
                    <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-2xs space-y-2 flex flex-col">
                      <h4 className="font-bold text-[#4A2E16] flex items-center gap-2">
                        <IconFlame className="w-4 h-4 text-[#ECA921]" /> Cách
                        dùng
                      </h4>
                      <ul className="list-disc list-inside text-gray-700 space-y-1 marker:text-amber-500 text-xs sm:text-sm">
                        {parseLines(cachDung).map((line, i) => (
                          <li key={i} className="leading-relaxed">
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {baoQuan && (
                    <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-2xs space-y-2 flex flex-col">
                      <h4 className="font-bold text-[#4A2E16] flex items-center gap-2">
                        <IconShieldLock className="w-4 h-4 text-blue-500" /> Bảo
                        quản
                      </h4>
                      <ul className="list-disc list-inside text-gray-700 space-y-1 marker:text-blue-500 text-xs sm:text-sm">
                        {parseLines(baoQuan).map((line, i) => (
                          <li key={i} className="leading-relaxed">
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* HÀNG 4: LƯU Ý */}
              {luuY && (
                <div className="bg-red-50/50 border border-red-200 p-4 rounded-2xl flex gap-3 items-start">
                  <IconAlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div className="text-red-900 font-medium text-sm leading-relaxed">
                    <span className="font-bold">Lưu ý:</span> {luuY}
                  </div>
                </div>
              )}

              {/* HÀNG 5: BẢNG THÔNG TIN CHI TIẾT */}
              {hasB2BTableRows && (
                <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs divide-y divide-gray-200">
                    <thead className="bg-amber-100/40 font-bold text-[#4A2E16]">
                      <tr>
                        <th className="p-3.5 w-1/4">Hạng mục</th>
                        <th className="p-3.5">Thông tin chi tiết</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {phuHopMonList.length > 0 && (
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
                                  {idx < phuHopMonList.length - 1 ? "," : ""}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}

                      {quyCachCatHang && (
                        <tr>
                          <td className="p-3.5 font-bold text-gray-700 bg-amber-50/20">
                            Quy cách & Cắt hàng
                          </td>
                          <td className="p-3.5 text-gray-900 font-medium leading-relaxed">
                            {quyCachCatHang}
                          </td>
                        </tr>
                      )}

                      {dacDiemSanPham && (
                        <tr>
                          <td className="p-3.5 font-bold text-gray-700 bg-amber-50/20">
                            Đặc điểm sản phẩm
                          </td>
                          <td className="p-3.5 text-gray-900 font-medium leading-relaxed whitespace-pre-line">
                            {dacDiemSanPham}
                          </td>
                        </tr>
                      )}

                      {phanTichThuongHieu && (
                        <tr>
                          <td className="p-3.5 font-bold text-gray-700 bg-amber-50/20">
                            Phân tích thương hiệu
                          </td>
                          <td className="p-3.5 text-gray-800 leading-relaxed font-medium">
                            {phanTichThuongHieu}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="relative bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between shrink-0">
          {copied && (
            <div className="absolute -top-14 right-6 z-50 bg-gray-900/95 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl border border-amber-400/40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center">
                <IconCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span>
                Đã sao chép! Hãy nhấn{" "}
                <strong className="text-[#ECA921] underline">Ctrl + V</strong>{" "}
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
                onClick={() => {
                  onClose();
                  onEdit?.(product);
                }}
                className="cursor-pointer px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md flex items-center gap-2"
              >
                <IconEdit className="w-4 h-4" /> Chỉnh sửa sản phẩm
              </button>
              <button
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
              onClick={async () => {
                const zaloNumber = "0399829074";
                const message = `Xin chào Khánh An Foods, tôi muốn nhận báo giá cho sản phẩm:\n- Mã STT: #${product.stt}\n- Tên: ${product.tenTiengViet}\nNhờ shop tư vấn giúp tôi nhé!`;
                try {
                  await navigator.clipboard.writeText(message);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 5000);
                } catch (err) {}
                setTimeout(() => {
                  window.location.href = `zalo://conversation?phone=${zaloNumber}`;
                  setTimeout(() => {
                    if (document.hasFocus())
                      window.open(`https://zalo.me/${zaloNumber}`, "_blank");
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
              {copied ? "Đã sao chép!" : "Yêu cầu báo giá"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
