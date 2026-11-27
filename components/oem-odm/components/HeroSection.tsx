import { ArrowRight, Download, ShieldCheck } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      {/* Subtle amber ambient glow */}
      <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-amber-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Đối tác gia công thực phẩm chuẩn ISO 22000 & HACCP</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:leading-[1.15]">
              Giải pháp gia công thực phẩm{" "}
              <span className="text-amber-400">OEM / ODM trọn gói</span> cho
              thương hiệu của bạn
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Từ ý tưởng công thức, phát triển mẫu thử đến sản xuất hàng loạt và
              hoàn thiện hồ sơ công bố. Khánh An Foods đồng hành giúp chuỗi F&B,
              nhà phân phối và thương hiệu bán lẻ đưa sản phẩm lên kệ nhanh
              chóng với chi phí tối ưu.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#oem-inquiry-form"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-base font-semibold text-slate-950 shadow-lg shadow-amber-500/25 transition hover:bg-amber-400"
              >
                Nhận tư vấn & báo giá
                <ArrowRight className="h-5 w-5" />
              </a>

              <a
                href="/documents/khanh-an-foods-oem-profile.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-base font-medium text-white transition hover:border-amber-500/50 hover:text-amber-300"
              >
                <Download className="h-5 w-5" />
                Tải hồ sơ năng lực (PDF)
              </a>
            </div>
          </div>

          {/* Visual Showcase Card (Thay thế bằng next/image từ Cloudinary) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-amber-500/20 bg-slate-900/90 p-3 shadow-2xl">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center border border-slate-800 text-center p-6">
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                  Khánh An Foods Factory
                </span>
                <p className="mt-2 text-sm text-slate-400">
                  Chèn ảnh thực tế dây chuyền sản xuất / đóng gói từ Cloudinary
                </p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-800/80 p-3">
                  <p className="text-xs text-slate-400">Bảo mật công thức</p>
                  <p className="mt-0.5 text-sm font-semibold text-amber-400">
                    Ký kết NDA 100%
                  </p>
                </div>
                <div className="rounded-lg bg-slate-800/80 p-3">
                  <p className="text-xs text-slate-400">Phản hồi báo giá</p>
                  <p className="mt-0.5 text-sm font-semibold text-white">
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