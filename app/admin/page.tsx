"use client";

import React, { useState, useMemo, Suspense, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import toast from "react-hot-toast";
import ProductDetailModal, {
  ProductDetail,
} from "@/components/ProductCatalogDetailModal";
import {
  IconSearch,
  IconFilter,
  IconLoader2,
  IconPlus,
  IconEdit,
  IconTrash,
  IconLayoutGrid,
  IconTable,
  IconAlertCircle,
  IconX,
  IconCheck,
  IconPhotoOff,
  IconUpload,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import StickyHeader from "@/components/StickyHeader";
import { logoutApi, authFetch } from "../services/auth.service";
import Footer from "@/components/Footer";
import NotFoundPage from "../not-found";

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

const ITEMS_PER_PAGE = 12;

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

const categoryLabelMap: Record<string, string> = Object.fromEntries(
  categoryOptions.map((c) => [c.id, c.label]),
);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = (url: string) =>
  fetch(`${API_BASE_URL}${url}`).then((res) => res.json());

// Helper tạo danh sách số trang gọn gàng
function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, 4, "...", total];
  }
  if (current >= total - 2) {
    return [1, "...", total - 3, total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
}

function AdminCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const categoryDropdownRef = useRef<HTMLDivElement | null>(null);
  const listTopRef = useRef<HTMLDivElement | null>(null);

  // 1. Trạng thái Đăng nhập & Chặn truy cập
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

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

  // 2. Đọc params từ URL
  const groupSlug = searchParams.get("group") || "";
  const searchFromUrl = searchParams.get("search") || "";

  // 3. State UI, Bộ lọc Category & Phân trang
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [onlyMissingImage, setOnlyMissingImage] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() =>
    groupSlug ? [groupSlug] : [],
  );
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] =
    useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // State Modal Sửa & Upload ảnh
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ApiProduct | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // State Form Thông tin Sản phẩm (Chỉ phục vụ Edit)
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

  // Đồng bộ nếu URL có truyền ?group=...
  useEffect(() => {
    if (groupSlug) {
      setSelectedCategories([groupSlug]);
    }
  }, [groupSlug]);

  // Đóng bảng chọn danh mục khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset về trang 1 khi thay đổi bộ lọc hoặc từ khóa tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, searchTerm, onlyMissingImage]);

  // 4. GỌI API GET PRODUCTS BẰNG SWR (keepPreviousData giúp không giật giao diện khi gõ tìm kiếm)
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append("search", searchTerm.trim());

    const queryString = params.toString();
    return queryString ? `/api/products?${queryString}` : `/api/products`;
  }, [searchTerm]);

  const {
    data: rawProducts = [],
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<ApiProduct[]>(apiUrl, fetcher, {
    keepPreviousData: true,
  });

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
        categorySlug: p.category || "thit-nhap-khau",
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
  }, [rawProducts]);

  // Đếm số lượng sản phẩm theo từng category để hiển thị trên bảng lọc
  const categoryCountMap = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of allMappedProducts) {
      counts[p.categorySlug] = (counts[p.categorySlug] || 0) + 1;
    }
    return counts;
  }, [allMappedProducts]);

  // Lọc theo danh mục đã chọn
  const categoryFilteredProducts = useMemo(() => {
    if (selectedCategories.length === 0) return allMappedProducts;
    return allMappedProducts.filter((p) =>
      selectedCategories.includes(p.categorySlug),
    );
  }, [allMappedProducts, selectedCategories]);

  // Lọc thêm điều kiện thiếu ảnh & đánh lại STT theo kết quả lọc
  const products = useMemo(() => {
    const filtered = onlyMissingImage
      ? categoryFilteredProducts.filter((p) => !p.hasRealImage)
      : categoryFilteredProducts;

    return filtered.map((p, idx) => ({
      ...p,
      stt: idx + 1,
    }));
  }, [categoryFilteredProducts, onlyMissingImage]);

  const missingImageCount = useMemo(
    () => categoryFilteredProducts.filter((p) => !p.hasRealImage).length,
    [categoryFilteredProducts],
  );

  // 6. Tính toán phân trang (12 sản phẩm / trang)
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));

  const paginatedProducts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return products.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [products, safeCurrentPage]);

  const startItem =
    products.length === 0 ? 0 : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(safeCurrentPage * ITEMS_PER_PAGE, products.length);

  const handlePageChange = (page: number, shouldScroll = false) => {
    if (page < 1 || page > totalPages || page === safeCurrentPage) return;
    setCurrentPage(page);
    if (shouldScroll) {
      listTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Toggle chọn / bỏ chọn category (bấm lần 1 thêm, bấm lần 2 mất)
  const handleToggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const pageTitle =
    selectedCategories.length === 1 && categoryTitleMap[selectedCategories[0]]
      ? categoryTitleMap[selectedCategories[0]]
      : "QUẢN LÝ DANH MỤC SẢN PHẨM";

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSearchTerm("");
    setOnlyMissingImage(false);
    setCurrentPage(1);
    setIsCategoryPanelOpen(false);
    router.push(`/admin`);
  };

  // ============================================================================
  // CÁC HÀM CALL API (UPLOAD ẢNH QUA PATCH, SỬA, XÓA)
  // ============================================================================

  // 1. PATCH /api/products/:id/image với key 'file'
  const handleImageFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct?.id) return;

    const formDataImg = new FormData();
    formDataImg.append("file", file);

    try {
      setIsUploadingImage(true);
      const token = localStorage.getItem("accessToken");
      const authHeaders: HeadersInit = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const response = await authFetch(
        `${API_BASE_URL}/api/products/${editingProduct.id}/image`,
        { method: "PATCH", body: formDataImg },
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
      toast.success("Đã cập nhật ảnh sản phẩm lên Cloudinary thành công!");
    } catch (err: any) {
      toast.error(`Lỗi upload ảnh: ${err.message}`);
    } finally {
      setIsUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  // 2. Mở Modal Sửa Sản phẩm & Biến thể
  const handleOpenEditModal = (rawProd: ApiProduct, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingProduct(rawProd);
    setFormData({
      name: rawProd.name || "",
      englishName: rawProd.englishName || "",
      category: rawProd.category || "thit-nhap-khau",
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

  // 3. Xử lý lưu cập nhật thông tin sản phẩm và biến thể
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên sản phẩm!");
      return;
    }

    try {
      setIsSubmitting(true);

      const productRes = await authFetch(
        `${API_BASE_URL}/api/products/${editingProduct.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
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
          const res = await authFetch(`${API_BASE_URL}/api/product-variants`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId: editingProduct.id,
              brandId: v.brandId || "default-brand-id",
              packaging: v.packaging,
              brandNote: v.brandNote,
            }),
          });
          if (!res.ok) throw new Error("Thêm biến thể thất bại");
        } else if (v.id) {
          const res = await authFetch(
            `${API_BASE_URL}/api/product-variants/${v.id}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                productId: v.productId,
                brandId: v.brandId,
                packaging: v.packaging,
                brandNote: v.brandNote,
              }),
            },
          );
          if (!res.ok) throw new Error("Cập nhật biến thể thất bại");
        }
      }

      toast.success("Đã cập nhật sản phẩm và biến thể thành công!");
      await mutate();
      setIsFormModalOpen(false);
    } catch (err: any) {
      toast.error(`Lỗi: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Xóa sản phẩm
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
      const res = await authFetch(
        `${API_BASE_URL}/api/products/${rawProd.id}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) throw new Error("Xóa sản phẩm thất bại");

      await mutate();
      toast.success("Đã xóa sản phẩm!");
    } catch (err: any) {
      toast.error(`Lỗi khi xóa: ${err.message}`);
    }
  };
  

  if (isCheckingAuth) {
    return <NotFoundPage />;
  }

  const showInitialLoader = isLoading && rawProducts.length === 0;

  return (
    <div>
      <StickyHeader isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* HEADER (Cố định 1 dòng tiêu đề để tránh nhảy chiều cao banner) */}
          <div className="bg-gradient-to-r from-gray-900 via-[#4A2E16] to-gray-900 rounded-3xl p-8 md:p-10 text-white shadow-xl mb-8 border border-amber-500/20 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left max-w-2xl min-w-0">
                <span className="text-xs font-bold uppercase tracking-widest text-[#ECA921] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Khánh An Admin Catalog
                </span>
                <h1 className="text-2xl md:text-4xl font-black text-amber-100 tracking-wider mt-3 uppercase truncate">
                  {pageTitle}
                </h1>
                <p className="text-xs md:text-sm text-gray-300 mt-2">
                  Quản trị viên có thể nhấp trực tiếp vào từng thẻ sản phẩm để
                  xem chi tiết, hoặc bấm Sửa / Xóa nhanh.
                </p>
              </div>
            </div>
          </div>

          {/* THANH CÔNG CỤ & BỘ LỌC CATEGORY */}
          <div
            ref={listTopRef}
            className="scroll-mt-24 bg-white p-4 rounded-2xl border border-amber-100/80 shadow-xs mb-8 space-y-3"
          >
            {/* HÀNG TRÊN CÙNG: LUÔN CỐ ĐỊNH CHIỀU CAO (h-10) ĐỂ KHÔNG NHẢY GIAO DIỆN */}
            <div className="h-10 flex items-center gap-2 pb-2.5 border-b border-amber-100/80 overflow-x-auto scrollbar-none">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1 shrink-0">
                Đang lọc:
              </span>

              {selectedCategories.length === 0 ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold shrink-0">
                  Tất cả danh mục
                </span>
              ) : (
                <>
                  {selectedCategories.map((catId) => (
                    <button
                      key={catId}
                      type="button"
                      onClick={() => handleToggleCategory(catId)}
                      title="Nhấn để bỏ chọn danh mục này"
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECA921] hover:bg-[#D89512] text-white text-xs font-bold shadow-xs transition-colors shrink-0 group"
                    >
                      <span>{categoryLabelMap[catId] || catId}</span>
                      <IconX className="w-3.5 h-3.5 stroke-[2.5] group-hover:scale-110 transition-transform" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSelectedCategories([])}
                    className="cursor-pointer text-xs font-bold text-gray-400 hover:text-red-500 px-2 py-1 transition-colors shrink-0 ml-auto"
                  >
                    Xóa tất cả
                  </button>
                </>
              )}
            </div>
            {/* HÀNG CÔNG CỤ CHÍNH */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                {/* NÚT MỞ BẢNG CHỌN CATEGORY (Kích thước cố định không đổi khi chọn) */}
                <div className="relative" ref={categoryDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsCategoryPanelOpen((prev) => !prev)}
                    className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      isCategoryPanelOpen || selectedCategories.length > 0
                        ? "bg-amber-50 text-[#4A2E16] border-[#ECA921] shadow-xs"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-amber-50 hover:border-amber-300"
                    }`}
                  >
                    <IconFilter className="w-4 h-4 text-[#ECA921] shrink-0" />
                    <span>Lọc danh mục</span>
                    <span
                      className={`min-w-5 h-5 px-1.5 rounded-full text-[10px] font-extrabold inline-flex items-center justify-center tabular-nums transition-colors ${
                        selectedCategories.length > 0
                          ? "bg-[#ECA921] text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {selectedCategories.length}
                    </span>
                    <IconChevronDown
                      className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${
                        isCategoryPanelOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* BẢNG CHỌN CATEGORY */}
                  {isCategoryPanelOpen && (
                    <div className="absolute left-0 mt-2 w-[320px] sm:w-[520px] bg-white rounded-2xl border border-amber-200 shadow-2xl p-4 z-40">
                      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-gray-100">
                        <span className="text-xs font-extrabold text-[#4A2E16] uppercase tracking-wider">
                          Chọn danh mục sản phẩm
                        </span>
                        <span className="text-[11px] text-gray-400 font-medium">
                          Bấm để chọn / bỏ chọn
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {categoryOptions.map((cat) => {
                          const isSelected = selectedCategories.includes(
                            cat.id,
                          );
                          const count = categoryCountMap[cat.id] || 0;

                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => handleToggleCategory(cat.id)}
                              className={`cursor-pointer flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-left text-xs font-bold transition-colors ${
                                isSelected
                                  ? "bg-amber-50 border-[#ECA921] text-[#4A2E16] shadow-2xs"
                                  : "bg-white border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-amber-200"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span
                                  className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                                    isSelected
                                      ? "bg-[#ECA921] border-[#ECA921] text-white"
                                      : "border-gray-300 bg-white"
                                  }`}
                                >
                                  {isSelected && (
                                    <IconCheck className="w-3 h-3 stroke-[3]" />
                                  )}
                                </span>
                                <span className="truncate">{cat.label}</span>
                              </div>
                              <span
                                className={`min-w-7 text-center text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 tabular-nums ${
                                  isSelected
                                    ? "bg-[#ECA921]/20 text-[#4A2E16]"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {count}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => setSelectedCategories([])}
                          disabled={selectedCategories.length === 0}
                          className="cursor-pointer text-xs font-bold text-gray-500 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          Bỏ chọn tất cả
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsCategoryPanelOpen(false)}
                          className="cursor-pointer px-4 py-1.5 rounded-lg bg-[#4A2E16] hover:bg-gray-800 text-white text-xs font-bold transition-colors"
                        >
                          Đóng
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* LỌC SẢN PHẨM CHƯA CÓ HÌNH */}
                <button
                  type="button"
                  onClick={() => setOnlyMissingImage(!onlyMissingImage)}
                  className={`cursor-pointer inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors min-w-[148px] tabular-nums ${
                    onlyMissingImage
                      ? "bg-red-600 text-white border-red-600 shadow-sm"
                      : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                  }`}
                >
                  <IconAlertCircle className="w-4 h-4 shrink-0" />
                  <span>Chưa có hình ({missingImageCount})</span>
                </button>
              </div>

              {/* TÌM KIẾM + CHẾ ĐỘ XEM + ĐẾM SỐ LƯỢNG */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
                <div className="relative flex-1 sm:w-64">
                  <input
                    type="text"
                    placeholder="Tìm theo tên sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-amber-200 focus:border-[#ECA921] focus:ring-2 focus:ring-amber-100 bg-white text-xs font-medium outline-none"
                  />
                  {isValidating && !showInitialLoader ? (
                    <IconLoader2 className="w-4 h-4 text-amber-500 animate-spin absolute left-3 top-1/2 -translate-y-1/2" />
                  ) : (
                    <IconSearch className="w-4 h-4 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>

                <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setViewMode("card")}
                    className={`cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
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
                    className={`cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      viewMode === "table"
                        ? "bg-white text-[#4A2E16] shadow-xs"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <IconTable className="w-4 h-4" />
                    <span>Table</span>
                  </button>
                </div>

                <div className="text-xs text-gray-500 font-semibold whitespace-nowrap hidden sm:block min-w-[148px] text-right tabular-nums">
                  Hiển thị{" "}
                  <strong className="text-[#ECA921] font-bold text-sm">
                    {products.length > 0 ? `${startItem}–${endItem}` : 0}
                  </strong>{" "}
                  / {products.length} mặt hàng
                </div>
              </div>
            </div>{" "}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white px-5 pt-4 border-t border-amber-100/80">
                <p className="text-xs text-gray-500 font-medium tabular-nums">
                  Trang{" "}
                  <strong className="text-[#4A2E16]">{safeCurrentPage}</strong>{" "}
                  / <strong className="text-[#4A2E16]">{totalPages}</strong>{" "}
                  (Tổng {products.length} mặt hàng)
                </p>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handlePageChange(safeCurrentPage - 1)}
                    disabled={safeCurrentPage === 1}
                    aria-label="Trang trước"
                    className="px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 border border-amber-200/80 text-[#4A2E16] hover:bg-amber-50 hover:text-[#ECA921] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <IconChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Trước</span>
                  </button>

                  {getPageNumbers(safeCurrentPage, totalPages).map(
                    (page, idx) =>
                      page === "..." ? (
                        <span
                          key={`ellipsis-${idx}`}
                          className="px-2 py-1 text-xs font-bold text-gray-400 select-none"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          type="button"
                          onClick={() => handlePageChange(page)}
                          className={`min-w-9 h-9 px-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer tabular-nums ${
                            safeCurrentPage === page
                              ? "bg-[#ECA921] text-white shadow-md shadow-amber-500/20"
                              : "bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-[#ECA921]"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                  )}

                  <button
                    type="button"
                    onClick={() => handlePageChange(safeCurrentPage + 1)}
                    disabled={safeCurrentPage === totalPages}
                    aria-label="Trang sau"
                    className="px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 border border-amber-200/80 text-[#4A2E16] hover:bg-amber-50 hover:text-[#ECA921] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <span className="hidden sm:inline">Sau</span>
                    <IconChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* VÙNG DANH SÁCH SẢN PHẨM (Cố định min-height chống giật trang & scrollbar) */}
          <div
            className={
              viewMode === "table" ? "min-h-[1060px]" : "min-h-[560px]"
            }
          >
            {showInitialLoader ? (
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
            ) : paginatedProducts.length === 0 ? (
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
            ) : (
              <>
                {viewMode === "card" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedProducts.map((product) => (
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
                                  <IconAlertCircle className="w-3.5 h-3.5" />{" "}
                                  Thiếu ảnh
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
                                <strong className="text-gray-700">
                                  Xuất xứ:
                                </strong>{" "}
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
                      <table className="w-full min-w-[1024px] table-fixed text-left border-collapse">
                        <thead>
                          <tr className="bg-amber-50/70 border-b border-amber-100 text-[11px] font-extrabold text-[#4A2E16] uppercase tracking-wider">
                            <th className="py-3.5 px-4 w-[6%] text-center">
                              STT
                            </th>
                            <th className="py-3.5 px-4 w-[8%]">Hình ảnh</th>
                            <th className="py-3.5 px-4 w-[26%]">
                              Tên sản phẩm
                            </th>
                            <th className="py-3.5 px-4 w-[11%]">Nhóm</th>
                            <th className="py-3.5 px-4 w-[17%]">Món phù hợp</th>
                            <th className="py-3.5 px-4 w-[16%]">
                              Thương hiệu / Xuất xứ
                            </th>
                            <th className="py-3.5 px-4 w-[16%] text-right">
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                          {paginatedProducts.map((product) => (
                            <tr
                              key={product.id}
                              onClick={() => setSelectedProduct(product)}
                              className="h-[84px] hover:bg-amber-50/30 transition-colors cursor-pointer"
                            >
                              <td className="py-3 px-4 text-center font-bold text-gray-400 tabular-nums">
                                #{product.stt}
                              </td>

                              <td className="py-3 px-4">
                                <div className="relative w-14 h-14 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
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
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span
                                    title={product.tenTiengViet}
                                    className="font-extrabold text-gray-900 text-sm truncate"
                                  >
                                    {product.tenTiengViet}
                                  </span>
                                  {!product.hasRealImage && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600 shrink-0 whitespace-nowrap">
                                      ! Chưa có ảnh
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-400 italic text-xs mt-0.5 truncate h-4">
                                  {product.tenTiengAnh || ""}
                                </p>
                              </td>

                              <td className="py-3 px-4">
                                <span
                                  title={product.nhom}
                                  className="inline-block max-w-full truncate px-2.5 py-1 rounded-lg bg-amber-100/80 text-[#4A2E16] font-bold text-[11px]"
                                >
                                  {product.nhom}
                                </span>
                              </td>

                              <td className="py-3 px-4">
                                <p className="line-clamp-2 break-words">
                                  {product.phuHopMon}
                                </p>
                              </td>

                              <td className="py-3 px-4">
                                <p className="line-clamp-2 break-words">
                                  {product.thuongHieuXuatXu}
                                </p>
                              </td>

                              <td
                                className="py-3 px-4 text-right whitespace-nowrap"
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

                {/* THANH PHÂN TRANG (12 SẢN PHẨM / TRANG) */}
                {totalPages > 1 && (
                  <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white px-5 py-4 rounded-2xl border border-amber-100/80 shadow-xs">
                    <p className="text-xs text-gray-500 font-medium tabular-nums">
                      Trang{" "}
                      <strong className="text-[#4A2E16]">
                        {safeCurrentPage}
                      </strong>{" "}
                      / <strong className="text-[#4A2E16]">{totalPages}</strong>{" "}
                      (Tổng {products.length} mặt hàng)
                    </p>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          handlePageChange(safeCurrentPage - 1, true)
                        }
                        disabled={safeCurrentPage === 1}
                        aria-label="Trang trước"
                        className="px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 border border-amber-200/80 text-[#4A2E16] hover:bg-amber-50 hover:text-[#ECA921] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      >
                        <IconChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Trước</span>
                      </button>

                      {getPageNumbers(safeCurrentPage, totalPages).map(
                        (page, idx) =>
                          page === "..." ? (
                            <span
                              key={`ellipsis-${idx}`}
                              className="px-2 py-1 text-xs font-bold text-gray-400 select-none"
                            >
                              ...
                            </span>
                          ) : (
                            <button
                              key={page}
                              type="button"
                              onClick={() => handlePageChange(page, true)}
                              className={`min-w-9 h-9 px-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer tabular-nums ${
                                safeCurrentPage === page
                                  ? "bg-[#ECA921] text-white shadow-md shadow-amber-500/20"
                                  : "bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-[#ECA921]"
                              }`}
                            >
                              {page}
                            </button>
                          ),
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handlePageChange(safeCurrentPage + 1, true)
                        }
                        disabled={safeCurrentPage === totalPages}
                        aria-label="Trang sau"
                        className="px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 border border-amber-200/80 text-[#4A2E16] hover:bg-amber-50 hover:text-[#ECA921] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      >
                        <span className="hidden sm:inline">Sau</span>
                        <IconChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

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

          {/* MODAL SỬA SẢN PHẨM & UPLOAD ẢNH QUA PATCH */}
          {isFormModalOpen && editingProduct && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl border border-amber-100 my-8 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <h2 className="text-lg font-extrabold text-[#4A2E16] uppercase">
                    Cập nhật: {editingProduct.name}
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
                        Tên Tiếng Anh
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
                        Danh mục
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
                        Nhóm phụ
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
                        Hình ảnh sản phẩm
                      </label>
                      <span className="text-[10px] text-amber-700 font-semibold">
                        Form key: <strong>file</strong>
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
                        Món phù hợp
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
                        Quy cách cắt hàng
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
                      Đặc điểm sản phẩm
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
                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-[#4A2E16] uppercase text-xs">
                        Biến thể theo Thương hiệu
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
                            Quy cách thùng
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
                            Ghi chú thương hiệu
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
                      <span>Lưu cập nhật</span>
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
