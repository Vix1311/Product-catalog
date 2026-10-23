"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  IconArrowLeft,
  IconCalendar,
  IconClock,
  IconUser,
  IconShare,
  IconCheck,
  IconChevronRight,
  IconFlame,
  IconBulb,
  IconPhoneCall,
  IconBook,
  IconTag,
} from "@tabler/icons-react";
import Footer from "@/components/Footer";
import StickyHeader from "@/components/StickyHeader";
import { logoutApi } from "@/app/services/auth.service";

interface BlogPostDetail {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  authorRole: string;
  imageUrl: string;
  tags: string[];
  keyTakeaways: string[];
  sections: {
    heading: string;
    content: string[];
    highlightBox?: string;
  }[];
  comparisonTable?: {
    headers: string[];
    rows: string[][];
  };
}

// Dữ liệu chi tiết cho đủ 5 bài viết từ trang danh sách Blog
const BLOG_DETAILS: Record<string, BlogPostDetail> = {
  "1": {
    id: "1",
    title:
      "Cách Phân Biệt Các Phần Thịt Bò Nhập Khẩu Mỹ & Úc Cho Quán Lẩu Nướng",
    excerpt:
      "Hướng dẫn chi tiết cách chọn Ba chỉ bò (Short Plate), Đầu thăn ngoại (Ribeye) và Lõi vai (Top Blade) giúp tối ưu chi phí cốt (Food Cost) mà vẫn giữ trọn độ mềm ngọt cho thực khách.",
    category: "Kiến Thức Nguyên Liệu",
    date: "20/10/2026",
    readTime: "6 phút đọc",
    author: "Ban Chuyên Gia Thực Phẩm",
    authorRole: "Khánh An Foods R&D",
    imageUrl:
      "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1200&auto=format&fit=crop",
    tags: [
      "Thịt bò nhập khẩu",
      "Bò Mỹ Swift",
      "Bò Úc Kilcoy",
      "Menu Lẩu Nướng",
      "Food Cost",
    ],
    keyTakeaways: [
      "Bò Mỹ (Grain-fed - ăn ngũ cốc) có vân mỡ cẩm thạch dày, độ béo thơm cao, cực kỳ hợp nướng BBQ và nhúng lẩu.",
      "Bò Úc (Grass-fed / Grain-fed) có thớ thịt săn chắc, vị ngọt đậm đà tự nhiên và mức giá sỉ tối ưu cho quán buffet.",
      "Chọn đúng quy cách cắt (1.5mm cho lẩu và 4mm - 6mm cho nướng) giúp giảm tới 12% tỷ lệ hao hụt nguyên liệu tại bếp.",
    ],
    sections: [
      {
        heading:
          "1. Vì sao việc chọn đúng phần thịt quyết định lợi nhuận quán?",
        content: [
          "Trong mô hình kinh doanh nhà hàng Lẩu - Nướng (Hotpot & BBQ) hoặc Buffet, chi phí nguyên liệu thịt bò thường chiếm từ 35% - 45% tổng giá vốn hàng bán (COGS). Nếu chọn sai phần thịt hoặc sai thương hiệu, nhà hàng rất dễ rơi vào tình trạng thịt bị khô xác khi nướng hoặc vụn nát khi nhúng lẩu.",
          "Tại Khánh An Foods, chúng tôi phân loại rõ từng dòng thịt theo mục đích chế biến của bếp để chủ quán dễ dàng lên định lượng chuẩn ngay từ đầu.",
        ],
      },
      {
        heading: "2. Top 3 phần thịt bò 'Vua doanh số' cho kênh HORECA",
        content: [
          "• Ba chỉ bò Mỹ (Short Plate): Phần thịt lấy từ bụng bò với các dải mỡ và nạc xen kẽ đều đặn. Khi bào mỏng 1.5mm - 2mm nhúng lẩu hoặc cuộn nấm kim châm nướng, phần mỡ tan chảy nhẹ giúp miếng thịt mềm mọng, không bao giờ bị ngấy.",
          "• Lõi nạc vai (Top Blade / Oyster Blade): Nằm ở vùng vai cổ, đặc trưng bởi một đường gân giòn sần sật chạy dọc chính giữa thớ thịt. Đây là phần thịt đa năng nhất: vừa cắt lát nướng tảng sốt tiêu đen, vừa áp chảo Steak giá tầm trung cực kỳ hút khách.",
          "• Gầu bò (Brisket) & Bắp bò (Shin/Shank): Lựa chọn số 1 cho các quán Phở truyền thống, Lẩu bò Tứ Xuyên hoặc Lẩu Hồng Kông nhờ độ giòn sần sật đặc trưng, càng ninh hoặc nhúng đúng độ càng dậy mùi thơm.",
        ],
        highlightBox:
          "Mẹo từ Bếp trưởng: Đối với mô hình Buffet tầm giá 199k - 299k, hãy kết hợp 60% Ba chỉ bò Mỹ + 40% Lõi vai hoặc Bắp bò Úc để cân bằng hoàn hảo giữa trải nghiệm độ mềm béo và bài toán chi phí cốt.",
      },
      {
        heading: "3. Tiêu chuẩn bảo quản và cắt thái tại Khánh An Foods",
        content: [
          "Toàn bộ các thùng thịt nguyên đai nguyên kiện từ các thương hiệu lớn như Swift, Excel (Mỹ) hay Kilcoy, JBS (Úc) đều được bảo quản xuyên suốt ở nhiệt độ chuẩn -18°C.",
          "Trước khi đưa vào máy cắt công nghiệp, khối thịt được hạ nhiệt chuẩn về mức -4°C đến -2°C để lát cắt phẳng mịn, cuộn tròn đẹp mắt khi bày lên khay mà không làm rách cấu trúc màng tế bào của thịt.",
        ],
      },
    ],
    comparisonTable: {
      headers: [
        "Phần thịt",
        "Xuất xứ phổ biến",
        "Độ dày cắt chuẩn",
        "Ứng dụng tối ưu",
      ],
      rows: [
        [
          "Ba chỉ bò (Short Plate)",
          "Mỹ / Nga",
          "1.5mm - 2.0mm",
          "Nhúng lẩu, Nướng cuộn, Bò nhúng giấm",
        ],
        [
          "Lõi nạc vai (Top Blade)",
          "Mỹ / Úc",
          "4.0mm - 15mm",
          "Nướng BBQ, Bít tết (Steak), Lúc lắc",
        ],
        [
          "Bắp hoa / Bắp rùa",
          "Úc / Mỹ",
          "1.5mm - 3.0mm",
          "Lẩu nhúng, Gỏi bò, Phở cao cấp",
        ],
        [
          "Dẻ sườn bò (Rib Finger)",
          "Mỹ / Úc",
          "Cắt khúc / Xẻ bướm",
          "Nướng Hàn Quốc, Hầm rượu vang, Kho",
        ],
      ],
    },
  },
  "2": {
    id: "2",
    title: "Quy Trình Rã Đông Thịt Cấp Đông Chuẩn Nhà Hàng Không Bị Mất Nước",
    excerpt:
      "Mẹo rã đông chậm trong mát từ 0°C - 4°C giúp giữ nguyên cấu trúc sợi cơ, màu sắc đỏ tươi và độ ngọt tự nhiên của thịt nhập khẩu.",
    category: "Kinh Nghiệm Bếp B2B",
    date: "16/10/2026",
    readTime: "4 phút đọc",
    author: "Kỹ Sư Công Nghệ Thực Phẩm",
    authorRole: "Khánh An Quality Control",
    imageUrl:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=1200&auto=format&fit=crop",
    tags: [
      "Rã đông chuẩn",
      "Bảo quản kho lạnh",
      "Vệ sinh ATTP",
      "Kinh nghiệm bếp",
    ],
    keyTakeaways: [
      "Tuyệt đối không rã đông thịt nhập khẩu bằng nước nóng hoặc để ngoài nhiệt độ phòng quá 2 giờ.",
      "Rã đông chậm trong tủ mát (Chiller 0°C - 4°C) trước 12 - 24 tiếng giúp tế bào thịt tái hấp thu dịch ngọt, giảm hao hụt trọng lượng.",
      "Giữ nguyên túi hút chân không trong suốt quá trình rã đông để ngăn vi khuẩn xâm nhập và tránh oxy hóa làm thâm bề mặt thịt.",
    ],
    sections: [
      {
        heading:
          "1. Sai lầm phổ biến khiến thịt nhập khẩu bị chảy nước đỏ (Drip Loss)",
        content: [
          "Nhiều nhân viên bếp khi cần hàng gấp thường ngâm trực tiếp khối thịt đông lạnh vào nước thường hoặc để ngoài không khí nóng. Sự chênh lệch nhiệt độ đột ngột làm các tinh thể băng bên trong đâm thủng màng tế bào sợi cơ.",
          "Hệ quả là khi thịt mềm ra, toàn bộ nước ngọt (Myoglobin) chảy ra ngoài khay, khiến miếng thịt sau khi chế biến bị khô, bã và hao hụt từ 8% - 15% trọng lượng thực tế.",
        ],
      },
      {
        heading: "2. Quy trình 3 bước rã đông chuẩn 5 sao cho bếp nhà hàng",
        content: [
          "• Bước 1 - Lên kế hoạch xuất kho: Chuyển phần thịt cần dùng cho ngày hôm sau từ tủ đông (-18°C) sang tủ mát Chiller (0°C đến 4°C) trước 12 - 18 tiếng tùy trọng lượng khối thịt.",
          "• Bước 2 - Đặt trên vỉ ráo nước: Đặt nguyên túi thịt còn hút chân không lên khay có vỉ lưới lót dưới để không khí lạnh lưu thông đều xung quanh.",
          "• Bước 3 - Thấm khô bề mặt: Sau khi mở túi hút chân không, dùng giấy thấm chuyên dụng thấm nhẹ bề mặt thịt rồi để thịt 'thở' khoảng 10 phút sẽ giúp màu đỏ cherry tươi rói trở lại.",
        ],
        highlightBox:
          "Lưu ý quan trọng: Đối với thịt đã cắt lát mỏng dùng cho Lẩu/Nướng, bạn KHÔNG cần rã đông hoàn toàn. Chỉ cần lấy ra trước 10 - 15 phút để lát thịt hơi mềm nhưng vẫn giữ form cuộn tròn đẹp mắt trên đĩa.",
      },
    ],
  },
  "3": {
    id: "3",
    title:
      "Surimi & Chả Mực Hạ Long: Giải Pháp Thực Đơn Hút Khách Cho Chuỗi Lẩu",
    excerpt:
      "Tại sao các dòng viên thả lẩu cao cấp và chả mực giã tay lại trở thành món gọi thêm (Add-on) mang lại biên lợi nhuận cao nhất cho các quán lẩu hiện nay?",
    category: "Xu Hướng Ẩm Thực",
    date: "12/10/2026",
    readTime: "5 phút đọc",
    author: "Chuyên Viên Tư Vấn Menu",
    authorRole: "Khánh An HORECA Team",
    imageUrl:
      "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1200&auto=format&fit=crop",
    tags: ["Surimi", "Chả mực Hạ Long", "Viên thả lẩu", "Menu quán lẩu"],
    keyTakeaways: [
      "Nhóm món thả lẩu Surimi và Chả mực có tỷ lệ hao hụt gần như bằng 0%, bảo quản dễ và lên món trong 30 giây.",
      "Biên lợi nhuận gộp của các set viên thả lẩu tổng hợp thường đạt từ 60% - 70%.",
      "Kết hợp hàng đặc sản truyền thống (Chả mực Hạ Long) cùng viên nhân phô mai/trứng cá giúp giữ chân cả nhóm khách gia đình lẫn giới trẻ.",
    ],
    sections: [
      {
        heading: "1. Sức hút từ nhóm món gọi thêm (Add-on Menu) trong quán lẩu",
        content: [
          "Bên cạnh thịt bò nhập khẩu là món chính kéo khách, các đĩa viên thả lẩu Surimi, đậu hũ phô mai, thanh cua và Chả mực Hạ Long chính là 'vũ khí' gia tăng giá trị hóa đơn trung bình (Upsell) hiệu quả nhất.",
          "Ưu điểm lớn nhất đối với vận hành bếp là không cần rã đông lâu, không tốn nhân công sơ chế và định lượng theo từng viên cực kỳ chính xác.",
        ],
      },
      {
        heading: "2. Gợi ý thiết kế Combo Thả Lẩu bán chạy nhất",
        content: [
          "• Combo Gia Đình Truyền Thống: Chả mực giã tay Hạ Long + Bò viên gân + Chả cá thác lác tươi.",
          "• Combo Giới Trẻ Hiện Đại: Viên bao tâm trứng cá chuồn + Đậu hũ hải sản phô mai + Thanh cua Surimi tuyết.",
        ],
        highlightBox:
          "Khánh An Foods cung cấp đầy đủ các dòng Surimi nhập khẩu & nội địa đạt chuẩn xuất khẩu với quy cách đóng gói 500g - 1kg tiện lợi cho từng ca bán hàng của quán.",
      },
    ],
  },
};

