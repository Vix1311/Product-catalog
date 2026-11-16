"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconCheck,
  IconPhoto,
  IconSearch,
  IconBox,
  IconArrowLeft,
  IconDeviceFloppy,
  IconLoader2,
  IconInfoCircle,
  IconFileSpreadsheet,
} from "@tabler/icons-react";
import Footer from "@/components/Footer";
import StickyHeader from "@/components/StickyHeader";
import { logoutApi } from "@/app/services/auth.service";
import NotFoundPage from "@/app/not-found";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// ============================================================================
// 1. ZOD SCHEMA: ĐỊNH NGHĨA VÀ VALIDATION DỮ LIỆU
// ============================================================================
const productSchema = z
  .object({
    formMode: z.enum(["b2b", "rtc"]),
    name: z.string().min(1, "Tên sản phẩm không được để trống"),
    englishName: z.string().optional(),
    category: z.string().min(1, "Danh mục không được để trống"),

    // Các trường B2B
    productSpec: z.string().optional(),
    marketPopularity: z.string().optional(),
    suitableChannels: z.string().optional(),
    suitableDishes: z.string().optional(),
    characteristics: z.string().optional(),
    variants: z.array(z.any()).optional(),

    // Các trường RTC
    description: z.string().optional(),
    ingredients: z.string().optional(),
    usageInstructions: z.string().optional(),
    storageInstructions: z.string().optional(),
    warnings: z.string().optional(),
    highlights: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Validation chéo dựa trên formMode
    if (data.formMode === "b2b") {
      if (!data.productSpec?.trim())
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["productSpec"],
          message: "Bắt buộc",
        });
      if (!data.marketPopularity?.trim())
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["marketPopularity"],
          message: "Bắt buộc",
        });
      if (!data.suitableChannels?.trim())
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["suitableChannels"],
          message: "Bắt buộc",
        });
      if (!data.suitableDishes?.trim())
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["suitableDishes"],
          message: "Bắt buộc",
        });
      if (!data.characteristics?.trim())
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["characteristics"],
          message: "Bắt buộc",
        });
      if (!data.variants || data.variants.length === 0)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["variants"],
          message: "Vui lòng chọn ít nhất 1 thương hiệu B2B!",
        });
    } else {
      if (!data.description?.trim())
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["description"],
          message: "Bắt buộc",
        });
      if (!data.ingredients?.trim())
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ingredients"],
          message: "Bắt buộc",
        });
      if (!data.usageInstructions?.trim())
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["usageInstructions"],
          message: "Bắt buộc",
        });
      if (!data.storageInstructions?.trim())
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["storageInstructions"],
          message: "Bắt buộc",
        });
    }
  });

type ProductFormValues = z.infer<typeof productSchema>;

const MOCK_BRANDS = [
  { brandId: "b1", name: "A213PK", origin: "Đức" },
  { brandId: "b2", name: "EXCEL", origin: "Mỹ" },
  { brandId: "b3", name: "KILCOY", origin: "Úc" },
  { brandId: "b4", name: "SEABOARD", origin: "Mỹ" },
  { brandId: "b5", name: "MIRATORG", origin: "Nga" },
  { brandId: "b6", name: "SWIFTS", origin: "Mỹ" },
];

