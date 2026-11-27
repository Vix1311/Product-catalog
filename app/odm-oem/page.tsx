import type { Metadata } from "next";
import {
  CapabilitiesStats,
  HeroSection,
  OemFaqAccordion,
  OemInquiryForm,
  OemOdmComparison,
  ProcessTimeline,
  ProductCategoriesSection,
} from "@/components/oem-odm/components";

export const metadata: Metadata = {
  title: "Dịch vụ gia công thực phẩm OEM / ODM trọn gói | Khánh An Foods",
  description:
    "Khánh An Foods nhận gia công thực phẩm OEM/ODM đạt chuẩn ISO 22000 & HACCP: chế biến từ Surimi, thực phẩm đông lạnh, sốt gia vị với MOQ linh hoạt.",
  openGraph: {
    title: "Gia công thực phẩm OEM / ODM trọn gói | Khánh An Foods",
    description:
      "Giải pháp R&D công thức, sản xuất, đóng gói và công bố sản phẩm cho thương hiệu F&B và bán lẻ.",
    type: "website",
  },
};

export default function OemOdmPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <HeroSection />
      <CapabilitiesStats />
      <OemOdmComparison />
      <ProductCategoriesSection />
      <ProcessTimeline />
      <OemFaqAccordion />
      <OemInquiryForm />
    </main>
  );
}
