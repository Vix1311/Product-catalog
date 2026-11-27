import { PROCESS_STEPS } from "../types/oem.data";

export function ProcessTimeline() {
  return (
    <section className="bg-slate-950 py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-amber-400">
            Minh bạch từng giai đoạn
          </span>
          <h2 className="mt-2 text-2xl font-bold sm:text-4xl">
            Quy trình hợp tác OEM / ODM 6 bước
          </h2>
          <p className="mt-3 text-slate-400">
            Chuẩn hóa quy trình làm việc giúp rút ngắn thời gian ra mắt sản phẩm
            và kiểm soát đồng nhất chất lượng giữa các lô hàng.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROCESS_STEPS.map((item) => (
            <div
              key={item.step}
              className="relative rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition hover:border-amber-500/50"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-base font-extrabold text-slate-950">
                  {item.step}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-amber-500/40 to-transparent ml-4" />
              </div>

              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
