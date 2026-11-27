import { CheckCircle2 } from "lucide-react";
import { COMPARISON_ROWS } from "../types/oem.data";

export function OemOdmComparison() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-amber-600">
            Mô hình hợp tác linh hoạt
          </span>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-4xl">
            Lựa chọn hình thức gia công phù hợp
          </h2>
          <p className="mt-3 text-slate-600">
            Dù bạn đã sở hữu công thức độc quyền hay chỉ mới bắt đầu từ ý tưởng
            sản phẩm, Khánh An Foods đều có quy trình đáp ứng tối ưu.
          </p>
        </div>

        {/* Desktop Table */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-900 text-white">
                  <th className="w-1/4 px-6 py-4 text-sm font-semibold">
                    Tiêu chí
                  </th>
                  <th className="w-[37.5%] px-6 py-4 text-sm font-semibold">
                    <span className="inline-block rounded-md bg-slate-800 px-2.5 py-1 text-amber-400">
                      Dịch vụ OEM
                    </span>
                    <span className="ml-2 font-normal text-slate-300">
                      (Theo công thức đối tác)
                    </span>
                  </th>
                  <th className="w-[37.5%] bg-amber-600 px-6 py-4 text-sm font-semibold text-white">
                    <span className="inline-block rounded-md bg-white/20 px-2.5 py-1">
                      Dịch vụ ODM
                    </span>
                    <span className="ml-2 font-normal text-amber-50">
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
      </div>
    </section>
  );
}