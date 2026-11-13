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
  IconInfoCircle,
  IconExchange,
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

  // --- Các trường B2B ---
  suitableDishes?: string;
  characteristics?: string;
  productSpec?: string;
  marketPopularity?: string;
  suitableChannels?: string;

  // --- Các trường RTC ---
  description?: string;
  ingredients?: string;
  usageInstructions?: string;
  storageInstructions?: string;
  warnings?: string;
  highlights?: string;

  imageUrl: string | null;
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
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Chế độ nhập liệu: 'b2b' hoặc 'rtc'
  const [formMode, setFormMode] = useState<"b2b" | "rtc">("b2b");

  const [product, setProduct] = useState<Partial<ProductInput>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});

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
    const isExist = selectedVariants.find((v) => v.brandId === brand.brandId);
    if (isExist) {
      setSelectedVariants(
        selectedVariants.filter((v) => v.brandId !== brand.brandId),
      );
    } else {
      setSelectedVariants([...selectedVariants, { ...brand }]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setProduct({ ...product, imageUrl });
    }
  };

  const handleFinalSubmit = async () => {
    const newErrors: Record<string, boolean> = {};

    // Validate chung
    if (!product.name || String(product.name).trim() === "")
      newErrors.name = true;
    if (!product.category || String(product.category).trim() === "")
      newErrors.category = true;

    // Validate theo Mode
    if (formMode === "b2b") {
      const b2bFields: (keyof ProductInput)[] = [
        "productSpec",
        "marketPopularity",
        "suitableChannels",
        "suitableDishes",
        "characteristics",
      ];
      b2bFields.forEach((field) => {
        if (!product[field] || String(product[field]).trim() === "") {
          newErrors[field] = true;
        }
      });
    } else {
      const rtcFields: (keyof ProductInput)[] = [
        "description",
        "ingredients",
        "usageInstructions",
        "storageInstructions",
      ];
      rtcFields.forEach((field) => {
        if (!product[field] || String(product[field]).trim() === "") {
          newErrors[field] = true;
        }
      });
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Vui lòng không để trống các trường bắt buộc có dấu (*)");
      return;
    }

    if (selectedVariants.length === 0 && formMode === "b2b") {
      toast.error("Vui lòng chọn ít nhất 1 thương hiệu B2B!");
      return;
    }

    setSubmitting(true);

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

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                type="button"
                disabled={submitting}
                onClick={() => router.push("/admin")}
                className="cursor-pointer px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-amber-100 border border-amber-500/30 text-xs font-bold transition-colors flex items-center gap-2"
              >
                <IconArrowLeft className="w-4 h-4" /> Hủy bỏ
              </button>

              {/* NÚT CHUYỂN ĐỔI CHẾ ĐỘ FORM */}
              <div className="flex bg-gray-900 border border-amber-500/30 rounded-xl p-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => setFormMode("b2b")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                    formMode === "b2b"
                      ? "bg-[#ECA921] text-gray-950"
                      : "text-amber-100 hover:text-white"
                  }`}
                >
                  <IconBox className="w-4 h-4" /> Ngành Hàng B2B
                </button>
                <button
                  type="button"
                  onClick={() => setFormMode("rtc")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
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

        {/* NỘI DUNG CHÍNH */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* CỘT TRÁI (8/12) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Card 1: Thông tin cơ bản (Dùng chung) */}
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
                      className={getInputClass(errors.name)}
                      value={product.name || ""}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          name: capitalizeFirst(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">
                      Tên tiếng Anh (Quốc tế)
                    </label>
                    <input
                      type="text"
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
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={getInputClass(errors.category)}
                      value={product.category || ""}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          category: capitalizeFirst(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* RENDER FORM DỰA VÀO MODE */}
              {formMode === "b2b" ? (
                <>
                  {/* Card 2 - B2B: Đặc tính chi tiết */}
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
                          Mức độ phổ biến{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
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
                          Kênh quán phù hợp{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
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
                          Đặc điểm sản phẩm{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={3}
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

                  {/* Card 3 - B2B: CHỌN BIẾN THỂ */}
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
                      {/* Đoạn search brand giữ nguyên như file cũ */}
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
                      <div className="p-4 bg-amber-50/50 border border-amber-200/70 rounded-2xl min-h-[96px]">
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
                /* -------------------------------------------------------------
                   GIAO DIỆN MỚI CHO RTC / FMCG (Khi chọn Tab Xanh lá)
                   ------------------------------------------------------------- */
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
                        className={`${getInputClass(errors.description)} resize-none`}
                        value={product.description || ""}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            description: capitalizeFirst(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Thành phần chính <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="VD: Cơm, Thịt Kho Trứng (75%), nước tương lên men..."
                        className={`${getInputClass(errors.ingredients)} resize-none`}
                        value={product.ingredients || ""}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            ingredients: capitalizeFirst(e.target.value),
                          })
                        }
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
                          className={`${getInputClass(errors.usageInstructions)} resize-none whitespace-pre-wrap`}
                          value={product.usageInstructions || ""}
                          onChange={(e) =>
                            setProduct({
                              ...product,
                              usageInstructions: capitalizeFirst(
                                e.target.value,
                              ),
                            })
                          }
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
                          className={`${getInputClass(errors.storageInstructions)} resize-none whitespace-pre-wrap`}
                          value={product.storageInstructions || ""}
                          onChange={(e) =>
                            setProduct({
                              ...product,
                              storageInstructions: capitalizeFirst(
                                e.target.value,
                              ),
                            })
                          }
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
                          className={`${getInputClass(errors.highlights)} resize-none`}
                          value={product.highlights || ""}
                          onChange={(e) =>
                            setProduct({
                              ...product,
                              highlights: capitalizeFirst(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">
                          Lưu ý / Cảnh báo dị ứng
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Không sử dụng nếu bao bì rách..."
                          className={`${getInputClass(errors.warnings)} resize-none bg-red-50/20`}
                          value={product.warnings || ""}
                          onChange={(e) =>
                            setProduct({
                              ...product,
                              warnings: capitalizeFirst(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CỘT PHẢI: UPLOAD ẢNH & PREVIEW (4/12) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
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

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleFinalSubmit}
                    className={`w-full cursor-pointer py-3.5 px-6 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                      formMode === "rtc"
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                        : "bg-[#ECA921] hover:bg-[#D89512] text-gray-950"
                    }`}
                  >
                    {submitting ? (
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
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
