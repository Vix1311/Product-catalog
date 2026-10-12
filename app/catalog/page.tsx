"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductDetailModal, {
  ProductDetail,
} from "@/components/ProductCatalogDetailModal";
import { IconSearch, IconEye, IconFilter } from "@tabler/icons-react";
import StickyHeader from "@/components/StickyHeader";

// Tên hiển thị chuẩn hóa dựa trên Link Group Slug
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

// Danh sách các Protein Filter Tabs
const proteinFilters = [
  { id: "ALL", label: "Tất cả" },
  { id: "HEO", label: "Thịt Heo" },
  { id: "BÒ", label: "Thịt Bò" },
  { id: "GÀ", label: "Thịt Gà" },
  { id: "TRÂU", label: "Thịt Trâu" },
];

// Dữ liệu mẫu chứa đầy đủ thông tin chuẩn cấu trúc
const mockProducts: ProductDetail[] = [
  {
    id: "ba-roi-co-suon",
    stt: 1,
    tenTiengViet: "BA RỌI CÓ SƯỜN",
    tenTiengAnh: "Frozen Pork Single Ribbed Belly",
    nhom: "HEO",
    phuHopMon:
      "Nướng than hoa, BBQ Hàn Quốc, Kho tàu, Thịt luộc, Xào Kim chi/cải chua, Thịt kho, Áp chảo sốt miso/teriyaki, Rang cháy cạnh",
    quyCachCatHang:
      "Bẹ nguyên tấm 4 - 6kg; cắt lát dày mỏng tùy theo yêu cầu của khách",
    phanTichThuongHieu: "Sadia/Seara tỉ lệ nạc mỡ đều đẹp",
    mucDoPhoBien: "Rất phổ biến",
    dacDiemSanPham:
      "Có sườn và sụn non, nạc mỡ xen kẽ đều tầng lớp, da giòn ngậy khi nướng",
    phuHopKenhQuan: "Cơm tấm, Cơm tổng hợp, Nhà hàng lẩu nướng, Suất ăn",
    thuongHieuXuatXu:
      "Sadia: Brazil; Seara: Brazil; APK: Nga; Miratorg: Nga; Olymel: Canada",
    quyCachThung:
      "Sadia: 15-20kg/thùng; Seara: 20kg/thùng; APK: ~20kg/thùng; Miratorg: 15-20kg/thùng; Olymel: 15-20kg/thùng",
    imageUrl:
      "https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=500",
  },
  {
    id: "loi-vai-bo-my",
    stt: 2,
    tenTiengViet: "Lõi Vai Bò Mỹ Premium",
    tenTiengAnh: "Top Blade Beef USA",
    nhom: "BÒ",
    phuHopMon: "Bít tết (Steak), Nướng tảng, Lẩu cao cấp",
    quyCachCatHang: "Cắt bít tết 1.5cm - 2cm hoặc nguyên khối",
    phanTichThuongHieu:
      "St. Helens / Choice grade - Đường gân giữa giòn ngọt đặc trưng",
    mucDoPhoBien: "Phổ biến",
    dacDiemSanPham: "Thịt đậm vị, màu đỏ tươi, gân trong mềm giòn",
    phuHopKenhQuan: "Nhà hàng Âu, Bít tết, Quán nướng Hàn Quốc",
    thuongHieuXuatXu: "St. Helens (Mỹ)",
    quyCachThung: "Thùng 18kg - 20kg",
    imageUrl:
      "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=500",
  },
  {
    id: "dui-ga-goc-tu-y",
    stt: 3,
    tenTiengViet: "Đùi Gà Góc Tư Nhập Khẩu",
    tenTiengAnh: "Frozen Chicken Leg Quarter",
    nhom: "GÀ",
    phuHopMon: "Gà chiên giòn, Gà xối mỡ, Cơm gà Hải Nam, Gà nướng lu",
    quyCachCatHang: "Đóng khay hoặc đóng bịch nguyên đùi góc tư",
    phanTichThuongHieu: "Mountaire / Tyson - Thịt săn chắc, da mỏng ít mỡ",
    mucDoPhoBien: "Rất phổ biến",
    dacDiemSanPham:
      "Thịt dai ngọt tự nhiên, không bở rã khi chiên nhiệt độ cao",
    phuHopKenhQuan: "Quán cơm gà, Chuỗi gà chiên, Suất ăn công nghiệp",
    thuongHieuXuatXu: "Tyson (Mỹ), Mountaire (Mỹ)",
    quyCachThung: "Thùng 15kg",
    imageUrl:
      "https://images.unsplash.com/photo-1587593810167-a84920ea0781?q=80&w=500",
  },
  {
    id: "thit-trau-an-do-m60",
    stt: 4,
    tenTiengViet: "Bắp Trần Trâu Ấn Độ Allana M60",
    tenTiengAnh: "Frozen Buffalo Shin Shank M60",
    nhom: "TRÂU",
    phuHopMon: "Phở bò/trâu, Bún bò Huế, Trâu nhúng mẻ, Trâu hầm tiêu xanh",
    quyCachCatHang: "Nguyên bắp hoa hoặc thái lát mỏng nhúng lẩu",
    phanTichThuongHieu:
      "Allana - Thương hiệu trâu Ấn Độ đạt chuẩn Halal xuất khẩu",
    mucDoPhoBien: "Phổ biến",
    dacDiemSanPham:
      "Nhiều gân hoa đan xen, thịt giòn ngọt, màu đỏ thẫm đẹp mắt",
    phuHopKenhQuan: "Quán phở, Bún bò, Quán nhậu bình dân & Trung cấp",
    thuongHieuXuatXu: "Allana (Ấn Độ)",
    quyCachThung: "Thùng 20kg",
    imageUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=500",
  },
];

