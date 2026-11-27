import { CERTIFICATIONS, OEM_STATS } from "../types/oem.data";
import { CertificationLogo } from "./CertificationLogo";

export function CapabilitiesStats() {
  return (
    <section className="border-b border-slate-200 bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Metrics Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {OEM_STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-amber-100 bg-amber-50/40 p-6 transition hover:border-amber-300"
            >
              <p className="text-3xl font-extrabold text-amber-600">
                {stat.value}
              </p>
              <h3 className="mt-2 text-base font-bold text-slate-900">
                {stat.label}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Certifications Strip (Logo version - Fixed size & 3 columns) */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="lg:max-w-xs shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Tiêu chuẩn chất lượng
              </span>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Hệ thống quản lý & chứng nhận an toàn thực phẩm
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Quy trình sản xuất và kiểm soát chất lượng đáp ứng đầy đủ tiêu
                chuẩn lưu hành nội địa và xuất khẩu.
              </p>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
              {CERTIFICATIONS.map((cert) => (
                <div
                  key={cert.code}
                  title={`${cert.label} - ${cert.name}`}
                  className="group flex flex-col items-center justify-start rounded-xl border border-slate-200 bg-white px-4 py-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
                >
                  <div className="flex h-20 w-full items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-105">
                    <CertificationLogo cert={cert} />
                  </div>

                  <span className="mt-4 text-sm font-bold text-slate-900">
                    {cert.label}
                  </span>
                  <span className="mt-1 text-xs leading-snug text-slate-500">
                    {cert.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
