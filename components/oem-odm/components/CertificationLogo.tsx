import Image from "next/image";
import { CertificationItem } from "../types/oem.types";

interface CertificationLogoProps {
  cert: CertificationItem;
}

export function CertificationLogo({ cert }: CertificationLogoProps) {
  // Ưu tiên render file logo thật (PNG/SVG nền trong suốt từ Cloudinary hoặc /public)
  if (cert.logoUrl) {
    return (
      <div className="flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden">
        <img
          src={cert.logoUrl}
          alt={`Chứng nhận ${cert.label}`}
          className="max-h-full max-w-full object-contain mix-blend-multiply"
        />
      </div>
    );
  }

  // Fallback: Con dấu SVG vector dùng ngay cho giao diện
  switch (cert.code) {
    case "ISO_22000":
      return (
        <svg
          viewBox="0 0 120 120"
          className="h-16 w-16"
          aria-label="ISO 22000:2018"
        >
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="#FFFBEB"
            stroke="#D97706"
            strokeWidth="4"
          />
          <circle
            cx="60"
            cy="60"
            r="46"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <text
            x="60"
            y="50"
            textAnchor="middle"
            fill="#0F172A"
            fontSize="22"
            fontWeight="800"
          >
            ISO
          </text>
          <rect x="20" y="57" width="80" height="20" rx="10" fill="#D97706" />
          <text
            x="60"
            y="71"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="11.5"
            fontWeight="700"
          >
            22000:2018
          </text>
          <text
            x="60"
            y="92"
            textAnchor="middle"
            fill="#92400E"
            fontSize="8.5"
            fontWeight="700"
          >
            CERTIFIED
          </text>
        </svg>
      );

    case "HACCP":
      return (
        <svg viewBox="0 0 120 120" className="h-16 w-16" aria-label="HACCP">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="#EFF6FF"
            stroke="#1D4ED8"
            strokeWidth="4"
          />
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="1.5"
          />
          <path
            d="M48 38 L57 47 L73 31"
            fill="none"
            stroke="#1D4ED8"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x="60"
            y="70"
            textAnchor="middle"
            fill="#1E3A8A"
            fontSize="19"
            fontWeight="800"
          >
            HACCP
          </text>
          <text
            x="60"
            y="86"
            textAnchor="middle"
            fill="#1D4ED8"
            fontSize="8.5"
            fontWeight="700"
          >
            FOOD SAFETY
          </text>
        </svg>
      );

    case "VSATTP":
      return (
        <svg viewBox="0 0 120 120" className="h-16 w-16" aria-label="VSATTP">
          <path
            d="M60 10 L102 26 V58 C102 84 84 102 60 112 C36 102 18 84 18 58 V26 Z"
            fill="#ECFDF5"
            stroke="#059669"
            strokeWidth="4"
          />
          <path
            d="M46 50 L56 60 L75 41"
            fill="none"
            stroke="#059669"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x="60"
            y="82"
            textAnchor="middle"
            fill="#065F46"
            fontSize="14.5"
            fontWeight="800"
          >
            VSATTP
          </text>
        </svg>
      );

    case "HALAL":
      return (
        <svg viewBox="0 0 120 120" className="h-16 w-16" aria-label="HALAL">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="#F0FDF4"
            stroke="#15803D"
            strokeWidth="4"
          />
          <circle
            cx="60"
            cy="60"
            r="46"
            fill="none"
            stroke="#22C55E"
            strokeWidth="1.5"
          />
          <text
            x="60"
            y="54"
            textAnchor="middle"
            fill="#166534"
            fontSize="22"
            fontWeight="700"
          >
            حلال
          </text>
          <line
            x1="30"
            y1="63"
            x2="90"
            y2="63"
            stroke="#15803D"
            strokeWidth="1.5"
          />
          <text
            x="60"
            y="81"
            textAnchor="middle"
            fill="#14532D"
            fontSize="15"
            fontWeight="800"
            letterSpacing="1.5"
          >
            HALAL
          </text>
        </svg>
      );
  }
}
