import { ArrowRight, Download, ShieldCheck } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      {/* Subtle amber ambient glow */}
      <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 rounded-full bg-amber-600/10 blur-3xl sm:h-72 sm:w-72" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 sm:mb-6 sm:px-4 sm:py-1.5 sm:text-sm">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              <span>Đối tác gia công thực phẩm chuẩn ISO 22000 & HACCP</span>
            </div>

            <h1 className="text-2xl font-bold leading-snug tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.15]">
              Giải pháp gia công thực phẩm{" "}
              <span className="text-amber-400">OEM / ODM trọn gói</span> cho
              thương hiệu của bạn
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:mt-6 sm:text-base lg:text-lg">
              Từ ý tưởng công thức, phát triển mẫu thử đến sản xuất hàng loạt và
              hoàn thiện hồ sơ công bố. Khánh An Foods đồng hành giúp chuỗi F&B,
              nhà phân phối và thương hiệu bán lẻ đưa sản phẩm lên kệ nhanh
              chóng với chi phí tối ưu.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4">
              <a
                href="#oem-inquiry-form"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/25 transition hover:bg-amber-400 sm:w-auto sm:px-6 sm:py-3.5 sm:text-base"
              >
                Nhận tư vấn & báo giá
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>

              <a
                href="/documents/khanh-an-foods-oem-profile.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm font-medium text-white transition hover:border-amber-500/50 hover:text-amber-300 sm:w-auto sm:px-6 sm:py-3.5 sm:text-base"
              >
                <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                Tải hồ sơ năng lực (PDF)
              </a>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-amber-500/20 bg-slate-900/90 p-2.5 shadow-2xl sm:p-3">
              <div className="flex aspect-[16/10] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-br from-slate-800 to-slate-900 p-4 text-center sm:aspect-[4/3] sm:p-6">
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                  Khánh An Foods Factory
                </span>
                <p className="mt-2 text-xs text-slate-400 sm:text-sm">
                  Chèn ảnh thực tế dây chuyền sản xuất / đóng gói từ Cloudinary
                </p>
              </div>

              <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:mt-3 sm:gap-3">
                <div className="rounded-lg bg-slate-800/80 p-2.5 sm:p-3">
                  <p className="text-[11px] text-slate-400 sm:text-xs">
                    Bảo mật công thức
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-amber-400 sm:text-sm">
                    Ký kết NDA 100%
                  </p>
                </div>
                <div className="rounded-lg bg-slate-800/80 p-2.5 sm:p-3">
                  <p className="text-[11px] text-slate-400 sm:text-xs">
                    Phản hồi báo giá
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-white sm:text-sm">
                    Trong vòng 24 giờ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