function CatalogContent() {
  const searchParams = useSearchParams();
  const groupSlug = searchParams.get("group") || "thit-nhap-khau";

  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProtein, setSelectedProtein] = useState("ALL");

  // Tiêu đề trang động dựa trên Link URL
  const pageTitle = categoryTitleMap[groupSlug] || "DANH MỤC SẢN PHẨM KHÁNH AN";

  // Lọc sản phẩm kết hợp: Từ khóa tìm kiếm + Bộ lọc HEO / BÒ / GÀ / TRÂU
  const filteredProducts = useMemo(() => {
    return mockProducts.filter((p) => {
      // 1. Lọc theo Protein Tab
      const matchProtein =
        selectedProtein === "ALL" ||
        p.nhom.toUpperCase().includes(selectedProtein);

      // 2. Lọc theo Từ khóa Tìm kiếm
      const matchSearch =
        p.tenTiengViet.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tenTiengAnh.toLowerCase().includes(searchTerm.toLowerCase());

      return matchProtein && matchSearch;
    });
  }, [searchTerm, selectedProtein]);

  return (
    <div>
      <StickyHeader
        searchQuery=""
        setSearchQuery={() => {}}
        isLoggedIn={true}
        onLogout={() => {}}
      />
      <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* HEADER TIÊU ĐỀ TRANG TỰ ĐỘNG BẮT LINK */}
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

          {/* BỘ LỌC HEO / BÒ / GÀ / TRÂU + THANH TÌM KIẾM */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-amber-100/80 shadow-xs">
            {/* Cụm Tabs Nút Lọc Loại Thịt */}
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
                    onClick={() => setSelectedProtein(tab.id)}
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

            {/* Ô Tìm Kiếm + Tổng Số Sản Phẩm */}
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
                  {filteredProducts.length}
                </strong>{" "}
                mặt hàng
              </div>
            </div>
          </div>

          {/* DANH SÁCH CARD SẢN PHẨM */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="group bg-white rounded-2xl border border-amber-100 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Khung Ảnh */}
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

                    {/* Tên Tiếng Việt & Tiếng Anh */}
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

                  {/* Nút Xem Chi Tiết */}
                  <div className="px-5 pb-5 pt-2">
                    <button className="w-full py-2.5 rounded-xl bg-amber-50 group-hover:bg-[#ECA921] text-[#4A2E16] group-hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 border border-amber-200/60 group-hover:border-transparent">
                      <IconEye className="w-4 h-4" /> Xem Chi Tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Trường hợp không có sản phẩm phù hợp bộ lọc */
            <div className="text-center py-16 bg-white rounded-3xl border border-amber-100 shadow-2xs">
              <p className="text-gray-500 text-sm font-semibold">
                Không tìm thấy mặt hàng nào phù hợp với bộ lọc hiện tại.
              </p>
              <button
                onClick={() => {
                  setSelectedProtein("ALL");
                  setSearchTerm("");
                }}
                className="mt-4 px-4 py-2 bg-amber-100 text-[#4A2E16] rounded-xl text-xs font-bold hover:bg-[#ECA921] hover:text-white transition-colors"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}

          {/* POPUP MODAL THÔNG TIN SẢN PHẨM */}
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        </div>
      </div>
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
