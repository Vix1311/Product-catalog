import { Package, Layers } from "lucide-react";
import { OEM_CATEGORIES } from "../types/oem.data";

export function ProductCategoriesSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-amber-600">
              Danh mục gia công thế mạnh
            </span>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-4xl">
              Các dòng sản phẩm Khánh An Foods nhận sản xuất
            </h2>
          </div>
          <a
            href="#oem-inquiry-form"
            className="text-sm font-semibold text-amber-600 underline-offset-4 hover:underline"
          >
            Bạn cần dòng sản phẩm khác? Trao đổi với R&D →
          </a>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {OEM_CATEGORIES.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-md"
            >
              {/* Replace placeholder with <Image src={item.imageUrl} ... /> */}
              <div className="flex aspect-[16/10] w-full items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100/70 p-4 text-center">
                <span className="text-xs font-medium text-amber-800/70">
                  Ảnh sản phẩm: {item.title}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{item.subtitle}</p>

                <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm">
                  <div className="flex items-start gap-2">
                    <Package className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <div>
                      <span className="font-semibold text-slate-800">
                        Quy cách đóng gói:
                      </span>
                      <ul className="mt-1 space-y-1 text-slate-600">
                        {item.packagingOptions.map((opt) => (
                          <li key={opt}>• {opt}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
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
