"use client";

import React, { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import ProductDetailModal, {
  ProductDetail,
} from "@/components/ProductCatalogDetailModal";
import {
  IconSearch,
  IconEye,
  IconFilter,
  IconLoader2,
} from "@tabler/icons-react";
import StickyHeader from "@/components/StickyHeader";
import { logoutApi } from "../services/auth.service"; // Điều chỉnh đường dẫn tương đối đúng với project của bạn nếu cần
import Footer from "@/components/Footer";

// Interface map theo đúng response API từ Postman
interface ApiBrand {
  id: string;
  name: string;
  origin: string;
}

interface ApiVariant {
  id: string;
  sku: string | null;
  unit: string | null;
  packaging: string;
  brandNote: string;
  productId: string;
  brandId: string;
  brand: ApiBrand;
}

interface ApiProduct {
  id: string;
  name: string;
  englishName: string;
  category: string;
  subCategory: string;
  suitableDishes: string;
  characteristics: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  productSpec: string;
  marketPopularity: string;
  suitableChannels: string;
  variants: ApiVariant[];
}

interface CatalogProduct extends ProductDetail {
  categorySlug: string;
  subCategorySlug?: string;
}

const categoryTitleMap: Record<string, string> = {
  "thit-nhap-khau": "THỊT NHẬP KHẨU",
  surimi: "SURIMI & CHẢ CÁ",
  sauce: "SAUCE / NƯỚC SỐT",
  mayonnaise: "MAYONNAISE",
  bia: "BIA & ĐỒ UỐNG",
  "cha-bong": "CHÀ BÔNG HEO / GÀ",
  rte: "RTE (THỰC PHẨM ĂN LIỀN)",
  rtc: "RTC (THỰC PHẨM SƠ CHẾ SẴN)",
  "oem-odm": "DỊCH VỤ GIA CÔNG OEM / ODM",
};

const proteinFilters = [
  { id: "ALL", label: "Tất cả" },
  { id: "HEO", label: "Thịt Heo" },
  { id: "BÒ", label: "Thịt Bò" },
  { id: "GÀ", label: "Thịt Gà" },
  { id: "TRÂU", label: "Thịt Trâu" },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://product-catalog-be-henna.vercel.app";

const fetcher = (url: string) =>
  fetch(`${API_BASE_URL}${url}`).then((res) => res.json());

function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Quản lý trạng thái xác thực người dùng thực tế
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

  // 2. Đọc thông tin từ URL
  const groupSlug = searchParams.get("group") || "thit-nhap-khau";
  const subCategorySlug =
    searchParams.get("subCategory") || searchParams.get("sub") || "";
  const searchFromUrl = searchParams.get("search") || "";

  // Điều kiện hiển thị cụm Filter Loại Thịt
  const showProteinFilter = groupSlug === "thit-nhap-khau";

  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [selectedProtein, setSelectedProtein] = useState("ALL");

  useEffect(() => {
    setSearchTerm(searchFromUrl);
  }, [searchFromUrl]);

  // Đồng bộ tab protein khi subCategory thay đổi trên URL
  useEffect(() => {
    if (showProteinFilter && subCategorySlug) {
      const match = proteinFilters.find(
        (f) => f.id.toLowerCase() === subCategorySlug.toLowerCase(),
      );
      setSelectedProtein(match ? match.id : "ALL");
    } else {
      setSelectedProtein("ALL");
    }
  }, [subCategorySlug, showProteinFilter]);

  // 3. Tạo URL động để call API qua SWR
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (groupSlug) params.append("category", groupSlug);
    if (showProteinFilter && selectedProtein !== "ALL") {
      params.append("subCategory", selectedProtein);
    }
    if (searchTerm.trim()) params.append("search", searchTerm.trim());

    return `/api/products?${params.toString()}`;
  }, [groupSlug, selectedProtein, searchTerm, showProteinFilter]);

  const {
    data: rawProducts = [],
    error,
    isLoading,
  } = useSWR<ApiProduct[]>(apiUrl, fetcher);

  // 4. Map dữ liệu từ API sang dạng UI
  const products: CatalogProduct[] = useMemo(() => {
    if (!Array.isArray(rawProducts)) return [];

    return rawProducts.map((p, index) => {
      const brandOrigins = p.variants
        ?.map(
          (v?: any) =>
            `${v.brand?.name || ""}${v.brand?.origin ? ` (${v.brand.origin})` : ""}`,
        )
        .filter(Boolean)
        .join("; ");

      const packagings = p.variants
        ?.map((v?: any) => v.packaging)
        .filter(Boolean)
        .join("; ");

      const brandNotes = p.variants
        ?.map((v?: any) => v.brandNote)
        .filter(Boolean)
        .join("; ");

      return {
        id: p.id,
        stt: index + 1,
        tenTiengViet: p.name || "",
        tenTiengAnh: p.englishName || "",
        nhom: (p.subCategory || "KHÁC").toUpperCase(),
        categorySlug: p.category || groupSlug,
        subCategorySlug: p.subCategory?.toLowerCase() || "",
        phuHopMon: p.suitableDishes || "Chưa cập nhật",
        quyCachCatHang: p.productSpec || "Chưa cập nhật",
        phanTichThuongHieu: brandNotes || "Chưa cập nhật",
        mucDoPhoBien: p.marketPopularity || "Bình thường",
        dacDiemSanPham: p.characteristics || "",
        phuHopKenhQuan: p.suitableChannels || "",
        thuongHieuXuatXu: brandOrigins || "Chưa cập nhật",
        quyCachThung: packagings || "Chưa cập nhật",
        imageUrl:
          p.imageUrl ||
          "https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=500",
      };
    });
  }, [rawProducts, groupSlug]);

  const pageTitle = categoryTitleMap[groupSlug] || "DANH MỤC SẢN PHẨM KHÁNH AN";

  const handleSelectProtein = (proteinId: string) => {
    setSelectedProtein(proteinId);
    const params = new URLSearchParams(searchParams.toString());

    if (proteinId === "ALL") {
      params.delete("subCategory");
      params.delete("sub");
    } else {
      params.set("subCategory", proteinId.toLowerCase());
    }

    router.push(`/catalog?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setSelectedProtein("ALL");
    setSearchTerm("");
    router.push(`/catalog?group=${groupSlug}`);
  };

  return (
    <div>
      <StickyHeader isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-gray-900 via-[#4A2E16] to-gray-900 rounded-3xl p-8 md:p-10 text-white shadow-xl mb-10 border border-amber-500/20 relative overflow-hidden">
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-[#ECA921] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Khánh An Foods Catalog
              </span>
              <h1 className="text-2xl md:text-4xl font-black text-amber-100 tracking-wider mt-3 uppercase">
                {pageTitle}
              </h1>
              <p className="text-xs md:text-sm text-gray-300 mt-2">
                Danh mục thực phẩm nhập khẩu & phân phối đạt tiêu chuẩn chất
                lượng quốc tế cho chuỗi nhà hàng, siêu thị.
              </p>
            </div>
          </div>

          {/* BỘ LỌC & TÌM KIẾM */}
          <div
            className={`flex flex-col md:flex-row items-center gap-4 mb-8 bg-white p-4 rounded-2xl border border-amber-100/80 shadow-xs ${showProteinFilter ? "justify-between" : "justify-end"}`}
          >
            {showProteinFilter && (
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 mr-2 flex-shrink-0">
                  <IconFilter className="w-4 h-4 text-[#ECA921]" />
                  <span>Loại thịt:</span>
                </div>
                {proteinFilters.map((tab) => {
                  const isActive = selectedProtein === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleSelectProtein(tab.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
                        isActive
                          ? "bg-[#ECA921] text-white shadow-md shadow-amber-500/20"
                          : "bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-[#ECA921]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Ô TÌM KIẾM + TỔNG SỐ SẢN PHẨM */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  placeholder="Tìm theo tên sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-amber-200 focus:border-[#ECA921] focus:ring-2 focus:ring-amber-100 bg-white text-xs font-medium shadow-2xs"
                />
                <IconSearch className="w-4 h-4 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="text-xs text-gray-500 font-semibold whitespace-nowrap hidden sm:block">
                Hiển thị{" "}
                <strong className="text-[#ECA921] font-bold text-sm">
                  {products.length}
                </strong>{" "}
                mặt hàng
              </div>
            </div>
          </div>

          {/* TRẠNG THÁI LOADING / LỖI / DANH SÁCH SẢN PHẨM */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-amber-100 shadow-2xs">
              <IconLoader2 className="w-8 h-8 text-[#ECA921] animate-spin mb-2" />
              <p className="text-gray-500 text-sm font-semibold">
                Đang tải danh sách sản phẩm...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-amber-100 shadow-2xs">
              <p className="text-red-500 text-sm font-semibold">
                Đã có lỗi xảy ra khi tải dữ liệu sản phẩm.
              </p>
              <button
                onClick={() => handleResetFilters()}
                className="mt-4 px-4 py-2 bg-amber-100 text-[#4A2E16] rounded-xl text-xs font-bold hover:bg-[#ECA921] hover:text-white transition-colors cursor-pointer"
              >
                Thử lại
              </button>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="group bg-white rounded-2xl border border-amber-100 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-52 overflow-hidden bg-gray-100">
                      <img
                        src={product.imageUrl}
                        alt={product.tenTiengViet}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-gray-900/80 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                        STT #{product.stt}
                      </div>
                      <div className="absolute top-3 right-3 bg-[#ECA921] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs">
                        {product.nhom}
                      </div>
                    </div>

                    <div className="p-5">
                      <span className="text-[11px] font-bold text-[#ECA921] uppercase tracking-wider block mb-1">
                        NHÓM {product.nhom}
                      </span>
                      <h3 className="text-base font-extrabold text-gray-900 group-hover:text-[#ECA921] transition-colors leading-snug">
                        {product.tenTiengViet}
                      </h3>
                      <p className="text-xs text-gray-500 italic mt-0.5 font-medium">
                        {product.tenTiengAnh}
                      </p>

                      <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
                        <p className="line-clamp-1">
                          <strong className="text-gray-700">
                            Món phù hợp:
                          </strong>{" "}
                          {product.phuHopMon}
                        </p>
                        <p className="line-clamp-1">
                          <strong className="text-gray-700">Xuất xứ:</strong>{" "}
                          {product.thuongHieuXuatXu}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2">
                    <button className="w-full py-2.5 rounded-xl bg-amber-50 hover:cursor-pointer group-hover:bg-[#ECA921] text-[#4A2E16] group-hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 border border-amber-200/60 group-hover:border-transparent">
                      <IconEye className="w-4 h-4" /> Xem Chi Tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-amber-100 shadow-2xs">
              <p className="text-gray-500 text-sm font-semibold">
                Không tìm thấy mặt hàng nào phù hợp với bộ lọc hiện tại.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-amber-100 text-[#4A2E16] rounded-xl text-xs font-bold hover:bg-[#ECA921] hover:text-white transition-colors cursor-pointer"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}

          {/* MODAL CHI TIẾT */}
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={<div className="p-10 text-center">Đang tải Catalog...</div>}
    >
      <CatalogContent />
    </Suspense>
  );
}
