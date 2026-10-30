"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  IconArrowLeft,
  IconCalendar,
  IconClock,
  IconChevronRight,
  IconFlame,
  IconBulb,
  IconBook,
  IconLoader2,
} from "@tabler/icons-react";
import Footer from "@/components/Footer";
import StickyHeader from "@/components/StickyHeader";
import { logoutApi } from "@/app/services/auth.service";
import rehypeRaw from "rehype-raw";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface BlogPostDetail {
  id: string;
  slug?: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  authorRole: string;
  imageUrl: string;
  tags: string[];
  content?: string;
  keyTakeaways?: string[];
  sections?: {
    heading: string;
    content: string[];
    highlightBox?: string;
  }[];
  comparisonTable?: {
    headers: string[];
    rows: string[][];
  };
}

// Dữ liệu mặc định (Fallback)
const BLOG_DETAILS: Record<string, BlogPostDetail> = {
  "1": {
    id: "1",
    title:
      "Cách Phân Biệt Các Phần Thịt Bò Nhập Khẩu Mỹ & Úc Cho Quán Lẩu Nướng",
    excerpt:
      "Hướng dẫn chi tiết cách chọn Ba chỉ bò (Short Plate), Đầu thăn ngoại (Ribeye) và Lõi vai (Top Blade) giúp tối ưu chi phí cốt...",
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
      "Bò Mỹ (Grain-fed) có vân mỡ cẩm thạch dày, hợp nướng BBQ và nhúng lẩu.",
      "Bò Úc có thớ thịt săn chắc, vị ngọt tự nhiên, giá sỉ tối ưu.",
      "Chọn đúng quy cách cắt giúp giảm tới 12% tỷ lệ hao hụt.",
    ],
    sections: [
      {
        heading:
          "1. Vì sao việc chọn đúng phần thịt quyết định lợi nhuận quán?",
        content: [
          "Trong mô hình kinh doanh nhà hàng Lẩu - Nướng, chi phí nguyên liệu thịt bò thường chiếm từ 35% - 45% tổng giá vốn hàng bán...",
        ],
      },
    ],
  },
};

function extractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children))
    return children.map(extractTextFromChildren).join("");
  if (React.isValidElement(children)) {
    return extractTextFromChildren((children.props as any)?.children);
  }
  return "";
}

