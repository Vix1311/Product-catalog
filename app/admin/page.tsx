"use client";

import React, { useState, useMemo, Suspense, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import ProductDetailModal, {
  ProductDetail,
} from "@/components/ProductCatalogDetailModal";
import {
  IconSearch,
  IconFilter,
  IconLoader2,
  IconPlus,
  IconFileSpreadsheet,
  IconEdit,
  IconTrash,
  IconLayoutGrid,
  IconTable,
  IconAlertCircle,
  IconX,
  IconCheck,
  IconPhotoOff,
  IconUpload,
} from "@tabler/icons-react";
import StickyHeader from "@/components/StickyHeader";
import { logoutApi } from "../services/auth.service";
import Footer from "@/components/Footer";

// 1. INTERFACES TỪ API RESPONSE
interface ApiBrand {
  id: string;
  name: string;
  origin: string;
}

interface ApiVariant {
  id: string;
  sku: string | null;
  unit: string | null;
  price?: number | null;
  packaging: string;
  brandNote: string;
  productId: string;
  brandId: string;
  brand: ApiBrand;
  isNew?: boolean;
}

interface ApiProduct {
  id: string;
  name: string;
  englishName: string | null;
  category: string;
  subCategory: string | null;
  suitableDishes: string | null;
  characteristics: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  productSpec: string | null;
  marketPopularity: string | null;
  suitableChannels: string | null;
  variants: ApiVariant[];
}

interface CatalogProduct extends ProductDetail {
  categorySlug: string;
  subCategorySlug?: string;
  hasRealImage: boolean;
  rawProduct: ApiProduct;
}

interface VariantFormItem {
  id: string;
  productId: string;
  brandId: string;
  brandName: string;
  price?: number | string;
  packaging: string;
  brandNote: string;
  isNew?: boolean;
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

const categoryOptions = [
  { id: "thit-nhap-khau", label: "Thịt Nhập Khẩu" },
  { id: "surimi", label: "Surimi & Chả Cá" },
  { id: "sauce", label: "Sauce / Nước Sốt" },
  { id: "mayonnaise", label: "Mayonnaise" },
  { id: "bia", label: "Bia & Đồ Uống" },
  { id: "cha-bong", label: "Chà Bông Heo / Gà" },
  { id: "rte", label: "RTE (Thực phẩm ăn liền)" },
  { id: "rtc", label: "RTC (Thực phẩm sơ chế sẵn)" },
  { id: "oem-odm", label: "Dịch vụ OEM / ODM" },
];

const proteinFilters = [
  { id: "ALL", label: "Tất cả" },
  { id: "HEO", label: "Thịt Heo" },
  { id: "BÒ", label: "Thịt Bò" },
  { id: "GÀ", label: "Thịt Gà" },
  { id: "TRÂU", label: "Thịt Trâu" },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = (url: string) =>
  fetch(`${API_BASE_URL}${url}`).then((res) => res.json());

function AdminCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const excelInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // 1. Trạng thái Đăng nhập
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

  // 2. Đọc params từ URL
  const groupSlug = searchParams.get("group") || "";
  const subCategorySlug =
    searchParams.get("subCategory") || searchParams.get("sub") || "";
  const searchFromUrl = searchParams.get("search") || "";

  const showProteinFilter = !groupSlug || groupSlug === "thit-nhap-khau";

  // 3. State UI & Bộ lọc
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [onlyMissingImage, setOnlyMissingImage] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [selectedProtein, setSelectedProtein] = useState("ALL");

  // State Modal Thêm / Sửa & Upload
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ApiProduct | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingExcel, setIsUploadingExcel] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // State lưu file ảnh được chọn khi tạo sản phẩm mới (chưa có ID)
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);

  // State Form Thông tin Sản phẩm
  const [formData, setFormData] = useState({
    name: "",
    englishName: "",
    category: "thit-nhap-khau",
    subCategory: "HEO",
    suitableDishes: "",
    characteristics: "",
    productSpec: "",
    marketPopularity: "Phổ biến",
    suitableChannels: "",
    imageUrl: "",
  });

  const [variantForms, setVariantForms] = useState<VariantFormItem[]>([]);

  useEffect(() => {
    setSearchTerm(searchFromUrl);
  }, [searchFromUrl]);

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

  // 4. GỌI API GET PRODUCTS BẰNG SWR
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
    mutate,
  } = useSWR<ApiProduct[]>(apiUrl, fetcher);

  // 5. Map dữ liệu sang dạng UI
  const allMappedProducts: CatalogProduct[] = useMemo(() => {
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

      const hasRealImage = Boolean(p.imageUrl && p.imageUrl.trim() !== "");

      return {
        id: p.id,
        stt: index + 1,
        tenTiengViet: p.name || "",
        tenTiengAnh: p.englishName || "",
        nhom: (p.subCategory || "KHÁC").toUpperCase(),
        categorySlug: p.category || groupSlug || "thit-nhap-khau",
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
        hasRealImage,
        rawProduct: p,
      };
    });
  }, [rawProducts, groupSlug]);

  const products = useMemo(() => {
    if (!onlyMissingImage) return allMappedProducts;
    return allMappedProducts.filter((p) => !p.hasRealImage);
  }, [allMappedProducts, onlyMissingImage]);

  const missingImageCount = useMemo(
    () => allMappedProducts.filter((p) => !p.hasRealImage).length,
    [allMappedProducts],
  );

  const pageTitle =
    (groupSlug && categoryTitleMap[groupSlug]) || "QUẢN LÝ DANH MỤC SẢN PHẨM";

  const handleSelectProtein = (proteinId: string) => {
    setSelectedProtein(proteinId);
    const params = new URLSearchParams(searchParams.toString());

    if (proteinId === "ALL") {
      params.delete("subCategory");
      params.delete("sub");
    } else {
      params.set("subCategory", proteinId.toLowerCase());
    }

    router.push(`?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setSelectedProtein("ALL");
    setSearchTerm("");
    setOnlyMissingImage(false);
    router.push(groupSlug ? `?group=${groupSlug}` : `/admin`);
  };

  // ============================================================================
  // CÁC HÀM CALL API (IMPORT EXCEL, UPLOAD ẢNH QUA PATCH, SỬA, XÓA)
  // ============================================================================

  // 1. POST /api/products/import-excel
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataExcel = new FormData();
    formDataExcel.append("file", file);

    try {
      setIsUploadingExcel(true);
      const token = localStorage.getItem("accessToken");

      const authHeaders: HeadersInit = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const response = await fetch(
        `${API_BASE_URL}/api/products/import-excel`,
        {
          method: "POST",
          headers: authHeaders,
          body: formDataExcel,
        },
      );

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || "Lỗi khi import file Excel");
      }

      await mutate();
      alert(
        `Import Excel thành công!\nTổng số: ${result.successCount ?? "Tất cả"}/${result.total ?? ""} dòng.`,
      );
    } catch (err: any) {
      alert(`Lỗi Import Excel: ${err.message}`);
    } finally {
      setIsUploadingExcel(false);
      if (excelInputRef.current) excelInputRef.current.value = "";
    }
  };

  // 2. 🎯 CẬP NHẬT CHUẨN POSTMAN: PATCH /api/products/:id/image với key 'file'
  const handleImageFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // A. Nếu đang sửa sản phẩm đã có id -> gọi thẳng PATCH /api/products/:id/image
    if (editingProduct?.id) {
      const formDataImg = new FormData();
      formDataImg.append("file", file); // Key 'file' đúng chuẩn Postman

      try {
        setIsUploadingImage(true);
        const token = localStorage.getItem("accessToken");
        const authHeaders: HeadersInit = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        const response = await fetch(
          `${API_BASE_URL}/api/products/${editingProduct.id}/image`,
          {
            method: "PATCH",
            headers: authHeaders,
            body: formDataImg,
          },
        );

        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(result.message || "Không thể cập nhật ảnh qua PATCH");
        }

        const newImageUrl =
          result.imageUrl ||
          result.url ||
          result.secure_url ||
          result.data?.imageUrl;

        if (newImageUrl) {
          setFormData((prev) => ({ ...prev, imageUrl: newImageUrl }));
        }

        await mutate();
        alert("Đã cập nhật ảnh sản phẩm lên Cloudinary thành công!");
      } catch (err: any) {
        alert(`Lỗi upload ảnh: ${err.message}`);
      } finally {
        setIsUploadingImage(false);
        if (imageInputRef.current) imageInputRef.current.value = "";
      }
    } else {
      // B. Nếu đang tạo mới (chưa có id) -> lưu tạm file, tạo preview và chờ bấm Lưu sẽ gọi PATCH
      setPendingImageFile(file);
      setFormData((prev) => ({
        ...prev,
        imageUrl: URL.createObjectURL(file),
      }));
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  // Mở Modal Thêm mới
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setPendingImageFile(null);
    setFormData({
      name: "",
      englishName: "",
      category: groupSlug || "thit-nhap-khau",
      subCategory: selectedProtein !== "ALL" ? selectedProtein : "HEO",
      suitableDishes: "",
      characteristics: "",
      productSpec: "",
      marketPopularity: "Phổ biến",
      suitableChannels: "",
      imageUrl: "",
    });
    setVariantForms([]);
    setIsFormModalOpen(true);
  };

  // Mở Modal Sửa Sản phẩm & Biến thể
  const handleOpenEditModal = (rawProd: ApiProduct, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingProduct(rawProd);
    setPendingImageFile(null);
    setFormData({
      name: rawProd.name || "",
      englishName: rawProd.englishName || "",
      category: rawProd.category || groupSlug || "thit-nhap-khau",
      subCategory: rawProd.subCategory || "",
      suitableDishes: rawProd.suitableDishes || "",
      characteristics: rawProd.characteristics || "",
      productSpec: rawProd.productSpec || "",
      marketPopularity: rawProd.marketPopularity || "",
      suitableChannels: rawProd.suitableChannels || "",
      imageUrl: rawProd.imageUrl || "",
    });

    setVariantForms(
      (rawProd.variants || []).map((v) => ({
        id: v.id,
        productId: v.productId || rawProd.id,
        brandId: v.brandId || v.brand?.id || "",
        brandName: v.brand?.name || "Thương hiệu",
        price: v.price ?? 0,
        packaging: v.packaging || "",
        brandNote: v.brandNote || "",
        isNew: false,
      })),
    );
    setIsFormModalOpen(true);
  };

  // 3 & 4. Xử lý lưu thông tin sản phẩm và biến thể
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên sản phẩm!");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("accessToken");
      const authHeaders: HeadersInit = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      if (editingProduct) {
        // Cập nhật thông tin text của sản phẩm
        const productRes = await fetch(
          `${API_BASE_URL}/api/products/${editingProduct.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              ...authHeaders,
            },
            body: JSON.stringify({
              name: formData.name,
              englishName: formData.englishName || null,
              category: formData.category,
              subCategory: formData.subCategory || null,
              suitableDishes: formData.suitableDishes || null,
              characteristics: formData.characteristics || null,
              productSpec: formData.productSpec || null,
              marketPopularity: formData.marketPopularity || null,
              suitableChannels: formData.suitableChannels || null,
              imageUrl: formData.imageUrl.trim() || null,
            }),
          },
        );

        if (!productRes.ok) {
          throw new Error("Cập nhật thông tin sản phẩm thất bại");
        }

        // Cập nhật từng variant
        for (const v of variantForms) {
          if (v.isNew) {
            await fetch(`${API_BASE_URL}/api/product-variants`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...authHeaders,
              },
              body: JSON.stringify({
                productId: editingProduct.id,
                brandId: v.brandId || "default-brand-id",
                packaging: v.packaging,
                brandNote: v.brandNote,
              }),
            });
          } else if (v.id) {
            await fetch(`${API_BASE_URL}/api/product-variants/${v.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                ...authHeaders,
              },
              body: JSON.stringify({
                productId: v.productId,
                brandId: v.brandId,
                packaging: v.packaging,
                brandNote: v.brandNote,
              }),
            });
          }
        }

        alert("Đã cập nhật sản phẩm và biến thể thành công!");
      } else {
        // Tạo sản phẩm mới
        const createRes = await fetch(`${API_BASE_URL}/api/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },
          body: JSON.stringify({
            ...formData,
            imageUrl: pendingImageFile
              ? null
              : formData.imageUrl.trim() || null,
          }),
        });

        if (!createRes.ok) {
          throw new Error("Tạo sản phẩm mới thất bại");
        }

        const newProd = await createRes.json();

        // Nếu có chọn ảnh khi tạo mới, gọi tiếp PATCH /api/products/:id/image
        if (pendingImageFile && newProd?.id) {
          const patchFormData = new FormData();
          patchFormData.append("file", pendingImageFile);

          await fetch(`${API_BASE_URL}/api/products/${newProd.id}/image`, {
            method: "PATCH",
            headers: authHeaders,
            body: patchFormData,
          });
        }

        alert("Đã tạo sản phẩm mới thành công!");
      }

      await mutate();
      setIsFormModalOpen(false);
      setPendingImageFile(null);
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xóa sản phẩm
  const handleDeleteProduct = async (
    rawProd: ApiProduct,
    e?: React.MouseEvent,
  ) => {
    if (e) e.stopPropagation();
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa sản phẩm "${rawProd.name}" không?`,
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const authHeaders: HeadersInit = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const res = await fetch(`${API_BASE_URL}/api/products/${rawProd.id}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      if (!res.ok) throw new Error("Xóa sản phẩm thất bại");

      await mutate();
      alert("Đã xóa sản phẩm!");
    } catch (err: any) {
      alert(`Lỗi khi xóa: ${err.message}`);
    }
  };

  return (
    <div>
      <StickyHeader isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-gray-900 via-[#4A2E16] to-gray-900 rounded-3xl p-8 md:p-10 text-white shadow-xl mb-8 border border-amber-500/20 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-widest text-[#ECA921] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Khánh An Admin Catalog
                </span>
                <h1 className="text-2xl md:text-4xl font-black text-amber-100 tracking-wider mt-3 uppercase">
                  {pageTitle}
                </h1>
                <p className="text-xs md:text-sm text-gray-300 mt-2">
                  Quản trị viên có thể nhấp trực tiếp vào từng thẻ sản phẩm để
                  xem chi tiết, hoặc bấm Sửa / Xóa nhanh.
                </p>
              </div>

              {/* Cụm nút Quản trị */}
              <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                <input
                  ref={excelInputRef}
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleExcelUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploadingExcel}
                  onClick={() => excelInputRef.current?.click()}
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-xs shadow-lg transition-all"
                >
                  {isUploadingExcel ? (
                    <IconLoader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <IconFileSpreadsheet className="w-4 h-4" />
                  )}
                  <span>
                    {isUploadingExcel ? "Đang import..." : "Thêm bằng Excel"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenCreateModal}
                  className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ECA921] hover:bg-[#D89512] text-white font-bold text-xs shadow-lg transition-all"
                >
                  <IconPlus className="w-4 h-4" />
                  <span>Thêm Sản Phẩm</span>
                </button>
              </div>
            </div>
          </div>

          {/* THANH CÔNG CỤ */}
          <div className="bg-white p-4 rounded-2xl border border-amber-100/80 shadow-xs mb-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                {showProteinFilter && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 mr-1 shrink-0">
                      <IconFilter className="w-4 h-4 text-[#ECA921]" />
                      <span>Loại thịt:</span>
                    </div>
                    {proteinFilters.map((tab) => {
                      const isActive = selectedProtein === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => handleSelectProtein(tab.id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
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

                <button
                  type="button"
                  onClick={() => setOnlyMissingImage(!onlyMissingImage)}
                  className={`cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    onlyMissingImage
                      ? "bg-red-600 text-white border-red-600 shadow-sm"
                      : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                  }`}
                >
                  <IconAlertCircle className="w-4 h-4" />
                  <span>Chưa có hình ({missingImageCount})</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
                <div className="relative flex-1 sm:w-64">
                  <input
                    type="text"
                    placeholder="Tìm theo tên sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-amber-200 focus:border-[#ECA921] focus:ring-2 focus:ring-amber-100 bg-white text-xs font-medium outline-none"
                  />
                  <IconSearch className="w-4 h-4 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setViewMode("card")}
                    className={`cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      viewMode === "card"
                        ? "bg-white text-[#4A2E16] shadow-xs"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <IconLayoutGrid className="w-4 h-4" />
                    <span>Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    className={`cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      viewMode === "table"
                        ? "bg-white text-[#4A2E16] shadow-xs"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <IconTable className="w-4 h-4" />
                    <span>Table</span>
                  </button>
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
          </div>

          {/* DANH SÁCH SẢN PHẨM */}
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
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-amber-100 text-[#4A2E16] rounded-xl text-xs font-bold hover:bg-[#ECA921] hover:text-white transition-colors cursor-pointer"
              >
                Thử lại
              </button>
            </div>
          ) : products.length === 0 ? (
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
          ) : viewMode === "card" ? (
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

                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        {!product.hasRealImage && (
                          <div
                            title="Sản phẩm này chưa có hình ảnh!"
                            className="bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 animate-bounce"
                          >
                            <IconAlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Chưa có hình</span>
                          </div>
                        )}
                        <div className="bg-[#ECA921] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs">
                          {product.nhom}
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-[#ECA921] uppercase tracking-wider">
                          NHÓM {product.nhom}
                        </span>
                        {!product.hasRealImage && (
                          <span className="text-[10px] font-bold text-red-600 flex items-center gap-0.5">
                            <IconAlertCircle className="w-3.5 h-3.5" /> Thiếu
                            ảnh
                          </span>
                        )}
                      </div>

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

                  <div
                    className="px-5 pb-5 pt-2 grid grid-cols-2 gap-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={(e) =>
                        handleOpenEditModal(product.rawProduct, e)
                      }
                      className="cursor-pointer w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 border border-blue-200/80 hover:border-transparent shadow-2xs"
                    >
                      <IconEdit className="w-4 h-4" />
                      <span>Chỉnh Sửa</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) =>
                        handleDeleteProduct(product.rawProduct, e)
                      }
                      className="cursor-pointer w-full py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 border border-red-200/80 hover:border-transparent shadow-2xs"
                    >
                      <IconTrash className="w-4 h-4" />
                      <span>Xóa Bỏ</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-amber-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-amber-50/70 border-b border-amber-100 text-[11px] font-extrabold text-[#4A2E16] uppercase tracking-wider">
                      <th className="py-3.5 px-4 w-12 text-center">STT</th>
                      <th className="py-3.5 px-4 w-24">Hình ảnh</th>
                      <th className="py-3.5 px-4">Tên sản phẩm</th>
                      <th className="py-3.5 px-4">Nhóm</th>
                      <th className="py-3.5 px-4">Món phù hợp</th>
                      <th className="py-3.5 px-4">Thương hiệu / Xuất xứ</th>
                      <th className="py-3.5 px-4 text-right w-44">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className="hover:bg-amber-50/30 transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-4 text-center font-bold text-gray-400">
                          #{product.stt}
                        </td>
                        <td className="py-3 px-4">
                          <div className="relative w-14 h-14 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                            {product.hasRealImage ? (
                              <img
                                src={product.imageUrl}
                                alt={product.tenTiengViet}
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-red-400">
                                <IconPhotoOff className="w-5 h-5" />
                                <span className="text-[9px] font-bold text-red-500">
                                  Trống
                                </span>
                              </div>
                            )}

                            {!product.hasRealImage && (
                              <span
                                title="Sản phẩm chưa có hình ảnh!"
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md animate-pulse"
                              >
                                <IconAlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-gray-900 text-sm">
                              {product.tenTiengViet}
                            </span>
                            {!product.hasRealImage && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600">
                                ! Chưa có ảnh
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 italic text-xs mt-0.5">
                            {product.tenTiengAnh}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-amber-100/80 text-[#4A2E16] font-bold text-[11px]">
                            {product.nhom}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <p className="line-clamp-2">{product.phuHopMon}</p>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <p className="line-clamp-2">
                            {product.thuongHieuXuatXu}
                          </p>
                        </td>
                        <td
                          className="py-3 px-4 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) =>
                                handleOpenEditModal(product.rawProduct, e)
                              }
                              className="cursor-pointer px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold transition-colors flex items-center gap-1"
                            >
                              <IconEdit className="w-4 h-4" /> Sửa
                            </button>
                            <button
                              type="button"
                              onClick={(e) =>
                                handleDeleteProduct(product.rawProduct, e)
                              }
                              className="cursor-pointer px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold transition-colors flex items-center gap-1"
                            >
                              <IconTrash className="w-4 h-4" /> Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODAL XEM CHI TIẾT SẢN PHẨM */}
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            isAdmin={true}
            onEdit={() => {
              if (selectedProduct) {
                handleOpenEditModal(selectedProduct.rawProduct);
              }
            }}
            onDelete={() => {
              if (selectedProduct) {
                handleDeleteProduct(selectedProduct.rawProduct);
              }
            }}
          />

          {/* MODAL THÊM / SỬA SẢN PHẨM & UPLOAD ẢNH QUA PATCH */}
          {isFormModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl border border-amber-100 my-8 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <h2 className="text-lg font-extrabold text-[#4A2E16] uppercase">
                    {editingProduct
                      ? `Cập nhật: ${editingProduct.name}`
                      : "Thêm sản phẩm mới"}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="cursor-pointer p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <IconX className="w-5 h-5" />
                  </button>
                </div>

                <form
                  onSubmit={handleSaveProduct}
                  className="space-y-5 mt-5 text-xs"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        Tên sản phẩm *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#ECA921] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        Tên Tiếng Anh (englishName)
                      </label>
                      <input
                        type="text"
                        value={formData.englishName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            englishName: e.target.value,
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#ECA921] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        Danh mục (category)
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#ECA921] outline-none bg-white"
                      >
                        {categoryOptions.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        Nhóm phụ (subCategory)
                      </label>
                      <input
                        type="text"
                        value={formData.subCategory}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            subCategory: e.target.value,
                          })
                        }
                        placeholder="VD: HEO, BÒ, GÀ..."
                        className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#ECA921] outline-none"
                      />
                    </div>
                  </div>

                  {/* PHẦN UPLOAD HÌNH ẢNH QUA PATCH /api/products/:id/image */}
                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-[#4A2E16]">
                        Hình ảnh sản phẩm (PATCH /api/products/:id/image)[cite:
                        3]
                      </label>
                      <span className="text-[10px] text-amber-700 font-semibold">
                        Form key: <strong>file</strong>[cite: 3]
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <input
                        type="text"
                        value={formData.imageUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, imageUrl: e.target.value })
                        }
                        placeholder="Dán link ảnh hoặc bấm chọn file..."
                        className="flex-1 p-2.5 rounded-xl border border-gray-200 bg-white focus:border-[#ECA921] outline-none"
                      />
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={isUploadingImage}
                        onClick={() => imageInputRef.current?.click()}
                        className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#4A2E16] hover:bg-gray-800 text-white font-bold shrink-0 transition-all"
                      >
                        {isUploadingImage ? (
                          <IconLoader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <IconUpload className="w-4 h-4" />
                        )}
                        <span>
                          {isUploadingImage
                            ? "Đang tải lên..."
                            : "Chọn & Upload Ảnh"}
                        </span>
                      </button>
                    </div>

                    {formData.imageUrl && (
                      <div className="pt-2 flex items-center gap-3">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-16 h-16 rounded-xl object-cover border border-amber-200"
                        />
                        <span className="text-[11px] text-emerald-600 font-bold">
                          ✓ Đã sẵn sàng hiển thị
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        Món phù hợp (suitableDishes)
                      </label>
                      <input
                        type="text"
                        value={formData.suitableDishes}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            suitableDishes: e.target.value,
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#ECA921] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        Quy cách cắt hàng (productSpec)
                      </label>
                      <input
                        type="text"
                        value={formData.productSpec}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            productSpec: e.target.value,
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#ECA921] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Đặc điểm sản phẩm (characteristics)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.characteristics}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          characteristics: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#ECA921] outline-none"
                    />
                  </div>

                  {/* BIẾN THỂ THƯƠNG HIỆU */}
                  {editingProduct && (
                    <div className="pt-4 border-t border-gray-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-[#4A2E16] uppercase text-xs">
                          Biến thể theo Thương hiệu (Product Variants)
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            setVariantForms([
                              ...variantForms,
                              {
                                id: "",
                                productId: editingProduct.id,
                                brandId: "",
                                brandName: "Thương hiệu mới",
                                price: 0,
                                packaging: "",
                                brandNote: "",
                                isNew: true,
                              },
                            ]);
                          }}
                          className="cursor-pointer inline-flex items-center gap-1 px-3 py-1 bg-amber-100 hover:bg-[#ECA921] text-[#4A2E16] hover:text-white rounded-lg text-xs font-bold transition-all"
                        >
                          <IconPlus className="w-3.5 h-3.5" /> Thêm biến thể
                        </button>
                      </div>

                      {variantForms.map((v, idx) => (
                        <div
                          key={v.id || idx}
                          className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-3 relative"
                        >
                          <div className="sm:col-span-2 flex items-center justify-between font-bold text-amber-700">
                            <span>
                              {v.isNew
                                ? "➕ Thêm biến thể mới"
                                : `Thương hiệu: ${v.brandName}`}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = variantForms.filter(
                                  (_, i) => i !== idx,
                                );
                                setVariantForms(updated);
                              }}
                              className="text-red-500 hover:text-red-700 text-[11px] cursor-pointer"
                            >
                              Xóa dòng
                            </button>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-gray-600 mb-1">
                              Quy cách thùng (packaging)
                            </label>
                            <input
                              type="text"
                              value={v.packaging}
                              placeholder="VD: Thùng 15kg..."
                              onChange={(e) => {
                                const updated = [...variantForms];
                                updated[idx].packaging = e.target.value;
                                setVariantForms(updated);
                              }}
                              className="w-full p-2 rounded-lg border border-gray-200 bg-white outline-none focus:border-[#ECA921]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-gray-600 mb-1">
                              Ghi chú thương hiệu (brandNote)
                            </label>
                            <input
                              type="text"
                              value={v.brandNote}
                              placeholder="VD: Hàng đông lạnh nhập khẩu..."
                              onChange={(e) => {
                                const updated = [...variantForms];
                                updated[idx].brandNote = e.target.value;
                                setVariantForms(updated);
                              }}
                              className="w-full p-2 rounded-lg border border-gray-200 bg-white outline-none focus:border-[#ECA921]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setIsFormModalOpen(false)}
                      className="cursor-pointer px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="cursor-pointer inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#ECA921] hover:bg-[#D89512] text-white font-bold shadow-md"
                    >
                      {isSubmitting ? (
                        <IconLoader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <IconCheck className="w-4 h-4" />
                      )}
                      <span>
                        {editingProduct ? "Lưu cập nhật" : "Tạo sản phẩm"}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function AdminCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center">Đang tải trang quản trị...</div>
      }
    >
      <AdminCatalogContent />
    </Suspense>
  );
}
