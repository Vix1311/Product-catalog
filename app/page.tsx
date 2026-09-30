"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import * as XLSX from "xlsx";

// ==========================================
// COMPONENT BỘ LỌC CÓ Ô TÌM KIẾM (CUSTOM DROPDOWN)
// ==========================================
const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="relative w-full sm:w-[220px]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white flex justify-between items-center focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <span className="truncate text-gray-700">
          {value === "all" ? placeholder : value}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-xl flex flex-col animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2 border-b border-gray-100 bg-gray-50 rounded-t-md">
            <div className="relative">
              <svg
                className="w-4 h-4 absolute left-2 top-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
              <input
                type="text"
                className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Gõ để tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <ul className="max-h-60 overflow-y-auto p-1 scrollbar-thin">
            <li
              className={`px-3 py-2 text-sm cursor-pointer rounded-md mb-1 transition-colors ${
                value === "all"
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => {
                onChange("all");
                setIsOpen(false);
                setSearchTerm("");
              }}
            >
              {placeholder}
            </li>
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-4 text-sm text-gray-500 text-center italic">
                Không tìm kết quả
              </li>
            ) : (
              filteredOptions.map((opt, idx) => (
                <li
                  key={idx}
                  className={`px-3 py-2 text-sm cursor-pointer rounded-md mb-1 transition-colors ${
                    value === opt
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  {opt}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

// 1. Định nghĩa kiểu dữ liệu Product
type Product = {
  id: number;
  name: string;
  group: string;
  enName: string;
  dishes: string;
  spec: string;
  desc: string;
  channel: string;
  pack: string;
  image: string;
  brandAnalysis: string;
  brandOrigin: string;
};

export default function App() {
  // --- STATES QUẢN LÝ MÀN HÌNH ---
  const [currentScreen, setCurrentScreen] = useState<
    "upload" | "catalog" | "add"
  >("upload");
  const [products, setProducts] = useState<Product[]>([]);

  // --- STATES BỘ LỌC & HIỂN THỊ ---
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGroup, setFilterGroup] = useState("all");
  const [filterChannel, setFilterChannel] = useState("all");
  const [filterDish, setFilterDish] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // --- STATES THÊM SẢN PHẨM MỚI ---
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});

  // 2. Tự động trích xuất các danh sách Dropdown (không trùng lặp)
  const allGroups = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.group)))
      .filter(Boolean)
      .sort();
  }, [products]);

  const allChannels = useMemo(() => {
    const rawList = products.flatMap((p) =>
      p.channel ? p.channel.split(",").map((c) => c.trim()) : [],
    );
    return Array.from(new Set(rawList)).filter(Boolean).sort();
  }, [products]);

  const allDishes = useMemo(() => {
    const rawList = products.flatMap((p) =>
      p.dishes ? p.dishes.split(",").map((d) => d.trim()) : [],
    );
    return Array.from(new Set(rawList)).filter(Boolean).sort();
  }, [products]);

  // 3. Logic Đọc File Excel
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      const parsedProducts: Product[] = data
        .map((row: any, index) => ({
          id: row["STT"] || index + 1,
          name: row["Tên sản phẩm báo giá"] || "",
          group: row["Nhóm"] || "",
          enName: row["Tên tiếng Anh"] || "",
          dishes: row["Phù hợp món"] || "",
          spec: row["Quy cách sản phẩm & cắt hàng"] || "",
          desc: row["Đặc điểm sản phẩm"] || "",
          channel: row["Phù hợp với kênh quán"] || "",
          pack: row["Quy cách thùng/ theo nguồn"] || "",
          image: row["Ảnh catalogue — đường dẫn tư liệu"] || "",
          brandAnalysis: row["Phân tích đặc điểm từng thương hiệu"] || "",
          brandOrigin: row["Thương hiệu & Xuất xứ tham khảo"] || "",
        }))
        .filter((p) => p.name);

      setProducts(parsedProducts);
      setCurrentScreen("catalog");
    };
    reader.readAsBinaryString(file);
  };

  // 4. Logic Xuất File Excel
  const handleExport = () => {
    const exportData = products.map((p) => ({
      STT: p.id,
      "Tên sản phẩm báo giá": p.name,
      Nhóm: p.group,
      "Tên tiếng Anh": p.enName,
      "Phù hợp món": p.dishes,
      "Quy cách sản phẩm & cắt hàng": p.spec,
      "Phân tích đặc điểm từng thương hiệu": p.brandAnalysis,
      "Mức độ phổ biến trên thị trường": "",
      "Đặc điểm sản phẩm": p.desc,
      "Phù hợp với kênh quán": p.channel,
      "Thương hiệu & Xuất xứ tham khảo": p.brandOrigin,
      "Quy cách thùng/ theo nguồn": p.pack,
      "Ảnh catalogue — đường dẫn tư liệu": p.image,
      "Ảnh hiển thị": "",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "Du_Lieu_San_Pham_Cap_Nhat.xlsx");
  };

  // 5. Logic Thêm Sản Phẩm Mới
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

    const productToAdd: Product = {
      id: newId,
      name: newProduct.name || "",
      group: newProduct.group || "",
      enName: newProduct.enName || "",
      dishes: newProduct.dishes || "",
      spec: newProduct.spec || "",
      desc: newProduct.desc || "",
      channel: newProduct.channel || "",
      pack: newProduct.pack || "",
      image: newProduct.image || "",
      brandAnalysis: newProduct.brandAnalysis || "",
      brandOrigin: newProduct.brandOrigin || "",
    };

    setProducts([...products, productToAdd]);
    setNewProduct({});
    setCurrentScreen("catalog");
  };

  // 6. Logic Lọc Sản Phẩm
  const filteredProducts = products.filter((p) => {
    const searchLower = searchQuery.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(searchLower) ||
      (p.channel && p.channel.toLowerCase().includes(searchLower)) ||
      (p.dishes && p.dishes.toLowerCase().includes(searchLower));

    const matchGroup =
      filterGroup === "all" ||
      p.group.toUpperCase() === filterGroup.toUpperCase();
    const matchChannel =
      filterChannel === "all" ||
      (p.channel && p.channel.includes(filterChannel));
    const matchDish =
      filterDish === "all" || (p.dishes && p.dishes.includes(filterDish));

    return matchSearch && matchGroup && matchChannel && matchDish;
  });

  /* ========================================================================
     GIAO DIỆN 1: MÀN HÌNH UPLOAD EXCEL
     ======================================================================== */
  if (currentScreen === "upload") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <div className="w-20 h-20 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Nhập Dữ Liệu
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Vui lòng tải lên file Excel (.xlsx) danh mục sản phẩm.
          </p>
          <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block w-full">
            Chọn File Excel
            <input
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>
    );
  }

  /* ========================================================================
     GIAO DIỆN 2: MÀN HÌNH THÊM SẢN PHẨM MỚI
     ======================================================================== */
  if (currentScreen === "add") {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">
              Thêm Sản Phẩm Mới
            </h2>
            <button
              onClick={() => setCurrentScreen("catalog")}
              className="text-gray-500 hover:text-gray-800"
            >
              Trở về
            </button>
          </div>
          <form onSubmit={handleSaveProduct} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sản phẩm *
                </label>
                <input
                  required
                  type="text"
                  className="w-full p-2 border rounded-md text-gray-800"
                  value={newProduct.name || ""}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên tiếng Anh
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md text-gray-800"
                  value={newProduct.enName || ""}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, enName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nhóm (VD: HEO)
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md text-gray-800 uppercase"
                  value={newProduct.group || ""}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      group: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Ảnh
                </label>
                <input
                  type="url"
                  className="w-full p-2 border rounded-md text-gray-800"
                  value={newProduct.image || ""}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quy cách sản phẩm & cắt hàng
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md text-gray-800"
                  value={newProduct.spec || ""}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, spec: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đặc điểm sản phẩm
                </label>
                <textarea
                  className="w-full p-2 border rounded-md text-gray-800"
                  rows={2}
                  value={newProduct.desc || ""}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, desc: e.target.value })
                  }
                ></textarea>
              </div>

              {/* Bổ sung input cho 2 trường mới */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phân tích đặc điểm từng thương hiệu
                </label>
                <textarea
                  className="w-full p-2 border rounded-md text-gray-800"
                  rows={2}
                  value={newProduct.brandAnalysis || ""}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      brandAnalysis: e.target.value,
                    })
                  }
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thương hiệu & Xuất xứ tham khảo
                </label>
                <textarea
                  className="w-full p-2 border rounded-md text-gray-800"
                  rows={2}
                  value={newProduct.brandOrigin || ""}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      brandOrigin: e.target.value,
                    })
                  }
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quy cách thùng / nguồn
                </label>
                <textarea
                  className="w-full p-2 border rounded-md text-gray-800"
                  rows={2}
                  value={newProduct.pack || ""}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, pack: e.target.value })
                  }
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phù hợp món ăn (Cách dấu phẩy)
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md text-gray-800"
                  value={newProduct.dishes || ""}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, dishes: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phù hợp kênh quán (Cách dấu phẩy)
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md text-gray-800"
                  value={newProduct.channel || ""}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, channel: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setCurrentScreen("catalog")}
                className="px-5 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Lưu Sản Phẩm
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  /* ========================================================================
     GIAO DIỆN 3: MÀN HÌNH DANH MỤC SẢN PHẨM (CATALOG CHÍNH)
     ======================================================================== */
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-10">
      {/* HEADER & TASKBAR BỘ LỌC */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Danh Mục Thực Phẩm ({products.length})
            </h1>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setCurrentScreen("add")}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-100 text-sm font-medium flex items-center gap-1"
              >
                + Thêm mới
              </button>
              <button
                onClick={handleExport}
                className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium flex items-center gap-1"
              >
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  ></path>
                </svg>
                Xuất Excel
              </button>

              <div className="flex bg-gray-100 p-1 rounded-md border border-gray-200 ml-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                  title="Dạng lưới"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    ></path>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === "table"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                  title="Dạng bảng"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Dòng 2: Cụm Bộ Lọc (Filters) */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Tìm tên sản phẩm, kênh, món..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 pr-8 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="hover:cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none p-1 rounded-full hover:bg-gray-100 transition-colors"
                  title="Xóa tìm kiếm"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            <SearchableSelect
              options={allGroups}
              value={filterGroup}
              onChange={setFilterGroup}
              placeholder="Tất cả Nhóm"
            />

            <SearchableSelect
              options={allChannels}
              value={filterChannel}
              onChange={setFilterChannel}
              placeholder="Tất cả Kênh quán"
            />

            <SearchableSelect
              options={allDishes}
              value={filterDish}
              onChange={setFilterDish}
              placeholder="Tất cả Món ăn"
            />
          </div>
        </div>
      </header>

      {/* HIỂN THỊ DANH SÁCH (Grid / Table) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">
              Không tìm thấy sản phẩm nào phù hợp.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterGroup("all");
                setFilterChannel("all");
                setFilterDish("all");
              }}
              className="mt-3 text-blue-600 hover:underline text-sm"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer flex flex-col border border-gray-100 group"
              >
                <div className="h-48 overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                  <img
                    src={
                      p.image || "https://via.placeholder.com/200?text=No+Image"
                    }
                    alt={p.name}
                    className="max-h-full object-contain mix-blend-multiply transition-transform group-hover:scale-105 duration-300"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <span className="text-[10px] font-bold tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded w-max mb-2">
                    {p.group}
                  </span>
                  <h3 className="text-gray-900 font-bold text-lg leading-tight mb-1">
                    {p.name}
                  </h3>
                  <p className="text-gray-500 text-xs italic mb-3 line-clamp-1">
                    {p.enName}
                  </p>
                  <div className="mt-auto pt-3 border-t border-gray-100 text-xs text-gray-600 space-y-1">
                    <p>
                      <span className="font-semibold text-gray-800">
                        Cắt hàng:
                      </span>{" "}
                      <span className="line-clamp-1">
                        {p.spec?.split(";")[0]}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">Kênh:</span>{" "}
                      <span className="line-clamp-1">{p.channel}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 text-gray-600 font-semibold text-left">
                  <tr>
                    <th className="px-4 py-3 w-20 text-center">Ảnh</th>
                    <th className="px-4 py-3 min-w-[200px]">Tên Sản Phẩm</th>
                    <th className="px-4 py-3 w-24">Nhóm</th>
                    <th className="px-4 py-3 min-w-[200px]">Quy Cách</th>
                    <th className="px-4 py-3 min-w-[200px]">Kênh Quán</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedProduct(p)}
                      className="hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-2">
                        <div className="w-12 h-12 bg-gray-50 rounded border border-gray-100 flex items-center justify-center p-1">
                          <img
                            src={
                              p.image ||
                              "https://via.placeholder.com/50?text=IMG"
                            }
                            alt={p.name}
                            className="max-w-full max-h-full object-contain mix-blend-multiply"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <p className="font-bold text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500 italic">
                          {p.enName}
                        </p>
                      </td>
                      <td className="px-4 py-2 items-center justify-center ">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 rounded">
                          {p.group}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                        <p className="line-clamp-2">{p.spec}</p>
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        <p className="line-clamp-2">{p.channel}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* POPUP CHI TIẾT SẢN PHẨM */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 z-10 transition-colors"
            >
              <svg
                className="w-5 h-5 hover:cursor-pointer"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="md:w-2/5 bg-gray-50 flex items-center justify-center p-6 border-r border-gray-100">
              <img
                src={
                  selectedProduct.image ||
                  "https://via.placeholder.com/400?text=No+Image"
                }
                alt={selectedProduct.name}
                className="max-w-full max-h-[40vh] md:max-h-[80vh] object-contain drop-shadow-md rounded mix-blend-multiply"
              />
            </div>

            <div className="md:w-3/5 p-6 md:p-8 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {selectedProduct.name}
                </h2>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-semibold mb-2">
                  {selectedProduct.group}
                </span>
              </div>

              <p className="text-sm text-gray-500 italic mb-4 pb-4 border-b border-gray-200">
                {selectedProduct.enName}
              </p>

              <div className="space-y-5">
                {/* 1. Đặc điểm chung */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">
                    Đặc điểm sản phẩm
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {selectedProduct.desc}
                  </p>
                </div>

                {/* THÊM MỚI 1: Phân tích đặc điểm thương hiệu */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  {selectedProduct.brandAnalysis && (
                    <div className="bg-blue-50/50 border-l-4 border-blue-400 p-3 rounded-r-md">
                      <h3 className="text-xs font-bold text-blue-800 uppercase mb-1">
                        💡 Phân tích thương hiệu
                      </h3>
                      <p className="text-sm text-gray-700 leading-relaxed italic">
                        {selectedProduct.brandAnalysis}
                      </p>
                    </div>
                  )}
                  <div className="bg-gray-50 p-4 border-l-4 border-gray-300">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase">
                      Quy cách & Cắt hàng
                    </h3>
                    <p className="text-sm text-gray-800 mt-1 font-medium whitespace-pre-line">
                      {selectedProduct.spec}
                    </p>
                  </div>
                </div>

                {/* 2. Cụm Thông số */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  {/* THÊM MỚI 2: Xuất xứ */}
                  <div className="md:col-span-1 border-t md:border-t-0 border-gray-200 pt-3 md:pt-0 md:pl-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase">
                      Xuất xứ tham khảo
                    </h3>
                    <p className="text-sm text-gray-800 mt-1 whitespace-pre-line">
                      {selectedProduct.brandOrigin || "Đang cập nhật"}
                    </p>
                  </div>
                  <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-gray-200 pt-3 md:pt-0 md:pl-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase">
                      Quy cách đóng thùng
                    </h3>
                    <p className="text-sm text-gray-800 mt-1 whitespace-pre-line">
                      {selectedProduct.pack}
                    </p>
                  </div>
                </div>

                {/* 3. Kênh & Món */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="text-orange-500">🏬</span> Phù hợp kênh
                    quán
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedProduct.channel}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="text-green-500">🍲</span> Gợi ý món ăn
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedProduct.dishes?.split(",").map((dish, idx) => (
                      <span
                        key={idx}
                        className="bg-green-50 text-green-700 text-xs px-2 py-1 border border-green-200 rounded-full"
                      >
                        {dish.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
