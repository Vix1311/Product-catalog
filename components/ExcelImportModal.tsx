"use client";

import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import {
  IconX,
  IconDownload,
  IconFileSpreadsheet,
  IconUpload,
  IconLock,
  IconLockOpen,
  IconCheck,
  IconAlertTriangle,
  IconInfoCircle,
  IconLoader2,
  IconTrash,
} from "@tabler/icons-react";

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Danh mục đang lọc (nếu có) để tự điền gợi ý cột Nhóm trong file mẫu */
  activeCategorySlug?: string;
  /** Hàm gọi API upload file Excel ở trang cha */
  onImportFile: (file: File) => Promise<void>;
}

// ĐÚNG 21 CỘT TIÊU ĐỀ CHUẨN (Khớp tuyệt đối với file mẫu v2)
const EXCEL_HEADERS = [
  "STT",
  "Tên sản phẩm báo giá",
  "Nhóm",
  "Tên tiếng Anh",
  "Phù hợp món",
  "Quy cách sản phẩm & cắt hàng",
  "Phân tích đặc điểm từng thương hiệu",
  "Mức độ phổ biến trên thị trường",
  "Đặc điểm sản phẩm",
  "Phù hợp với kênh quán",
  "Thương hiệu & Xuất xứ tham khảo",
  "Quy cách thùng/ theo nguồn",
  "Báo giá",
  "Ảnh catalogue — đường dẫn tư liệu",
  "Ảnh hiển thị",
  "Mô tả sản phẩm (RTC)",
  "Thành phần (RTC)",
  "Cách dùng (RTC)",
  "Bảo quản (RTC)",
  "Lưu ý (RTC)",
  "Tiêu chí nổi bật (RTC)",
] as const;

const CATEGORY_TO_GROUP_MAP: Record<string, string> = {
  "thit-nhap-khau": "HEO",
  surimi: "THANH CUA",
  sauce: "SAUCE",
  mayonnaise: "MAYONNAISE",
  bia: "BIA",
  "cha-bong": "CHÀ BÔNG",
  rte: "RTE",
  rtc: "RTC",
  "oem-odm": "OEM",
};

interface RuleItem {
  id: string;
  title: string;
  badge?: string;
  rule: string;
  goodExample: string;
  badExample: string;
}

