import { z } from "zod";

export const productSchema = z.object({
  // Các trường chung
  formMode: z.enum(["b2b", "rtc"]),
  name: z.string().min(1, "Vui lòng nhập tên sản phẩm"),
  englishName: z.string().nullable().optional(),
  category: z.string().min(1, "Bắt buộc chọn danh mục chính"),
  subCategory: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),

  // Các trường B2B
  productSpec: z.string().nullable().optional(),
  marketPopularity: z.string().nullable().optional(),
  suitableChannels: z.string().nullable().optional(),
  suitableDishes: z.string().nullable().optional(),
  characteristics: z.string().nullable().optional(),
  variants: z.array(z.any()).optional(),

  // Các trường RTC
  description: z.string().nullable().optional(),
  ingredients: z.string().nullable().optional(),
  usageInstructions: z.string().nullable().optional(),
  storageInstructions: z.string().nullable().optional(),
  warnings: z.string().nullable().optional(),
  highlights: z.string().nullable().optional(),
}).superRefine((data, ctx) => {
  // CROSS-VALIDATION: Tùy theo Mode mà bắt lỗi các trường khác nhau
  if (data.formMode === "b2b") {
    if (!data.productSpec?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["productSpec"], message: "Bắt buộc nhập quy cách cắt hàng" });
    if (!data.marketPopularity?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["marketPopularity"], message: "Bắt buộc nhập mức độ phổ biến" });
    if (!data.suitableChannels?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["suitableChannels"], message: "Bắt buộc nhập kênh quán phù hợp" });
    if (!data.suitableDishes?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["suitableDishes"], message: "Bắt buộc nhập món ăn phù hợp" });
    if (!data.characteristics?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["characteristics"], message: "Bắt buộc nhập đặc điểm sản phẩm" });
    if (!data.variants || data.variants.length === 0) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["variants"], message: "Vui lòng chọn ít nhất 1 thương hiệu" });
  } else if (data.formMode === "rtc") {
    if (!data.description?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["description"], message: "Bắt buộc nhập mô tả sản phẩm" });
    if (!data.ingredients?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["ingredients"], message: "Bắt buộc nhập thành phần chính" });
    if (!data.usageInstructions?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["usageInstructions"], message: "Bắt buộc nhập cách dùng" });
    if (!data.storageInstructions?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["storageInstructions"], message: "Bắt buộc nhập bảo quản" });
  }
});

// Xuất type để dùng cho React Hook Form
export type ProductFormValues = z.infer<typeof productSchema>;