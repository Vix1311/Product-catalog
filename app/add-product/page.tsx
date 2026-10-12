"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

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

// Mock data cho thanh search thương hiệu
const MOCK_BRANDS = [
  { brandId: "b1", name: "A213PK", origin: "Đức" },
  { brandId: "b2", name: "EXCEL", origin: "Mỹ" },
  { brandId: "b3", name: "KILCOY", origin: "Úc" },
  { brandId: "b4", name: "SEABOARD", origin: "Mỹ" },
  { brandId: "b5", name: "MIRATORG", origin: "Nga" },
  { brandId: "b6", name: "SWIFTS", origin: "Mỹ" },
];

// Hàm Helper: Tự động viết hoa chữ cái đầu tiên
const capitalizeFirst = (text: string) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export default function AddProductPage() {
  const router = useRouter();

  // State sản phẩm khởi tạo trống hoàn toàn
  const [product, setProduct] = useState<Partial<ProductInput>>({});

  // State quản lý lỗi Validation
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // State Hình ảnh
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State Thương hiệu (Variants)
  const [searchBrand, setSearchBrand] = useState("");
  const [selectedVariants, setSelectedVariants] = useState<any[]>([]);

  // State Thương hiệu đề xuất (Random)
  const [suggestedBrands, setSuggestedBrands] = useState<typeof MOCK_BRANDS>(
    [],
  );

  // Random 4 thương hiệu khi form vừa render
  useEffect(() => {
    const shuffled = [...MOCK_BRANDS].sort(() => 0.5 - Math.random());
    setSuggestedBrands(shuffled.slice(0, 4));
  }, []);

  // Lọc brand theo thanh tìm kiếm
  const filteredBrands = useMemo(() => {
    if (!searchBrand) return [];
    return MOCK_BRANDS.filter(
      (b) =>
        b.name.toLowerCase().includes(searchBrand.toLowerCase()) ||
        b.origin.toLowerCase().includes(searchBrand.toLowerCase()),
    );
  }, [searchBrand]);

  const displayBrands = searchBrand ? filteredBrands : suggestedBrands;

  // Logic Click Chọn / Hủy Chọn (Toggle)
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

  // Xử lý khi chọn file ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setProduct({ ...product, imageUrl: imageUrl });
    }
  };

  // Submit và validate trực tiếp tại đây
  const handleFinalSubmit = () => {
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
      alert("Vui lòng không để trống các trường thông tin sản phẩm!");
      return;
    }

    if (selectedVariants.length === 0) {
      alert("Vui lòng chọn ít nhất 1 thương hiệu!");
      return;
    }

    const payload = {
      ...product,
      variants: selectedVariants,
    };

    console.log("DỮ LIỆU GỬI LÊN PRISMA:", JSON.stringify(payload, null, 2));
    alert("Đã lưu thành công!");
    router.push("/"); // Lưu xong tự động chuyển về trang chủ
  };

  return (
    <div className="relative min-h-screen bg-slate-100 overflow-hidden font-sans pb-16">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Thông Tin Sản Phẩm
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleFinalSubmit}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
            >
              Hoàn Tất & Lưu Sản Phẩm
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CỘT TRÁI: FORM NHẬP LIỆU & CHỌN BRAND (8/12) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: Thông tin cơ bản */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  1
                </span>
                Thông tin cơ bản
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Thăn ngoại bò Mỹ"
                    className={`w-full p-2.5 bg-slate-50 border rounded-lg text-slate-900 focus:bg-white focus:outline-none transition-all ${
                      errors.name
                        ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200"
                        : "border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                    }`}
                    value={product.name || ""}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        name: capitalizeFirst(e.target.value),
                      })
                    }
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      Không được để trống tên sản phẩm
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Tên tiếng Anh
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Striploin"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none"
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
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Danh mục *
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Bò"
                    className={`w-full p-2.5 bg-slate-50 border rounded-lg text-slate-900 focus:bg-white focus:outline-none transition-all ${
                      errors.category
                        ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200"
                        : "border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                    }`}
                    value={product.category || ""}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        category: capitalizeFirst(e.target.value),
                      })
                    }
                  />
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1">
                      Không được để trống danh mục
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Card 2: Đặc tính chi tiết */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                  2
                </span>
                Đặc tính sản phẩm
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Quy cách cắt *
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Cắt lát 2cm"
                    className={`w-full p-2.5 bg-slate-50 border rounded-lg text-slate-900 focus:bg-white focus:outline-none ${
                      errors.productSpec
                        ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200"
                        : "border-slate-200 focus:ring-2 focus:ring-orange-100"
                    }`}
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
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Độ phổ biến *
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Rất cao"
                    className={`w-full p-2.5 bg-slate-50 border rounded-lg text-slate-900 focus:bg-white focus:outline-none ${
                      errors.marketPopularity
                        ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200"
                        : "border-slate-200 focus:ring-2 focus:ring-orange-100"
                    }`}
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
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Kênh phù hợp *
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Nhà hàng Steakhouse, Quán nướng cao cấp"
                    className={`w-full p-2.5 bg-slate-50 border rounded-lg text-slate-900 focus:bg-white focus:outline-none ${
                      errors.suitableChannels
                        ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200"
                        : "border-slate-200 focus:ring-2 focus:ring-orange-100"
                    }`}
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
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Món ăn phù hợp *
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Steak, Nướng"
                    className={`w-full p-2.5 bg-slate-50 border rounded-lg text-slate-900 focus:bg-white focus:outline-none ${
                      errors.suitableDishes
                        ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200"
                        : "border-slate-200 focus:ring-2 focus:ring-orange-100"
                    }`}
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
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Đặc điểm *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="VD: Thịt mềm, viền mỡ thơm"
                    className={`w-full p-3 bg-slate-50 border rounded-lg text-slate-900 focus:bg-white focus:outline-none resize-none ${
                      errors.characteristics
                        ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200"
                        : "border-slate-200 focus:ring-2 focus:ring-orange-100"
                    }`}
                    value={product.characteristics || ""}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        characteristics: capitalizeFirst(e.target.value),
                      })
                    }
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Card 3: CHỌN BIẾN THỂ / THƯƠNG HIỆU */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                  3
                </span>
                Thương hiệu
              </h3>

              <input
                type="text"
                placeholder="🔍 Gõ tìm mã thương hiệu hoặc xuất xứ (VD: EXCEL, Mỹ)..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-green-100 outline-none mb-3"
                value={searchBrand}
                onChange={(e) => setSearchBrand(e.target.value)}
              />

              {/* Box Gợi ý tìm kiếm / Đề xuất */}
              <div className="flex flex-wrap gap-2 mb-4 p-4 bg-slate-50 border border-slate-100 rounded-xl min-h-[80px]">
                {!searchBrand && (
                  <div className="w-full text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    💡 Đề xuất cho bạn:
                  </div>
                )}
                {searchBrand && displayBrands.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">
                    Không tìm thấy thương hiệu này...
                  </p>
                ) : null}

                {displayBrands.map((brand) => {
                  const isSelected = selectedVariants.some(
                    (v) => v.brandId === brand.brandId,
                  );
                  return (
                    <button
                      key={brand.brandId}
                      onClick={() => toggleBrand(brand)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-600 ring-offset-1"
                          : "bg-white text-slate-700 border border-slate-200 hover:border-blue-400 hover:bg-blue-50"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                      {brand.name}{" "}
                      <span
                        className={
                          isSelected ? "text-blue-200" : "text-slate-400"
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

          {/* CỘT PHẢI: UPLOAD ẢNH & PREVIEW (4/12) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 sticky top-8">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Hình ảnh (imageUrl)
              </h3>

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full aspect-[4/3] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group ${
                  previewImage
                    ? "border-transparent bg-slate-100"
                    : "border-slate-300 bg-slate-50 hover:bg-blue-50 hover:border-blue-400"
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
                      className="w-full h-full object-contain mix-blend-multiply p-2"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
                        Đổi ảnh
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <div className="w-14 h-14 mx-auto mb-3 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:scale-110 transition-transform">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      Click tải ảnh lên
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>  
  );
}
  