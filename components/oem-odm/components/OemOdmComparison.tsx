import { CheckCircle2 } from "lucide-react";
import { COMPARISON_ROWS } from "../types/oem.data";

export function OemOdmComparison() {
  return (
    <section className="bg-slate-50 py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 sm:text-sm">
            Mô hình hợp tác linh hoạt
          </span>
          <h2 className="mt-1.5 text-2xl font-bold text-slate-900 sm:mt-2 sm:text-4xl">
            Lựa chọn hình thức gia công phù hợp
          </h2>
          <p className="mt-2.5 text-sm text-slate-600 sm:mt-3 sm:text-base">
            Dù bạn đã sở hữu công thức độc quyền hay chỉ mới bắt đầu từ ý tưởng
            sản phẩm, Khánh An Foods đều có quy trình đáp ứng tối ưu.
          </p>
        </div>

        {/* Mobile View: Stacked Cards (No horizontal scroll) */}
        <div className="mt-8 space-y-4 md:hidden">
          {COMPARISON_ROWS.map((row) => (
            <div
              key={row.criteria}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="border-b border-slate-200 bg-slate-900 px-4 py-3">
                <h3 className="text-sm font-bold text-white">{row.criteria}</h3>
              </div>

              <div className="divide-y divide-slate-100">
                <div className="p-4">
                  <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                    Dịch vụ OEM (Theo công thức đối tác)
                  </span>
                  <div className="mt-2 flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <span>{row.oem}</span>
                  </div>
                </div>

                <div className="bg-amber-50/50 p-4">
                  <span className="inline-block rounded-md bg-amber-500 px-2 py-0.5 text-xs font-bold text-slate-950">
                    Dịch vụ ODM (Nghiên cứu trọn gói)
                  </span>
                  <div className="mt-2 flex items-start gap-2 text-sm text-slate-800">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <span>{row.odm}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tablet & Desktop View: Table */}
        <div className="mt-12 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-900 text-white">
                <th className="w-1/4 px-6 py-4 text-sm font-semibold">
                  Tiêu chí
                </th>
                <th className="w-[37.5%] px-6 py-4 text-sm font-semibold">
                  <span className="inline-block rounded-md bg-slate-800 px-2.5 py-1 text-amber-400">
                    Dịch vụ OEM
                  </span>
                  <span className="ml-2 block font-normal text-slate-300 lg:inline">
                    (Theo công thức đối tác)
                  </span>
                </th>
                <th className="w-[37.5%] bg-amber-600 px-6 py-4 text-sm font-semibold text-white">
                  <span className="inline-block rounded-md bg-white/20 px-2.5 py-1">
                    Dịch vụ ODM
                  </span>
                  <span className="ml-2 block font-normal text-amber-50 lg:inline">
                    (Nghiên cứu trọn gói)
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.criteria} className="hover:bg-amber-50/30">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {row.criteria}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      <span>{row.oem}</span>
                    </div>
                  </td>
                  <td className="bg-amber-50/40 px-6 py-4 text-slate-800">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                      <span>{row.odm}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