const IMPORT_RULES: RuleItem[] = [
  {
    id: "required",
    title: "1. Tên sản phẩm & Nhóm",
    badge: "Bắt buộc",
    rule: "Không để trống. Cột Nhóm viết IN HOA đúng tên hệ thống nhận: HEO, BÒ, GÀ, TRÂU, CỪU, DÊ, HẢI SẢN, THANH CUA, TOPPING, SURIMI, CHẢ CÁ, ĂN KÈM, SAUCE, NƯỚC SỐT, BIA, ĐỒ UỐNG, MAYONNAISE, CHÀ BÔNG, RTE, RTC, OEM, ODM.",
    goodExample:
      "Tên: BA RỌI RÚT SƯỜN\nNhóm: HEO (hoặc THANH CUA, BIA, OEM...)",
    badExample:
      "Ghi 'OEM / ODM', 'Thịt heo' (sẽ tự rơi về danh mục Thịt nhập khẩu)",
  },
  {
    id: "multiline-desc",
    title: "2. Mô tả (RTC) & Đặc điểm sản phẩm",
    badge: "Xuống dòng",
    rule: "Web giữ nguyên định dạng xuống dòng (whitespace-pre-line). Muốn tách đoạn mới, bấm Alt + Enter (Win) hoặc Option + Enter (Mac) ngay trong ô.",
    goodExample:
      "Huy chương Vàng World Beer 2019.\nPhong cách bia Đức truyền thống, nguồn nước Lao Sơn Tuyền.",
    badExample:
      "Viết dính thành 1 đoạn dài hoặc dùng dấu ';' để hy vọng tự tách đoạn",
  },
  {
    id: "bullet-rtc",
    title: "3. Tiêu chí nổi bật, Cách dùng & Bảo quản (RTC)",
    badge: "Tách mục",
    rule: "Web tự tách thành từng thẻ/gạch đầu dòng khi gặp xuống dòng (Alt + Enter) hoặc dấu chấm phẩy (;). Lưu ý viết liền khoảng số (3-5 phút) để tránh bị tách nhầm ở dấu ' - '.",
    goodExample:
      "1. Siêu tiết kiệm chi phí: Đóng túi 1kg tiện lợi.\n2. Hương vị béo ngậy, sánh mịn chuẩn vị.\n(Khoảng số viết liền: Chiên 3-5 phút ở 0-4°C)",
    badExample:
      "Chiên 3 - 5 phút (có khoảng trắng quanh dấu gạch ngang dễ bị tách thành 2 dòng riêng)",
  },
  {
    id: "brand-origin",
    title: "4. Thương hiệu & Xuất xứ tham khảo",
    badge: "Mỗi hãng 1 dòng",
    rule: "Mỗi thương hiệu nằm trên 1 dòng riêng (Alt + Enter) theo cú pháp 'Tên hãng: Xuất xứ'. Không gộp 2 hãng chung 1 dòng.",
    goodExample:
      "Seara: Brazil\nSadia: Brazil\nQ6 Agro-Belogorie: Nga\nBoseler: Đức",
    badExample:
      "Q6 Agro-Belogorie: Nga, Boseler: Đức (gộp 2 hãng 1 dòng)\nSmithfield / Seaboard: Mỹ (gộp bằng dấu /)",
  },
  {
    id: "brand-packaging-sync",
    title: "5. Khớp số dòng Thương hiệu ↔ Quy cách & Phân tích",
    badge: "Rất dễ lỗi",
    rule: "Hệ thống ghép Thương hiệu, Quy cách thùng và Phân tích theo đúng thứ tự từng dòng (dòng 1 khớp dòng 1, dòng 2 khớp dòng 2). Tên hãng trước dấu ':' ở Quy cách phải khớp 100% với cột Thương hiệu.",
    goodExample:
      "Thương hiệu: Tonnies: Đức ↵ Sadia: Brazil\nQuy cách: Tonnies: 10kg/thùng ↵ Sadia: 20kg/thùng\n(Nếu cùng quy cách vẫn nên ghi đủ 2 dòng tương ứng)",
    badExample:
      "Tönnies ↔ Tonnies (lệch dấu ö)\n3 dòng thương hiệu nhưng chỉ ghi 1 dòng quy cách (2 hãng sau sẽ bị trống)",
  },
  {
    id: "dishes-channels",
    title: "6. Phù hợp món & Phù hợp kênh quán",
    rule: "Liệt kê các món hoặc kênh quán cách nhau bằng dấu phẩy (,) hoặc chấm phẩy (;) thống nhất trên 1 dòng.",
    goodExample:
      "Phù hợp món: BBQ Hàn Quốc; Thịt kho tàu; Heo quay da giòn\nKênh quán: Cơm tấm, Nhà hàng lẩu nướng, Suất ăn",
    badExample:
      "Đánh số 1. 2. 3. lộn xộn hoặc thêm đoạn ghi chú dài trong ngoặc",
  },
  {
    id: "image-price-rtc",
    title: "7. Hình ảnh, Báo giá & 6 cột (RTC)",
    badge: "Chỉ nhận link",
    rule: "Hệ thống KHÔNG nhận hình ảnh chèn/dán trực tiếp vào ô Excel — chỉ đọc đường dẫn URL (https://...) ở cột 'Ảnh catalogue — đường dẫn tư liệu' (hoặc 'Ảnh hiển thị'). Nếu chưa có link cứ để trống rồi tải ảnh sau trên web. Cột Báo giá & 6 cột RTC không dùng thì để trống, không xóa cột.",
    goodExample:
      "Dán link: https://i.postimg.cc/.../ba-roi.webp\nHoặc để trống để tải ảnh sau tại trang Quản lý",
    badExample:
      "Insert / Copy-Paste ảnh trực tiếp vào ô Excel (ảnh sẽ bị bỏ qua)\nDán link Google Drive chưa mở công khai",
  },
];

