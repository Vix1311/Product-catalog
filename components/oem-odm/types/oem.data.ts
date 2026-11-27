import {
  ComparisonRow,
  FaqItem,
  OemCategoryItem,
  ProcessStep,
  StatItem,
} from "../types/oem.types";
import { CertificationItem } from "../types/oem.types";

export const CERTIFICATIONS: CertificationItem[] = [
  {
    code: "ISO_22000",
    label: "ISO 22000:2018",
    name: "Hệ thống quản lý ATTP",
    logoUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2Kn6g1DU1W6d1-K1kXHJahsg6rX44EyS_VKbuPZDgt86g1SMPHV43oRYs&s=10",
  },
  {
    code: "HACCP",
    label: "HACCP",
    name: "Phân tích mối nguy & kiểm soát tới hạn",
    logoUrl: "https://vinachg.vn/wp-content/uploads/2024/08/haccp-la-gi.jpg",
  },
  {
    code: "HALAL",
    label: "HALAL",
    name: "Đáp ứng tiêu chuẩn xuất khẩu",
    logoUrl: "https://alibabavietnam.com.vn/upload/news/the-halal-certification-process-4380.jpg",
  },
];
export const OEM_STATS: StatItem[] = [
  {
    value: "500+ Tấn",
    label: "Công suất / Tháng",
    description: "Dây chuyền sản xuất và cấp đông nhanh đạt chuẩn xuất khẩu",
  },
  {
    value: "5 - 7 Ngày",
    label: "Thời gian ra mẫu thử",
    description: "Đội ngũ R&D phát triển và tinh chỉnh hương vị theo yêu cầu",
  },
  {
    value: "100%",
    label: "Truy xuất nguồn gốc",
    description: "Nguyên liệu nhập khẩu chính ngạch, kiểm soát QC nghiêm ngặt",
  },
  {
    value: "Linh hoạt",
    label: "Chính sách MOQ",
    description: "Hỗ trợ lô sản xuất thử nghiệm cho thương hiệu mới ra mắt",
  },
];

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    criteria: "Đối tượng phù hợp",
    oem: "Thương hiệu đã có sẵn công thức, tiêu chuẩn và thiết kế bao bì",
    odm: "Doanh nghiệp, chuỗi F&B mới có ý tưởng và cần giải pháp trọn gói",
  },
  {
    criteria: "Nghiên cứu công thức (R&D)",
    oem: "Sản xuất chính xác theo công thức & thông số khách hàng cung cấp",
    odm: "Khánh An R&D công thức độc quyền, test vị đến khi đạt chuẩn",
  },
  {
    criteria: "Thiết kế & Bao bì",
    oem: "In ấn, đóng gói theo file thiết kế sẵn có của đối tác",
    odm: "Tư vấn quy cách bao bì, hỗ trợ thiết kế nhãn mác đúng quy định",
  },
  {
    criteria: "Hồ sơ pháp lý",
    oem: "Hỗ trợ cung cấp hồ sơ nhà máy & phiếu kiểm nghiệm",
    odm: "Tư vấn trọn gói kiểm nghiệm định kỳ và hồ sơ tự công bố sản phẩm",
  },
];

