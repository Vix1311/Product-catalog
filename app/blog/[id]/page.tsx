"use client";

import React, { useEffect, useState, useMemo } from "react";
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
  IconSparkles,
} from "@tabler/icons-react";
import Footer from "@/components/Footer";
import StickyHeader from "@/components/StickyHeader";
import { logoutApi } from "@/app/services/auth.service";
import rehypeRaw from "rehype-raw";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

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

function buildVideoEmbedHtml(rawUrl: string): string {
  const url = rawUrl.trim();
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i,
  );
  if (ytMatch) {
    return `\n\n<iframe src="https://www.youtube.com/embed/${ytMatch[1]}" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\n\n`;
  }

  const driveMatch = url.match(
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i,
  );
  if (driveMatch) {
    return `\n\n<iframe src="https://drive.google.com/file/d/${driveMatch[1]}/preview" allow="autoplay" allowfullscreen></iframe>\n\n`;
  }

  return `\n\n<video controls preload="metadata" src="${url}"></video>\n\n`;
}

// 🎯 COMPONENT CON: WIDGET BÀI VIẾT NGẪU NHIÊN
function RandomBlogWidget({ currentPostId }: { currentPostId: string }) {
  const [randomPosts, setRandomPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomPosts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/posts`);
        if (res.ok) {
          const data = await res.json();
          const rawPosts = Array.isArray(data) ? data : data.posts || [];
          
          // Lọc bỏ bài viết đang xem
          const filtered = rawPosts.filter((p: any) => p.id !== currentPostId);
          
          // Đảo mảng ngẫu nhiên (Fisher-Yates shuffle)
          for (let i = filtered.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
          }
          
          // Lấy 3 bài đầu tiên sau khi đảo
          setRandomPosts(filtered.slice(0, 3));
        }
      } catch (error) {
        console.error("Lỗi fetch random posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomPosts();
  }, [currentPostId]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-amber-200/60 shadow-sm mt-6 text-center">
        <IconLoader2 className="w-5 h-5 text-amber-500 animate-spin mx-auto" />
      </div>
    );
  }

  if (randomPosts.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-amber-200/60 shadow-sm mt-6">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-900 pb-3 border-b border-gray-100 mb-4">
        <IconSparkles className="w-4 h-4 text-[#ECA921]" /> Có thể bạn quan tâm
      </div>
      <div className="space-y-4">
        {randomPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug || post.id}`}
            className="flex items-start gap-3 group"
          >
            <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
              <img
                src={post.imageUrl || "https://placehold.co/150x150?text=No+Image"}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <h4 className="text-xs sm:text-[13px] font-extrabold text-gray-800 line-clamp-2 leading-snug group-hover:text-[#B8731B] transition-colors">
                {post.title}
              </h4>
              <span className="text-[10px] text-gray-400 font-medium">
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString("vi-VN") : "Đang cập nhật"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function BlogDetailPage() {
  const params = useParams();
  const postId = typeof params?.id === "string" ? params.id : "1";

  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState<BlogPostDetail>(
    BLOG_DETAILS[postId] || { ...BLOG_DETAILS["1"], id: postId },
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

  useEffect(() => {
    const fetchPostFromApi = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/posts/${postId}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.post) {
            setPost(data.post);
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
      const plainCheck = trimmed.replace(/^[*_]+|[*_]+$/g, "").trim();

      if (/^(tóm tắt|điểm chính)\s*:/i.test(plainCheck)) {
        const cleanedPoint = plainCheck.replace(
          /^(tóm tắt|điểm chính)\s*:\s*/i,
          "",
        );
        cleanedPoint
          .split(";")
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((item) => extractedTakeaways.push(item));
      } else if (/^video\s*:/i.test(plainCheck)) {
        const urlPart = plainCheck
          .replace(/^video\s*:\s*/i, "")
          .replace(/^[*_]+|[*_]+$/g, "")
          .trim();
        const mdLinkMatch = urlPart.match(/\[.*?\]\((https?:\/\/[^\s)]+)\)/i);
        const rawUrlMatch = urlPart.match(/(https?:\/\/[^\s]+)/i);
        const videoUrl = mdLinkMatch
          ? mdLinkMatch[1]
          : rawUrlMatch
            ? rawUrlMatch[1]
            : "";

        if (videoUrl) {
          remainingLines.push(buildVideoEmbedHtml(videoUrl));
        } else {
          remainingLines.push(line);
        }
      } else if (/^(image|hình ảnh|hinh anh|ảnh)\s*:/i.test(plainCheck)) {
        const urlPart = plainCheck
          .replace(/^(image|hình ảnh|hinh anh|ảnh)\s*:\s*/i, "")
          .replace(/^[*_]+|[*_]+$/g, "")
          .trim();
        const mdLinkMatch = urlPart.match(/\[.*?\]\((https?:\/\/[^\s)]+)\)/i);
        const rawUrlMatch = urlPart.match(/(https?:\/\/[^\s]+)/i);
        const imgUrl = mdLinkMatch
          ? mdLinkMatch[1]
          : rawUrlMatch
            ? rawUrlMatch[1]
            : "";

        if (imgUrl) {
          remainingLines.push(`\n\n![](${imgUrl})\n\n`);
        } else {
          remainingLines.push(line);
        }
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
          const text = td
            .replace(/<\/?(td|th|p|strong|b|span)[^>]*>/gi, "")
            .trim();
          cells.push(text);
        });
        if (cells.length > 0) rows.push(cells);
      });

      if (rows.length === 0) return tableHtml;

      const header = `| ${rows[0].join(" | ")} |`;
      const divider = `| ${rows[0].map(() => "---").join(" | ")} |`;
      const body = rows
        .slice(1)
        .map((r) => `| ${r.join(" | ")} |`)
        .join("\n");

      return `\n\n${header}\n${divider}\n${body}\n\n`;
    },
  );

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

  const generateHeadingId = (text: string) => {
    return (
      "muc-" +
      text
        .replace(/\\/g, "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
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
            
            {/* CỘT TRÁI: BÀI VIẾT CHÍNH */}
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
                          <span className="block my-6 rounded-2xl overflow-hidden border border-amber-200 shadow-md bg-gray-50">
                            <img
                              src={src}
                              alt={alt || ""}
                              className="w-full h-auto object-cover block"
                              loading="lazy"
                            />
                          </span>
                        ),
                        video: ({ src, ...props }) => (
                          <div className="my-6 rounded-2xl overflow-hidden border border-amber-200 shadow-md bg-gray-950">
                            <video
                              src={src}
                              controls
                              playsInline
                              preload="metadata"
                              className="w-full max-h-[520px] object-contain mx-auto block"
                              {...props}
                            />
                          </div>
                        ),
                        iframe: ({ src, title, ...props }) => (
                          <div className="my-6 rounded-2xl overflow-hidden border border-amber-200 shadow-md bg-gray-950 aspect-video w-full">
                            <iframe
                              src={src}
                              title={title || "Embedded Video"}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              {...props}
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
                              className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line"
                              {...props}
                            >
                              {children}
                            </p>
                          );
                        },
                        table: ({ children, ...props }) => (
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
                          <thead
                            className="bg-gradient-to-r from-amber-50/90 to-amber-100/50 border-b border-amber-200"
                            {...props}
                          >
                            {children}
                          </thead>
                        ),
                        tbody: ({ children, ...props }) => (
                          <tbody
                            className="divide-y divide-amber-100/80"
                            {...props}
                          >
                            {children}
                          </tbody>
                        ),
                        tr: ({ children, ...props }) => (
                          <tr
                            className="hover:bg-amber-50/40 transition-colors duration-200 [&:first-child]:bg-amber-50/60 [&:first-child_td]:font-black [&:first-child_td_p]:font-black [&:first-child_td]:text-[#8C5210] [&:first-child_td]:uppercase"
                            {...props}
                          >
                            {children}
                          </tr>
                        ),
                        th: ({ children, ...props }) => (
                          <th
                            className="px-5 py-4 text-left font-black text-[#8C5210] uppercase tracking-wider text-xs align-middle"
                            {...props}
                          >
                            {children}
                          </th>
                        ),
                        td: ({ children, ...props }) => (
                          <td
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

            {/* CỘT PHẢI: MỤC LỤC & RANDOM BLOGS */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28">
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
                            e.preventDefault();
                            const targetEl = document.getElementById(item.id);
                            if (targetEl) {
                              targetEl.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
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

              {/* 🚀 COMPONENT GỢI Ý BÀI VIẾT NẰM Ở ĐÂY */}
              <RandomBlogWidget currentPostId={post.id} />

            </aside>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}