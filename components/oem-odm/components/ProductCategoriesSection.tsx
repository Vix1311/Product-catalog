import { Layers, Package } from "lucide-react";
import { OEM_CATEGORIES } from "../types/oem.data";

export function ProductCategoriesSection() {
  return (
    <section className="bg-white py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end md:gap-4">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 sm:text-sm">
              Danh mục gia công thế mạnh
            </span>
            <h2 className="mt-1.5 text-2xl font-bold text-slate-900 sm:mt-2 sm:text-4xl">
              Các dòng sản phẩm Khánh An Foods nhận sản xuất
            </h2>
          </div>
          <a
            href="#oem-inquiry-form"
            className="inline-block text-sm font-semibold text-amber-600 underline-offset-4 hover:underline"
          >
            Bạn cần dòng sản phẩm khác? Trao đổi với R&D →
          </a>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {OEM_CATEGORIES.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-md"
            >
              {/* Replace placeholder with <img src={item.imageUrl} ... /> or next/image */}
              <div className="flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100/70 p-4 text-center sm:aspect-[16/10]">
                <span className="text-xs font-medium text-amber-800/70">
                  Ảnh sản phẩm: {item.title}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-4 sm:p-6">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 sm:text-lg">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm text-slate-600 sm:mt-2">
                  {item.subtitle}
                </p>

                <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-sm sm:mt-5">
                  <div className="flex items-start gap-2">
                    <Package className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <div className="min-w-0">
                      <span className="font-semibold text-slate-800">
                        Quy cách đóng gói:
                      </span>
                      <ul className="mt-1 space-y-1 text-xs text-slate-600 sm:text-sm">
                        {item.packagingOptions.map((opt) => (
                          <li key={opt}>• {opt}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Layers className="h-4 w-4 shrink-0 text-amber-600" />
                    <span className="font-semibold text-slate-800">MOQ:</span>
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                      {item.moq}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