export const OEM_CATEGORIES: OemCategoryItem[] = [
  {
    id: "surimi",
    title: "Chế biến từ Surimi & Hải sản",
    subtitle: "Thanh cua, chả cá viên, đậu hũ cá, viên thả lẩu các loại",
    packagingOptions: [
      "Túi hút chân không 500g/1kg",
      "Khay định hình MAP",
      "Thùng Bulk B2B 5kg",
    ],
    moq: "Từ 300 kg / SKU",
    imageUrl: "/images/oem/surimi-placeholder.jpg",
  },
  {
    id: "frozen-food",
    title: "Thực phẩm đông lạnh tiện lợi",
    subtitle: "Xúc xích, dimsum, thịt tẩm ướp, đồ chiên sẵn cho chuỗi F&B",
    packagingOptions: ["Túi PA/PE in ống đồng", "Hộp giấy cán màng chống thấm"],
    moq: "Từ 500 kg / SKU",
    imageUrl: "/images/oem/frozen-placeholder.jpg",
  },
  {
    id: "sauces-snacks",
    title: "Sốt gia vị & Đồ ăn vặt",
    subtitle: "Nước lẩu cô đặc, sốt chấm độc quyền, snack tẩm vị đóng gói",
    packagingOptions: [
      "Gói stick/sachet",
      "Chai PET / Hũ thủy tinh",
      "Túi zipper đáy đứng",
    ],
    moq: "Từ 2.000 đơn vị / SKU",
    imageUrl: "/images/oem/sauce-placeholder.jpg",
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "Tiếp nhận Brief",
    description:
      "Trao đổi định vị sản phẩm, phân khúc giá, kênh bán hàng và sản lượng mục tiêu.",
  },
  {
    step: "02",
    title: "R&D & Gửi mẫu thử",
    description:
      "Phát triển mẫu thực tế trong 5–7 ngày, gửi khách hàng đánh giá và hiệu chỉnh.",
  },
  {
    step: "03",
    title: "Chốt công thức & Bao bì",
    description:
      "Khóa thông số kỹ thuật, định lượng, thiết kế nhãn mác và ký cam kết bảo mật (NDA).",
  },
  {
    step: "04",
    title: "Báo giá & Hợp đồng",
    description:
      "Minh bạch chi phí nguyên liệu, gia công, đóng gói và thống nhất tiến độ giao hàng.",
  },
  {
    step: "05",
    title: "Hồ sơ công bố",
    description:
      "Hỗ trợ gửi mẫu kiểm nghiệm chất lượng và hoàn thiện hồ sơ tự công bố sản phẩm.",
  },
  {
    step: "06",
    title: "Sản xuất & Giao hàng",
    description:
      "Sản xuất hàng loạt, kiểm định QC trước xuất xưởng và vận chuyển bằng xe lạnh chuyên dụng.",
  },
];

export const OEM_FAQS: FaqItem[] = [
  {
    question:
      "Số lượng đặt hàng tối thiểu (MOQ) cho mỗi đơn gia công là bao nhiêu?",
    answer:
      "MOQ phụ thuộc vào từng dòng sản phẩm và loại bao bì (in ống đồng hay dán decal). Thông thường dao động từ 300kg – 500kg/SKU. Với thương hiệu mới cần test thị trường, Khánh An Foods có gói hỗ trợ MOQ linh hoạt.",
  },
  {
    question: "Khánh An Foods có cam kết bảo mật công thức độc quyền không?",
    answer:
      "Có. Trước khi tiếp nhận công thức OEM hoặc bàn giao công thức ODM độc quyền, hai bên sẽ ký thỏa thuận bảo mật thông tin (NDA) nhằm đảm bảo quyền sở hữu tuyệt đối cho đối tác.",
  },
  {
    question:
      "Thời gian từ lúc chốt mẫu đến khi nhận lô hàng đầu tiên mất bao lâu?",
    answer:
      "Trung bình từ 15 đến 25 ngày làm việc (bao gồm thời gian đặt in trục bao bì nếu khách dùng bao bì in trực tiếp và thời gian kiểm nghiệm/công bố sản phẩm).",
  },
  {
    question: "Chi phí làm mẫu thử (R&D) được tính như thế nào?",
    answer:
      "Khánh An Foods hỗ trợ miễn phí 2 lần gửi mẫu chuẩn hóa cơ bản cho doanh nghiệp. Với các công thức đặc thù yêu cầu nguyên liệu nhập khẩu riêng, chi phí làm mẫu sẽ được khấu trừ 100% vào đơn hàng chính thức đầu tiên.",
  },
];
