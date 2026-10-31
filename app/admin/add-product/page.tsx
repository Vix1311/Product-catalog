"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  IconCheck,
  IconX,
  IconPhoto,
  IconSearch,
  IconBulb,
  IconBox,
  IconSparkles,
  IconAward,
  IconArrowLeft,
  IconDeviceFloppy,
  IconLoader2,
} from "@tabler/icons-react";
import Footer from "@/components/Footer";
import StickyHeader from "@/components/StickyHeader";
import { logoutApi } from "@/app/services/auth.service";
import NotFoundPage from "@/app/not-found";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

type ProductInput = {
  id?: string;
  name: string;
  englishName: string;
  category: string;
  suitableDishes: string;
  characteristics: string;
  imageUrl: string | null;
  productSpec: string;
  marketPopularity: string;
  suitableChannels: string;
};

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

export default function AddProductPage() {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [product, setProduct] = useState<Partial<ProductInput>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // State lưu File ảnh vật lý để gửi qua FormData & state loading
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchBrand, setSearchBrand] = useState("");
  const [selectedVariants, setSelectedVariants] = useState<any[]>([]);
  const [suggestedBrands, setSuggestedBrands] = useState<typeof MOCK_BRANDS>(
    [],
  );

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
    const isExist = selectedVariants.find((v) => v.brandId === brand.brandId);
    if (isExist) {
      setSelectedVariants(
        selectedVariants.filter((v) => v.brandId !== brand.brandId),
      );
    } else {
      setSelectedVariants([...selectedVariants, { ...brand }]);
    }
  };

  // Lưu cả file gốc và URL preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setProduct({ ...product, imageUrl });
    }
  };

  // 🚀 XỬ LÝ SUBMIT CHUẨN: TẠO SẢN PHẨM -> GỌI PATCH /api/products/:id/image
  const handleFinalSubmit = async () => {
    const newErrors: Record<string, boolean> = {};

    const requiredFields: (keyof ProductInput)[] = [
      "name",
      "category",
      "productSpec",
      "marketPopularity",
      "suitableChannels",
      "suitableDishes",
      "characteristics",
    ];

    let isValid = true;
    requiredFields.forEach((field) => {
      if (!product[field] || String(product[field]).trim() === "") {
        newErrors[field] = true;
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (!isValid) {
      toast.error("Vui lòng không để trống các trường thông tin sản phẩm!");
      return;
    }

    if (selectedVariants.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 thương hiệu!");
      return;
    }

    setSubmitting(true);

    try {
      // ✅ ĐOẠN MỚI ĐÃ SỬA:
      const token = localStorage.getItem("accessToken");

      // 1. Thêm : HeadersInit để TypeScript không bắt lỗi type undefined
      const authHeaders: HeadersInit = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      // BƯỚC 1: Tạo sản phẩm mới
      const createResponse = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({
          ...product,
          variants: selectedVariants,
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

      // BƯỚC 2: Nếu có chọn file ảnh -> Gọi PATCH /api/products/:id/image với key 'file'
      if (selectedFile && newProductId) {
        const imageFormData = new FormData();
        imageFormData.append("file", selectedFile);

        const patchImageResponse = await fetch(
          `${API_BASE}/api/products/${newProductId}/image`,
          {
            method: "PATCH",
            headers: authHeaders, // Truyền authHeaders vào đây hết lỗi
            body: imageFormData,
          },
        );

        if (!patchImageResponse.ok) {
          const patchErr = await patchImageResponse.json().catch(() => ({}));
          throw new Error(
            patchErr.message || "Lỗi khi upload ảnh sản phẩm qua PATCH.",
          );
        }
      }
      toast.success("Đã lưu thông tin và tải ảnh sản phẩm lên thành công!");
      router.push("/admin");
    } catch (error: any) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      toast.error(`Có lỗi xảy ra: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getInputClass = (hasError?: boolean) =>
    `w-full px-3.5 py-2.5 bg-amber-50/20 border rounded-xl text-xs sm:text-sm text-gray-900 focus:bg-white focus:outline-none transition-all ${
      hasError
        ? "border-red-500 bg-red-50/50 focus:ring-2 focus:ring-red-200"
        : "border-gray-200 focus:border-[#ECA921] focus:ring-2 focus:ring-[#ECA921]/20"
    }`;

  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      const loggedInState = localStorage.getItem("isLoggedIn");
      const isValid = !!(token && loggedInState === "true");

      if (!isValid) {
        router.replace("/"); // Đẩy thẳng về trang chủ nếu LocalStorage trống
      } else {
        setIsLoggedIn(true);
        setIsCheckingAuth(false); // Mở khóa cho phép hiển thị
      }
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [router]);

  if (isCheckingAuth) {
    return <NotFoundPage />;
  }

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
                THÊM MỚI SẢN PHẨM B2B
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-gray-300 max-w-xl">
                Thiết lập thông tin chi tiết, quy cách cắt thái và gán thương
                hiệu nhập khẩu để hiển thị lên hệ thống Catalog Khánh An Foods.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                disabled={submitting}
                onClick={() => router.push("/admin")}
                className="cursor-pointer px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-amber-100 border border-amber-500/30 text-xs font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <IconArrowLeft className="w-4 h-4" /> Hủy bỏ
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleFinalSubmit}
                className="cursor-pointer px-6 py-3 rounded-xl bg-[#ECA921] hover:bg-[#D89512] text-gray-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <IconLoader2 className="w-4 h-4 animate-spin" /> Đang lưu
                    lên Cloud...
                  </>
                ) : (
                  <>
                    <IconDeviceFloppy className="w-4 h-4" /> Hoàn Tất & Lưu Sản
                    Phẩm
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* NỘI DUNG CHÍNH */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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
                      placeholder="VD: Thăn ngoại bò Mỹ"
                      className={getInputClass(errors.name)}
                      value={product.name || ""}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          name: capitalizeFirst(e.target.value),
                        })
                      }
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs font-semibold mt-1">
                        Không được để trống tên sản phẩm
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">
                      Tên tiếng Anh (Quốc tế)
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Striploin"
                      className={getInputClass(false)}
                      value={product.englishName || ""}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          englishName: capitalizeFirst(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">
                      Danh mục nhóm hàng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Thịt bò nhập khẩu"
                      className={getInputClass(errors.category)}
                      value={product.category || ""}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          category: capitalizeFirst(e.target.value),
                        })
                      }
                    />
                    {errors.category && (
                      <p className="text-red-500 text-xs font-semibold mt-1">
                        Không được để trống danh mục
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 2: Đặc tính chi tiết */}
              <div className="bg-white rounded-3xl shadow-sm border border-amber-200/70 overflow-hidden">
                <div className="bg-gray-900 text-white px-6 py-4 border-b border-amber-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#ECA921] text-gray-950 font-black text-xs flex items-center justify-center">
                      02
                    </span>
                    <h3 className="text-base font-black text-amber-100">
                      Đặc Tính & Quy Cách B2B
                    </h3>
                  </div>
                  <IconSparkles className="w-5 h-5 text-[#ECA921]" />
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">
                      Quy cách cắt hàng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Cắt lát 2cm, Bào mỏng 1.5mm"
                      className={getInputClass(errors.productSpec)}
                      value={product.productSpec || ""}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          productSpec: capitalizeFirst(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">
                      Mức độ phổ biến <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Rất cao / Bán chạy"
                      className={getInputClass(errors.marketPopularity)}
                      value={product.marketPopularity || ""}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          marketPopularity: capitalizeFirst(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">
                      Kênh quán phù hợp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Nhà hàng Steakhouse, Quán nướng BBQ, Chuỗi Lẩu"
                      className={getInputClass(errors.suitableChannels)}
                      value={product.suitableChannels || ""}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          suitableChannels: capitalizeFirst(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">
                      Món ăn phù hợp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Steak áp chảo; Nướng tảng; Nhúng lẩu"
                      className={getInputClass(errors.suitableDishes)}
                      value={product.suitableDishes || ""}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          suitableDishes: capitalizeFirst(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">
                      Đặc điểm sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="VD: Thịt mềm mọng, viền mỡ thơm béo đặc trưng..."
                      className={`${getInputClass(errors.characteristics)} resize-none`}
                      value={product.characteristics || ""}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          characteristics: capitalizeFirst(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: CHỌN BIẾN THỂ / THƯƠNG HIỆU */}
              <div className="bg-white rounded-3xl shadow-sm border border-amber-200/70 overflow-hidden">
                <div className="bg-gray-900 text-white px-6 py-4 border-b border-amber-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#ECA921] text-gray-950 font-black text-xs flex items-center justify-center">
                      03
                    </span>
                    <h3 className="text-base font-black text-amber-100">
                      Thương Hiệu & Xuất Xứ Nhập Khẩu
                    </h3>
                  </div>
                  <IconAward className="w-5 h-5 text-[#ECA921]" />
                </div>

                <div className="p-6 space-y-4">
                  <div className="relative">
                    <IconSearch className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Gõ tìm mã thương hiệu hoặc xuất xứ (VD: EXCEL, KILCOY, Mỹ, Úc)..."
                      className="w-full pl-10 pr-4 py-2.5 bg-amber-50/30 border border-amber-200/80 rounded-xl text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-[#ECA921] focus:outline-none transition-all"
                      value={searchBrand}
                      onChange={(e) => setSearchBrand(e.target.value)}
                    />
                  </div>

                  <div className="p-4 bg-amber-50/50 border border-amber-200/70 rounded-2xl min-h-[96px]">
                    {!searchBrand && (
                      <div className="flex items-center gap-1.5 text-xs font-black text-[#8C5210] uppercase tracking-wider mb-3">
                        <IconBulb className="w-4 h-4 text-[#ECA921]" />
                        Thương hiệu đề xuất nhanh:
                      </div>
                    )}

                    {searchBrand && displayBrands.length === 0 ? (
                      <p className="text-xs text-gray-500 italic py-2">
                        Không tìm thấy thương hiệu phù hợp...
                      </p>
                    ) : null}

                    <div className="flex flex-wrap gap-2">
                      {displayBrands.map((brand) => {
                        const isSelected = selectedVariants.some(
                          (v) => v.brandId === brand.brandId,
                        );
                        return (
                          <button
                            type="button"
                            key={brand.brandId}
                            onClick={() => toggleBrand(brand)}
                            className={`cursor-pointer px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                              isSelected
                                ? "bg-gray-900 text-[#ECA921] shadow-md border border-[#ECA921]"
                                : "bg-white text-gray-800 border border-amber-200 hover:border-[#ECA921] hover:bg-amber-50"
                            }`}
                          >
                            {isSelected && (
                              <span className="w-4 h-4 rounded-full bg-[#ECA921] text-gray-950 flex items-center justify-center">
                                <IconCheck className="w-3 h-3" stroke={3} />
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

                  {selectedVariants.length > 0 && (
                    <div className="pt-2">
                      <div className="text-xs font-bold text-gray-600 mb-2">
                        Đã chọn ({selectedVariants.length} thương hiệu):
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedVariants.map((v) => (
                          <span
                            key={v.brandId}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECA921]/20 border border-[#ECA921]/50 text-[#4A2E16] text-xs font-extrabold"
                          >
                            {v.name} ({v.origin})
                            <button
                              type="button"
                              onClick={() => toggleBrand(v)}
                              className="cursor-pointer hover:text-red-600"
                            >
                              <IconX className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: UPLOAD ẢNH & PREVIEW (4/12) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
              <div className="bg-white rounded-3xl shadow-sm border border-amber-200/70 overflow-hidden">
                <div className="bg-gray-900 text-white px-6 py-4 border-b border-amber-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconPhoto className="w-5 h-5 text-[#ECA921]" />
                    <h3 className="text-base font-black text-amber-100">
                      Hình Ảnh Sản Phẩm
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#ECA921] bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    PATCH /image
                  </span>
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
                      <>
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-gray-950 text-xs font-extrabold bg-[#ECA921] px-4 py-2 rounded-xl shadow-lg">
                            Bấm để đổi ảnh khác
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6">
                        <div className="w-14 h-14 mx-auto mb-3 bg-amber-100/70 rounded-2xl border border-amber-200 flex items-center justify-center text-[#B8731B] group-hover:scale-110 transition-transform">
                          <IconPhoto className="w-7 h-7" />
                        </div>
                        <p className="text-xs sm:text-sm font-extrabold text-gray-800">
                          Bấm để tải ảnh sản phẩm lên
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1">
                          Hỗ trợ JPG, PNG, WEBP (Tỉ lệ chuẩn 4:3)
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-4 space-y-2 text-xs">
                    <div className="font-black text-[#8C5210] uppercase tracking-wider">
                      Kiểm tra trước khi lưu:
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tên sản phẩm:</span>
                      <strong className="text-gray-900 truncate max-w-[160px]">
                        {product.name || "Chưa nhập"}
                      </strong>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Danh mục:</span>
                      <strong className="text-gray-900">
                        {product.category || "Chưa nhập"}
                      </strong>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>File ảnh đính kèm:</span>
                      <strong className="text-emerald-700 truncate max-w-[150px]">
                        {selectedFile ? selectedFile.name : "Chưa chọn ảnh"}
                      </strong>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Số thương hiệu:</span>
                      <strong className="text-[#B8731B]">
                        {selectedVariants.length} thương hiệu
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleFinalSubmit}
                    className="w-full cursor-pointer py-3.5 px-6 rounded-xl bg-[#ECA921] hover:bg-[#D89512] text-gray-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <IconLoader2 className="w-4 h-4 animate-spin" /> Đang
                        tải lên...
                      </>
                    ) : (
                      <>
                        <IconDeviceFloppy className="w-4 h-4" /> Hoàn Tất & Lưu
                        Sản Phẩm
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
