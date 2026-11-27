import { PROCESS_STEPS } from "../types/oem.data";

export function ProcessTimeline() {
  return (
    <section className="bg-slate-950 py-12 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 sm:text-sm">
            Minh bạch từng giai đoạn
          </span>
          <h2 className="mt-1.5 text-2xl font-bold sm:mt-2 sm:text-4xl">
            Quy trình hợp tác OEM / ODM 6 bước
          </h2>
          <p className="mt-2.5 text-sm text-slate-400 sm:mt-3 sm:text-base">
            Chuẩn hóa quy trình làm việc giúp rút ngắn thời gian ra mắt sản phẩm
            và kiểm soát đồng nhất chất lượng giữa các lô hàng.
          </p>
        </div>

        <div className="mt-8 grid gap-3.5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {PROCESS_STEPS.map((item) => (
            <div
              key={item.step}
              className="relative flex items-start gap-3.5 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 transition hover:border-amber-500/50 sm:block sm:p-6"
            >
              <div className="shrink-0 sm:mb-4 sm:flex sm:items-center sm:justify-between">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-sm font-extrabold text-slate-950 sm:h-11 sm:w-11 sm:text-base">
                  {item.step}
                </span>
                <div className="ml-4 hidden h-px flex-1 bg-gradient-to-r from-amber-500/40 to-transparent sm:block" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-white sm:text-lg">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400 sm:mt-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