export default function ExcelImportModal({
  isOpen,
  onClose,
  activeCategorySlug,
  onImportFile,
}: ExcelImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Reset trạng thái mỗi khi đóng/mở modal
  useEffect(() => {
    if (!isOpen) {
      setIsConfirmed(false);
      setSelectedFile(null);
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const suggestedGroup =
    (activeCategorySlug && CATEGORY_TO_GROUP_MAP[activeCategorySlug]) || "HEO";

  // Xuất file Excel mẫu 21 cột + 2 dòng ví dụ + Sheet Hướng dẫn
  const handleDownloadTemplate = () => {
    try {
      const sampleRows: Record<string, string | number>[] = [
        {
          STT: 1,
          "Tên sản phẩm báo giá":
            "BA RỌI RÚT SƯỜN (DÒNG MẪU - XÓA TRƯỚC KHI IMPORT)",
          Nhóm: suggestedGroup,
          "Tên tiếng Anh": "Frozen Pork Sheet Belly Boneless",
          "Phù hợp món":
            "BBQ Hàn Quốc; Thịt kho tàu; Heo quay da giòn; Rang cháy cạnh",
          "Quy cách sản phẩm & cắt hàng":
            "Bẹ phẳng 4-6kg; bào lát 1.5-2mm hoặc cắt khúc vuông 2-3cm",
          "Phân tích đặc điểm từng thương hiệu":
            "Seara da mỏng ít mỡ; Sadia vân nạc mỡ chuẩn 7:3",
          "Mức độ phổ biến trên thị trường": "Rất phổ biến",
          "Đặc điểm sản phẩm":
            "Rút xương sườn sạch sẽ, thớ thịt phẳng đẹp.\nNạc mỡ đan xen mềm mọng, không bị khô khi nướng.",
          "Phù hợp với kênh quán":
            "Cơm tấm, Nhà hàng lẩu nướng, Heo quay, Suất ăn",
          "Thương hiệu & Xuất xứ tham khảo": "Seara: Brazil\nSadia: Brazil",
          "Quy cách thùng/ theo nguồn": "Seara: ~20kg/thùng\nSadia: 20kg/thùng",
          "Báo giá": "",
          "Ảnh catalogue — đường dẫn tư liệu":
            "https://i.postimg.cc/fRJXH3LH/Ba-roi-rut-suon.jpg",
          "Ảnh hiển thị": "",
          "Mô tả sản phẩm (RTC)": "",
          "Thành phần (RTC)": "",
          "Cách dùng (RTC)": "",
          "Bảo quản (RTC)": "",
          "Lưu ý (RTC)": "",
          "Tiêu chí nổi bật (RTC)": "",
        },
        {
          STT: 2,
          "Tên sản phẩm báo giá":
            "Sốt Mayonnaise Siêu Tiết Kiệm (DÒNG MẪU - XÓA TRƯỚC KHI IMPORT)",
          Nhóm: "MAYONNAISE",
          "Tên tiếng Anh": "Economy Mayonnaise Sauce 1kg",
          "Phù hợp món":
            "Bánh mì thịt nguội; Khoai tây chiên; Gà rán; Salad; Pizza",
          "Quy cách sản phẩm & cắt hàng": "Khối lượng thực: 1 Kg / túi",
          "Phân tích đặc điểm từng thương hiệu": "",
          "Mức độ phổ biến trên thị trường": "Phổ biến",
          "Đặc điểm sản phẩm": "Độ sánh mịn chuẩn vị, vị béo ngậy hài hòa",
          "Phù hợp với kênh quán":
            "Quán bánh mì, Chuỗi thức ăn nhanh, Nhà hàng (Horeca)",
          "Thương hiệu & Xuất xứ tham khảo": "Uma Food: Việt Nam",
          "Quy cách thùng/ theo nguồn": "Uma Food: 1 Kg / túi",
          "Báo giá": "",
          "Ảnh catalogue — đường dẫn tư liệu": "",
          "Ảnh hiển thị": "",
          "Mô tả sản phẩm (RTC)":
            "Sốt Mayonnaise Siêu Tiết Kiệm Uma Food chuyên biệt cho quán bánh mì và chuỗi F&B.\nHương vị béo ngậy đặc trưng, tối ưu chi phí đầu vào.",
          "Thành phần (RTC)": "Dầu thực vật, nước, trứng gà, đường, muối, giấm",
          "Cách dùng (RTC)":
            "Quết trực tiếp lên bánh mì\nTrộn salad hoặc làm sốt chấm đồ chiên rán",
          "Bảo quản (RTC)":
            "Để nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp\nBảo quản ngăn mát tủ lạnh (2-6°C) sau khi mở bao bì",
          "Lưu ý (RTC)": "Thời hạn sử dụng: 12 tháng kể từ ngày sản xuất.",
          "Tiêu chí nổi bật (RTC)":
            "1. Siêu tiết kiệm chi phí: Túi 1kg tối ưu giá vốn từng phần ăn.\n2. Độ sánh mịn chuẩn vị: Dễ phết, không làm mềm vỏ bánh.\n3. An toàn tiện lợi: Dây chuyền sản xuất hiện đại.",
        },
      ];

      // Sheet 1: Dữ liệu mẫu chuẩn 21 cột
      const wsData = XLSX.utils.json_to_sheet(sampleRows, {
        header: [...EXCEL_HEADERS],
      });

      wsData["!cols"] = [
        { wch: 6 }, // STT
        { wch: 36 }, // Tên SP
        { wch: 14 }, // Nhóm
        { wch: 28 }, // Tên tiếng Anh
        { wch: 34 }, // Phù hợp món
        { wch: 32 }, // Quy cách cắt hàng
        { wch: 32 }, // Phân tích thương hiệu
        { wch: 18 }, // Phổ biến
        { wch: 34 }, // Đặc điểm
        { wch: 28 }, // Kênh quán
        { wch: 26 }, // Thương hiệu & Xuất xứ
        { wch: 26 }, // Quy cách thùng
        { wch: 14 }, // Báo giá
        { wch: 38 }, // Ảnh URL
        { wch: 14 }, // Ảnh hiển thị
        { wch: 38 }, // Mô tả (RTC)
        { wch: 28 }, // Thành phần (RTC)
        { wch: 32 }, // Cách dùng (RTC)
        { wch: 32 }, // Bảo quản (RTC)
        { wch: 28 }, // Lưu ý (RTC)
        { wch: 42 }, // Tiêu chí nổi bật (RTC)
      ];

      // Sheet 2: Hướng dẫn tóm tắt ngay trong file Excel
      const guideRows = [
        ["QUY ƯỚC NHẬP LIỆU FILE EXCEL IMPORT - KHÁNH AN FOODS", "", ""],
        ["Cột / Nhóm cột", "Yêu cầu", "Hướng dẫn & Ví dụ chuẩn"],
        [
          "Tên sản phẩm báo giá, Nhóm",
          "Bắt buộc",
          "Không để trống. Cột Nhóm viết IN HOA đồng nhất (VD: HEO, BÒ, GÀ, THANH CUA, BIA, MAYONNAISE).",
        ],
        [
          "Mô tả sản phẩm (RTC), Đặc điểm sản phẩm",
          "Tùy chọn",
          "Bấm Alt + Enter (Windows) hoặc Option + Enter (Mac) để xuống dòng tách đoạn.",
        ],
        [
          "Tiêu chí nổi bật, Cách dùng, Bảo quản (RTC)",
          "Tùy chọn",
          "Tách từng mục bằng Alt + Enter hoặc dấu ';'. Khoảng số viết liền (VD: 3-5 phút, 0-4°C).",
        ],
        [
          "Thương hiệu & Xuất xứ tham khảo",
          "Nên có",
          "Mỗi thương hiệu 1 dòng riêng theo cú pháp 'Tên hãng: Xuất xứ'. Không gộp 2 hãng cùng 1 dòng.",
        ],
        [
          "Quy cách thùng/ theo nguồn",
          "Nên có",
          "Tên hãng trước dấu ':' phải trùng khớp 100% với cột Thương hiệu (VD: Tonnies: 10kg/thùng).",
        ],
        [
          "Ảnh catalogue — đường dẫn tư liệu / Ảnh hiển thị",
          "Chỉ nhận link",
          "Chỉ nhận đường dẫn URL (https://...). Ảnh chèn/dán trực tiếp vào ô Excel sẽ bị bỏ qua — nếu chưa có link, để trống và upload ảnh sau trên trang Quản lý.",
        ],
        [
          "LƯU Ý & CẢNH BÁO QUAN TRỌNG",
          "Bắt buộc",
          "1) Trùng tên sản phẩm sẽ tự cập nhật đè. 2) Xóa 2 dòng mẫu & mọi dòng ghi chú cuối bảng. 3) Không đổi tên hoặc xóa 21 cột tiêu đề dòng 1.",
        ],
        [
          "CẢNH BÁO QUAN TRỌNG",
          "Bắt buộc",
          "1) Xóa 2 dòng ví dụ mẫu trước khi upload. 2) Xóa mọi dòng 'Ghi chú' ở cuối bảng. 3) Không xóa/đổi tên 21 cột tiêu đề ở dòng 1.",
        ],
      ];

      const wsGuide = XLSX.utils.aoa_to_sheet(guideRows);
      wsGuide["!cols"] = [{ wch: 38 }, { wch: 14 }, { wch: 80 }];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsData, "Sheet1");
      XLSX.utils.book_append_sheet(wb, wsGuide, "Huong_Dan");

      const fileSuffix = activeCategorySlug ? `_${suggestedGroup}` : "";
      XLSX.writeFile(wb, `Mau_Import_SanPham_KhanhAn${fileSuffix}.xlsx`);
      toast.success("Đã tải xuống file Excel mẫu chuẩn 21 cột!");
    } catch (err) {
      console.error("Lỗi tạo file Excel mẫu:", err);
      toast.error("Không thể tạo file Excel mẫu. Vui lòng thử lại!");
    }
  };

  // Chọn file .xlsx / .xls
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValidExcel =
      file.name.toLowerCase().endsWith(".xlsx") ||
      file.name.toLowerCase().endsWith(".xls");

    if (!isValidExcel) {
      toast.error("Vui lòng chỉ chọn file Excel định dạng .xlsx hoặc .xls!");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
  };

  // Bấm nút Import ở góc phải Footer
  const handleImportButtonClick = async () => {
    if (!isConfirmed || isUploading) return;

    // Nếu chưa chọn file -> mở hộp thoại chọn file
    if (!selectedFile) {
      fileInputRef.current?.click();
      return;
    }

    // Đã chọn file -> tiến hành upload lên API
    try {
      setIsUploading(true);
      await onImportFile(selectedFile);
      onClose();
    } catch {
      // Lỗi đã được toast ở hàm cha, giữ nguyên modal để user kiểm tra lại
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div
      onClick={() => !isUploading && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
    >
      {/* MODAL CỠ LỚN (Đồng bộ kích thước với ProductDetailModal) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-6xl h-[90vh] max-h-[880px] rounded-3xl shadow-2xl overflow-hidden border border-amber-200/80 flex flex-col"
      >
        {/* HEADER */}
        <div className="bg-gradient-to-r from-gray-900 via-[#4A2E16] to-gray-900 text-white px-6 py-5 flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-[#ECA921]/15 border border-[#ECA921]/40 flex items-center justify-center shrink-0">
              <IconFileSpreadsheet className="w-6 h-6 text-[#ECA921]" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#ECA921] bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                Chuẩn bị dữ liệu trước khi Import
              </span>
              <h2 className="text-lg sm:text-xl font-black text-amber-100 mt-1 truncate uppercase">
                Hướng dẫn, Quy ước & Tải File Excel Mẫu
              </h2>
            </div>
          </div>

          <button
            type="button"
            disabled={isUploading}
            onClick={onClose}
            className="cursor-pointer p-2 rounded-full bg-white/10 hover:bg-amber-500/20 text-gray-300 hover:text-white transition-colors disabled:opacity-40"
          >
            <IconX className="w-6 h-6" />
          </button>
        </div>

        {/* BODY CUỘN ĐỘC LẬP */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-gray-50/60">
          {/* KHỐI 1: TẢI FILE EXCEL MẪU */}
          <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/70 border border-amber-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#ECA921] text-white text-xs font-extrabold">
                  1
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-[#4A2E16]">
                  Tải file Excel mẫu chuẩn (21 cột)
                </h3>
                {activeCategorySlug && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-[#4A2E16] border border-amber-300/60">
                    Đang gợi ý nhóm: {suggestedGroup}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed pl-8">
                File bao gồm đầy đủ <strong>21 cột tiêu đề chuẩn</strong>, kèm{" "}
                <strong>2 dòng ví dụ</strong> (1 dòng Thịt/B2B và 1 dòng
                RTC/Sốt) và <strong>Sheet Huong_Dan</strong> để nhân viên nhập
                liệu đối chiếu trực tiếp.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="cursor-pointer shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#4A2E16] hover:bg-gray-800 text-white text-xs font-bold shadow-md transition-all"
            >
              <IconDownload className="w-4 h-4 text-[#ECA921]" />
              <span>Tải file Excel mẫu (.xlsx)</span>
            </button>
          </div>

          {/* KHỐI 2: QUY ƯỚC NHẬP LIỆU & VÍ DỤ ĐÚNG / SAI */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#ECA921] text-white text-xs font-extrabold">
                  2
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-[#4A2E16]">
                  Quy ước nhập liệu & Các lỗi thực tế thường gặp
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500">
                <IconInfoCircle className="w-4 h-4 text-[#ECA921]" />
                Xuống dòng trong 1 ô Excel: <strong>Alt + Enter</strong> (Win) /{" "}
                <strong>Option + Enter</strong> (Mac)
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
              {IMPORT_RULES.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-200/90 p-4 shadow-2xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-extrabold text-[#4A2E16]">
                        {item.title}
                      </h4>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                            item.badge === "Bắt buộc" ||
                            item.badge === "Rất dễ lỗi"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-[#4A2E16]"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {item.rule}
                    </p>
                  </div>

                  {/* SO SÁNH ĐÚNG / SAI */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div className="rounded-xl bg-emerald-50/80 border border-emerald-200/80 p-2.5 space-y-1">
                      <div className="flex items-center gap-1 font-extrabold text-emerald-700">
                        <IconCheck className="w-3.5 h-3.5 stroke-[3]" />
                        <span>NÊN NHẬP (ĐÚNG)</span>
                      </div>
                      <p className="text-emerald-950 font-medium whitespace-pre-line leading-relaxed">
                        {item.goodExample}
                      </p>
                    </div>

                    <div className="rounded-xl bg-red-50/70 border border-red-200/80 p-2.5 space-y-1">
                      <div className="flex items-center gap-1 font-extrabold text-red-700">
                        <IconX className="w-3.5 h-3.5 stroke-[3]" />
                        <span>TRÁNH (DỄ LỖI)</span>
                      </div>
                      <p className="text-red-950 font-medium whitespace-pre-line leading-relaxed">
                        {item.badExample}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KHỐI 3: LƯU Ý & CẢNH BÁO QUAN TRỌNG */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-red-700">
              <IconAlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-extrabold uppercase tracking-wide">
                3. Lưu ý &amp; Cảnh báo bắt buộc kiểm tra trước khi Import
              </h3>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs text-red-950 font-medium list-disc list-inside marker:text-red-500">
              <li>
                <strong>Không nhận hình ảnh dán trực tiếp trong Excel:</strong>{" "}
                Hệ thống chỉ nhận đường dẫn ảnh (<code>https://...</code>) dạng
                chữ. Ảnh chèn đè lên ô sẽ bị bỏ qua — nếu chưa có link, cứ để
                trống rồi vào trang <em>Quản lý</em> bấm lọc{" "}
                <strong>&quot;Chưa có hình&quot;</strong> để tải ảnh lên sau.
              </li>
              <li>
                <strong>Trùng tên sản phẩm sẽ tự cập nhật đè:</strong> Nếu cột{" "}
                <em>&quot;Tên sản phẩm báo giá&quot;</em> trùng với sản phẩm đã
                có trên hệ thống, dữ liệu mới trong file Excel sẽ ghi đè lên sản
                phẩm cũ.
              </li>
              <li>
                <strong>Xóa sạch dòng mẫu &amp; dòng ghi chú cuối bảng:</strong>{" "}
                Nhớ xóa 2 dòng ví dụ mẫu và mọi dòng ghi chú tự do dưới cùng
                file (như <em>&quot;Ghi chú&quot;</em>,{" "}
                <em>&quot;Ăn vặt gồm...&quot;</em>) để tránh báo lỗi hoặc tạo dữ
                liệu rác.
              </li>
              <li>
                <strong>Giữ nguyên 21 tiêu đề cột ở dòng 1:</strong> Không sửa
                tên cột, không xóa cột trống (kể cả khi không dùng 6 cột RTC),
                không gộp ô (Merge cells).
              </li>
            </ul>
          </div>
        </div>

        {/* FOOTER CỐ ĐỊNH: BÊN TRÁI LÀ NÚT XÁC NHẬN MỞ KHÓA, GÓC PHẢI LÀ NÚT IMPORT */}
        <div className="bg-white border-t border-amber-100 px-5 sm:px-6 py-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 shrink-0">
          {/* INPUT FILE ẨN */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* BÊN TRÁI: NÚT XÁC NHẬN MỞ KHÓA NÚT IMPORT */}
          <label
            className={`cursor-pointer select-none flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${
              isConfirmed
                ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                : "bg-amber-50/70 border-amber-200 text-[#4A2E16] hover:bg-amber-100/60"
            }`}
          >
            <input
              type="checkbox"
              checked={isConfirmed}
              disabled={isUploading}
              onChange={(e) => {
                setIsConfirmed(e.target.checked);
                if (!e.target.checked) {
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }
              }}
              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer shrink-0"
            />
            <span className="text-xs font-bold leading-snug">
              Tôi đã đọc kỹ quy ước nhập liệu, xóa dòng mẫu &amp; dòng ghi chú
              thừ<a href=""></a>
              <span
                className={isConfirmed ? "text-emerald-700" : "text-[#ECA921]"}
              ></span>
            </span>
          </label>

          {/* GÓC PHẢI: HIỂN THỊ FILE ĐÃ CHỌN (NẾU CÓ) + NÚT IMPORT */}
          <div className="flex flex-wrap items-center justify-end gap-2.5">
            {selectedFile && isConfirmed && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 border border-gray-200 text-xs max-w-[260px]">
                <IconFileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <p
                    title={selectedFile.name}
                    className="font-bold text-gray-800 truncate"
                  >
                    {selectedFile.name}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  title="Bỏ chọn file"
                  className="cursor-pointer p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <IconTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              type="button"
              disabled={isUploading}
              onClick={onClose}
              className="cursor-pointer px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors disabled:opacity-40"
            >
              Đóng
            </button>

            <button
              type="button"
              disabled={!isConfirmed || isUploading}
              onClick={handleImportButtonClick}
              className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md ${
                !isConfirmed
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                  : selectedFile
                    ? "cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "cursor-pointer bg-[#ECA921] hover:bg-[#D89512] text-white"
              }`}
            >
              {isUploading ? (
                <>
                  <IconLoader2 className="w-4 h-4 animate-spin" />
                  <span>Đang Import dữ liệu...</span>
                </>
              ) : !isConfirmed ? (
                <>
                  <IconLock className="w-4 h-4" />
                  <span>Import Excel (Đang khóa)</span>
                </>
              ) : selectedFile ? (
                <>
                  <IconUpload className="w-4 h-4" />
                  <span>Xác nhận tải file lên</span>
                </>
              ) : (
                <>
                  <IconLockOpen className="w-4 h-4" />
                  <span>Chọn file Import Excel</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
