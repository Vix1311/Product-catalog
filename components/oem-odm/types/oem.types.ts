export type ServiceType = "OEM" | "ODM" | "BOTH";
export type CertificationCode = "ISO_22000" | "HACCP" | "VSATTP" | "HALAL";

export interface CertificationItem {
  code: CertificationCode;
  label: string;
  name: string;
  logoUrl?: string;
}
export interface StatItem {
  value: string;
  label: string;
  description: string;
}

export interface ComparisonRow {
  criteria: string;
  oem: string;
  odm: string;
}

export interface OemCategoryItem {
  id: string;
  title: string;
  subtitle: string;
  packagingOptions: string[];
  moq: string;
  imageUrl: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface OemInquiryPayload {
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  serviceType: ServiceType;
  productCategory: string;
  estimatedQuantity: string;
  packagingNeeds: string;
  note: string;
}