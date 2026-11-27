import { CERTIFICATIONS, OEM_STATS } from "../types/oem.data";
import { CertificationLogo } from "./CertificationLogo";

export function CapabilitiesStats() {
  return (
    <section className="border-b border-slate-200 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Metrics Grid */}
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {OEM_STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5 transition hover:border-amber-300 sm:p-6"
            >
              <p className="text-2xl font-extrabold text-amber-600 sm:text-3xl">
                {stat.value}
              </p>
              <h3 className="mt-1.5 text-base font-bold text-slate-900 sm:mt-2">
                {stat.label}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 sm:mt-1.5">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Certifications Strip (Compact horizontal cards on mobile, 3-col grid on desktop) */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:mt-12 sm:p-8">
          <div className="flex flex-col gap-5 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="shrink-0 lg:max-w-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Tiêu chuẩn chất lượng
              </span>
              <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
                Hệ thống quản lý & chứng nhận an toàn thực phẩm
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600 sm:mt-2">
                Quy trình sản xuất và kiểm soát chất lượng đáp ứng đầy đủ tiêu
                chuẩn lưu hành nội địa và xuất khẩu.
              </p>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              {CERTIFICATIONS.map((cert) => (
                <div
                  key={cert.code}
                  title={`${cert.label} - ${cert.name}`}
                  className="group flex flex-row items-center gap-3.5 rounded-xl border border-slate-200 bg-white p-3.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md sm:flex-col sm:justify-start sm:gap-0 sm:px-4 sm:py-5 sm:text-center"
                >
                  <div className="flex h-12 w-14 shrink-0 items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-105 sm:h-20 sm:w-full">
                    <CertificationLogo cert={cert} />
                  </div>

                  <div className="min-w-0 flex-1 sm:mt-4 sm:flex-none">
                    <span className="block text-sm font-bold text-slate-900">
                      {cert.label}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-slate-500 sm:mt-1">
                      {cert.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