export default function BlogDetailPage() {
  const params = useParams();
  const postId = typeof params?.id === "string" ? params.id : "1";

  // Lấy bài viết theo ID trên URL, nếu ID là 4 hoặc 5 chưa có chi tiết riêng thì hiển thị mẫu đầy đủ kết hợp thông tin bài đó
  const post: BlogPostDetail = BLOG_DETAILS[postId] || {
    ...BLOG_DETAILS["1"],
    id: postId,
  };

  const relatedPosts = Object.values(BLOG_DETAILS).filter(
    (item) => item.id !== post.id,
  );

  const [copiedQuote, setCopiedQuote] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Hàm xử lý bấm tư vấn báo giá qua Zalo (tự copy + bật App Zalo)
  const handleZaloConsult = async () => {
    const zaloNumber = "0399829074";
    const message = `Xin chào Khánh An Foods, tôi vừa đọc bài viết "${post.title}" trên website và muốn nhận bảng báo giá sỉ các mặt hàng liên quan. Nhờ shop tư vấn giúp tôi nhé!`;

    try {
      await navigator.clipboard.writeText(message);
      setCopiedQuote(true);
      setTimeout(() => setCopiedQuote(false), 5000);
    } catch (err) {
      console.error("Không thể copy tự động:", err);
    }

    setTimeout(() => {
      window.location.href = `zalo://conversation?phone=${zaloNumber}`;
      setTimeout(() => {
        if (document.hasFocus()) {
          window.open(`https://zalo.me/${zaloNumber}`, "_blank");
        }
      }, 1500);
    }, 600);
  };

  const handleShareLink = async () => {
    if (typeof window !== "undefined") {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

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

  return (
    <div>
      <StickyHeader isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <div className="min-h-screen bg-[#FAF8F5] text-gray-800 pb-20">
        {/* 🎯 BANNER ĐẦU TRANG CHUẨN PHONG CÁCH HÌNH 2 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div
            className="w-full rounded-[28px] py-10 sm:py-14 px-6 sm:px-12 shadow-2xl border border-amber-500/20 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(90deg, #0B0F17 0%, #1F150D 25%, #4A2809 50%, #1F150D 75%, #0B0F17 100%)",
            }}
          >
            {/* Điều hướng Breadcrumb */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#ECA921] hover:text-amber-300 bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-amber-500/30 transition-colors"
              >
                <IconArrowLeft className="w-4 h-4" /> Quay lại danh sách Blog
              </Link>

              <div className="inline-block px-3.5 py-1 rounded-full border border-[#ECA921]/40 bg-[#ECA921]/10">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#ECA921]">
                  {post.category}
                </span>
              </div>
            </div>

            {/* Tiêu đề bài viết */}
            <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-black text-[#FFF3D1] leading-tight max-w-4xl">
              {post.title}
            </h1>

            {/* Thông tin tác giả & ngày đăng */}
            <div className="mt-6 pt-5 border-t border-amber-500/20 flex flex-wrap items-center gap-6 text-xs text-gray-300">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#ECA921] text-gray-950 font-black flex items-center justify-center">
                  KA
                </div>
                <div>
                  <div className="font-bold text-amber-100">{post.author}</div>
                  <div className="text-[11px] text-gray-400">
                    {post.authorRole}
                  </div>
                </div>
              </div>

              <span className="flex items-center gap-1.5">
                <IconCalendar className="w-4 h-4 text-[#ECA921]" />
                Ngày đăng: <strong className="text-white">{post.date}</strong>
              </span>

              <span className="flex items-center gap-1.5">
                <IconClock className="w-4 h-4 text-[#ECA921]" />
                Thời lượng:{" "}
                <strong className="text-white">{post.readTime}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* BỐ CỤC CHÍNH: 8 CỘT NỘI DUNG + 4 CỘT SIDEBAR */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* CỘT TRÁI (8 CỘT): NỘI DUNG BÀI VIẾT */}
            <article className="lg:col-span-8 bg-white rounded-3xl shadow-sm border border-amber-100 overflow-hidden">
              {/* Ảnh bìa bài viết */}
              <div className="h-64 sm:h-96 w-full overflow-hidden bg-gray-900 border-b border-amber-100">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 sm:p-10 space-y-8">
                {/* Đoạn mở đầu (Sapo) */}
                <p className="text-base sm:text-lg font-bold text-gray-900 leading-relaxed border-l-4 border-[#ECA921] pl-4 bg-amber-50/40 py-3 rounded-r-xl">
                  {post.excerpt}
                </p>

                {/* Hộp Điểm Chính (Key Takeaways) */}
                <div className="bg-gradient-to-br from-amber-50/90 to-amber-100/40 border border-amber-200 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#8C5210]">
                    <IconFlame className="w-4 h-4 text-[#ECA921]" />
                    Tóm tắt nội dung quan trọng
                  </div>
                  <ul className="space-y-2.5">
                    {post.keyTakeaways.map((point, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-gray-800 leading-relaxed"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#ECA921] text-gray-950 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Các phần nội dung chi tiết */}
                <div className="space-y-8">
                  {post.sections.map((sec, idx) => (
                    <div key={idx} id={`section-${idx}`} className="space-y-4">
                      <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                        {sec.heading}
                      </h2>
                      {sec.content.map((para, pIdx) => (
                        <p
                          key={pIdx}
                          className="text-sm sm:text-base text-gray-700 leading-relaxed"
                        >
                          {para}
                        </p>
                      ))}

                      {sec.highlightBox && (
                        <div className="bg-gray-900 text-amber-100 p-5 rounded-2xl border border-amber-500/30 flex items-start gap-3.5 shadow-md my-4">
                          <IconBulb className="w-6 h-6 text-[#ECA921] shrink-0 mt-0.5" />
                          <p className="text-xs sm:text-sm leading-relaxed font-medium">
                            {sec.highlightBox}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bảng So Sánh Thông Số (Nếu có) */}
                {post.comparisonTable && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-lg font-black text-gray-900">
                      Bảng Tra Cứu Nhanh Quy Cách Cho Bếp Nhà Hàng
                    </h3>
                    <div className="border border-amber-200 rounded-2xl overflow-hidden shadow-xs overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm divide-y divide-gray-200">
                        <thead className="bg-[#ECA921]/20 font-extrabold text-[#4A2E16]">
                          <tr>
                            {post.comparisonTable.headers.map((h, i) => (
                              <th key={i} className="p-3.5 whitespace-nowrap">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {post.comparisonTable.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-amber-50/40">
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className={`p-3.5 ${
                                    cIdx === 0
                                      ? "font-bold text-gray-900"
                                      : "text-gray-700 font-medium"
                                  }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Chân bài viết: Tags & Chia sẻ */}
                <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                      <IconTag className="w-4 h-4 text-[#ECA921]" /> Từ khóa:
                    </span>
                    {post.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs font-semibold bg-amber-50 text-[#8C5210] border border-amber-200/70 px-3 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleShareLink}
                    className="cursor-pointer px-4 py-2 rounded-xl bg-gray-100 hover:bg-amber-100 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    {copiedLink ? (
                      <>
                        <IconCheck className="w-4 h-4 text-emerald-600" /> Đã
                        sao chép link!
                      </>
                    ) : (
                      <>
                        <IconShare className="w-4 h-4 text-[#B8731B]" /> Chia sẻ
                        bài viết
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>

            {/* CỘT PHẢI (4 CỘT): SIDEBAR MỤC LỤC & NHẬN BÁO GIÁ SỈ */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
              {/* 1. Mục lục bài viết */}
              <div className="bg-white rounded-2xl p-6 border border-amber-200/60 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-900 pb-3 border-b border-gray-100">
                  <IconBook className="w-4 h-4 text-[#ECA921]" />
                  Nội dung chính trong bài
                </div>
                <ul className="mt-4 space-y-2.5 text-xs font-semibold text-gray-600">
                  {post.sections.map((sec, idx) => (
                    <li key={idx}>
                      <a
                        href={`#section-${idx}`}
                        className="flex items-center gap-2 hover:text-[#B8731B] transition-colors py-1"
                      >
                        <IconChevronRight className="w-3.5 h-3.5 text-[#ECA921] shrink-0" />
                        <span className="line-clamp-1">{sec.heading}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 2. Thẻ Đặt Hàng / Báo Giá B2B qua Zalo */}
              <div
                className="rounded-3xl p-6 text-white shadow-xl border border-amber-500/30 space-y-4 relative"
                style={{
                  background:
                    "linear-gradient(145deg, #0B0F17 0%, #3A2008 60%, #0B0F17 100%)",
                }}
              >
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#ECA921] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  KHÁNH AN B2B WHOLESALE
                </span>
                <h3 className="text-xl font-black text-[#FFF3D1] leading-snug">
                  Cần Báo Giá Sỉ Nguyên Liệu Trong Bài Viết?
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Nhận ngay bảng giá thùng ưu đãi cho nhà hàng, quán lẩu nướng
                  kèm chính sách cắt thái theo yêu cầu.
                </p>

                {/* Thông báo khi đã copy */}
                {copiedQuote && (
                  <div className="bg-emerald-950/90 border border-emerald-400/50 text-emerald-200 text-[11px] p-3 rounded-xl flex items-center gap-2">
                    <IconCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Đã chép nội dung! Hãy nhấn <strong>Ctrl + V (Dán)</strong>{" "}
                      vào Zalo.
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleZaloConsult}
                  className={`w-full cursor-pointer py-3 px-4 rounded-xl text-xs font-extrabold transition-all shadow-lg flex items-center justify-center gap-2 ${
                    copiedQuote
                      ? "bg-emerald-500 text-white"
                      : "bg-[#ECA921] hover:bg-[#D89512] text-gray-950"
                  }`}
                >
                  <IconPhoneCall className="w-4 h-4" />
                  {copiedQuote
                    ? "Đã sao chép! Đang mở Zalo..."
                    : "Nhận Báo Giá Qua Zalo Ngay"}
                </button>

                <Link
                  href="/san-pham"
                  className="block text-center w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-amber-100 border border-white/15 transition-colors"
                >
                  Mở Catalog Sản Phẩm
                </Link>
              </div>

              {/* 3. Bài viết liên quan */}
              <div className="bg-white rounded-2xl p-6 border border-amber-200/60 shadow-sm space-y-4">
                <div className="text-xs font-black uppercase tracking-wider text-gray-900 pb-3 border-b border-gray-100">
                  Bài viết cùng chủ đề
                </div>
                <div className="space-y-4">
                  {relatedPosts.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/blog/${rel.id}`}
                      className="flex gap-3.5 group items-center"
                    >
                      <img
                        src={rel.imageUrl}
                        alt={rel.title}
                        className="w-20 h-16 rounded-xl object-cover shrink-0 border border-amber-100 group-hover:scale-105 transition-transform"
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#B8731B]">
                          {rel.category}
                        </span>
                        <h4 className="text-xs font-extrabold text-gray-900 line-clamp-2 group-hover:text-[#ECA921] transition-colors">
                          {rel.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
