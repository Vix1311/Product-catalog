"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { OEM_FAQS } from "../types/oem.data";

export function OemFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white py-12 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 sm:text-sm">
            Giải đáp thắc mắc
          </span>
          <h2 className="mt-1.5 text-2xl font-bold text-slate-900 sm:mt-2 sm:text-4xl">
            Câu hỏi thường gặp về dịch vụ gia công
          </h2>
        </div>

        <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white sm:mt-10">
          {OEM_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="p-4 sm:p-6">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-3 text-left sm:gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold leading-snug text-slate-900 sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-amber-600 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600 sm:mt-3">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}