const capitalizeFirst = (text: string) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// ============================================================================
// 2. COMPONENT CHÍNH
// ============================================================================
export default function AddProductPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const excelInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingExcel, setIsUploadingExcel] = useState<boolean>(false);

  const [searchBrand, setSearchBrand] = useState("");
  const [suggestedBrands, setSuggestedBrands] = useState<typeof MOCK_BRANDS>(
    [],
  );

  // Khởi tạo React Hook Form kết hợp Zod
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      formMode: "b2b",
      variants: [],
    },
  });

  const formMode = watch("formMode");
  const selectedVariants = watch("variants") || [];

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

  useEffect(() => {
    const shuffled = [...MOCK_BRANDS].sort(() => 0.5 - Math.random());
    setSuggestedBrands(shuffled.slice(0, 4));
  }, []);

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

  const filteredBrands = useMemo(() => {
    if (!searchBrand) return [];
    return MOCK_BRANDS.filter(
      (b) =>
        b.name.toLowerCase().includes(searchBrand.toLowerCase()) ||
        b.origin.toLowerCase().includes(searchBrand.toLowerCase()),
    );
  }, [searchBrand]);

  const displayBrands = searchBrand ? filteredBrands : suggestedBrands;

  const toggleBrand = (brand: (typeof MOCK_BRANDS)[0]) => {
    const isExist = selectedVariants.find(
      (v: any) => v.brandId === brand.brandId,
    );
    let newVariants = [];
    if (isExist) {
      newVariants = selectedVariants.filter(
        (v: any) => v.brandId !== brand.brandId,
      );
    } else {
      newVariants = [...selectedVariants, { ...brand }];
    }
    setValue("variants", newVariants, { shouldValidate: true });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

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

      const response = await fetch(`${API_BASE}/api/products/import-excel`, {
        method: "POST",
        headers: authHeaders,
        body: formDataExcel,
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || "Lỗi khi import file Excel");
      }

      toast.success(
        `Import Excel thành công! Tổng số: ${result.successCount ?? "Tất cả"}/${result.total ?? ""} dòng.`,
      );
      router.push("/admin");
    } catch (err: any) {
      toast.error(`Lỗi Import Excel: ${err.message}`);
    } finally {
      setIsUploadingExcel(false);
      if (excelInputRef.current) excelInputRef.current.value = "";
    }
  };

  // Hàm này CHỈ CHẠY khi Form đã pass toàn bộ Zod validation
  const onSubmit = async (data: ProductFormValues) => {
    try {
      const token = localStorage.getItem("accessToken");
      const authHeaders: HeadersInit = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const createResponse = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({
          ...data,
          // Đảm bảo lọc sạch dữ liệu dựa vào mode trước khi gửi đi
          variants: data.formMode === "b2b" ? data.variants : [],
        }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Không thể tạo thông tin sản phẩm trên server.",
        );
      }

      const createdProduct = await createResponse.json();
      const newProductId = createdProduct.id;

      if (selectedFile && newProductId) {
        const imageFormData = new FormData();
        imageFormData.append("file", selectedFile);

        const patchImageResponse = await fetch(
          `${API_BASE}/api/products/${newProductId}/image`,
          {
            method: "PATCH",
            headers: authHeaders,
            body: imageFormData,
          },
        );

        if (!patchImageResponse.ok) {
          throw new Error("Lỗi khi upload ảnh sản phẩm qua PATCH.");
        }
      }
      toast.success("Đã lưu thông tin và tải ảnh sản phẩm lên thành công!");
      router.push("/admin");
    } catch (error: any) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      toast.error(`Có lỗi xảy ra: ${error.message}`);
    }
  };

  // Hàm xử lý hiển thị lỗi Toast khi validation thất bại
  const onInvalid = (formErrors: any) => {
    if (formErrors.variants) {
      toast.error(formErrors.variants.message);
    } else {
      toast.error("Vui lòng không để trống các trường bắt buộc có dấu (*)");
    }
  };

  const getInputClass = (fieldName: keyof ProductFormValues) =>
    `w-full px-3.5 py-2.5 bg-amber-50/20 border rounded-xl text-xs sm:text-sm text-gray-900 focus:bg-white focus:outline-none transition-all ${
      errors[fieldName]
        ? "border-red-500 bg-red-50/50 focus:ring-2 focus:ring-red-200"
        : "border-gray-200 focus:border-[#ECA921] focus:ring-2 focus:ring-[#ECA921]/20"
    }`;

  if (isCheckingAuth) return <NotFoundPage />;

  return (
    <div>
      <StickyHeader isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <div className="min-h-screen bg-[#FAF8F5] text-gray-800">
        {/* BANNER ĐẦU TRANG */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div
            className="w-full rounded-[28px] py-10 px-6 sm:px-12 shadow-2xl border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            style={{
              background:
                "linear-gradient(90deg, #0B0F17 0%, #1F150D 25%, #4A2809 50%, #1F150D 75%, #0B0F17 100%)",
            }}
          >
            <div>
              <div className="inline-block px-3.5 py-1 rounded-full border border-[#ECA921]/40 bg-[#ECA921]/10 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ECA921]">
                  KHÁNH AN CATALOG CMS
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black uppercase text-[#FFF3D1] tracking-tight">
                THÊM MỚI SẢN PHẨM
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-gray-300 max-w-xl">
                Cập nhật thông tin chi tiết để hiển thị lên hệ thống Catalog
                Khánh An Foods. Hỗ trợ nhiều ngành hàng đa dạng.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                disabled={isSubmitting || isUploadingExcel}
                onClick={() => router.push("/admin")}
                className="cursor-pointer px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-amber-100 border border-amber-500/30 text-xs font-bold transition-colors flex items-center gap-2"
              >
                <IconArrowLeft className="w-4 h-4" /> Hủy bỏ
              </button>

              <input
                ref={excelInputRef}
                type="file"
                accept=".xlsx, .xls"
                onChange={handleExcelUpload}
                className="hidden"
              />
              <button
                type="button"
                disabled={isUploadingExcel || isSubmitting}
                onClick={() => excelInputRef.current?.click()}
                className="cursor-pointer px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
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

              <div className="flex bg-gray-900 border border-amber-500/30 rounded-xl p-1 shadow-lg">
                <button
                  type="button"
                  onClick={() =>
                    setValue("formMode", "b2b", { shouldValidate: true })
                  }
                  className={`cursor-pointer px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                    formMode === "b2b"
                      ? "bg-[#ECA921] text-gray-950"
                      : "text-amber-100 hover:text-white"
                  }`}
                >
                  <IconBox className="w-4 h-4" /> Ngành Hàng B2B
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setValue("formMode", "rtc", { shouldValidate: true })
                  }
                  className={`cursor-pointer px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                    formMode === "rtc"
                      ? "bg-emerald-500 text-gray-950"
                      : "text-amber-100 hover:text-white"
                  }`}
                >
                  <IconInfoCircle className="w-4 h-4" /> FMCG / Nấu Sẵn
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* NỘI DUNG CHÍNH - BAO BỌC BỞI THẺ <form> ĐỂ GỌI REACT HOOK FORM */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pb-20">
          <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* CỘT TRÁI (8/12) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Card 1: Thông tin cơ bản */}
              <div className="bg-white rounded-3xl shadow-sm border border-amber-200/70 overflow-hidden">
                <div className="bg-gray-900 text-white px-6 py-4 border-b border-amber-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#ECA921] text-gray-950 font-black text-xs flex items-center justify-center">
                      01
                    </span>
                    <h3 className="text-base font-black text-amber-100">
                      Thông Tin Cơ Bản
                    </h3>
                  </div>
                  <IconBox className="w-5 h-5 text-[#ECA921]" />
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">
                      Tên sản phẩm (Tiếng Việt){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={getInputClass("name")}
                      {...register("name", {
                        onChange: (e) =>
                          setValue("name", capitalizeFirst(e.target.value), {
                            shouldValidate: true,
                          }),
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">
                      Tên tiếng Anh (Quốc tế)
                    </label>
                    <input
                      type="text"
                      className={getInputClass("englishName")}
                      {...register("englishName", {
                        onChange: (e) =>
                          setValue(
                            "englishName",
                            capitalizeFirst(e.target.value),
                            { shouldValidate: true },
                          ),
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={getInputClass("category")}
                      {...register("category", {
                        onChange: (e) =>
                          setValue(
                            "category",
                            capitalizeFirst(e.target.value),
                            { shouldValidate: true },
                          ),
                      })}
                    />
                  </div>
                </div>
              </div>

              {formMode === "b2b" ? (
                <>
                  <div className="bg-white rounded-3xl shadow-sm border border-amber-200/70 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-gray-900 text-white px-6 py-4 border-b border-amber-500/30 flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-[#ECA921] text-gray-950 font-black text-xs flex items-center justify-center">
                        02
                      </span>
                      <h3 className="text-base font-black text-amber-100">
                        Đặc Tính & Quy Cách B2B
                      </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">
                          Quy cách cắt hàng{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={getInputClass("productSpec")}
                          {...register("productSpec", {
                            onChange: (e) =>
                              setValue(
                                "productSpec",
                                capitalizeFirst(e.target.value),
                                { shouldValidate: true },
                              ),
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">
                          Mức độ phổ biến{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={getInputClass("marketPopularity")}
                          {...register("marketPopularity", {
                            onChange: (e) =>
                              setValue(
                                "marketPopularity",
                                capitalizeFirst(e.target.value),
                                { shouldValidate: true },
                              ),
                          })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">
                          Kênh quán phù hợp{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={getInputClass("suitableChannels")}
                          {...register("suitableChannels", {
                            onChange: (e) =>
                              setValue(
                                "suitableChannels",
                                capitalizeFirst(e.target.value),
                                { shouldValidate: true },
                              ),
                          })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">
                          Món ăn phù hợp <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={getInputClass("suitableDishes")}
                          {...register("suitableDishes", {
                            onChange: (e) =>
                              setValue(
                                "suitableDishes",
                                capitalizeFirst(e.target.value),
                                { shouldValidate: true },
                              ),
                          })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">
                          Đặc điểm sản phẩm{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          className={`${getInputClass("characteristics")} resize-none`}
                          {...register("characteristics", {
                            onChange: (e) =>
                              setValue(
                                "characteristics",
                                capitalizeFirst(e.target.value),
                                { shouldValidate: true },
                              ),
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl shadow-sm border border-amber-200/70 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-gray-900 text-white px-6 py-4 border-b border-amber-500/30 flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-[#ECA921] text-gray-950 font-black text-xs flex items-center justify-center">
                        03
                      </span>
                      <h3 className="text-base font-black text-amber-100">
                        Thương Hiệu & Xuất Xứ Nhập Khẩu
                      </h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="relative">
                        <IconSearch className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Gõ tìm mã thương hiệu hoặc xuất xứ..."
                          className="w-full pl-10 pr-4 py-2.5 bg-amber-50/30 border border-amber-200/80 rounded-xl text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-[#ECA921] focus:outline-none transition-all"
                          value={searchBrand}
                          onChange={(e) => setSearchBrand(e.target.value)}
                        />
                      </div>
                      <div
                        className={`p-4 bg-amber-50/50 border rounded-2xl min-h-[96px] ${errors.variants ? "border-red-500 bg-red-50/50" : "border-amber-200/70"}`}
                      >
                        <div className="flex flex-wrap gap-2">
                          {displayBrands.map((brand) => {
                            const isSelected = selectedVariants.some(
                              (v: any) => v.brandId === brand.brandId,
                            );
                            return (
                              <button
                                type="button"
                                key={brand.brandId}
                                onClick={() => toggleBrand(brand)}
                                className={`cursor-pointer px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                  isSelected
                                    ? "bg-gray-900 text-[#ECA921] shadow-md border border-[#ECA921]"
                                    : "bg-white text-gray-800 border border-amber-200 hover:border-[#ECA921]"
                                }`}
                              >
                                {isSelected && (
                                  <span className="w-4 h-4 rounded-full bg-[#ECA921] flex items-center justify-center">
                                    <IconCheck
                                      className="w-3 h-3 text-gray-950"
                                      stroke={3}
                                    />
                                  </span>
                                )}
                                <span>{brand.name}</span>
                                <span
                                  className={
                                    isSelected
                                      ? "text-amber-200/80"
                                      : "text-gray-400"
                                  }
                                >
                                  ({brand.origin})
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-emerald-200/70 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="bg-emerald-900 text-white px-6 py-4 border-b border-emerald-500/30 flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-emerald-400 text-gray-950 font-black text-xs flex items-center justify-center">
                      02
                    </span>
                    <h3 className="text-base font-black text-emerald-100">
                      Thông Tin Hàng Tiêu Dùng / RTC
                    </h3>
                  </div>

                  <div className="p-6 space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Mô tả sản phẩm <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Mô tả chi tiết về nguồn gốc, hương vị đặc trưng..."
                        className={`${getInputClass("description")} resize-none`}
                        {...register("description", {
                          onChange: (e) =>
                            setValue(
                              "description",
                              capitalizeFirst(e.target.value),
                              { shouldValidate: true },
                            ),
                        })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Thành phần chính <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="VD: Cơm, Thịt Kho Trứng (75%), nước tương lên men..."
                        className={`${getInputClass("ingredients")} resize-none`}
                        {...register("ingredients", {
                          onChange: (e) =>
                            setValue(
                              "ingredients",
                              capitalizeFirst(e.target.value),
                              { shouldValidate: true },
                            ),
                        })}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">
                          Cách dùng <span className="text-red-500">*</span>{" "}
                          <span className="font-normal italic text-gray-500">
                            (Mỗi ý xuống dòng)
                          </span>
                        </label>
                        <textarea
                          rows={4}
                          placeholder="- Hâm nóng bằng vi sóng&#10;- Dùng kèm kim chi..."
                          className={`${getInputClass("usageInstructions")} resize-none whitespace-pre-wrap`}
                          {...register("usageInstructions", {
                            onChange: (e) =>
                              setValue(
                                "usageInstructions",
                                capitalizeFirst(e.target.value),
                                { shouldValidate: true },
                              ),
                          })}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">
                          Bảo quản <span className="text-red-500">*</span>{" "}
                          <span className="font-normal italic text-gray-500">
                            (Mỗi ý xuống dòng)
                          </span>
                        </label>
                        <textarea
                          rows={4}
                          placeholder="- Bảo quản ngăn mát&#10;- Dùng trong 24h sau khi mở..."
                          className={`${getInputClass("storageInstructions")} resize-none whitespace-pre-wrap`}
                          {...register("storageInstructions", {
                            onChange: (e) =>
                              setValue(
                                "storageInstructions",
                                capitalizeFirst(e.target.value),
                                { shouldValidate: true },
                              ),
                          })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">
                          Tiêu chí nổi bật{" "}
                          <span className="font-normal italic text-gray-500">
                            (Mỗi ý cách nhau dấu ;)
                          </span>
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Tiện lợi; Chuẩn vị nhà hàng; Không chất bảo quản"
                          className={`${getInputClass("highlights")} resize-none`}
                          {...register("highlights", {
                            onChange: (e) =>
                              setValue(
                                "highlights",
                                capitalizeFirst(e.target.value),
                                { shouldValidate: true },
                              ),
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">
                          Lưu ý / Cảnh báo dị ứng
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Không sử dụng nếu bao bì rách..."
                          className={`${getInputClass("warnings")} resize-none bg-red-50/20`}
                          {...register("warnings", {
                            onChange: (e) =>
                              setValue(
                                "warnings",
                                capitalizeFirst(e.target.value),
                                { shouldValidate: true },
                              ),
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CỘT PHẢI: UPLOAD ẢNH & PREVIEW (4/12) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
              <div className="bg-white rounded-3xl shadow-sm border border-amber-200/70 overflow-hidden">
                <div className="bg-gray-900 text-white px-6 py-4 border-b border-amber-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconPhoto className="w-5 h-5 text-[#ECA921]" />
                    <h3 className="text-base font-black text-amber-100">
                      Hình Ảnh
                    </h3>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative w-full aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group ${
                      previewImage
                        ? "border-amber-300 bg-gray-900"
                        : "border-amber-300 bg-amber-50/30 hover:bg-amber-50/70 hover:border-[#ECA921]"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                    />
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-6 text-[#B8731B]">
                        Bấm để tải ảnh lên
                      </div>
                    )}
                  </div>

                  {/* SUBMIT BUTTON - BỌC TRONG FORM ĐỂ TRIGGER ZOD */}
                  <button
                    type="submit"
                    disabled={isSubmitting || isUploadingExcel}
                    className={`w-full cursor-pointer py-3.5 px-6 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                      formMode === "rtc"
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                        : "bg-[#ECA921] hover:bg-[#D89512] text-gray-950"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <IconLoader2 className="w-4 h-4 animate-spin" /> Đang
                        lưu...
                      </>
                    ) : (
                      <>
                        <IconDeviceFloppy className="w-4 h-4" /> Hoàn Tất Lưu
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </main>
        <Footer />
      </div>
    </div>
  );
}