export default function BlogDetailPage() {
  const params = useParams();
  const postId = typeof params?.id === "string" ? params.id : "1";

  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState<BlogPostDetail>(
    BLOG_DETAILS[postId] || { ...BLOG_DETAILS["1"], id: postId },
  );
  const [relatedPosts, setRelatedPosts] = useState<BlogPostDetail[]>(
    Object.values(BLOG_DETAILS).filter((item) => item.id !== postId),
  );

  const [copiedQuote, setCopiedQuote] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
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

  // 🎯 GỌI API LẤY CHI TIẾT BÀI VIẾT THEO SLUG / ID
  useEffect(() => {
    const fetchPostFromApi = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/posts/${postId}`); //[cite: 8]
        if (res.ok) {
          const data = await res.json();
          if (data?.post) {
            setPost(data.post);
            if (
              Array.isArray(data.relatedPosts) &&
              data.relatedPosts.length > 0
            ) {
              setRelatedPosts(data.relatedPosts);
            }
          }
        }
      } catch (error) {
        console.error("Lỗi khi fetch bài viết:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPostFromApi();
  }, [postId]);

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

  const handleZaloConsult = async () => {
    const zaloNumber = "0399829074";
    const message = `Xin chào Khánh An Foods, tôi vừa đọc bài viết "${post.title}" trên website và muốn nhận bảng báo giá sỉ.`;
    try {
      await navigator.clipboard.writeText(message);
      setCopiedQuote(true);
      setTimeout(() => setCopiedQuote(false), 5000);
    } catch (err) {
      console.error("Không thể copy:", err);
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

  const extractedTakeaways: string[] = post.keyTakeaways
    ? [...post.keyTakeaways]
    : [];
  let cleanedMarkdown = post.content || "";

  if (post.content && (!post.keyTakeaways || post.keyTakeaways.length === 0)) {
    const lines = post.content.split("\n");
    const remainingLines: string[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (/^(tóm tắt|điểm chính)\s*:/i.test(trimmed)) {
        const cleanedPoint = trimmed.replace(
          /^(tóm tắt|điểm chính)\s*:\s*/i,
          "",
        );
        cleanedPoint
          .split(";")
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((item) => extractedTakeaways.push(item));
      } else {
        remainingLines.push(line);
      }
    });
    cleanedMarkdown = remainingLines.join("\n");
  }
  cleanedMarkdown = cleanedMarkdown.replace(
    /<table>[\s\S]*?<\/table>/gi,
    (tableHtml) => {
      const rows: string[][] = [];
      const trMatches = tableHtml.match(/<tr[\s\S]*?<\/tr>/gi) || [];

      trMatches.forEach((tr) => {
        const cells: string[] = [];
        const tdMatches = tr.match(/<(td|th)[\s\S]*?<\/(td|th)>/gi) || [];
        tdMatches.forEach((td) => {
          // Xóa toàn bộ các thẻ <p>, <strong>, <td> bên trong để lấy mỗi chữ
          const text = td
            .replace(/<\/?(td|th|p|strong|b|span)[^>]*>/gi, "")
            .trim();
          cells.push(text);
        });
        if (cells.length > 0) rows.push(cells);
      });

      if (rows.length === 0) return tableHtml;

      // Tạo bảng chuẩn cú pháp Markdown để remarkGfm tự động đọc được
      const header = `| ${rows[0].join(" | ")} |`;
      const divider = `| ${rows[0].map(() => "---").join(" | ")} |`;
      const body = rows
        .slice(1)
        .map((r) => `| ${r.join(" | ")} |`)
        .join("\n");

      return `\n\n${header}\n${divider}\n${body}\n\n`;
    },
  );

  // Hiển thị trạng thái Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[#ECA921]">
          <IconLoader2 className="w-10 h-10 animate-spin" />
          <p className="font-bold">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  // Hàm chuyển tiêu đề thành ID chuẩn (VD: "1. Tại sao..." -> "muc-1-tai-sao")
  const generateHeadingId = (text: string) => {
    return (
      "muc-" +
      text
        .replace(/\\/g, "") // Xóa dấu \ thừa
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Bỏ dấu tiếng Việt
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
    );
  };

  const tocItems =
    post.sections && post.sections.length > 0
      ? post.sections.map((sec) => ({
          id: generateHeadingId(sec.heading),
          label: sec.heading.replace(/\\/g, ""),
        }))
      : cleanedMarkdown
          .split("\n")
          .filter((line) => line.trim().startsWith("## "))
          .map((line) => {
            // Xóa '## ' ở đầu và xóa dấu '\' thừa trong chuỗi '1\.'
            const cleanLabel = line
              .replace(/^##\s+/, "")
              .replace(/\\/g, "")
              .trim();
            return {
              id: generateHeadingId(cleanLabel),
              label: cleanLabel,
            };
          });

  return (
    <div>
      <StickyHeader isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <div className="min-h-screen bg-[#FAF8F5] text-gray-800">
        {/* BANNER ĐẦU TRANG */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div
            className="w-full rounded-[28px] py-10 sm:py-14 px-6 sm:px-12 shadow-2xl border border-amber-500/20 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(90deg, #0B0F17 0%, #1F150D 25%, #4A2809 50%, #1F150D 75%, #0B0F17 100%)",
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#ECA921] hover:text-amber-300 bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-amber-500/30 transition-colors"
              >
                <IconArrowLeft className="w-4 h-4" /> Quay lại danh sách Blog
              </Link>
              <div className="flex items-center gap-2">
                <div className="inline-block px-3.5 py-1 rounded-full border border-[#ECA921]/40 bg-[#ECA921]/10">
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#ECA921]">
                    {post.category}
                  </span>
                </div>
              </div>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-black text-[#FFF3D1] leading-tight max-w-4xl">
              {post.title}
            </h1>
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

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <article className="lg:col-span-8 bg-white rounded-3xl shadow-sm border border-amber-100 overflow-hidden">
              {post.imageUrl && (
                <div className="h-64 sm:h-96 w-full overflow-hidden bg-gray-900 border-b border-amber-100">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 sm:p-10 space-y-8">
                {post.excerpt && (
                  <p className="text-base sm:text-lg font-bold text-gray-900 leading-relaxed border-l-4 border-[#ECA921] pl-4 bg-amber-50/40 py-3 rounded-r-xl">
                    {post.excerpt}
                  </p>
                )}

                {extractedTakeaways.length > 0 && (
                  <div className="bg-gradient-to-br from-amber-50/90 to-amber-100/40 border border-amber-200 rounded-2xl p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#8C5210]">
                      <IconFlame className="w-4 h-4 text-[#ECA921]" /> Tóm tắt
                      nội dung quan trọng
                    </div>
                    <ul className="space-y-2.5">
                      {extractedTakeaways.map((point, index) => (
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
                )}

                {cleanedMarkdown ? (
                  <div className="space-y-4">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        h2: ({ children, ...props }) => {
                          const rawText = extractTextFromChildren(children);
                          const currentId = generateHeadingId(rawText);
                          return (
                            <h2
                              id={currentId}
                              className="text-xl sm:text-2xl font-black text-gray-900 pt-4 scroll-mt-28"
                              {...props}
                            >
                              {children}
                            </h2>
                          );
                        },
                        h3: ({ children, ...props }) => (
                          <h3
                            className="text-lg font-black text-gray-900 pt-2"
                            {...props}
                          >
                            {children}
                          </h3>
                        ),
                        ul: ({ children, ...props }) => (
                          <ul
                            className="space-y-2 pl-5 list-disc marker:text-[#ECA921]"
                            {...props}
                          >
                            {children}
                          </ul>
                        ),
                        li: ({ children, ...props }) => (
                          <li
                            className="text-sm sm:text-base text-gray-700 leading-relaxed"
                            {...props}
                          >
                            {children}
                          </li>
                        ),
                        img: ({ src, alt }) => (
                          <div className="my-5 rounded-2xl overflow-hidden border border-amber-200 shadow-md">
                            <img
                              src={src}
                              alt={alt || ""}
                              className="w-full h-auto object-cover"
                            />
                          </div>
                        ),
                        p: ({ children, ...props }) => {
                          const rawText =
                            extractTextFromChildren(children).trim();
                          if (
                            /^(mẹo|mẹo nhỏ|mẹo từ bếp trưởng|lưu ý|lưu ý quan trọng)\s*:/i.test(
                              rawText,
                            )
                          ) {
                            return (
                              <div className="bg-gray-900 text-amber-100 p-5 rounded-2xl border border-amber-500/30 flex items-start gap-3.5 shadow-md my-4">
                                <IconBulb className="w-6 h-6 text-[#ECA921] shrink-0 mt-0.5" />
                                <p className="text-xs sm:text-sm leading-relaxed font-medium whitespace-pre-line">
                                  {children}
                                </p>
                              </div>
                            );
                          }
                          return (
                            <p
                              // Thêm class 'whitespace-pre-line' vào đây
                              className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line"
                              {...props}
                            >
                              {children}
                            </p>
                          );
                        },
                        table: ({ children, ...props }) => (
                          // Bọc bảng bằng div bo góc, có viền màu amber và đổ bóng nhẹ giống các hộp highlight
                          <div className="overflow-x-auto my-8 rounded-2xl border border-amber-200 shadow-sm bg-white">
                            <table
                              className="min-w-full border-collapse text-sm"
                              {...props}
                            >
                              {children}
                            </table>
                          </div>
                        ),
                        thead: ({ children, ...props }) => (
                          // Header gradient giống hộp "Tóm tắt nội dung"
                          <thead
                            className="bg-gradient-to-r from-amber-50/90 to-amber-100/50 border-b border-amber-200"
                            {...props}
                          >
                            {children}
                          </thead>
                        ),
                        tbody: ({ children, ...props }) => (
                          // Chia đường viền ngang giữa các hàng với màu amber nhạt
                          <tbody
                            className="divide-y divide-amber-100/80"
                            {...props}
                          >
                            {children}
                          </tbody>
                        ),
                        tr: ({ children, ...props }) => (
                          <tr
                            // Hiệu ứng hover đổi màu nền hàng và ép dòng đầu tiên thành style header (phòng trường hợp API trả về td)
                            className="hover:bg-amber-50/40 transition-colors duration-200 [&:first-child]:bg-amber-50/60 [&:first-child_td]:font-black [&:first-child_td_p]:font-black [&:first-child_td]:text-[#8C5210] [&:first-child_td]:uppercase"
                            {...props}
                          >
                            {children}
                          </tr>
                        ),
                        th: ({ children, ...props }) => (
                          <th
                            // Style chữ cho tiêu đề: in đậm, màu nâu hổ phách, in hoa
                            className="px-5 py-4 text-left font-black text-[#8C5210] uppercase tracking-wider text-xs align-middle"
                            {...props}
                          >
                            {children}
                          </th>
                        ),
                        td: ({ children, ...props }) => (
                          <td
                            // Style cho dữ liệu: text xám, căn giữa theo chiều dọc, reset margin thẻ p
                            className="px-5 py-4 text-gray-700 font-medium align-middle [&>p]:m-0"
                            {...props}
                          >
                            {children}
                          </td>
                        ),
                      }}
                    >
                      {cleanedMarkdown}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <p>Nội dung đang được cập nhật...</p>
                  </div>
                )}
              </div>
            </article>

            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
              {tocItems.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-amber-200/60 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-900 pb-3 border-b border-gray-100">
                    <IconBook className="w-4 h-4 text-[#ECA921]" /> Nội dung
                    chính trong bài
                  </div>
                  <ul className="mt-4 space-y-2.5 text-xs font-semibold text-gray-600">
                    {tocItems.map((item, idx) => (
                      <li key={idx}>
                        <a
                          href={`#${item.id}`}
                          onClick={(e) => {
                            // 1. Chặn hành vi nhảy trang và ghi đè lịch sử mặc định của thẻ <a>
                            e.preventDefault();

                            const targetEl = document.getElementById(item.id);
                            if (targetEl) {
                              // 2. Thực hiện cuộn mượt đến mục tiêu
                              targetEl.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });

                              // 3. Cập nhật ID lên thanh URL nhưng DÙNG REPLACE thay vì PUSH
                              // Nút Back sẽ bỏ qua các ID này và quay thẳng về trang trước đó (danh sách blog)
                              window.history.replaceState(
                                null,
                                "",
                                `#${item.id}`,
                              );
                            }
                          }}
                          className="flex items-center gap-2 hover:text-[#B8731B] transition-colors py-1 cursor-pointer"
                        >
                          <IconChevronRight className="w-3.5 h-3.5 text-[#ECA921] shrink-0" />
                          <span className="line-clamp-1">{item.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
