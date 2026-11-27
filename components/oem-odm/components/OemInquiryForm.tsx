"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Mail, Phone, Send } from "lucide-react";
import { OemInquiryPayload, ServiceType } from "../types/oem.types";

const INITIAL_STATE: OemInquiryPayload = {
  companyName: "",
  contactName: "",
  phone: "",
  email: "",
  serviceType: "ODM",
  productCategory: "Chế biến từ Surimi & Hải sản",
  estimatedQuantity: "",
  packagingNeeds: "",
  note: "",
};

export function OemInquiryForm() {
  const [formData, setFormData] = useState<OemInquiryPayload>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Đổi NEXT_PUBLIC_API_URL trỏ về NestJS backend của Khánh An Foods
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
      const response = await fetch(`${apiUrl}/oem-inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Không thể gửi yêu cầu lúc này. Vui lòng thử lại.");
      }

      setIsSuccess(true);
      setFormData(INITIAL_STATE);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Đã có lỗi xảy ra."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="oem-inquiry-form"
      className="scroll-mt-20 bg-amber-50/60 py-20 border-t border-amber-100"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left Info Column */}
          <div className="lg:col-span-5">
            <span className="text-sm font-semibold uppercase tracking-wider text-amber-600">
              Liên hệ bộ phận B2B & R&D
            </span>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-4xl">
              Gửi yêu cầu tư vấn & nhận báo giá
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Để lại thông tin sản phẩm dự kiến. Chuyên viên dự án OEM/ODM của
              Khánh An Foods sẽ liên hệ tư vấn công thức, MOQ và gửi dự toán sơ
              bộ trong vòng 24 giờ làm việc.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-white p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Hotline dự án B2B</p>
                  <p className="font-semibold text-slate-900">0829387980</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-white p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email nhận Brief</p>
                  <p className="font-semibold text-slate-900">
                    khanh.nd@khanhanfoods.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              {isSuccess ? (
                <div className="py-10 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-slate-900">
                    Đã tiếp nhận yêu cầu thành công!
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Đội ngũ phụ trách dự án OEM/ODM sẽ liên hệ lại với bạn sớm
                    nhất.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="mt-6 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-400"
                  >
                    Gửi thêm yêu cầu khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Tên công ty / Thương hiệu *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData({ ...formData, companyName: e.target.value })
                        }
                        placeholder="VD: Công ty TNHH Thực Phẩm ABC"
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Người liên hệ *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.contactName}
                        onChange={(e) =>
                          setFormData({ ...formData, contactName: e.target.value })
                        }
                        placeholder="Họ và tên"
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Số điện thoại / Zalo *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="0901 234 567"
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Email doanh nghiệp *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="name@company.com"
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Hình thức hợp tác *
                      </label>
                      <select
                        value={formData.serviceType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            serviceType: e.target.value as ServiceType,
                          })
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      >
                        <option value="OEM">OEM (Đã có công thức)</option>
                        <option value="ODM">ODM (R&D trọn gói)</option>
                        <option value="BOTH">Cần tư vấn cả OEM & ODM</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Nhóm sản phẩm quan tâm *
                      </label>
                      <select
                        value={formData.productCategory}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            productCategory: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      >
                        <option value="Chế biến từ Surimi & Hải sản">
                          Chế biến từ Surimi & Hải sản
                        </option>
                        <option value="Thực phẩm đông lạnh tiện lợi">
                          Thực phẩm đông lạnh tiện lợi
                        </option>
                        <option value="Sốt gia vị & Đồ ăn vặt">
                          Sốt gia vị & Đồ ăn vặt
                        </option>
                        <option value="Khác">Dòng sản phẩm khác</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Sản lượng dự kiến / tháng
                      </label>
                      <input
                        type="text"
                        value={formData.estimatedQuantity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            estimatedQuantity: e.target.value,
                          })
                        }
                        placeholder="VD: 500kg - 2 tấn / tháng"
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Quy cách đóng gói mong muốn
                      </label>
                      <input
                        type="text"
                        value={formData.packagingNeeds}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            packagingNeeds: e.target.value,
                          })
                        }
                        placeholder="VD: Túi hút chân không 500g"
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Mô tả chi tiết yêu cầu (hương vị, thời gian dự kiến...)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.note}
                      onChange={(e) =>
                        setFormData({ ...formData, note: e.target.value })
                      }
                      placeholder="Chia sẻ thêm thông tin để đội ngũ R&D chuẩn bị phương án phù hợp nhất..."
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  {errorMessage && (
                    <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                      {errorMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-base font-semibold text-slate-950 shadow-sm transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? "Đang gửi yêu cầu..." : "Gửi yêu cầu báo giá"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}